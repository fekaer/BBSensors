// controleur de infoAlerte
app.controller("infoAlerteCtrl", function( $scope, $rootScope, $state, $ionicLoading, $stateParams, $timeout, ListPatients, Background, $interval, Alertes)
{
	// POur afficher ou pas l'option de suppression des alertes
	$scope.data = {
		showDelete: false
	};

	$scope.index = $stateParams.mIndex;
	$scope.lesAlertes = ListPatients.patients[$scope.index].alertes;



	var deleteFunc = function(){
		//var repPromise1 = $interval.cancel(ListPatients.patients[$scope.index].timeoutAlarm.promiseTimeoutClignot);
		var	repPromise1 = $interval.cancel(ListPatients.patients[$scope.index].timeoutAlarm.promiseTimeoutClignot);
		var repPromise2 = $timeout.cancel(ListPatients.patients[$scope.index].timeoutAlarm.promiseTimeoutAlarmNonRes);
		if((repPromise1)&&(repPromise2)){
			ListPatients.patients[$scope.index].clignote = false;
			ListPatients.patients[$scope.index].alarme = 0;
		}
		else{
			if(ListPatients.patients[$scope.index].clignote == false){
				ListPatients.patients[$scope.index].alarme = 0;
			}
		}


		Background.remouveName(ListPatients.patients[$scope.index].nom);
		$rootScope.nbalert -= 1;
	}

	// Fonction pour supprimer une alerte du tableau de ListAlertes
	$scope.deleteAlerte = function(index)
	{
		// Supprime un ellement de la liste
		$scope.lesAlertes.splice(index,1);

		if(($scope.lesAlertes.length == 0) && ((ListPatients.patients[$scope.index].clignote == true) || (ListPatients.patients[$scope.index].alarme == 2)))
		{
			deleteFunc();
		}
	}

	$scope.deleteAll = function()
	{
		$scope.lesAlertes.splice(0, $scope.lesAlertes.length);
		if((ListPatients.patients[$scope.index].clignote == true) || (ListPatients.patients[$scope.index].alarme == 2))
		{
			deleteFunc();
		}
		$scope.data.showDelete = false;
	}

	// Fonction pour afficher les alertes d'un passient du tableau des alertes
	$scope.signalAlerte = function(index)
	{
		var d = new Date();
		/*
		$ionicLoading.show({
			template: 'Loading...'
		});
		*/

		var mtime = $scope.getTimeAlerte(index);
		var started = null;

		var getdataAletre = function(signal){
			var diff = (new Date()).getTime() - started;
			alert("arrive" + diff);
			/*
			Alertes.dataSignalAlerte.nbData = signal.length/2;
			console.log(Alertes.dataSignalAlerte.nbData);


			var arrayDataTemp = [];
			console.log(d.getTime());
			var i;
			for (i = 0; i < signal.length; i+2) {
				if(i < signal.length)
				{
					arrayDataTemp[i/2] = signal[i];
				}
				else{
					console.log("coucou");
				}

			}

			Alertes.dataSignalAlerte.data = arrayDataTemp;
			//Alertes.dataSignalAlerte.dataMin = Math.min.apply(null, signal);
			//Alertes.dataSignalAlerte.dataMax = Math.max.apply(null, signal);
			$state.go("graphAlert");
			*/

		};

		started = (new Date()).getTime();
		ListPatients.patients[$scope.index].socket.connectSendAndClose("history", getdataAletre, mtime + ";" + (Alertes.configGlobalAlert.plagetemp * 60 * 250));

	//	$timeout(function(){
	//		$state.go("graphAlert",{mIndex:index});
	//	}, 100);

	}



	$scope.getTimeAlerte = function(index){
		var mdate = new Date();
		var tttt = mdate.toLocaleTimeString();
		var time1 = tttt.split(":");

		var time2 = $scope.lesAlertes[index].date;
		time2 = time2.split(" ");
		time2 = time2[4];
		time2 = time2.split(":");

		var min;
		var sec;
		if(parseInt(time1[0]) > parseInt(time2[0]))
		{
			min = parseInt(time1[1]) + (60 - parseInt(time2[1]));
		}
		else{
			min = parseInt(time1[1]) - parseInt(time2[1]);
		}
		sec = parseInt(time1[2]) - parseInt(time2[2]);

		var mtime = (min * 60 * 250) + (sec * 250);
		return mtime;
	};
 });
