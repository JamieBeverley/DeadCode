
const Connection = {};

Connection.init = function(host=window.location.hostname,port=8000){
    if (Connection.ws){
        Connection.ws.close();
        delete Connection.ws;
    }
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    Connection.ws = new WebSocket('ws://' + host + ":" + port);
    Connection.ws.isOpen = false;
    Connection.ws.onopen = function open() {
        Connection.ws.isOpen = true;
        console.log('ws connection established');
    }

    Connection.ws.onclose =  function incoming(data) {
        Connection.ws.isOpen = false;
    };
};

Connection.sendCode = function(code){
    if(!Connection.ws || !Connection.ws.isOpen){
        console.warn('Connection is closed');
        return;
    }
    Connection.ws.send(JSON.stringify({type:'eval',code}));
};

export default Connection