app.service('Socket', function($rootScope, $q, ListPatients){

	this.connectionpatients = [];


	this.construct = function(adresse) {
		return new JoelSocket(adresse);
	};


	this.connect = function(adresse){
		var js = new JoelSocket(adresse);
		this.connectionpatients.push(js);
	};




	// The JoelSocket simplify the websocket management **************************************************
  function JoelSocket(adresse){
    //"use strict";
		var updateAndSocketDictionary = {};
		this.MySocketDictionary = updateAndSocketDictionary;
    // Register a function with a signal name. If the signal
    // already exists, it register only the function and it doesn't create
    // new sockets.
    this.register = function(signalName, updateFunction, id)
    {
      // si la connection n'est pas encore etablie
      if(!(signalName in updateAndSocketDictionary)){
        var socket = new WebSocket(adresse, signalName);
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
        updateAndSocketDictionary[signalName].lstFunc.forEach(
          function (update){
            update(signal.data, updateAndSocketDictionary[signalName].id);
          }
        );

      };

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
