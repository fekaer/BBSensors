// controleur du Weather
app.controller("addPatientCtrl", function($scope, $rootScope, $state, $stateParams, $interval, ListPatients, BDD, Socket, Notification, $ionicHistory){

	$scope.newPatient = {};
	angular.copy(ListPatients.modelPatient, $scope.newPatient);

	$scope.addNewPatient = function()
	{
		// Ajoute mon nouvau patient
		ListPatients.addPatient($scope.newPatient);
		// Ajoute le patient dans la base de donnée
		BDD.InsertPatientInBDD("INSERT INTO BbSensor (Nom, IP, Port) VALUES (?,?,?)", $scope.newPatient.nom, $scope.newPatient.ip, $scope.newPatient.port);
	}


});
