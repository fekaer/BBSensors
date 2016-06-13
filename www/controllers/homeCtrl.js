// controleur du Home
app.controller("homeCtrl", function( $scope, $rootScope, $state, $ionicListDelegate, $interval, $timeout, Socket, ListPatients, Notification, Background, $ionicLoading, $window, BDD, Alertes) {
	$scope.lesPatients = [];

	// Paramerte General

	$rootScope.Paramgeneral = {plagetemp:1, delaisAlertRes:30};


	//$rootScope.Paramgeneral = {plagetemp:2, delaisAlertRes:30};


  // Variable tempon du nb patient dans le tableau pour savoir si il faut effectuer une connection
	$scope.nbPatientTemp = 0;
	// variable indiquand quand la bdd est prète
	$scope.bdd_ok = false;


	$rootScope.nbalert = 0;






	// Fonction qui va etre appelé quand la BDD est prête
	$scope.$on('BddOK', function(event, args){
		// recupère les patients de la base de donnée
		$scope.lesPatients = ListPatients.patients;
		// Recharge la vue
		$state.go($state.current, {}, {reload: true});

	});


	// Fonction qui va etre appelé a chaque fois qu'on va venire ou revenire sur la vue Home
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

  // Fonction qui effetue la conection WebSocket
  $scope.connexionSocket = function(ip, port, id)
	{
		Socket.connect("ws://"+ ip + ":" + port)
		{
			Socket.connectionpatients[id].register("freq", $scope.freq, id);
			Socket.connectionpatients[id].register("alarm",$scope.alerm, id);
		}
	}

// Fonction appelé par l'objet JoelSocket ------------------------------------------------------
	$scope.freq = function(data, id) {
		if(data == 'connect')
		{
			console.log('connection');
			$scope.lesPatients[id].etat = 1;
		}

		if(data == 'disconnect')
		{
			console.log('deconection');
			$scope.lesPatients[id].etat = 0;
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
			if(data.search("NEW_FREQ:") != -1)
			{
				console.log('New Freq recu');
				var val = data.replace("NEW_FREQ:", "");
				val = val.split(";");
				ListPatients.patients[id].seuils.FCmin = parseInt(val[0]);
				ListPatients.patients[id].seuils.FCmax = parseInt(val[1]);
			}

			if(data == 'MIN_FREQ')
			{
				console.log('MIN_FREQ');

				seuil = "< " + ListPatients.patients[id].seuils.FCmin;

				Alertes.indiqueAlerte(id, seuil);
			}

			if(data == 'MAX_FREQ')
			{
				console.log('MAX_FREQ');

				var seuil = "> " + ListPatients.patients[id].seuils.FCmax;

				Alertes.indiqueAlerte(id, seuil);
			}
		}

	}

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
			if(data.search("NEW_FREQ:") != -1)
			{
				console.log('New Freq recu');
				var val = data.replace("NEW_FREQ:", "");
				val = val.split(";");
				ListPatients.patients[id].seuils.FCmin = parseInt(val[0]);
				ListPatients.patients[id].seuils.FCmax = parseInt(val[1]);
			}

			if(data == 'MIN_FREQ')
			{
				console.log('MIN_FREQ');

				seuil = "< " + ListPatients.patients[id].seuils.FCmin;

				Alertes.indiqueAlerte(id, seuil);
			}

			if(data == 'MAX_FREQ')
			{
				console.log('MAX_FREQ');

				var seuil = "> " + ListPatients.patients[id].seuils.FCmax;

				Alertes.indiqueAlerte(id, seuil);
			}
		}
	}

	// Gestion de l'option general

	    //Memorise les parametre general
    if(window.localStorage.getItem('plagetemp') == undefined)
    {
      window.localStorage.setItem('plagetemp', 1);
      $rootScope.Paramgeneral.plagetemp = 1;
    } else{
      $rootScope.Paramgeneral.plagetemp = parseInt(window.localStorage.getItem('plagetemp'));
    }
    if(window.localStorage.getItem('delaisAlertRes') == undefined)
    {
      window.localStorage.setItem('delaisAlertRes', 30);
      $rootScope.Paramgeneral.delaisAlertRes = 30;
    } else{
      $rootScope.Paramgeneral.delaisAlertRes = parseInt(window.localStorage.getItem('delaisAlertRes'));
    }

    // quand je clique sur enregistrer
    $rootScope.enregistrParamGeneral = function() {
      window.localStorage.setItem('plagetemp', $rootScope.Paramgeneral.plagetemp);
      window.localStorage.setItem('delaisAlertRes', $rootScope.Paramgeneral.delaisAlertRes);
    }











	// Fonction pour supprimer un passient du tableau de ListPatients
	$scope.deletePatient = function(index)
	{
		if(ListPatients.patients[index].etat == 2){
			Background.remouveName(ListPatients.patients[index].nom);
			$rootScope.nbalert -= 1;
		}
		// deconnaicte un ellement de la liste des sockets
		Socket.connectionpatients[index].MySocketDictionary["freq"].socket.close();
		Socket.connectionpatients[index].MySocketDictionary["alarm"].socket.close();

		// cache le patient
		ListPatients.patients[index].supprimer = true;
		BDD.Delete("DELETE FROM BbSensor where id=?", ListPatients.patients[index].id);

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
		// va a la page infoAlerte en donnant l'id du passient celectionné
		$state.go("infoPatient",{mIndex:index});
	}


	// Gere la mise en veille de l'application
	document.addEventListener('deviceready', Background.start, false);
});
