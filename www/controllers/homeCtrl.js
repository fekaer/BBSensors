// controleur du Home
app.controller("homeCtrl", function( $scope, $rootScope, $state, $ionicListDelegate, $interval, $timeout, Socket, ListPatients, Notification, Background, $ionicLoading, $window, BDD) {
	$scope.lesPatients = [];
	console.log('Start Home');
	// Text a afficher en mode Backgrand
	$scope.mtext = "Alerte patient: ";
	//Permet d'indiquer si on fais un Add ou un Modif d'un patient
  $rootScope.etatAddModif = null;
	// Paramerte General
	$rootScope.Paramgeneral = {plagetemp:2, delaisAlertRes:1};
	//$scope.bdd_ok = false;

	// variable qui va indiquer si une alerte a été detecté
	$rootScope.alerteDetect = false;
  // Variable tempon du nb patient dans le tableau pour savoir si il faut effectuer une connection
	$scope.nbPatientTemp = 0;
	// variable indiquand quand la bdd est prète
	$scope.bdd_ok = false;







	// Fonction qui va etre appelé quand la BDD est prête
	$scope.$on('BddOK', function(event, args) {
		// recupère les patients de la base de donnée
		$scope.lesPatients = ListPatients.patients;
		// Recharge la vue
		$state.go($state.current, {}, {reload: true});

	});


	// Fonction qui va etre appelé a chaque fois qu'on va venire ou revenire sur la vue Home
  $scope.$on('$ionicView.enter', function()
  {
		// Si la base de donnée est prête
		if($scope.bdd_ok == true)
		{
			$scope.newConnection();
		}
		// Effectue le code que à la deuxième fois
		$scope.bdd_ok = true;
  });






// ----------------------------------------- Fonctiopn ---------------------------------------------------------------------------------------------------
	$scope.newConnection = function(){
		// Indique qu'aucun patient est visualisé (infoPatient)
		$rootScope.idVisu = null;
		// Indique qu'il y a plus d'allerte dans le mode Backgrand donc changer le text
		$rootScope.$broadcast('bbAlerteFin');

		console.log('nbPatientTemp: ' + $scope.nbPatientTemp);
		// effectuer la conection des patient pas encor connecté
		if($scope.lesPatients.length > $scope.nbPatientTemp){
			$scope.connexionSocket($scope.lesPatients[$scope.nbPatientTemp].ip, $scope.lesPatients[$scope.nbPatientTemp].port, $scope.nbPatientTemp, $scope.lesPatients.length -1);
		}
		// Mais a jour la variable tempon
		$scope.nbPatientTemp = $scope.lesPatients.length;
	}

  // Fonction qui effetue la conection WebSocket
  $scope.connexionSocket = function(ip, port, i, nb) {
		//joel
		//Socket.connect("ws://"+ ip + ":" + port).then(
		// moi
		Socket.connect("http://"+ ip + ":" + port).then(
			// Connection Accept
			function (data){},
			// Connection Reject
			function (data){
				if(data == "unconnected"){
          //Change l'icone du patient
					$scope.lesPatients[i].etat = 0;
					console.log("pas pue se conecter");


          // effectue la conection des patients suivant si il y en a
					if(i < nb)
					{
						$scope.connexionSocket($scope.lesPatients[i+1].ip, $scope.lesPatients[i+1].port, i+1, nb);
					}
				}
			},
			// Notify
			function (data){
        //Conection effectué
				if(data == "connected"){
          // Change l'icone du patient
					$scope.lesPatients[i].etat = 1;
          // Effectue la conection recursive
					if(i < nb)
					{
						$scope.connexionSocket($scope.lesPatients[i+1].ip, $scope.lesPatients[i+1].port, i+1, nb);
					}
				}
				else{
					// Données recu
					if(data.type=="bpm"){
            // recupère les données Fc du patient
						$scope.lesPatients[i].Fc = data.value;

						// Si Fc == 1 et que le patient est pas en allerte et que l'id visité n'est pas l'id du patient
						if(($scope.lesPatients[i].Fc >= 100) && ($scope.lesPatients[i].etat == 1) && (i != $rootScope.idVisu))
						{
							// Change l'icone du patient en alerte
							$scope.lesPatients[i].etat = 2;

							$timeout(function()
							{
								if($scope.lesPatients[i].etat == 2)
								{
									$scope.lesPatients[i].etat = 3;
								}
							}, $rootScope.Paramgeneral.delaisAlertRes * 1000 * 60);


							$rootScope.$broadcast('bbAlerte', i);
							//$rootScope.alerteDetect = true;

							// Fait vibrer 1sec
							Notification.vibrate(1000);
							// fais sonner 1 fois
							Notification.beep(1);
							// Affiche un message aletre
						  //Notification.alert('le patient ' + (i) + ' a un problème de FC', null, 'Fc problème', 'OK');

						}
					}
					if(data.type=="resp"){
						$scope.lesPatients[i].FR = data.value;
					}
					if(data.type=="satur"){
						$scope.lesPatients[i].SpOz = data.value;
					}
				}
			}
		);
	}













	// Fonction pour supprimer un passient du tableau de ListPatients
	$scope.deletePatient = function(index)
	{
		//alert($rootScope.Paramgeneral.plagetemp);
		// deconnaicte un ellement de la liste des sockets
		Socket.connectionpatients[index].close();
		// cache le patient
		$scope.lesPatients[index].supprimer = true;
		BDD.Delete("DELETE FROM BbSensor where id=?", $scope.lesPatients[index].id);
		// Glisser pour ne plus afficher les boutons d'option
		$ionicListDelegate.$getByHandle('liste-patients').closeOptionButtons();
	}
	// Fonction pour modiffier les données d'un passient du tableau de ListPatients
	$scope.modifPatient = function(index)
	{
		// va a la page modifListe en donnant l'id du passient celectionné
		$state.go("modifList",{mIndex:index});
		// Glisser pour ne plus afficher les boutons d'option
		$ionicListDelegate.$getByHandle('liste-patients').closeOptionButtons();
    //$scope.deletePatient(index);
	}
	// Fonction pour afficher les alertes d'un passient du tableau des alertes
	$scope.infoAlerte = function(index)
	{
		// va a la page infoAlerte en donnant l'id du passient celectionné
		$state.go("infoAlerte",{mIndex:index});
		// Glisser pour ne plus afficher les boutons d'option
		$ionicListDelegate.$getByHandle('liste-patients').closeOptionButtons();
	}

	// Fonction pour afficher les alertes d'un passient du tableau des alertes
	$scope.ecg = function(index)
	{
		// va a la page infoAlerte en donnant l'id du passient celectionné
		$state.go("infoPatient",{mIndex:index});
	}





	//Background.bibi();
	Background.start();
	/*
	// Gere la mise en veille de l'application
	document.addEventListener('deviceready', function () {

    // customization
    cordova.plugins.backgroundMode.setDefaults({
    	title:  'BbSensor',
  		ticker: 'myTicker',
  		text:   'Aucune alerte détectée'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {

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
    }
	}, false);
*/
});
