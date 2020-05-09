import {applyMiddleware, createStore} from "redux";
import WSClient from "./WSClient";
import DeadReducer from '../reducers'
import {createServerMiddleware} from "./middleware/wsServer";
import {createRenderMiddleware} from "./middleware/render";
import {TidalRenderer} from "./NativeRenderers/TidalCylces";
import {setTerminalTitle} from "../util";
import {minimalLogger} from "../middleware";
const http = require('http');
const WebSocket = require('ws');

setTerminalTitle("backend");
// Boot Tidal
TidalRenderer.boot();


// Start server
const server = http.createServer();

const wss = new WebSocket.Server({ server });
wss.broadcast = WSClient.broadcast;

function onMessage(data){
    var msg = JSON.parse(data);
    if (msg.type === 'action'){
        // Tag action w/ sender id so can exclude it from broadcast in wsServer middleware.
        msg.action.meta.sender = this.id;
        store.dispatch(msg.action);
    } else {
        console.warn('unrecognized ws message type: ',msg.type,JSON.stringify(data));
    }
}

function onConnect(ws){
    const client = new WSClient(ws);
    console.log('Connected client ', client.id, new Date(), "\n");
    client.ws.on('message',onMessage.bind(client));
    client.ws.on('close', ()=>{client.remove()});
}

wss.on('connection',onConnect);
server.listen(8001);
console.log('listening...\n');


// Create store
const serverMiddleware = createServerMiddleware(wss);
const renderMiddleware = createRenderMiddleware([TidalRenderer]);
const store = createStore(DeadReducer, applyMiddleware(serverMiddleware, renderMiddleware,minimalLogger));
