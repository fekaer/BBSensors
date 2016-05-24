// controleur du Home
app.controller("infoPatientCtrl", function( $scope, $rootScope, $state, $stateParams, ListPatients, $ionicHistory, $window)
{

    
    $scope.index = $stateParams.mIndex;
    $rootScope.idVisu = $scope.index;
    // Pour l'icone dans home
    if($rootScope.mesPatients[$scope.index].etat == 2)
    {
        $rootScope.mesPatients[$scope.index].etat = 1;
    }


    //129.194.185.76









    "use strict";
    var monitor = document.getElementById("monitor");
    var ctx = monitor.getContext("2d");
    ctx.fillStyle = "#dbbd7a";
    ctx.fill();

    // requestAnimationFrame(drawWave);
    var MARGIN_MONITOR_RIGHT = Math.floor(monitor.width - monitor.width / 5.5);
    var MARGIN_MONITOR_LEFT = Math.floor(monitor.width / 50);
    var MARGIN_BLOCK = 8;


    $scope.infoAlerte = function(index)
    {
        // va a la page infoAlerte en donnant l'id du passient celectionné
        $state.go("infoAlerte",{mIndex:index});
    }


    // Information des données sur le côté droite du moniteur
    function drawInfo(txt, color, style, positionY) {
        ctx.fillStyle = color; //Permet de donner une couleur au texe indiquant les valeur num a droite
        ctx.font = style; // indique le style du text
        ctx.fillText(txt, monitor.width -45, positionY); // Indique - le text a afficher, la position en x, la position en y
    }

    function drawWave() {

        const NB_BLOCK = 3;

        function positionCenterY(no_block) {
            return ((no_block * 2) + 1) / (NB_BLOCK * 2) * monitor.height;
        }
        function positionTopY(no_block) {

            return no_block * 2 / (NB_BLOCK * 2) * monitor.height;
        }
        function positionBottomY(no_block) {
            return (no_block * 2 + 2) / (NB_BLOCK * 2) * monitor.height;
        }

        function drawLine(x0, y0, x1, y1) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }

        function minMaxDraw(min, value, max) {
            return Math.max(min + MARGIN_BLOCK / 2, Math.min(max - MARGIN_BLOCK / 2, value));
        }

        function minMax(min, value, max) {
            return Math.max(min, Math.min(max, value));
        }


        ctx.strokeStyle = 'white';
        ctx.lineWidth = "1.0";

        // +0.5 avoiding antialiasing !
        Array.from(Array(10).keys()).forEach(function (i) {
            drawLine(0, positionBottomY(i) + 0.5, monitor.width, positionBottomY(i) + 0.5);
        });

        drawLine(MARGIN_MONITOR_RIGHT + 5.5, 0, MARGIN_MONITOR_RIGHT + 5.5, monitor.height);

        // Class Signal :
        // - position: position du signal (slot) sur le moniteur
        // - info: Nom du signal abrégé
        // - signals: liste des informations reçues à affichier (flux continu de données et informations chaque seconde)
        // - color: Couleur du signal
        // - scaleFunction: fonction pour l'affichage des limites du signal dans son slot
        function Signal(position, info, signals, color, scaleFunction) {

            this.position = position;
            this.info = info;
            this.x = MARGIN_MONITOR_LEFT;
            this.scaleFunction = scaleFunction;
            this.color = color;
            this.value = [positionCenterY(this.position), 0];

            // Configuration des sockets pour recevoir les signaux
            var _this = this;
            //this.mysocket = io.connect('http://' + $rootScope.mesPatients[$scope.index].mip + ':' + $rootScope.mesPatients[$scope.index].mport);
            this.mysocket = io.connect('http://129.194.185.76:8085');

              //this.mysocket = io.connect('http://' + $rootScope.mesPatients[$scope.index].mip + ':' + $rootScope.mesPatients[$scope.index].mport);
              /*
            this.mysocket.on('connect_failed', function(){console.log("connect_failed");});

            this.mysocket.on("error", function (error) {
              console.log("coucou ca merde" + error);
            });
            */


            this.mysocket.on(signals[0], function (signal) {
              //console.log("Signal 0 " + signal);
                _this.drawFlowSignal(signal);
            });
            this.mysocket.on(signals[1], function (signal) {
              //console.log("Signal 1 " + signal);
                _this.basicSignal(signal);
            });

            // Flux du signal
            this.drawFlowSignal = function (signal) {
                ctx.lineWidth = "2";
                this.x = (this.x - MARGIN_MONITOR_LEFT + 1)
                        % (MARGIN_MONITOR_RIGHT - MARGIN_MONITOR_LEFT)
                        + MARGIN_MONITOR_LEFT;
                ctx.strokeStyle = this.color;
                this.value[1] = this.scaleFunction(signal);
                drawLine(this.x - 1, this.value[0], this.x, this.value[1]);
                this.value[0] = this.value[1];
                this.clearOverlap(this.x);
            };

            // Information ponctuelle (données à droite)
            this.basicSignal = function (signal) {
              console.log("signale recu " + signal);
              // Gere la taille d'affichage si la valeur est en centaine
              var size_info;
              if(signal > 99){ size_info = 20; }
              else{ size_info = 25; }

              const topMargin = 20;
              ctx.clearRect(MARGIN_MONITOR_RIGHT + 10, positionTopY(this.position) + topMargin, monitor.width - MARGIN_MONITOR_RIGHT, monitor.height / NB_BLOCK - MARGIN_BLOCK / 2 - topMargin);
              // Nom de la donnée
              drawInfo(this.info, this.color, "bold 12px Arial", positionCenterY(this.position) - size_info / 2);
              // Valeur de la donnée
              drawInfo(signal, this.color, "bold " + size_info + "px Arial", positionCenterY(this.position) + size_info / 2);
            };

            // Effaçage du signal précédent
            this.clearOverlap = function (x) {
                const TO = 4;
                // Condition utilisée pour effacer le début du signal
                const N = (x === MARGIN_MONITOR_LEFT) ? x - 3 : x;
                ctx.clearRect(minMax(0, N + 1, MARGIN_MONITOR_RIGHT), positionTopY(this.position) + 2, TO, positionBottomY(this.position) - positionTopY(this.position) - 4);
            };

          this.destroy = function () {
            this.mysocket.emit('forceDisconnect');
            this.mysocket.disconnect();
            this.mysocket.close();
          };

        }

        // INSTANCES DES SIGNAUX AVEC FONCTION CALLBACK POUR AFFICHER LE SIGNAL
        // Simulation
        $scope.SignalBPM = new Signal(0, "BPM", ["bpm_flow", "bpm_sec"], "green", function (value) {
            return minMaxDraw(positionTopY(0), 1.3 * parseInt(-value) + positionCenterY(0), positionBottomY(0) - 1);
        });

        $scope.SignalResp = new Signal(1, "Resp", ["resp_flow", "resp_sec"], "rgb(0, 128, 255)", function (value) { //Couleur bleu claire = rgb(0, 128, 255)
            return minMaxDraw(positionTopY(1), parseInt(-value) + positionCenterY(1), positionBottomY(1));
        });

        $scope.SignalSp02 = new Signal(2, "Sp02", ["satur_flow", "satur_sec"], "gray", function (value) {
            return minMaxDraw(positionTopY(2) + 1, 2 * parseInt(-value) + positionCenterY(2), positionBottomY(2) - 1);
        });

        $scope.test1000 = function() {
          console.log("GrossePute");
          $scope.SignalBPM = new Signal(0, "BPM", ["bpm_flow", "bpm_sec"], "green", function (value) {
              return minMaxDraw(positionTopY(0), 1.3 * parseInt(-value) + positionCenterY(0), positionBottomY(0) - 1);
          });
        };


    }


    drawWave();


    //drawWave();


    $scope.$on('$ionicView.leave', function(){
      // Any thing you can think of
      console.log("mabite");
    });
    
    // Permet de couper la connection socket une fois la vue quité
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        //$window.location.reload(true)
        //$state.go($state.current, {}, {reload: true});

        $ionicHistory.clearCache();
        $state.go('app.fooDestinationView');

    //alert("bibi");
      //$scope.SignalBPM.destroy();
      //$scope.SignalResp.destroy();
      //$scope.SignalSp02.destroy();


/*
       delete $scope.SignalBPM;
       delete $scope.SignalResp;
       delete $scope.SignalSp02;
*/

       //$scope.test1000();


    });



});
