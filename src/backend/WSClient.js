const WebSocket = require('ws');

export default class WSClient {
    constructor(ws) {
        this.ws = ws;
        this.id = WSClient.id++;
        WSClient.clients[this.id] = this;
        return this;
    }

    remove() {
        delete WSClient.clients[this.id];
    }
};
WSClient.id = 0;
WSClient.clients = {};
WSClient.broadcast = (msg, exclude = []) => {
    exclude = exclude.map(String);
    Object.keys(WSClient.clients).filter(x => {
        return !exclude.includes(x)
    }).forEach(x => {
        const ws = WSClient.clients[x].ws;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
        }
    });
};
