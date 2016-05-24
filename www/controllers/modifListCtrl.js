// controleur du Home
app.controller("modifListCtrl", function( $scope, $rootScope, $state, $stateParams, Socket, ListPatients, $ionicHistory, Notification, $ionicPopover)
{
	$scope.test = false;

	// pour l'option bouton a droit
	$scope.popover = $ionicPopover.fromTemplateUrl('templates/popover.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});



	$scope.bibi = function() {
		// Ferme le popover
		$scope.popover.hide();
		$scope.test = true;
	}
	$scope.baba = function() {
		// Ferme le popover
		$scope.popover.hide();
		$scope.test = false;
	}


	// nouveau patient vide
	$scope.patient = {id: null, nom:'', Fc: 0, SpOz: 0, FR: 0, mip: "", mport: "", clignote:false, supprimer: false, etat: 0};
	// l'id du patient a modiffier
	$scope.mId = $stateParams.mIndex;
	// Indique a Home d'une modification
	$rootScope.etatAddModif = "modif";



	// on recupère les nouvelles données du patient
	$scope.patient.nom = $rootScope.mesPatients[$scope.mId].nom;
	$scope.patient.mip = $rootScope.mesPatients[$scope.mId].mip;
	$scope.patient.mport = $rootScope.mesPatients[$scope.mId].mport;

	$scope.openPopover = function($event) {
	    $scope.popover.show($event);
	  };




	$scope.modifPatient = function () {

		$ionicHistory.goBack();
		/*
		// Deconnecte et cache le patien modiffier
		Socket.connectionpatients[$scope.mId].disconnect();
		$rootScope.mesPatients[$scope.mId].supprimer = true;


		// Supprime de la BD l'encien patient
		$rootScope.myDB.transaction(function(transaction)
		{
			var executeQuery = "DELETE FROM BbSensor where id=?";
			transaction.executeSql(executeQuery, [$rootScope.mesPatients[$scope.mId].id],
			//On Success
			function(tx, result)
			{
				$rootScope.mesPatients.push($scope.patient);
				$ionicHistory.goBack();
			},
			//On Error
			function(error){
				alert('Erreur de supression DB');
			});
		});
		*/

	};
});
