import {applyMiddleware, createStore} from "redux";
import logger from 'redux-logger';
import Client from "./Client";
import DeadReducer from '../reducers'
import {ActionSpec,Actions} from "../actions";
import {Renderers} from "../renderers";
import {throttle} from 'lodash';
import {serverMiddleware,renderMiddleWare} from "./middleware";

const spawn = require('child_process').spawn;
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let store = createStore(DeadReducer, applyMiddleware(serverMiddleware,renderMiddleWare));

// Cmdline opts
let nopt = require('nopt');
let path = require('path');
let knownOpts = {'bootTidal':path};
let parsed = nopt(knownOpts, {},process.argv);

// Tidal bootscript path
let bootTidal = parsed.bootTidal || "./src/backend/BootTidal.hs";

let stderr = process.stderr;
let defaultFeedbackFunction = function(x) {
  stderr.write(x);
}

let tidal = spawn('ghci', ['-XOverloadedStrings']);
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


function evalTidal(str){
  tidal.stdin.write(str+"\n");
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

function onMessage(data){
    var msg = JSON.parse(data);
    if(msg.type==='eval'){
      tidal.stdin.write(msg.code+"\n");
      stderr.write(msg.code+"\n");
    } else if (msg.type === 'action'){
      store.dispatch(msg.action);
      if(msg.action.type ==='EFFECT_UPDATE'){
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
console.log('listening...\n');
