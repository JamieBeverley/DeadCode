
const Connection = {};

Connection.init = function(host=window.location.hostname,port=8000, onOpen=()=>{}, onClose=()=>{}, onErr=()=>{}){
    if (Connection.ws){
        Connection.ws.close();
    }
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    try{
        Connection.ws = new WebSocket('ws://' + host + ":" + port);
        Connection.ws.isOpen = false;
        Connection.ws.onopen = function open() {
            Connection.ws.isOpen = true;
            console.log('ws connection established');
            onOpen();
        }
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

Connection.sendCode = function(code){
    if(!Connection.ws || !Connection.ws.isOpen){
        console.warn('Connection is closed');
        return;
    }
    Connection.ws.send(JSON.stringify({type:'eval',code}));
};

export default Connection