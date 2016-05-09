// controleur du Weather
app.controller("addPatientCtrl", function($scope, $rootScope, $state, $stateParams, $interval, ListPatients, Socket, Notification, $ionicHistory){

	$scope.patient = {id: null, nom:'', Fc: 0, SpOz: 0, FR: 0, mip: "", mport: "", clignote:false, supprimer: false, etat: 0};


	$scope.addNewPatient = function()
	{

		//$scope.index = $rootScope.mesPatients.length;
		// Ajoute mon nouvau patient
		$rootScope.mesPatients.push($scope.patient);
		// Indique a Home d'un ajout
		$rootScope.etatAddModif = "add";
		// Retoure a la page d'avent (Home)
		$ionicHistory.goBack();
	}


});
