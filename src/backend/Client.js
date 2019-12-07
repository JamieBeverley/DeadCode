var id = 0;

export default class Client {
    constructor(ws){
        this.ws = ws;
        this.id = id++;
        return this;
    }


    // onMessage(data){
    //     let  msg = JSON.parse(data);
    //     if(msg.type === "eval"){
    //         tidal.stdin.write(msg.code+"\n");
    //         stderr.write(msg.code+"\n");
    //     } else if (msg.type === 'action'){
    //         console.log('action received: ', JSON.stringify(msg.action));
    //         broadcast(msg,[]);
    //     } else {
    //         console.warn('hmm');
    //     }
    // }


}

