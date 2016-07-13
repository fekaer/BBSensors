app.service('ListPatients', function($rootScope){

	this.Paramgeneral = {};

	this.patients = [];
	// joel
	//$scope.patient = {id: null, nom:'', Fc: 0, SpOz: 0, FR: 0, mip: "192.168.2.7", mport: 5000, clignote:false, supprimer: false, etatConnection: 0};
	// moi
	//$scope.newPatient = {id: null, nom:'', Fc: 0, SpOz: 0, FR: 0, ip: "129.194.185.76", port: null, clignote:false, supprimer: false, etatConnection: 0};
	this.modelPatient = {id: null, nom:'', chambre:'', Fc: 0, SpOz: 0, FR: 0, ip: "", port: null, clignote:false, supprimer: false, etatConnection: 0,
												alarme: 0, timeoutAlarm:{}, alertes:[], seuils:{}, inervalFunc:null, socket:null, conectionOn:true};

	this.modelPatient.seuils = {FCmin: 60, FCmax:100, FRmin: 30, FRmax: 50, SP02min: 90, SP02max: 100};
	this.modelPatient.timeoutAlarm = {promiseTimeoutClignot: null, promiseTimeoutAlarmNonRes: null};



	/* Ajoute un patient dans le tableau de patient. --------------------------------------
    param: le patient
    return: --.
  */
	this.addPatient = function (patient) {
		this.patients.push(patient);
	};



	/* Recupère tous les patient de la BDD et les ajoute au tableau de patient. --------------------------------------
    param: valeur retourné pare la BDD contenant les patients <.item(i)>
    return: --.
  */
	this.getAllPatientBDD = function (valeur) {
		//ajout au tableau des Patient les patient mémorisé dans la BDD
		for (var i = 0; i < valeur.length; i++)
		{
			var mpatient = {};
			angular.copy(this.modelPatient, mpatient);
			mpatient.id = valeur.item(i).id;
			mpatient.nom = valeur.item(i).Nom;
			mpatient.chambre = valeur.item(i).Chambre;
			mpatient.ip = valeur.item(i).IP;
			mpatient.port = valeur.item(i).Port;

			this.addPatient(mpatient);
		}


	};
});
