// controleur du Home
app.controller("homeCtrl", function( $scope, $rootScope, $ionicHistory, $ionicPopup, $state, $ionicListDelegate, $interval, $timeout, Socket, ListPatients, Background, $ionicLoading, $window, BDD, Alertes, $ionicPlatform) {
	$scope.lesPatients = [];

	// Paramerte General
	$rootScope.Paramgeneral = {};
	angular.copy(Alertes.configGlobalAlert, $rootScope.Paramgeneral);


  // Variable tempon du nb patient dans le tableau pour savoir si il faut effectuer une connection
	$scope.nbPatientTemp = 0;
	// variable indiquand quand la bdd est prète
	$scope.bdd_ok = false;

	$rootScope.nbalert = 0;


	/**
	 * Appelé quand la BDD est prête
	 * @param l'evenement.
	 * @param l'argument.
	 * @return --.
	*/
	$scope.$on('BddOK', function(event, args){
		// recupère les patients de la base de donnée
		$scope.lesPatients = ListPatients.patients;
		// Recharge la vue
		$state.go($state.current, {}, {reload: true});

	});

	/**
	 * Appelé à chaque fois qu'on va venir ou revenir sur la vue Home
	 * @param --.
	 * @param la fonction a executer.
	 * @return --.
	*/
  $scope.$on('$ionicView.enter', function()
  {
		// Si la base de donnée est prête
		if($scope.bdd_ok)
		{
			$scope.newConnection();
		}
		// Effectue le code que à la deuxième fois
		$scope.bdd_ok = true;
  });






// ----------------------------------------- Fonctiopn ---------------------------------------------------------------------------------------------------

	/**
	 * Fonction appelé pour créer une nouvelle connection des patient pas encor connécté
	 * @param --.
	 * @return --.
	*/
	$scope.newConnection = function(){
		// Indique qu'il y a plus d'allerte dans le mode Backgrand donc changer le text
		$rootScope.$broadcast('bbAlerteFin');

		// effectuer la conection des patient pas encor connecté
		if($scope.lesPatients.length > $scope.nbPatientTemp){
			for (var i = $scope.nbPatientTemp; i < $scope.lesPatients.length; i++){
				$scope.connexionSocket( $scope.lesPatients[i].ip,	$scope.lesPatients[i].port,	i	);
			}
		}
		// Mais a jour la variable tempon
		$scope.nbPatientTemp = $scope.lesPatients.length;
	}

	/**
	 * Fonction qui effetue la conection WebSocket
	 * @param ip du patient.
	 * @param port du patient.
	 * @param index du patient dans le tableau ListPatients.patients
	 * @return --.
	*/
  $scope.connexionSocket = function(ip, port, id)
	{
		Socket.connect("ws://"+ ip + ":" + port, id)
		{
			ListPatients.patients[id].socket.register("freq", $scope.freq, id);
			ListPatients.patients[id].socket.register("alarm",$scope.alerm, id);
		}
	}

//--------------------- Fonction appelé par l'objet JoelSocket ------------------------------------------------------------------------------------
	/**
	 * Fonction appelé a la reception de donées du tunnel fréquences du webSocket
	 * @param les datas.
	 * @param index du pacient pour qui sont les frequances.
	 * @return --.
	*/
	$scope.freq = function(data, id) {
		if(data == 'connect')
		{
			console.log('connection');
			$scope.lesPatients[id].etatConnection = 1;
		}

		if(data == 'disconnect')
		{
			console.log('deconection');
			if(ListPatients.patients[id].conectionOn){
				$scope.lesPatients[id].etatConnection = 2;
			}
			else{
				$scope.lesPatients[id].etatConnection = 0;
				ListPatients.patients[id].conectionOn = true;
			}
		}
		// si ce n'est pas le message de conection ni le message de déconnection
		if((data != 'connect') && (data != 'disconnect'))
		{
			var seuil;
			var res = data.split(";");
			$scope.lesPatients[id].Fc = res[0];
		}

		// Mais a jour la vue
		if(!$scope.$$phase)
		{
			$scope.$apply();
		}

	}

	/**
	 * Fonction appelé a la reception de donées du tunnel alarmes du webSocket
	 * @param les datas.
	 * @param index du pacient pour qui sont les frequances.
	 * @return --.
	*/
	$scope.alerm = function(data, id){
		if(data == 'connect')
		{
			console.log('alerm connection');
		}

		if(data == 'disconnect')
		{
			console.log(' alarm deconection');
		}

		// si ce n'est pas le message de conection ni le message de déconnection
		if((data != 'connect') && (data != 'disconnect'))
		{
			if(data.search("NEW_FREQ;") != -1)
			{
				var val = data.replace("NEW_FREQ;", "");
				val = val.split(";");
				ListPatients.patients[id].seuils.FCmin = parseInt(val[0]);
				ListPatients.patients[id].seuils.FCmax = parseInt(val[1]);
			}else if(data.search("MIN_FREQ;") != -1)
			{
				seuil = "< " + ListPatients.patients[id].seuils.FCmin;
				Alertes.indiqueAlerte(id, seuil);
			}else if(data.search("MAX_FREQ;") != -1)
			{
				var seuil = "> " + ListPatients.patients[id].seuils.FCmax;
				Alertes.indiqueAlerte(id, seuil);
			}else{

			}
		}
	}

	//-------------------- Gestion Menu -----------------------------------------------------------------------------------------------------------------------------

	//Memorise les parametre general
  if(window.localStorage.getItem('plagetemp') == undefined)
  {
    window.localStorage.setItem('plagetemp',Alertes.configGlobalAlert.plagetemp);
  } else{
    $rootScope.Paramgeneral.plagetemp = parseInt(window.localStorage.getItem('plagetemp'));
		Alertes.configGlobalAlert.plagetemp = parseInt(window.localStorage.getItem('plagetemp'));
  }
  if(window.localStorage.getItem('delaisAlertRes') == undefined)
  {
    window.localStorage.setItem('delaisAlertRes', Alertes.configGlobalAlert.delaisAlertRes);
  } else{
    $rootScope.Paramgeneral.delaisAlertRes = parseInt(window.localStorage.getItem('delaisAlertRes'));
		Alertes.configGlobalAlert.delaisAlertRes = parseInt(window.localStorage.getItem('delaisAlertRes'));
  }
	if(window.localStorage.getItem('nbAlertMem') == undefined)
	{
		window.localStorage.setItem('nbAlertMem', Alertes.configGlobalAlert.nbAlertMem);
	} else{
		$rootScope.Paramgeneral.nbAlertMem = parseInt(window.localStorage.getItem('nbAlertMem'));
		Alertes.configGlobalAlert.nbAlertMem = parseInt(window.localStorage.getItem('nbAlertMem'));
	}

  // quand je clique sur enregistrer
  $rootScope.enregistrParamGeneral = function() {
    window.localStorage.setItem('plagetemp', $rootScope.Paramgeneral.plagetemp);
    window.localStorage.setItem('delaisAlertRes', $rootScope.Paramgeneral.delaisAlertRes);
		window.localStorage.setItem('nbAlertMem', $rootScope.Paramgeneral.nbAlertMem);
		angular.copy($rootScope.Paramgeneral, Alertes.configGlobalAlert);

		for (var i = 0; i < ListPatients.patients.length; i++) {
			ListPatients.patients[i].alertes.splice(Alertes.configGlobalAlert.nbAlertMem, ListPatients.patients[i].alertes.length - Alertes.configGlobalAlert.nbAlertMem);
		}
  }



	// Fonction pour supprimer un passient du tableau de ListPatients
	$scope.deletePatient = function(index)
	{
		var confirmPopup = $ionicPopup.confirm({
			title: 'Supprimer patient',
			template: "Etes-vous sûr de vouloir supprimer ce patient ?",
			buttons: [
				{
					text: 'Non',
					type: 'button-default'
				}, {
					text: 'Oui',
					type: 'button-positive',
					onTap: function(e) {
						if((ListPatients.patients[index].alarme == 1) || (ListPatients.patients[index].alarme == 2)){
							Background.remouveName(ListPatients.patients[index].nom);
							$rootScope.nbalert -= 1;
						}
						// deconnecte un ellement de la liste des sockets
						ListPatients.patients[index].socket.MySocketDictionary["freq"].socket.close();
						ListPatients.patients[index].socket.MySocketDictionary["alarm"].socket.close();

						// cache le patient
						ListPatients.patients[index].supprimer = true;
						BDD.Delete("DELETE FROM BbSensor where id=?", ListPatients.patients[index].id);

						// Glisser pour ne plus afficher les boutons d'option
						$ionicListDelegate.$getByHandle('liste-patients').closeOptionButtons();

					}
				}
			]
		});
	}

	// Fonction pour modiffier les données d'un passient du tableau de ListPatients
	$scope.modifPatient = function(index)
	{
		// va a la page modifListe en donnant l'id du passient celectionné
		$state.go("modifList",{mIndex:index});
		// Glisser pour ne plus afficher les boutons d'option
		$ionicListDelegate.$getByHandle('liste-patients').closeOptionButtons();
	}

	$scope.connectionOnOff = function(index)
	{
		if(ListPatients.patients[index].etatConnection == 1)
		{
			ListPatients.patients[index].conectionOn = false;
			// deconnecte un ellement de la liste des sockets
			ListPatients.patients[index].socket.MySocketDictionary["freq"].socket.close();
			ListPatients.patients[index].socket.MySocketDictionary["alarm"].socket.close();
		}
		else {
			$scope.connexionSocket(ListPatients.patients[index].ip, ListPatients.patients[index].port, index);
		}
	}

	// Fonction pour afficher les alertes d'un passient du tableau des alertes
	$scope.infoAlerte = function(index)
	{
		// va a la page infoAlerte en donnant l'id du passient celectionné
		$state.go("infoAlerte",{mIndex:index});
	}

	// Fonction pour afficher les alertes d'un passient du tableau des alertes
	$scope.ecg = function(index)
	{
		if(ListPatients.patients[index].etatConnection == 1)
		{
			// va a la page infoAlerte en donnant l'id du passient celectionné
			$state.go("infoPatient",{mIndex:index});
		}
	}


	// Gere la mise en veille de l'application
	document.addEventListener('deviceready', Background.start, false);


// Gère le bouton "retoure en arrière du téléphone"
	$ionicPlatform.registerBackButtonAction(function(){
		if($ionicHistory.currentTitle() == 'Patients')
		{
			var confirmPopup = $ionicPopup.confirm({
				title: 'Quitter',
				template: "Etes-vous sûr de vouloir quitter l'application ?",
				buttons: [
					{
				    text: 'Non',
				    type: 'button-default'
				  }, {
				    text: 'Oui',
				    type: 'button-positive',
						onTap: function(e) {
							ionic.Platform.exitApp();
				    }
					}
				]
			});
		}
		else{
			$ionicHistory.goBack();
		}
	}, 100);
});
