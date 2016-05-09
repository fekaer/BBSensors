// controleur du Home
app.controller("infoPatientCtrl", function( $scope, $rootScope, $state, $stateParams, Socket, ListPatients, $ionicHistory)
{
	$scope.index = $stateParams.mIndex;
    $rootScope.idVisu = $scope.index;
    console.log($scope.index);
    // Pour l'icone dans home
    if($rootScope.mesPatients[$scope.index].etat == 2)
    {
        $rootScope.mesPatients[$scope.index].etat = 1;
    }












	"use strict";
    const monitor = document.getElementById("monitor");
    const ctx = monitor.getContext("2d");
    ctx.fillStyle = "#dbbd7a";
    ctx.fill();

    // requestAnimationFrame(drawWave);
    const MARGIN_MONITOR_RIGHT = Math.floor(monitor.width - monitor.width / 5.5);
    const MARGIN_MONITOR_LEFT = Math.floor(monitor.width / 50);
    const MARGIN_BLOCK = 8;
    const SIZE_INFO = 40;

    $scope.infoAlerte = function(index)
    {
        // va a la page infoAlerte en donnant l'id du passient celectionné
        $state.go("infoAlerte",{mIndex:index});
    }


    // Information sur le côté du moniteur
    function drawInfo(txt, color, style, positionX) {
        ctx.fillStyle = color;
        ctx.font = style;
        ctx.fillText(txt, monitor.width - 80, positionX);
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
            const _this = this;
            this.socket = io.connect('http://192.168.178.22:8085');
            //this.socket = io.connect('http://' + $rootScope.mesPatients[$scope.index].mip + ':' + $rootScope.mesPatients[$scope.index].mport);
            this.socket.on(signals[0], function (signal) {
                _this.drawFlowSignal(signal);
            });
            this.socket.on(signals[1], function (signal) {
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

            // Information ponctuelle
            this.basicSignal = function (signal) {
                const topMargin = 20;
                ctx.clearRect(MARGIN_MONITOR_RIGHT + 10, positionTopY(this.position) + topMargin, monitor.width - MARGIN_MONITOR_RIGHT, monitor.height / NB_BLOCK - MARGIN_BLOCK / 2 - topMargin);
                drawInfo(this.info, this.color, "bold 16px Arial", positionCenterY(this.position) - SIZE_INFO / 2);
                drawInfo(signal, this.color, "bold " + SIZE_INFO + "px Arial", positionCenterY(this.position) + SIZE_INFO / 2);
            };

            // Effaçage du signal précédent
            this.clearOverlap = function (x) {
                const TO = 4;
                // Condition utilisée pour effacer le début du signal
                const N = (x === MARGIN_MONITOR_LEFT) ? x - 3 : x;
                ctx.clearRect(minMax(0, N + 1, MARGIN_MONITOR_RIGHT), positionTopY(this.position) + 2, TO, positionBottomY(this.position) - positionTopY(this.position) - 4);
            };

        }

        // INSTANCES DES SIGNAUX AVEC FONCTION CALLBACK POUR AFFICHER LE SIGNAL
        // Simulation
        new Signal(0, "BPM", ["bpm_flow", "bpm_sec"], "green", function (value) {
            return minMaxDraw(positionTopY(0), 1.3 * parseInt(-value) + positionCenterY(0), positionBottomY(0) - 1);
        });

        // Raptar
        new Signal(0, "BPM", ["bpm_flow", "bpm_sec"], "green", function (value) {
            return minMaxDraw(positionTopY(0), parseInt(-value) / 400 + positionCenterY(0), positionBottomY(0) - 1);
        });


        new Signal(1, "Resp", ["resp_flow", "resp_sec"], "blue", function (value) {
            return minMaxDraw(positionTopY(1), parseInt(-value) + positionCenterY(1), positionBottomY(1));
        });

        new Signal(2, "Sp02", ["satur_flow", "satur_sec"], "gray", function (value) {
            return minMaxDraw(positionTopY(2) + 1, 2 * parseInt(-value) + positionCenterY(2), positionBottomY(2) - 1);
        });


    }

    drawInfo("BB Sensor v0.1", "gray", "bold 10px Arial", 12);

    drawWave();



});
