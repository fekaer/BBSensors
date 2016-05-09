// controleur de infoAlerte
app.controller("infoAlerteCtrl", function( $scope, $stateParams, ListPatients)
{

	$scope.index = $stateParams.mIndex;
	$scope.lesAlertes = [];

	$scope.alerte = {tipe:'Fc', descriptif: "Fc < 100", date: "12:06.2016 22h12"};
	$scope.lesAlertes.push($scope.alerte);


	// Fonction pour supprimer une alerte du tableau de ListAlertes
	$scope.deleteAlerte = function(index)
	{
		// Supprime un ellement de la liste
		$scope.lesAlertes.splice(index,1);
	}

	$scope.addAlerte = function()
	{
		// Si il y plus de 10 alerte memorisé
		if($scope.lesAlertes.length == 10)
		{
			$scope.lesAlertes.splice(10-1,1);
		}
		// ajoute une alerte
		$scope.lesAlertes.splice(0, 0, Math.random());
	}




});
