import OscBridge from "./osc";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import createActions from './actions'
import createOscMiddleware from './middleware';
import {minimalLogger} from '../middleware/index'
import Connection from "../Connection";
import prompt from "prompt-promise";
import {setTerminalTitle} from "../util";
setTerminalTitle("OSC");

const localPort = parseInt(process.argv[2]);
const remotePort = parseInt(process.argv[3]);
const remoteAddress = process.argv[4];


function init (){
    const actions = createActions(store);
    const oscBridge = new OscBridge(localPort, remoteAddress,remotePort, actions);
    const oscMiddleware = createOscMiddleware(oscBridge);
    addMiddleware(oscMiddleware, minimalLogger);
}

function reconnect(){
    prompt('disconnected, hit enter to reconnect').then(x=>{
            Connection.init('127.0.0.1', 8001, ()=>{console.log('connected')}, reconnect, console.log);
    });
}
Connection.init('127.0.0.1', 8001, init, reconnect, console.log);
