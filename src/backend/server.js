import {applyMiddleware, createStore} from "redux";
import logger from 'redux-logger';
import Client from "./Client";
import DeadReducer from '../reducers'
import {ActionSpec,Actions} from "../actions";
const spawn = require('child_process').spawn;
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const server = http.createServer();
const wss = new WebSocket.Server({ server });



const serverMiddleware = store => next => action => {
  if(action.type === ActionSpec.LOAD_FROM_SERVER.name){
    let state = {...store.getState(), connection:null};
    let msg = {type:'action',action:Actions.receiveState(state)};
    broadcast(msg)
  }
  return next(action);
}

let store = createStore(DeadReducer, applyMiddleware(serverMiddleware, logger));

// Cmdline opts
var nopt = require('nopt');
var path = require('path');
var knownOpts = {'bootTidal':path};
var parsed = nopt(knownOpts, {},process.argv);


// Tidal bootscript path
// const homedir = require('os').homedir();
var bootTidal = parsed.bootTidal || "./src/backend/BootTidal.hs";


// var output = process.stdout;
// var stdin = process.stdin;
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
  tidal.stdin .write(data);
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


const clients = {};

function broadcast (msg, exclude=[]){
  exclude = exclude.map(String);
  Object.keys(clients).filter(x=>{return !exclude.includes(x)}).forEach(x=>{
    let ws = clients[x].ws;
    if(ws.readyState === WebSocket.OPEN){
      ws.send(JSON.stringify(msg));
    }
  })
}



function onMessage(data){
    var msg = JSON.parse(data);
    if(msg.type=="eval"){
      tidal.stdin.write(msg.code+"\n");
      stderr.write(msg.code+"\n");
    } else if (msg.type === 'action'){
      store.dispatch(msg.action);
      broadcast(msg,[this.id]);
    } else {
      console.warn('unrecognized ws message type: ',msg.type,JSON.stringify(data));
    }
}

function onClose(id){
  delete clients[id];
}


wss.on('connection', function connection(ws) {
  let client = new Client(ws);
  clients[client.id] = client;
  console.log('connected client ', client.id, new Date());
  client.ws.on('message',onMessage.bind(client))
  client.ws.on('close', ()=>{onClose(client.id)});
});

server.listen(8001);
console.log('listening...\n')

















//
