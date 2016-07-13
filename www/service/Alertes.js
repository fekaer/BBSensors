app.service('Alertes', function($rootScope, $interval, $timeout, ListPatients, Background){

  this.modelAlert = {type:'', valeur:0, date:''};

  this.configGlobalAlert = {plagetemp:1, delaisAlertRes:30, nbAlertMem:6};
  this.dataSignalAlerte = {data:[], nbData:0, dataMin:0, dataMax:0}

  this.indiqueAlerte = function(id, seuil){
    var temp = [];
    var date = new Date();
    date = date.toDateString() + " " + date.toLocaleTimeString();

    // Ajoute le nouvelle alerte
    ListPatients.patients[id].alertes.splice(0, 0, {descriptif: "Fc "+ seuil, date: date});

    // Si il y plus de X alerte memorisé
    if(ListPatients.patients[id].alertes.length > this.configGlobalAlert.nbAlertMem)
    {
      // Supprime alerte en trop
      var nbAlertM = this.configGlobalAlert.nbAlertMem;
      $timeout(function() {
        ListPatients.patients[id].alertes.splice(nbAlertM, ListPatients.patients[id].alertes.length - nbAlertM);
      }, 0);
    }

    // Fonction de clignotement
    var clignoteFunc = function(){
      if(ListPatients.patients[id].clignote == true)
      {
        if(ListPatients.patients[id].alarme == 1){
          $timeout(function() {
           ListPatients.patients[id].alarme = 0;
          },0);
        }
        else{
          $timeout(function() {
            ListPatients.patients[id].alarme = 1;
          },0);
        }
        //ListPatients.patients[id].timeoutAlarm.promiseTimeoutClignot = $timeout(clignoteFunc, 500);
      }
    }

    var alertNonResFunc = function() {
      var repPromise = $interval.cancel(ListPatients.patients[id].timeoutAlarm.promiseTimeoutClignot);
      if(repPromise){
        $timeout(function() {
          ListPatients.patients[id].clignote = false;
          ListPatients.patients[id].alarme = 2;
        },0);
      }

    }


    if((ListPatients.patients[id].alarme == 0) && (ListPatients.patients[id].clignote == false)){
      ListPatients.patients[id].clignote = true;
      // Fais clignoter
      ListPatients.patients[id].timeoutAlarm.promiseTimeoutClignot = $interval(clignoteFunc, 500);

      // Indique que alerte pas recente
      ListPatients.patients[id].timeoutAlarm.promiseTimeoutAlarmNonRes = $timeout(alertNonResFunc, this.configGlobalAlert.delaisAlertRes * 1000);

      // Fait vibrer 1sec
      navigator.notification.vibrate(1000); // Fait vibrer X milisec
      // fais sonner 1 fois
      navigator.notification.beep(1); // fais sonner n fois

      // Affiche un message aletre
      /*
      navigator.notification.alert(
              message,  		// message
              callback,		// callback
              title,          // title
              buttonName      // buttonName
      );
      */


      Background.addNameAlert(ListPatients.patients[id].nom);
      $rootScope.nbalert += 1;
    }
  }
});
