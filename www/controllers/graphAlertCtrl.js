app.controller("graphAlertCtrl", function($scope, $stateParams, $ionicLoading, $rootScope, Alertes, ListPatients) {
	$scope.mtimeInt = $stateParams.mData;
	console.log("je veux voir ca ici mint");
	console.log($scope.mtimeInt);

	var nb_data_graph = Alertes.dataSignalAlerte.data.length;
	console.log(nb_data_graph);
	var min = Alertes.dataSignalAlerte.dataMin;
	var max = Alertes.dataSignalAlerte.dataMax;
	console.log(min);
	console.log(max);

	var timeMin = (nb_data_graph * 1000 / 250) / 2;
	console.log("ici");
	console.log(timeMin);
	timeMin = $scope.mtimeInt - timeMin;


	    $scope.clickBottom = function(){
				var val = ((max - min) * 10) / 100;
				min = min + val;
				max = max - val;

	      zingchart.exec('myChart', 'zoomin', {
	        graphid: 0,
	        //ymin: min,
					//ymax: max

	        zoomx: false,
	        zoomy: true
	      })
	    };
			$scope.clickBottom2 = function(){
				var val = (((max - min) * 10) / 100) / 2;
				min = min - val;
				max = max + val;

				zingchart.exec('myChart', 'zoomout', {
					graphid: 0,
					//ymin: min,
					//ymax: max
					zoomx: false,
					zoomy: true
				})
			};

			$scope.clickBottom3 = function(){
				zingchart.exec('myChart', 'zoomto', {
					graphid: 0,
					xmin: nb_data_graph/2 -1000,
					xmax: nb_data_graph/2 +1000
					//zoomx: true,
					//zoomy: true
				})
			};

	    var myConfig = {
	      "gui":{
	        "behaviors":[
	            {
									// retire l'option DownloadSVG
	                "id":"DownloadSVG",
	                "enabled":"none"
	            },
	            {
	                "id":"Reload",
	                "enabled":"none"
	            },
	            {
	                "id":"SaveAsImage",
	                "enabled":"none"
	            },
	            {
	                "id":"Print",
	                "enabled":"none"
	            },
	            {
	                "id":"HideGuide",
	                "enabled":"none"
	            },
	            {
	                "id":"ViewSource",
	                "enabled":"none"
	            },
	            {
	                "id":"About",
	                "enabled":"none"
	            },
	            {
	              "id":"ShowAll",
	              "enabled":"none"
	            },
	            {
	              "id":"DownloadPDF",
	              "enabled":"none"
	            }/*,
	            {   // Ajoute ceci au menu
	                "id":"CrosshairHide",
	                "enabled":"all"
	            }
	            */
	        ]
	       },
	      "graphset": [{
	        "type": "line",
	        "title": {
	          "text": "Historique",
	          "font-family": "Georgia",
	          "font-size": 16
	        },
	        "plot": {
	          "aspect":"spline" ,
	          "line-width": 1, // Taille de la ligne
	          "line-color": "#666699", // couleur du trais
	          "marker": {
	            "size": 3, // taile des points
	            "background-color": "#64b4ce #e0e0eb", // couleur des point
	            "border-width": 1,
	            "border-color": "#666699" // couleur du contour des points
	          },
	          "tooltip": {
	            "visible": false
	          }
	        },
	        "plotarea": {
	          "margin-top": "15%", // Marge en decu du tableau
	          "margin-bottom": "35%" // Marge en desous du tableau
	        },



	        "scale-x": {
	          //"values": "0:" + Alertes.dataSignalAlerte.nbData + ":1", // data a afficher dans le second graph
	          //"max-items": 11, // nombre de point sur l'axe des X
						"minValue":timeMin, //temps en millisec du premier point
					  "step":4, //milsec entre chaque point
					  "transform":{ //makes unix timestamps humon readable
			            "type":"date",
			            "all":"%D, %d %M %Y<br>%H:%i:%s"
						},
						"markers": [ // le marqueur
						  {
								"type":"line",
								"range":[$scope.mtimeInt], //temps en milisec ou il soit s'afficher
								"value-range":true, // afficher
								"line-color":"red", // couleur
								"line-width":2, // epesseur
								"line-style":"solid", // type de ligne
								"alpha":1 // je sais pas
								//"text": "Alerte"
						  }
						],


	          "zooming": true, // Indique q'on peux zoomer
	          "zoom-to": [Alertes.dataSignalAlerte.nbData/2 -1000, Alertes.dataSignalAlerte.nbData/2 +1000], // valeur a afficher dans le tableau zoomé entres les 2 val
	          "item": {
	            "font-size": 10 // tailles des valeur x
	          }
	        },
	        "preview": {
	          "margin-bottom": "12%"
	        },
	        "crosshair-x": {
	          "plot-label": {
	            "text": "%v" // Affiche la valeur du point quand on clique decu
	          },
	          "scale-label": {
	            "visible": true // affiche la valeur en x du point selectionné
	          },
	          "marker": {
	            "size": 3, // taille du point quand on selectionne un point
	            "background-color": "#64b4ce #ff3300", // couleur du point
	            "border-width": 1,
	            "border-color": "#666699" // Coiuleur du contour du point
	          }
	        },

	        "scale-y": {
						"zooming":true,
						//"zoom-to":[min+1,max-1],
	          "values": min + ":" + max + ":500", // valeur a afficher de 150 à 350 avec des saut de 50
	          "guide": {
	            "line-style": "dotted"
	          },
	          "item": {
	            "font-size": 0 // taille des val axe Y
	          }
	        },
	        "crosshair-y": {
	          "type": "multiple",
	          "scale-label": {
	            "visible": true // affiche la valeur en y du point selectionné
	          }
	        },
	        "series": [{
						"values" : Alertes.dataSignalAlerte.data
					}]
	      }]
	    };
		zingchart.render({
			id: 'myChart',
			data: myConfig,
			height: "100%",
			width: "100%",
		});

		zingchart.complete = function() {
		$ionicLoading.hide();
		}
	});
