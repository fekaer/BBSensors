app.service('BDD', function($rootScope, ListPatients, $ionicHistory){

  this.bdd = null;

  /* Crée la BDD. --------------------------------------
    param: le nom de la BDD
    param: location
    return: la BDD si ok, sinon false.
  */
  this.CreatBDD = function(nomBDD, locat){
    this.bdd = window.sqlitePlugin.openDatabase ({name: nomBDD, location: locat});
    if(this.bdd != null)
    {
      //alert('BDD créé');
      return this.bdd;
    }
    return false;
  };

  /* Crée une table dans la BDD. --------------------------------------
    param: La requette SQL (CREATE TABLE IF NOT EXISTS)
    return: true si ok, sinon false.
  */
	this.CreatTable = function (SQL_Comande) {
    // Crée la table dans la base de donnée
    this.bdd.transaction(function(transaction)
    {
      transaction.executeSql(SQL_Comande, [],
      // Accept
      function(tx, result)
      {
        return true;

      },
      // Error
      function(error) {
        alert("Erreur lors de la création de la table");
        return false;
      });
    });
	};

  /* Recupère les données dans la BDD. --------------------------------------
    param: La requette SQL (SELECT)
    return: --.
  */
  this.SelectAllInBDD = function(requet){
    this.bdd.transaction(function(transaction)
    {
      // Recupère tous de la table BbSensor
      transaction.executeSql(requet, [], function (tx, results)
      {
        ListPatients.getAllPatientBDD(results.rows);
        // indique a home que la BDD est prête
        $rootScope.$broadcast('BddOK');
        //return results.rows.length;
        //results.rows.item(i).id;
        //results.rows.length;
      }, null);
    });
  };



  /* Inserer dans la BDD. --------------------------------------
    param: La requette SQL`(CREATE TABLE IF NOT EXISTS)
    return: --.
  */
  this.InsertPatientInBDD = function(requet){
    var tabVal = [];
    for (var i = 1; i < arguments.length; i++){
      tabVal.push(arguments[i]);
    }

    // Incertion dans la BDD
    this.bdd.transaction(function(transaction) {
      //transaction.executeSql(arguments[0], tabVal
      transaction.executeSql(requet, tabVal, function(tx, result) {

        // Recupère l'id du patient
        transaction.executeSql('SELECT * FROM BbSensor', [], function (tx, results) {
          //ListPatients.patients[ListPatients.patients.length-1].id = results.rows.item(results.rows.length-1).id;
          var id = results.rows.item(results.rows.length-1).id;
          ListPatients.patients[ListPatients.patients.length-1].id = id;
          $ionicHistory.goBack();
        }, null);

      },
      function(error){
        console.log('Error occurred');
      });
    });
  };



  /* Supprime un patient de la BDD. --------------------------------------
    param: La requette SQL (SELECT)
    return: --.
  */
  this.Delete = function(requet, id){
    this.bdd.transaction(function(transaction)
    {
			transaction.executeSql(requet, [id],
			//On Success
			function(tx, result) {
			},
			//On Error
			function(error){
				alert('Erreur de supression DB');
			});
		});
  };
});
