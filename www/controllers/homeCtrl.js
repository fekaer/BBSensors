// controleur du Home
app.controller("homeCtrl", function( $scope, $rootScope, $state, $ionicListDelegate, $interval, $timeout, Socket, ListPatients, Notification) {

	$scope.lesPatients = $rootScope.mesPatients;
	$scope.mtext = "Alerte patient: ";
  $rootScope.etatAddModif = null;

	// variable qui va indiquer si une alerte a été detecté
	$rootScope.alerteDetect = false;
  // Variable tempon du nb patient dans le tableau pour savoir si il faut effectuer une connection
	$scope.nbPatientTemp = 0;


  // Fonction qui va etre appelé a chaque fois qu'on va venire ou revenire sur la vue Home
  $scope.$on('$ionicView.enter', function()
  {

    // Indique qu'aucun patient est visualisé (infoPatient)
      $rootScope.idVisu = null;
      // Indique qu'il y a plus d'allerte dans le mode Backgrand donc changer le text
      $rootScope.$broadcast('bbAlerteFin');

      // effectuer la conection des patient pas encor connecté
      //alert("length: "+ $rootScope.mesPatients.length + "  idTemp: " + $scope.nbPatientTemp);
      if($rootScope.mesPatients.length > $scope.nbPatientTemp){
        $scope.connexionSocket($rootScope.mesPatients[$scope.nbPatientTemp].mip, $rootScope.mesPatients[$scope.nbPatientTemp].mport, $scope.nbPatientTemp, $rootScope.mesPatients.length -1);
      }
      // Mais a jour la variable tempon
      $scope.nbPatientTemp = $rootScope.mesPatients.length;
  });

// ----------------------------------------- Fonctiopn ---------------------------------------------------------------------------------------------------

  // Fonction qui effetue la conection WebSocket
  $scope.connexionSocket = function(ip, port, i, nb) {
		Socket.connect("http://"+ ip + ":" + port).then(
			// Connection Accept
			function (data){},
			// Connection Reject
			function (data){
				if(data == "unconnected"){
					alert("Erreur de connexion! Veillez veriffier vos données");
          //Change l'icone du patient
					$rootScope.mesPatients[i].etat = 0;
          // effectue la conection des patients suivant si il y en a
					if(i < nb)
					{
						$scope.connexionSocket($scope.lesPatients[i+1].mip, $scope.lesPatients[i+1].mport, i+1, nb);
					}
				}
			},
			// Notify
			function (data){
        //Conection effectué
				if(data == "connected"){
          // Change l'icone du patient
					$rootScope.mesPatients[i].etat = 1;
          // Si la fonction connection a été appelé par add ou modif
          if(($rootScope.etatAddModif == "add") || ($rootScope.etatAddModif == "modif"))
          {

  					// Incertion dans la BDD
  					$rootScope.myDB.transaction(function(transaction) {
  						var executeQuery = "INSERT INTO BbSensor (Nom, IP, Port) VALUES (?,?,?)";
  						transaction.executeSql(executeQuery, [$rootScope.mesPatients[i].nom, $rootScope.mesPatients[i].mip, $rootScope.mesPatients[i].mport]
  						// Accept
  						, function(tx, result) {
                alert("insertion ok");
  							// Recupère l'id du patient
  							transaction.executeSql('SELECT * FROM BbSensor', [], function (tx, results) {
                  $rootScope.mesPatients[i].id = results.rows.item(results.rows.length-1).id;
                  // Si c'est pour un ajout de patient
                  if($rootScope.etatAddModif == "add"){
                    alert('Le nouveau patient a été ajouté');
                  }
                  // Si c'est pour une modification de patient
                  else{
                    alert('Le patient a été modifier');
                  }
  							}, null);
  						},
  						// Error
  						function(error){
  							alert('Error occurred');
  						});

  					});

          }

          // Effectue la conection recursive
					if(i < nb)
					{
						$scope.connexionSocket($scope.lesPatients[i+1].mip, $scope.lesPatients[i+1].mport, i+1, nb);
					}
				}
				else{
					// Données recu
					if(data.type=="bpm"){
            // recupère les données Fc du patient
						$rootScope.mesPatients[i].Fc = data.value;

						// Si Fc == 1 et que le patient est pas en allerte et que l'id visité n'est pas l'id du patient
						if(($rootScope.mesPatients[i].Fc == 1) && ($rootScope.mesPatients[i].etat != 2) && (i != $rootScope.idVisu))
						{
							// Change l'icone du patient en alerte
							$rootScope.mesPatients[i].etat = 2;


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
						$rootScope.mesPatients[i].FR = data.value;
					}
					if(data.type=="satur"){
						$rootScope.mesPatients[i].SpOz = data.value;
					}
				}
			}
		);
	}













	// Fonction pour supprimer un passient du tableau de ListPatients
	$scope.deletePatient = function(index)
	{
		// deconnaicte un ellement de la liste des sockets
		Socket.connectionpatients[index].disconnect();

		/*
		// ia un truc a faire ----------------------------------------------------------------------
		// Supprime un élément de la table
		$rootScope.myDB.transaction(function(transaction)
    {
			var executeQuery = "DELETE FROM BbSensor where id=?";
			transaction.executeSql(executeQuery, [$scope.lesPatients[index].id],
			//On Success
			function(tx, result) {
			},
			//On Error
			function(error){
				alert('Erreur de supression DB');
			});
		});
		*/
		$scope.lesPatients[index].supprimer = true;


	}
	// Fonction pour modiffier les données d'un passient du tableau de ListPatients
	$scope.modifPatient = function(index)
	{
    //$scope.deletePatient(index);
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

});
