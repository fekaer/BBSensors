app.service('Alertes', function($rootScope, $interval, $timeout, Notification, ListPatients, Background){

  this.modelAlert = {type:'', valeur:0, date:''};

  this.indiqueAlerte = function(id, seuil){
    var date = new Date();
    date = date.toDateString() + " " + date.toLocaleTimeString();
    ListPatients.patients[id].alertes.splice(0, 0, {descriptif: "Fc "+ seuil, date: date});

    if(ListPatients.patients[id].etat == 1){
      // Change l'icone
      $timeout(function() {
        ListPatients.patients[id].etat = 2;
      }, 0);

      $timeout(function() {
        if(ListPatients.patients[id].etat == 2)
        {
          ListPatients.patients[id].etat = 3;
        }
      }, $rootScope.Paramgeneral.delaisAlertRes * 1000);
      /*
      var fnc = function(){
        $timeout(function() {
          if(ListPatients.patients[id].etat == 2)
          {
            ListPatients.patients[id].clignote = !ListPatients.patients[id].clignote;
          }
        }, 0);

      };

      //$rootScope.clign = setInterval(fnc, 500);
      ListPatients.patients[id].inervalFunc = setInterval(fnc,500);
      */

      // Fait vibrer 1sec
      Notification.vibrate(1000);
      // fais sonner 1 fois
      Notification.beep(1);
      // Affiche un message aletre
      //Notification.alert('le patient ' + (i) + ' a un problème de FC', null, 'Fc problème', 'OK');


      Background.addNameAlert(ListPatients.patients[id].nom);
      $rootScope.nbalert += 1;
    }
  }
});
