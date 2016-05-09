app.service('ListPatients', function($rootScope){


	this.modifPatient = function (index, patient) {
		$rootScope.mesPatients[index].supprimer = true;
		$rootScope.mesPatients.push(patient);
		//this.mesPatients[index] = patient;
	};

	this.addPatient = function (patient) {

		$rootScope.mesPatients.push(patient);
	};
});
