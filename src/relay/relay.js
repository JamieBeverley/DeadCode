const spawn = require('child_process').spawn;
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs')
const server = http.createServer();
const wss = new WebSocket.Server({ server });


// Cmdline opts
var nopt = require('nopt');
var path = require('path');
var knownOpts = {'bootTidal':path};
var parsed = nopt(knownOpts, {},process.argv);


// Tidal bootscript path
const homedir = require('os').homedir()
var bootTidal = parsed.bootTidal || homedir+"/.atom/packages/TidalCycles/lib/BootTidal.hs"


// var output = process.stdout;
var stdin = process.stdin;
var stderr = process.stderr;
var defaultFeedbackFunction = function(x) {
  stderr.write(x);
}

var tidal = spawn('ghci', ['-XOverloadedStrings']);
// var bootTidal = "C:\\Users\\jamie\\.atom\\packages\\tidalcycles\\lib\\BootTidal.hs"
console.log(bootTidal)
tidal.on('close', function (code) {
  stderr.write('Tidal process exited with code ' + code + "\n");
});

tidal.stderr.addListener("data", function(m) {
 defaultFeedbackFunction(m.toString());
});

tidal.stdout.addListener("data", function(m) {
 defaultFeedbackFunction(m.toString());
});


fs.readFile(bootTidal,'utf8', function (err,data) {
  if (err) { console.log(err+"\n"); return; }
  tidal.stdin.write(data);
  console.log("Tidal/GHCI initialized\n");
});

function sanitizeStringForTidal(x) {
  var lines = x.split("\n");
  var result = "";
  var blockOpen = false;
  for(var n in lines) {
    var line = lines[n];
    var startsWithSpace = false;
    if(line[0] == " " || line[0] == "\t") startsWithSpace = true;
    if(blockOpen == false) {
      blockOpen = true;
      result = result + ":{\n" + line + "\n";
    }
    else if(startsWithSpace == false) {
      result = result + ":}\n:{\n" + line + "\n";
    }
    else if(startsWithSpace == true) {
      result = result + line + "\n";
    }
  }
  if(blockOpen == true) {
    result = result + ":}\n";
    blockOpen = false;
  }
  return result;
}




wss.on('connection', function connection(ws) {
  console.log('connected\n')
  ws.on('message', function (message) {
    // console.log('received: %s', message);
    var msg = JSON.parse(message);

    if(msg.type=="eval"){
      tidal.stdin.write(msg.code+"\n");
      stderr.write(msg.code+"\n");
    }
  });
});

server.listen(8001);
console.log('listening...\n')

















//
