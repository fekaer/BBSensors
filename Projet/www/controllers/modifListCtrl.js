// controleur du Home
app.controller("modifListCtrl", function( $scope, $rootScope, $state, $stateParams, $ionicHistory, $ionicPopover, $cordovaBarcodeScanner, ListPatients, BDD, Background)
{
	$scope.test = false;

	// l'id du patient a modiffier
	$scope.mId = $stateParams.mIndex;

	$scope.patient = {};
	angular.copy(ListPatients.modelPatient, $scope.patient);
	// on recupère les nouvelles données du patient
	$scope.patient.id = ListPatients.patients[$scope.mId].id;
	$scope.patient.nom = ListPatients.patients[$scope.mId].nom;
	$scope.patient.chambre = ListPatients.patients[$scope.mId].chambre;
	$scope.patient.ip = ListPatients.patients[$scope.mId].ip;
	$scope.patient.port = ListPatients.patients[$scope.mId].port;

	$scope.seuils = {};
	angular.copy(ListPatients.patients[$scope.mId].seuils, $scope.seuils);

	// pour l'option bouton a droit
	/*
	$scope.popover = $ionicPopover.fromTemplateUrl('templates/popover.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
*/
	// option bouton
	$scope.associer = function() {
		// Ferme le popover
		//$scope.popover.hide();
		$scope.test = false;
	}
	$scope.seuil = function() {
		// Ferme le popover
		//$scope.popover.hide();
		$scope.test = true;
	}

	$scope.qrCode = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData)
		{
			if((imageData.text.search("ip") != -1) && (imageData.text.search("port") != -1)){
				//var text = imageData.text.slice(2);
				var text = imageData.text.replace("ip", "");
				text = text.replace("port", "");
				var val = text.split("-");
				// Test si le QRCode est bon (Si il posaide une virgule)

				// Recupère la valeur de l'ip
				$scope.patient.ip = val[0];
				// Recupère la valeur du port
				$scope.patient.port = parseInt(val[1]);
			}
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	};

	$scope.codeBar = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData)
		{
			var val = imageData.text.split(",");

			if(imageData.text == '5901234123457'){

				$scope.patient.nom = 'BbSensor';
				$scope.patient.chambre = '185b';
			}
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	};


	$scope.modifPatient = function() {
		// deconnaicte un ellement de la liste des sockets
		ListPatients.patients[$scope.mId].socket.MySocketDictionary["freq"].socket.close();
		ListPatients.patients[$scope.mId].socket.MySocketDictionary["alarm"].socket.close();
		// cache le patient
		ListPatients.patients[$scope.mId].supprimer = true;
		BDD.Delete("DELETE FROM BbSensor where id=?", $scope.patient.id);

		// Ajoute mon nouvau patient
		ListPatients.addPatient($scope.patient);
		// Ajoute le patient dans la base de donnée
		BDD.InsertPatientInBDD("INSERT INTO BbSensor (Nom, Chambre, IP, Port) VALUES (?,?,?,?)", $scope.patient.nom, $scope.patient.chambre, $scope.patient.ip, $scope.patient.port);

		Background.remouveName(ListPatients.patients[$scope.mId].nom);
		$rootScope.nbalert -= 1;
	};

	$scope.modifSeuil = function() {
		//ListPatients.patients[$scope.mId].seuils = $scope.seuils;
		ListPatients.patients[$scope.mId].seuils.FCmax = parseInt($scope.seuils.FCmax);
		ListPatients.patients[$scope.mId].seuils.FCmin = parseInt($scope.seuils.FCmin);
		ListPatients.patients[$scope.mId].socket.send('alarm', $scope.seuils.FCmin + ';' + $scope.seuils.FCmax);
		$ionicHistory.goBack();
	};
});
