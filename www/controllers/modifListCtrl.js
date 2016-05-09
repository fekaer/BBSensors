// controleur du Home
app.controller("modifListCtrl", function( $scope, $rootScope, $state, $stateParams, Socket, ListPatients, $ionicHistory, Notification)
{
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






	$scope.modifPatient = function () {


		// Deconnecte et cache le patien modiffier
		Socket.connectionpatients[$scope.mId].disconnect();
		$rootScope.mesPatients[$scope.mId].supprimer = true;

		// Il faut enlever après
		$ionicHistory.goBack();
		$rootScope.mesPatients.push($scope.patient);
/*
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
