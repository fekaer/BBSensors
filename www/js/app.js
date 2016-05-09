// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

app.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.mesPatients = [];

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
		$rootScope.myDB = window.sqlitePlugin.openDatabase ({name: "mySQLite.db", location: 'default'});


    // Crée la table dans la base de donnée
    $rootScope.myDB.transaction(function(transaction) 
    {
      transaction.executeSql('CREATE TABLE IF NOT EXISTS BbSensor (id integer primary key, Nom text, IP text, Port text)', [],
      // Accept
      function(tx, result)
      {
        // Recupère tous de la table BbSensor
        transaction.executeSql('SELECT * FROM BbSensor', [], function (tx, results)
        {
          var len = results.rows.length;
          var i;
          if(len > 0)
          {	//ajout au tableau mesPatients les patient mémorisé dans la BDD
            for (i = 0; i < len; i++)
            {
              var mpatient = {id: null, nom:'', Fc: 0, SpOz: 0, FR: 0, mip: "", mport: "", clignote:false, supprimer: false, etat: 0};
              mpatient.id = results.rows.item(i).id;
              mpatient.nom = results.rows.item(i).Nom;
              mpatient.mip = results.rows.item(i).IP;
              mpatient.mport = results.rows.item(i).Port;
              $rootScope.mesPatients.push(mpatient);
            }
          }
        }, null);
      },
      // Error
      function(error) {
        alert("Erreur lors de la création de la table");
      });
    });
  });
})




// Configuration des differante etat (pages) et l'etat (page) par deffaut
app.config(function($stateProvider,$urlRouterProvider) {

	// Etat start
	$stateProvider.state("start", {
		url: "/start",
		templateUrl: "templates/start.html",
		controller: "startCtrl"
	})


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


	// Etat par defaut (la page de demarage)
	$urlRouterProvider.otherwise("/start")
});
