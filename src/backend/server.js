import {applyMiddleware, createStore} from "redux";
import logger from 'redux-logger';
import Client from "./Client";
import DeadReducer from '../reducers'
import {ActionSpec,Actions} from "../actions";
import {Renderers} from "../renderers";
const spawn = require('child_process').spawn;
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const server = http.createServer();
const wss = new WebSocket.Server({ server });
import {throttle} from 'lodash';
// let store = createStore(DeadReducer, applyMiddleware(serverMiddleware,renderMiddleWare, logger));


const serverMiddleware = store => next => action => {
  if(action.type === ActionSpec.LOAD_FROM_SERVER.name){
    let state = {...store.getState(), connection:null};
    let msg = {type:'action',action:Actions.receiveState(state)};
    broadcast(msg)
  }
  return next(action);
}

let tidalCode ='';
let superColliderCode = '';
const renderMiddleWare = store => next => action => {
  next(action);
  let state = store.getState();
  if(action.type === ActionSpec.MASTER_UPDATE.name || action.type === ActionSpec.PUSH_STATE.name){
    evalTidal(state.master.TidalCycles.macros);
    evalTidal(Renderers.TidalCycles.getTempoCode(state));
  }
  const tc = Renderers.TidalCycles.getCode(state);
  if(tidalCode!==tc){
    evalTidal(tc);
    tidalCode = tc;
  }
  const scc = Renderers.SuperCollider.getCode(state);
  if(superColliderCode!==scc){
    evalSuperCollider(scc);
    superColliderCode = scc;
  }
};

let store = createStore(DeadReducer, applyMiddleware(serverMiddleware,renderMiddleWare));



// Cmdline opts
var nopt = require('nopt');
var path = require('path');
var knownOpts = {'bootTidal':path, 'bootSuperCollider':path};
var parsed = nopt(knownOpts, {},process.argv);


// Tidal/SC bootscript path
var bootTidal = parsed.bootTidal || "./src/backend/BootTidal.hs";
var bootSuperCollider = parsed.bootSuperCollider || "./src/backend/BootSuperCollider.sc";

var stderr = process.stderr;
var defaultFeedbackFunction = function(x) {
  stderr.write(x);
};

// INIT SUPERCOLLIDER
var superCollider = spawn('sclang');
superCollider.on('close',code=>{
  stderr.write('SuperCollider process exited with code '+ code + "\n");
});

superCollider.stderr.addListener("data", function(m) {
  defaultFeedbackFunction(m.toString());
});

superCollider.stdout.addListener("data", function(m) {
  defaultFeedbackFunction(m.toString());
});


// INIT TIDAL
var tidal = spawn('ghci', ['-XOverloadedStrings']);
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

fs.readFile(bootSuperCollider,'utf8', function (err,data) {
  if (err) { console.log(err+"\n"); return; }
  superCollider.stdin .write(data+"\n");
  console.log("SuperCollider Initialized\n");
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

function evalTidal(str){
  tidal.stdin.write(str+"\n");
  stderr.write("TIDALCYLCES________________\n");
  stderr.write(str+"\n");
}

function evalSuperCollider(str){
  superCollider.stdin.write(str+"\n");
  stderr.write("SUPERCOLLIDER________________\n");
  stderr.write(str+"\n");
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

const effectThrottles = {};

const throttledBroadcast = throttle(broadcast,200);

function onMessage(data){
    var msg = JSON.parse(data);
    if(msg.type=="eval"){
      tidal.stdin.write(msg.code+"\n");
      stderr.write(msg.code+"\n");
    } else if (msg.type === 'action'){
      store.dispatch(msg.action);
      if(msg.action.type ==='EFFECT_UPDATE'){
        // console.log(msg.action.payload.effectId, JSON.stringify(msg.action.payload));
        effectThrottles[msg.action.payload.effectId] = effectThrottles[msg.action.payload.effectId] || throttle(broadcast,200);
        effectThrottles[msg.action.payload.effectId](msg,[this.id]);
      } else{
        broadcast(msg,[this.id]);
      }
    } else {
      console.warn('unrecognized ws message type: ',msg.type,JSON.stringify(data));
    }
}

function onClose(id){
  console.log('closed connection with client', id, new Date());
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
