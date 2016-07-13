// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])

app.run(function($ionicPlatform, $rootScope, BDD, ListPatients) {
  /*
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  */

  $ionicPlatform.ready(function() {
    $rootScope.mesPatients = [];
    $rootScope.bdd_ok = false;

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


    // Crée la base de donnée
		//$rootScope.myDB = window.sqlitePlugin.openDatabase ({name: "mySQLite.db", location: 'default'});
    var mBdd = BDD.CreatBDD("mySQLite.db", 'default');
    if(mBdd != false)
    {
      if(BDD.CreatTable('CREATE TABLE IF NOT EXISTS BbSensor (id integer primary key, Nom text, Chambre text, IP text, Port integer)') != false)
      {
        BDD.SelectAllInBDD('SELECT * FROM BbSensor');
      }
    }

  });
})




// Configuration des differante etat (pages) et l'etat (page) par deffaut
app.config(function($stateProvider,$urlRouterProvider) {

	// Etat home
	$stateProvider.state("home", {
		url: "/home",
		templateUrl: "templates/home.html",
		controller: "homeCtrl"
	})


	// Etat Mes patients
	$stateProvider.state("addPatient", {
		url: "/addPatient",
		templateUrl: "templates/addPatient.html",
		controller: "addPatientCtrl"
	})

	// Etat Modifier Liste patients
	$stateProvider.state("modifList", {
		url: "/modifList/:mIndex",
		templateUrl: "templates/modifList.html",
		controller: "modifListCtrl"
	})

	// Etat Info patient
	$stateProvider.state("infoPatient", {
		url: "/infoPatient/:mIndex",
		templateUrl: "templates/infoPatient.html",
		controller: "infoPatientCtrl"
	})

	// Etat Info patient
	$stateProvider.state("infoAlerte", {
		url: "/infoAlerte/:mIndex",
		templateUrl: "templates/infoAlerte.html",
		controller: "infoAlerteCtrl"
	})

  // Etat graphAlert
  $stateProvider.state("graphAlert", {
    url: "/graphAlert",
    templateUrl: "templates/graphAlert.html",
    controller: "graphAlertCtrl"
  })


	// Etat par defaut (la page de demarage)
	$urlRouterProvider.otherwise("/home")
});
