// controleur de infoAlerte
app.controller("infoAlerteCtrl", function( $scope, $rootScope, $stateParams, ListPatients, Background, $interval)
{
	// POur afficher ou pas l'option de suppression des alertes
	$scope.data = {
		showDelete: false
	};

	$scope.index = $stateParams.mIndex;
	$scope.lesAlertes = ListPatients.patients[$scope.index].alertes;

	//$scope.alerte = {tipe:'Fc', descriptif: "Fc < 100", date: "12:06.2016 22h12"};
	//$scope.lesAlertes.push($scope.alerte);


	// Fonction pour supprimer une alerte du tableau de ListAlertes
	$scope.deleteAlerte = function(index)
	{
		// Supprime un ellement de la liste
		$scope.lesAlertes.splice(index,1);

		if(($scope.lesAlertes.length == 0) && ((ListPatients.patients[$scope.index].etat == 2) || (ListPatients.patients[$scope.index].etat == 3)))
		{
			//clearInterval(ListPatients.patients[$scope.index].inervalFunc);
			//var toto = $interval.cancel(ListPatients.patients[$scope.index].inervalFunc);
			//console.log('toto ' + toto);
			//if(toto = true)
			//{
				ListPatients.patients[$scope.index].clignote = false;
				ListPatients.patients[$scope.index].etat = 1;
				Background.remouveName(ListPatients.patients[$scope.index].nom);
				$rootScope.nbalert -= 1;
			//}

		}
	}

	$scope.deleteAll = function()
	{
		/*
		// Si il y plus de 10 alerte memorisé
		if($scope.lesAlertes.length == 10)
		{
			$scope.lesAlertes.splice(10-1,1);
		}
		*/


		$scope.lesAlertes.splice(0, $scope.lesAlertes.length);
		if((ListPatients.patients[$scope.index].etat == 2) || (ListPatients.patients[$scope.index].etat == 3))
		{
			//clearInterval(ListPatients.patients[$scope.index].inervalFunc);
		//	var toto = $interval.cancel(ListPatients.patients[$scope.index].inervalFunc);
		//	ListPatients.patients[$scope.index].inervalFunc = undefined;


		//	console.log('toto ' + toto);
		//	if(toto = true)
		//	{
				ListPatients.patients[$scope.index].clignote = false;
				ListPatients.patients[$scope.index].etat = 1;
				Background.remouveName(ListPatients.patients[$scope.index].nom);
				$rootScope.nbalert -= 1;
		//	}
		}
	}




});
