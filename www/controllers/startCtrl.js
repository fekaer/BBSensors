// controleur du Home
app.controller("startCtrl", function( $scope, $state, $stateParams, $ionicHistory)
{


	$scope.entrer = function() {
		$state.go("^.home");
	}

	$scope.exit = function(){
		ionic.Platform.exitApp();
	}

	$ionicHistory.nextViewOptions({
		disableAnimate: true,
		disableBack: true,
		historyRoot: true
	})

});
