app.service('Background', function($rootScope){



var toto = this;

	this.start = function () {
    // Gere la mise en veille de l'application
  	document.addEventListener('deviceready', function ()
    {

      // customization
      cordova.plugins.backgroundMode.setDefaults({
      	title:  'BbSensor',
    		ticker: 'myTicker',
    		text:   'Aucune alerte détectée'});
      // Enable background mode
      cordova.plugins.backgroundMode.enable();

      // Called when background mode has been activated
      cordova.plugins.backgroundMode.onactivate = function ()
      {

    		if($rootScope.alerteDetect == true)
    		{
    			cordova.plugins.backgroundMode.configure({
            text:'Alerte !!!'
          });
    		}
    		else
    		{
    			cordova.plugins.backgroundMode.configure({
            text:'Aucune alerte détectée'
          });
    		}

        /*
      	$scope.$on('bbAlerte', function(event, args) {
      		$scope.mtext = $scope.mtext + $rootScope.mesPatients[args].nom + "  ";
          cordova.plugins.backgroundMode.configure({
              text: $scope.mtext
          });
  			});

  			$scope.$on('bbAlerteFin', function(event, args) {
  				$scope.mtext = "Alerte patient: ";
          cordova.plugins.backgroundMode.configure({
              text:'Aucune alerte détectée'
          });
  			});
        */
      }
  	}, false);
	};

});
