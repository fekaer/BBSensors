// controleur du Home
app.controller("infoPatientCtrl", function( $scope, $rootScope, $state, $stateParams, Socket, ListPatients, $ionicHistory)
{
  $scope.index = $stateParams.mIndex;
  $rootScope.idVisu = $scope.index;
  console.log($scope.index);
  // Pour l'icone dans home
  if((ListPatients.patients[$scope.index].etat == 2) || (ListPatients.patients[$scope.index].etat == 3))
  {
      ListPatients.patients[$scope.index].etat = 1;
  }



  // The JoelSocket simplify the websocket management **************************************************
  function JoelSocket(){
      "use strict";

      var ServerEnum = {
          REPTAR_WIFI: 0,
          REPTAR_WIRE: 1,
          PROXY: 2
      }
      // Context configuration
      const currentContext = ServerEnum.REPTAR_WIFI;

      function getAddress(){
          switch(currentContext){
              case ServerEnum.REPTAR_WIFI:
                  return "ws://192.168.2.7:5000";
              case ServerEnum.REPTAR_WIRE:
                  return "ws://192.168.1.24:5000";
              case ServerEnum.PROXY:
                  return "ws://129.194.184.60:8085";
          }
      }

      // Register a function with a signal name. If the signal
      // already exists, it register only the function and it doesn't create
      // new sockets.
      this.register = function(signalName, updateFunction) {
          if(!(signalName in JoelSocket.updateAndSocketDictionary)){
              var socket = new WebSocket(getAddress(), signalName);
              JoelSocket.updateAndSocketDictionary[signalName] = {socket: socket, lstFunc: []};
          }

          // Add the new update function
          JoelSocket.updateAndSocketDictionary[signalName].lstFunc.push(updateFunction);

          // Change the callback function calling when a message arrive : update all functions
          // register to the signal name.
          JoelSocket.updateAndSocketDictionary[signalName].socket.onmessage = function(signal){
              Array.from(JoelSocket.updateAndSocketDictionary[signalName].lstFunc).forEach(
                  function (update){
                      update(signal.data);
                  }
              );
          };
      }
  }
  // This is a static field helping to keep only one socket for each signal client
  JoelSocket.updateAndSocketDictionary = {};
  // ***************************************************************************************************



  // Global function showing the signals ***************************************************************
  function monitorFunction(document) {
      "use strict";

      const monitor = document.getElementById("monitor");
      const ctx = monitor.getContext("2d");
      ctx.fillStyle = "#dbbd7a";
      ctx.fill();

      const MARGIN_MONITOR_RIGHT = Math.floor(monitor.width - monitor.width / 5.5);
      const MARGIN_MONITOR_LEFT = Math.floor(monitor.width / 50);
      const MARGIN_BLOCK = 8;
      const SIZE_INFO = 40;
      const NB_BLOCK = 3;
      const OVERLAP_SIZE = 4;
      const PIXEL_STEP = 2;

      // Information sur le côté du moniteur
      function drawInfo(txt, color, style, positionX) {
          ctx.fillStyle = color;
          ctx.font = style;
          ctx.fillText(txt, monitor.width - 80, positionX);
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
          // - monitorPosition: monitorPosition du signal (slot) sur le moniteur
          // - signalPosition: position du signal dans le message reçu par le websocket
          // - info: Nom du signal abrégé
          // - signals: liste des informations reçues à affichier (flux continu de données et informations chaque seconde)
          // - color: Couleur du signal
          // - scaleLead: fonction pour l'affichage des limites du signal dans son slot
          function Signal(
                  monitorPosition,
                  signalPosition,
                  info,
                  signals,
                  color,
                  scaleLead) {

              this.info = info;
              this.x = MARGIN_MONITOR_LEFT;
              this.color = color;
              this.value = [positionCenterY(monitorPosition), 0];

              // Flux du signal
              this.drawFlowSignal = function (signal) {
                  ctx.lineWidth = "2";
                  this.x = (this.x - MARGIN_MONITOR_LEFT + PIXEL_STEP)
                          % (MARGIN_MONITOR_RIGHT - MARGIN_MONITOR_LEFT)
                          + MARGIN_MONITOR_LEFT;
                  ctx.strokeStyle = this.color;

                  signal = parseInt(-signal.split(";")[signalPosition]);
                  this.value[1] = scaleLead(signal);
                  this.value[1] = minMaxDraw(
                          positionTopY(monitorPosition),
                          this.value[1] + positionCenterY(monitorPosition),
                          positionBottomY(monitorPosition) + monitorPosition - 1);

                  drawLine(this.x - PIXEL_STEP, this.value[0], this.x, this.value[1]);
                  this.value[0] = this.value[1];
                  this.clearOverlap(this.x);
              };

              // Information ponctuelle
              this.basicSignal = function (signal) {
                  const topMargin = 20;
                  ctx.clearRect(MARGIN_MONITOR_RIGHT + 10, positionTopY(monitorPosition) + topMargin, monitor.width - MARGIN_MONITOR_RIGHT, monitor.height / NB_BLOCK - MARGIN_BLOCK / 2 - topMargin);

                  // Information textuelle du signal
                  drawInfo(this.info, this.color, "bold 16px Arial", positionCenterY(monitorPosition) - SIZE_INFO / 2);
                  signal = parseInt(signal.split(";")[signalPosition]);
                  drawInfo(signal, this.color, "bold " + SIZE_INFO + "px Arial", positionCenterY(monitorPosition) + SIZE_INFO / 2);
              };
              this.basicSignal("0;0");


              // Effaçage du signal précédent
              this.clearOverlap = function (x) {
                  // Condition utilisée pour effacer le début du signal
                  const N = (x === MARGIN_MONITOR_LEFT) ? x - 4 : x;
                  ctx.clearRect(
                      minMax(0,
                          N + 1,
                          MARGIN_MONITOR_RIGHT),
                      positionTopY(monitorPosition) + 2,
                      OVERLAP_SIZE + PIXEL_STEP,
                      positionBottomY(monitorPosition) - positionTopY(monitorPosition) - 4
                  );
              };

              // Configuration des sockets pour recevoir les signaux
              var js = new JoelSocket();
              js.register(signals[0], this.drawFlowSignal.bind(this));
              js.register(signals[1], this.basicSignal.bind(this));

          }

          // INSTANCES DES SIGNAUX AVEC FONCTION CALLBACK POUR AFFICHER LE SIGNAL
          new Signal(
                  0,
                  0,
                  "BPM1",
                  ["lead", "freq"],
                  "green",
                  function (value) {
                      return value / 200;
                  }
          );

          new Signal(
                  1,
                  1,
                  "BPM2",
                  ["lead", "freq"],
                  "blue",
                  function (value) {
                      return value / 100;
                  }
          );
      }

      drawInfo("BB Sensor v0.1", "gray", "bold 10px Arial", 12);
      drawWave();
  }
});
