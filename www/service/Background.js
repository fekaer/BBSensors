app.service('Background', function($rootScope, $timeout){

  this.textAlerte = 'Alerte patient:  ';
  var self = this;

	this.start = function () {
    // customization
    cordova.plugins.backgroundMode.setDefaults({
    	title: 'BbSensor',
  		ticker: 'BbSensor',
  		text: 'Aucune alerte détectée'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();


    cordova.plugins.backgroundMode.onactivate = function()
    {
      if(self.textAlerte == 'Alerte patient:  ')
      {
        // il faut faire un timeout parceque quand on rentre dans onactivate, le plugine remait le texte par défaut
        // donc pour pas rentrer en conflit il faut le faire aprè
        $timeout(function()
        {
          cordova.plugins.backgroundMode.configure({
            text: 'Aucune alerte détectée'
          });
        }, 30);
      }
      else{
        // il faut faire un timeout parceque quand on rentre dans onactivate, le plugine remait le texte par défaut
        // donc pour pas rentrer en conflit il faut le faire aprè
        $timeout(function()
        {
          cordova.plugins.backgroundMode.configure({
            text:self.textAlerte
          });
        }, 30);
      }


      //$scope.$apply();

    };
  };


  this.addNameAlert = function(nom){
    this.textAlerte += (nom + ', ');
    cordova.plugins.backgroundMode.configure({
        text:this.textAlerte
    });
  };

  this.remouveName = function(nom){
    this.textAlerte = this.textAlerte.replace(nom + ', ', "");
    if(this.textAlerte == 'Alerte patient:  ')
    {
      cordova.plugins.backgroundMode.configure({
          text: 'Aucune alerte détectée'
      });
    }
    else{
      cordova.plugins.backgroundMode.configure({
          text:this.textAlerte
      });
    }
  };

  this.stopAlert = function(){
    this.textAlerte = 'Alerte patient: ';
  }

});
