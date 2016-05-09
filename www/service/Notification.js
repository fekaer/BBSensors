app.service('Notification', function($rootScope, $timeout, $interval, ListPatients){

	this.vibrate = function (temp_ms) {
		navigator.notification.vibrate(temp_ms); // Fait vibrer X milisec
	};

	this.beep = function (nb_beep) {
		navigator.notification.beep(nb_beep); // fais sonner n fois
	};

	
	
	this.alert = function (message, callback, title, buttonName) {
		navigator.notification.alert(
            message,  		// message
            callback,		// callback
            title,          // title
            buttonName      // buttonName
        );
	};
	

	// Fais clignoter l'icone
	this.clignote = function(index, fncClignote)
	{
		if(fncClignote == undefined)
			fncClignote = this.clignote;

		if($rootScope.mesPatients[index].etat == 2)
		{
			$rootScope.mesPatients[index].clignote = !$rootScope.mesPatients[index].clignote;
			$timeout(fncClignote, 400, true, index, fncClignote);

		}
		else
		{
			$rootScope.mesPatients[index].clignote = false;
			$rootScope.mesPatients[index].etat = 1;
		}
	}


});
