app.controller("graphAlertCtrl", function($scope, $stateParams) {

	$scope.index = $stateParams.mIndex;

	$scope.myChart = null;
  $scope.positiontab = 0;
  $scope.TotalData = [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                        65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                          65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                            65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40];



  $scope.series = ['Series A'];
  $scope.data = [[]];
  $scope.labels = [];
  // Position de la première valeur du tableau data
  $scope.positiontab = $scope.TotalData.length/2-24;
  for (var i = 0; i < 48; i++) {
    $scope.data[0].push($scope.TotalData[$scope.positiontab+i])
    $scope.labels.push(i);
  }

  $scope.dataZoom = [[65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56]];
  $scope.labelsZoom = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  $scope.options = {
    // Pour afficher la legende des point selectionné
    showTooltips: false,
    // Affichage adaptable
    responsive: true,
    //Affichage des point
    pointDot : true,
    // Rayon des points
    pointDotRadius : 4,
    // Pas afficher valeur axe Y
    //scaleShowLabels:false,
    // change la talle du texte des axes
    //scaleFontSize: 0
    // Desactive le mode animation
    animation : false

    // Affichage de la grille
    //scaleShowGridLines: false,
    // Couleur de la grille
    //scaleGridLineColor: 'rgba(0, 0, 255, 0.5)',
    // Afficher la grille Verticale
    //scaleShowVerticalLines: true,
    // Afficher la grille Horizontal
    //scaleShowHorizontalLines: false,

    // couleur sous la ligne
    //fillColor : "rgba(151,187,205,0.2)",
    // Couleur de la ligne
    //strokeColor : "rgba(151,187,205,1)",
    // couleur des point
    //pointColor : "rgba(151,187,205,1)"

  };





  $scope.onClick = function (points, evt) {

    console.log(evt.isTrusted + "  " + evt.screenX + "  " + evt.screenY + "  " + evt.clientX + "  " + evt.clientY);

    // Vide les tableau
    $scope.dataZoom[0].splice(0,$scope.dataZoom[0].length);
    $scope.labelsZoom.splice(0,$scope.labelsZoom.length);

    // Remais la couleur par défaut des points
    for (var h = 0; h < $scope.data[0].length; h++) {
      $scope.myChart.datasets[0].points[h].fillColor='rgba(151,187,205,1)'; // bleu claire
    }

    // Ajoute les nouvelle valeurs
    for(var i = 0; i < points.length; i++)
    {
      // Change la couleur des point selectionnés
      points[i].fillColor ="#00ff99"; //vert
      $scope.dataZoom[0].push(points[i].value);
      $scope.labelsZoom.push(points[i].label);
    }
    // met a jour le tableau
    $scope.myChart.update();
  };

  // Fonction de creation du tableau
  $scope.$on("create", function (evt, chart) {
    // Si c'est le 2eme tableau
    if(chart.id == "chart-1")
    {
      // Recupère le tableau
      $scope.myChart = chart;
    }
    console.log(chart);
  });

  // Fonction de mise a jour du tableau
  $scope.$on("update", function (evt, chart) {
    console.log("salut");
  });

  // Fonction Swipe droit
  $scope.onSwipeRight = function() {
    console.log("GragRight");
    // Suprime le dernier ellement
    $scope.data[0].pop();
    //Ajoute un ellement au debut
    for (var i = 1; i <= 1; i++) {
      $scope.data[0].splice(0, 0,$scope.TotalData[$scope.positiontab-i]);
    }

    // Test si les points sont de couleur verte
    for (var j = $scope.data[0].length-1; j >= 0; j--) {
      // Si oui
      if($scope.myChart.datasets[0].points[j].fillColor == '#00ff99') {
        // si le point et le point le plus a gauche
        if(j == $scope.data[0].length-1) {
          // Change la couleur du point en couleur par défaut
          $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
        }
        else {
          // Change la couleur du point 1 crant a gauche en couleur verte
          $scope.myChart.datasets[0].points[j+1].fillColor='#00ff99';
          // Change la couleur du point en couleur par défaut
          $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
        }
      }
    }
    // mais a jour la position du tableau data
    $scope.positiontab = $scope.positiontab - 1;
  };

  // Fonction Swipe gauche
  $scope.onSwipeLeft = function() {
    console.log("GragLeft");
    // Suprime points a gauche
    $scope.data[0].splice(0, 1);
    // Ajoute point droite
    for (var i = 1; i <= 1; i++) {
      $scope.data[0].push($scope.TotalData[$scope.positiontab+47+i])
    }

    // Test si les points sont de couleur verte
    for (var j = 0; j < $scope.data[0].length; j++) {
      // Si oui
      if($scope.myChart.datasets[0].points[j].fillColor == '#00ff99') {
        // si le point et le point le plus a gauche
        if(j == 0) {
          // Change la couleur du point en couleur par défaut
          $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
        }
        else {
          // Change la couleur du point 1 crant a gauche en couleur verte
          $scope.myChart.datasets[0].points[j-1].fillColor='#00ff99';
          // Change la couleur du point en couleur par défaut
          $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
        }
      }
    }
    // mais a jour la position du tableau data
    $scope.positiontab = $scope.positiontab + 1;
  };

  $scope.valDragRight = 1;
  $scope.onDragRight = function() {
    //alert("DragRight");
    $scope.valDragRight += 1;
    console.log($scope.valDragRight);
    if($scope.valDragRight % 5 == 0)
    {
      // Suprime le dernier ellement
      $scope.data[0].pop();
      //Ajoute un ellement au debut
      for (var i = 1; i <= 1; i++) {
        $scope.data[0].splice(0, 0,$scope.TotalData[$scope.positiontab-i]);
      }

      // Test si les points sont de couleur verte
      for (var j = $scope.data[0].length-1; j >= 0; j--) {
        // Si oui
        if($scope.myChart.datasets[0].points[j].fillColor == '#00ff99') {
          // si le point et le point le plus a gauche
          if(j == $scope.data[0].length-1) {
            // Change la couleur du point en couleur par défaut
            $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
          }
          else {
            // Change la couleur du point 1 crant a gauche en couleur verte
            $scope.myChart.datasets[0].points[j+1].fillColor='#00ff99';
            // Change la couleur du point en couleur par défaut
            $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
          }
        }
      }
      // mais a jour la position du tableau data
      $scope.positiontab = $scope.positiontab - 1;
    }

  }

  $scope.valDragLeft = 1;
  $scope.onDragLeft = function() {
    //alert("DragLeft");
    $scope.valDragLeft += 1;
    console.log($scope.valDragLeft);
    if($scope.valDragLeft % 5 == 0)
    {
      // Suprime points a gauche
      $scope.data[0].splice(0, 1);
      // Ajoute point droite
      for (var i = 1; i <= 1; i++) {
        $scope.data[0].push($scope.TotalData[$scope.positiontab+47+i])
      }

      // Test si les points sont de couleur verte
      for (var j = 0; j < $scope.data[0].length; j++) {
        // Si oui
        if($scope.myChart.datasets[0].points[j].fillColor == '#00ff99') {
          // si le point et le point le plus a gauche
          if(j == 0) {
            // Change la couleur du point en couleur par défaut
            $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
          }
          else {
            // Change la couleur du point 1 crant a gauche en couleur verte
            $scope.myChart.datasets[0].points[j-1].fillColor='#00ff99';
            // Change la couleur du point en couleur par défaut
            $scope.myChart.datasets[0].points[j].fillColor='rgba(151,187,205,1)';
          }
        }
      }
      // mais a jour la position du tableau data
      $scope.positiontab = $scope.positiontab + 1;

    }

  }
});
