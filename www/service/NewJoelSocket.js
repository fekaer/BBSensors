function JoelSocket(){
    "use strict";

    var ServerEnum = {
        REPTAR_WIFI: 0,
        REPTAR_WIRE: 1,
        PROXY: 2
    }

    var MessageType = {
        NEW_FREQ: 1,
        MIN_FREQ: 2,
        MAX_FREQ: 4
    }

    // Context configuration
    const currentContext = ServerEnum.REPTAR_WIFI;

    function getAddress(){
        switch(currentContext){
            case ServerEnum.REPTAR_WIFI:
                return "ws://192.168.2.7:5000";
            case ServerEnum.REPTAR_WIRE:
                return "ws://192.168.1.24:5000";
            case ServerEnum.PROXY:
                return "ws://129.194.184.60:8085";
        }
    }

    this.connectSendAndClose = function(signalName, func, message){
        var socket = new WebSocket(getAddress(), signalName);
        socket.onopen = function(e){
            socket.send(message);
            socket.binaryType = 'arraybuffer';
            console.log("-----------");
            socket.onmessage = function(signal){
                func(signal);
            }
        }
    }

    // Register a function with a signal name. If the signal
    // already exists, it register only the function and it doesn't create
    // new sockets.
    this.register = function(signalName, updateFunction) {
        if(!(signalName in JoelSocket.updateAndSocketDictionary)){
            var socket = new WebSocket(getAddress(), signalName);
            /* New binary protocol */
            socket.binaryType = 'arraybuffer';
            JoelSocket.updateAndSocketDictionary[signalName] = {socket: socket, lstFunc: []};
        }

        // Add the new update function
        JoelSocket.updateAndSocketDictionary[signalName].lstFunc.push(updateFunction);

        // Change the callback function calling when a message arrive : update all functions
        // register to the signal name.
        JoelSocket.updateAndSocketDictionary[signalName].socket.onmessage = function(signal){

            /* This section reproduce the old string buffered protocol. */
            var packet = new DataView(signal.data);
            if(signalName === "lead" || signalName == "freq"){
                var num1 = packet.getInt16(0, true);
                var num2 = packet.getInt16(2, true); 
                signal = num1 + ";" + num2;
            }else if(signalName === "alarm"){
                var type = packet.getInt16(0, true);
                var num1 = packet.getInt16(2, true);
                var num2 = packet.getInt16(4, true); 
                if(type === MessageType.NEW_FREQ){
                    signal = "NEW_FREQ;" + num1 + ";" + num2;
                }else if(type === MessageType.MIN_FREQ){
                    signal = "MIN_FREQ;" + num1 + ";" + num2;
                }else if(type === MessageType.MAX_FREQ){
                    signal = "MAX_FREQ;" + num1 + ";" + num2;
                }
            }

            _.forEach(
                JoelSocket.updateAndSocketDictionary[signalName].lstFunc,
                function(updateFunc){
                    updateFunc(signal);
                }
            );
            
        };
    }

    this.send = function (signalName, value) {
        var socket = JoelSocket.updateAndSocketDictionary[signalName].socket;
        socket.send(value);
    }
}