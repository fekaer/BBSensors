app.service('Socket', function($rootScope, $q, ListPatients){
	this.construct = function(adresse) {
		return new JoelSocket(adresse);
	};

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

	this.connect = function(adresse, id){
		var js = new JoelSocket(adresse);
		ListPatients.patients[id].socket = js;
	};




	// The JoelSocket simplify the websocket management **************************************************
    function JoelSocket(adresse){
    //"use strict";
		var updateAndSocketDictionary = {};
		this.MySocketDictionary = updateAndSocketDictionary;


		this.connectSendAndClose = function(signalName, func, message){
			var socket = new WebSocket(adresse, signalName);
			socket.onopen = function(e){
				socket.send(message);
				socket.binaryType = 'arraybuffer';
				socket.onmessage = function(signal){

					var historics = [];
					var packet = new DataView(signal.data);

					for(var i = 0; i < packet.byteLength/4; i++){
						historics.push( packet.getInt16(i*4, true), packet.getInt16(i*4+2, true));
					}
					func(historics);
					socket.close();
				}
			}
		}



		// Register a function with a signal name. If the signal
		// already exists, it register only the function and it doesn't create
		// new sockets.
		this.register = function(signalName, updateFunction, id)
		{
			// si la connection n'est pas encore etablie
			if(!(signalName in updateAndSocketDictionary)){
				var socket = new WebSocket(adresse, signalName);
				socket.binaryType = 'arraybuffer'; 
				updateAndSocketDictionary[signalName] = {socket: socket, lstFunc: [], id: id};
			}

			// Add the new update function
			updateAndSocketDictionary[signalName].lstFunc.push(updateFunction);

			updateAndSocketDictionary[signalName].socket.onopen = function(signal){
				updateAndSocketDictionary[signalName].lstFunc.forEach(
					function (update){
						update('connect', updateAndSocketDictionary[signalName].id);
					}
				);
			};

		  // Change the callback function calling when a message arrive : update all functions
		  // register to the signal name.
			updateAndSocketDictionary[signalName].socket.onmessage = function(signal){
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
					updateAndSocketDictionary[signalName].lstFunc,
					function(updateFunc){
							updateFunc(signal, updateAndSocketDictionary[signalName].id); 
					}
				);

			}.bind(this);

			// Send -1 in the function if socket closed
			updateAndSocketDictionary[signalName].socket.onclose = function(){
				updateAndSocketDictionary[signalName].lstFunc.forEach(
					function (update){
						update('disconnect', updateAndSocketDictionary[signalName].id);
					}
				);
			};
		}

		this.send = function (signalName, value) {
		  var socket = updateAndSocketDictionary[signalName].socket;
		  socket.send(value);
		}
	}
});
