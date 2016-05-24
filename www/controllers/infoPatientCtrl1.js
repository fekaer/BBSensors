// controleur du Home
app.controller("infoPatientCtrl", function( $scope, $rootScope, $state, $stateParams, Socket, ListPatients, $ionicHistory)
{
    ServerEnum = {
        REPTAR_WIFI: 0,
        REPTAR_WIRE: 1,
        PROXY: 2
    }

    const currentContext = ServerEnum.REPTAR_WIFI;


    function getAddress(){
        "use strict";
        switch(currentContext){
            case ServerEnum.REPTAR_WIFI:
                return "ws://192.168.2.7:5000";
            case ServerEnum.REPTAR:
                return "ws://192.168.1.24:5000";
            case ServerEnum.PROXY:
                return "ws://129.194.184.60:8085";
        }
    };

    function monitorFunction(document) {
        "use strict";
        const monitor = document.getElementById("monitor");
        const ctx = monitor.getContext("2d");
        ctx.fillStyle = "#dbbd7a";
        ctx.fill();

        const MARGIN_MONITOR_RIGHT = Math.floor(monitor.width - monitor.width / 5.5);
        const MARGIN_MONITOR_LEFT = Math.floor(monitor.width / 50);
        const MARGIN_BLOCK = 8;
        const SIZE_INFO = 20;
        const NB_BLOCK = 3;
        const OVERLAP_SIZE = 4;

        // Information sur le côté du moniteur
        function drawInfo(txt, color, style, positionX) {
            ctx.fillStyle = color;
            ctx.font = style;
            ctx.fillText(txt, monitor.width - 45, positionX);
        }

        function drawWave() {


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

            function drawLines(){
                ctx.strokeStyle = 'white';
                ctx.lineWidth = "1.0";

                // +0.5 avoiding antialiasing !
                Array.from(Array(10).keys()).forEach(function (i) {
                    drawLine(0, positionBottomY(i) + 0.5, monitor.width, positionBottomY(i) + 0.5);
                });

                drawLine(MARGIN_MONITOR_RIGHT + 5.5, 0, MARGIN_MONITOR_RIGHT + 5.5, monitor.height);
            }

            function minMaxDraw(min, value, max) {
                return Math.max(min + MARGIN_BLOCK / 2, Math.min(max - MARGIN_BLOCK / 2, value));
            }

            function minMax(min, value, max) {
                return Math.max(min, Math.min(max, value));
            }


            drawLines();

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
                var address = getAddress();
                var sock1 = new WebSocket(address, signals[0]);
                var sock2 = new WebSocket(address, signals[1]);

                //this.socket = io.connect('http://192.168.1.28:8085');
                sock1.onmessage = function (signal) {
                    this.drawFlowSignal(signal.data);
                }.bind(this);
                sock2.onmessage = function (signal) {
                    this.basicSignal(signal.data);
                }.bind(this);

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

                // Information ponctuelle
                this.basicSignal = function (signal) {
                    const topMargin = 20;
                    ctx.clearRect(MARGIN_MONITOR_RIGHT + 10, positionTopY(this.position) + topMargin, monitor.width - MARGIN_MONITOR_RIGHT, monitor.height / NB_BLOCK - MARGIN_BLOCK / 2 - topMargin);
                    drawInfo(signal, this.color, "bold " + SIZE_INFO + "px Arial", positionCenterY(this.position) + SIZE_INFO / 2);
                };
                this.basicSignal(0);

                // Information textuelle du signal
                drawInfo(this.info, this.color, "bold 16px Arial", positionCenterY(this.position) - SIZE_INFO / 2);

                // Effaçage du signal précédent
                this.clearOverlap = function (x) {
                    // Condition utilisée pour effacer le début du signal 
                    const N = (x === MARGIN_MONITOR_LEFT) ? x - 3 : x;
                    ctx.clearRect(minMax(0, N + 1, MARGIN_MONITOR_RIGHT), positionTopY(this.position) + 2, OVERLAP_SIZE, positionBottomY(this.position) - positionTopY(this.position) - 4);
                };

            }

            // INSTANCES DES SIGNAUX AVEC FONCTION CALLBACK POUR AFFICHER LE SIGNAL
            new Signal(0, "BPM1", ["lead1", "freq1"], "green", function (value) {
                return minMaxDraw(positionTopY(0), parseInt(-value) / 200 + positionCenterY(0), positionBottomY(0) - 1);
            });

            new Signal(1, "BPM2", ["lead2", "freq2"], "blue", function (value) {
                return minMaxDraw(positionTopY(1), parseInt(-value) / 200 + positionCenterY(1), positionBottomY(1));
            });
        }

        drawInfo("BB Sensor v0.1", "gray", "bold 10px Arial", 12);
        drawWave();
    }
    monitorFunction(document);


    $scope.$on('$ionicView.leave', function(){
      // Any thing you can think of
      console.log("toto");
    });
    
    // Permet de couper la connection socket une fois la vue quité
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        //$window.location.reload(true)
        //$state.go($state.current, {}, {reload: true});

        //$ionicHistory.clearCache();
        //$state.go('app.fooDestinationView');

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
