// controleur du Weather
app.controller("addPatientCtrl", function($scope, $rootScope, $state, $stateParams, $interval, ListPatients, BDD, Socket, Notification, $ionicHistory, $cordovaBarcodeScanner){

	$scope.newPatient = {};
	angular.copy(ListPatients.modelPatient, $scope.newPatient);

	$scope.QRCode = function()
	{
		$cordovaBarcodeScanner.scan().then(function(imageData)
		{
			if((imageData.text.search("ip") != -1) && (imageData.text.search("port") != -1)){
				//var text = imageData.text.slice(2);
				var text = imageData.text.replace("ip", "");
				text = text.replace("port", "");
				var val = text.split("-");
				// Test si le QRCode est bon (Si il posaide une virgule)

				// Recupère la valeur de l'ip
				$scope.newPatient.ip = val[0];
				// Recupère la valeur du port
				$scope.newPatient.port = parseInt(val[1]);
			}
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	}


	$scope.codeBar = function()
	{
		$cordovaBarcodeScanner.scan().then(function(imageData)
		{
			if(imageData.text == '5901234123457'){

				$scope.newPatient.nom = 'Baby';
				$scope.newPatient.chambre = '185b';
			}
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	}

	$scope.addNewPatient = function()
	{
		if(($scope.newPatient.ip != '') && ($scope.newPatient.port != null))
		{
			// Ajoute mon nouvau patient
			ListPatients.addPatient($scope.newPatient);
			// Ajoute le patient dans la base de donnée
			BDD.InsertPatientInBDD("INSERT INTO BbSensor (Nom, Chambre, IP, Port) VALUES (?,?,?,?)", $scope.newPatient.nom, $scope.newPatient.chambre, $scope.newPatient.ip, $scope.newPatient.port);
		}
		else {
			alert("Vous n'avez pas scanné le QRCode");
		}
	}


});
