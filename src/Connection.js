
// TODO this is probably bad practice.... (?)
// import {store} from "./index";

import store from './store'

const Connection = {};

Connection.init = function(host=window.location.hostname,port=8000, onOpen=()=>{}, onClose=()=>{}, onErr=()=>{}){
    if (Connection.ws){
        Connection.ws.close();
    }
    var WebSocket;
    if(typeof window!=='undefined'){
        WebSocket = window.WebSocket || window.MozWebSocket;
    } else{
        WebSocket = require('ws');
    }

    try{
        Connection.ws = new WebSocket('ws://' + host + ":" + port);
        Connection.ws.isOpen = false;
        Connection.ws.onopen = function open() {
            Connection.ws.isOpen = true;
            console.log('ws connection established');
            onOpen();
        }
        Connection.ws.onmessage = Connection.onMessage;

        Connection.ws.onerror = (e)=>{
            console.warn(e);
            onErr(e);
        }
        Connection.ws.onclose =  function incoming(data) {
            console.warn('ws closed')
            Connection.ws.isOpen = false;
            onClose(data);
        };
    } catch (e) {
        onErr();
    }
};

Connection.onMessage = function(event){
    let message = JSON.parse(event.data);
    if(message.type==='action'){
        let action = message.action;
        action.meta = action.meta || {};
        action.meta.fromServer = true;
        store.dispatch(action)
    } else{
        console.warn('Unrecognized message type from WS server: '+message.type, message);
    }
};

Connection.sendAction = function(action){
    if(!Connection.ws || !Connection.ws.isOpen){
        console.warn('Connection is closed');
        return;
    }
    const data = {type:'action',action}
    Connection.ws.send(JSON.stringify(data));
}

Connection.sendCode = function(code){
    if(!Connection.ws || !Connection.ws.isOpen){
        console.warn('Connection is closed');
        return;
    }
    Connection.ws.send(JSON.stringify({type:'eval',code}));
};

export default Connection