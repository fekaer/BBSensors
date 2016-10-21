var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var readline = require('readline');
var net = require('net');



app.use(express.static(__dirname + '/static/assets/js'));

// Page standard
app.get('/', function (req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Page prototype avec affichage amélioré
/*app.get('/proto.html', function (req, res) {
    fs.readFile('./proto.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});*/

// Création du serveur
var server = app.listen(8085, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

var i = 0;
io.sockets.on('connection', function (socket) {

    var j = i++;

    // lecture du l'entrée standard ( provenance -> analyse des signaux en c++ )
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    //rl.on('line', localDumpTest);
    rl.on('line', reptarDump);


    function localDumpTest (data) {
        "use strict";
        var line = String(data);
        var signals = line.split(";");

        // Réception du flux entrant de l'entrée standard
        if (signals[0] === "mean") {
            socket.emit('bpm_sec', signals[1]);
            socket.emit('resp_sec', signals[2]);
            socket.emit('satur_sec', signals[3]);
        } else if (signals[0] === "sig") {
            socket.emit('bpm_flow', signals[1]);
            socket.emit('resp_flow', signals[2]);
            socket.emit('satur_flow', signals[3]);
        }
    }

    var inc = 0;
    function reptarDump(data) {
        "use strict";
        var line = String(data);
        var signals = line.split(",");


        // Réception du flux entrant de l'entrée standard
        //if (inc % 3 == 0){
            if(inc % 4 == 0 && signals[0] === "leadI"){
                socket.emit('bpm1_flow', signals[1]);
                socket.emit('bpm1_sec', signals[2]);
            }
            if((inc+1) % 4 == 0 && signals[0] === "leadII"){
                socket.emit('bpm2_flow', signals[1]);
                socket.emit('bpm2_sec', signals[2]);
            }
        //}
        inc += 1;
    }

});




server.listen(8085);
