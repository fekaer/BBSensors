app.service('Socket', function($rootScope, $q, ListPatients){
	var deferred;

	this.connectionpatients = [];



	this.connect = function (adresse) {
		var deferred = $q.defer();


		var socketFC = new WebSocket(adresse, "freq1");
		this.connectionpatients.push(socketFC);
		socketFC.onopen = function (event) {
		  deferred.notify('connected');
		};


		socketFC.onclose = function (event) {
		  deferred.reject('unconnected');
		};

		socketFC.onerror = function (event) {
			console.log("Connection imposible");
			deferred.reject('unconnected');
		};


		socketFC.onmessage=function(event) {
		    //var data = JSON.parse(event.data);
				console.log(event.data);
				deferred.notify({type:"bpm", value:event.data});

		};


		/*

		var nb_patient = this.connectionpatients.push(io.connect(adresse,
		{
			//secure:true, // pour du https
			'reconnectionAttempts':1, // nb tentative de connection
			'reconnectionDelay':50,  // toute les Xms
			'force new connection':true // force la connection

		}));

	  	this.connectionpatients[nb_patient-1].on('connect', function(data) {
			deferred.notify('connected');
	  	});

	  	this.connectionpatients[nb_patient-1].on('reconnect_failed', function(data) {
			deferred.reject('unconnected');
	  	});

	  	this.connectionpatients[nb_patient-1].on('message', function(data) {
			deferred.notify(data);
	  	});








	  	// Serveur Joël
	  	this.connectionpatients[nb_patient-1].on('bpm_sec', function(data) {
			deferred.notify({type:"bpm", value:data});
	  	});

	  	this.connectionpatients[nb_patient-1].on('resp_sec', function(data) {
			deferred.notify({type:"resp", value:data});
	  	});

	  	this.connectionpatients[nb_patient-1].on('satur_sec', function(data) {
			deferred.notify({type:"satur", value:data});
	  	});

*/

		return deferred.promise;
	};
});
