import osc from 'osc';


function parsePosition(addr) {
    const split = addr.split("/");
    return {trackIndex: parseInt(split[split.length - 2]), effectIndex: parseInt(split[split.length - 1])}
}

function parseStemPosition(addr){
    const split = addr.split("/");
    const trackIndex = split[split.length-1]-1;
    const stemIndex = 8 - split[split.length-2];
    return {trackIndex, stemIndex};
}

function parseTrackGainPosition(addr){
    const split = addr.split("/");
    return parseInt(split[split.length-1])-1
}

function parseMovePosition(addr){
    const split = addr.split("/");
    return parseInt(split[split.length-2])-1
}


class OscBridge {

    constructor(localPort = 9000, remoteAddress, remotePort = 9001, actions) {
        this.receivers = [
            {
                baseAddr: "/track/effect/value",
                handle: (message) => {
                    const {trackIndex, effectIndex} = parsePosition(message.address);
                    const value = this._fromZeroOne(effectIndex, message.args[0].value);
                    this.actions.trackEffectSliderValue(trackIndex, effectIndex, value);
                }
            },
            {
                baseAddr: "/track/gain",
                handle: (message) => {
                    const trackIndex = parseTrackGainPosition(message.address);
                    const effectIndex = 0; // gain is zeroth
                    const value = this._fromZeroOne(effectIndex, message.args[0].value);
                    this.actions.trackEffectSliderValue(trackIndex, effectIndex, value);
                }
            },
            {
                baseAddr: "/track/effect/toggle",
                handle: (message) => {
                    const {trackIndex, effectIndex} = parsePosition(message.address);
                    const on = message.args[0].value === 1;
                    this.actions.trackEffectToggle(trackIndex, effectIndex, on);
                }
            }, {
                baseAddr: "/stem/toggle",
                handle: message => {
                    const {trackIndex, stemIndex} = parseStemPosition(message.address);
                    const on = message.args[0].value === 1;
                    this.actions.stemUpdate(trackIndex, stemIndex, {on});
                }
            }, {
                baseAddr: "/move",
                handle: message => {
                    const index = parseMovePosition(message.address);
                    const on = message.args[0].value;
                    if (on){
                        [
                            this.actions.midiDown,
                            this.actions.midiUp,
                            this.actions.midiRight,
                            this.actions.midiLeft
                        ][index]()
                    }
                }
            }
        ];

        this._mappingFunctions = [
            //gain
            {toZeroOne: value => value/2, fromZeroOne: value => value*2},
            //lpf
            {toZeroOne: value => Math.pow(value / 22000, 1 / 2), fromZeroOne: value => Math.pow(value, 2) * 22000},
            //hfp
            {toZeroOne: value => Math.pow(value / 22000, 1 / 2), fromZeroOne: value => Math.pow(value, 2) * 22000},
            //coarse
            {toZeroOne: value => value / 24, fromZeroOne: value => Math.round(value * 24)}
        ];


        // Create an osc.js UDP Port listening on port 57121.
        this.actions = actions;
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.udpPort = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort,
            metadata: true
        });
        // Listen for incoming OSC messages.
        this.udpPort.on("message",this.onMessage.bind(this));
        this.udpPort.on("ready", ()=>{
            this.actions.midiInit();
        });
        this.udpPort.open();
        console.log(`Listening for OSC from ${remoteAddress} on ${localPort}, sending to ${remotePort}`)
    }

    onMessage(msg){
        const receiver = this.receivers.find(x => msg.address.startsWith(x.baseAddr));
        console.log(msg);
        if (receiver) {
            receiver.handle(msg);
        }
    }

    send(payload) {
        this.udpPort.send(payload, this.remoteAddress, this.remotePort);
    }


    // osc.toggleStem(trackIndex, stemIndex, payload.value.on);
    toggleStem(trackIndex, stemIndex, on) {
        const payload = {address: `/stem/toggle/${8-(stemIndex)}/${trackIndex+1}`, args: {type: 'f', value: on ? 1 : 0}};
        console.log(payload);
        this.send(payload);
    }

    // osc.trackUpdateEffectValue(trackIndex, effectIndex, payload.value.properties.value);
    trackUpdateEffectValue(trackIndex, effectIndex, value) {
        value = this._toZeroOne(effectIndex, value);
        const args = {type: 'f', value};
        this.send({address: `/track/effect/value/${trackIndex}/${effectIndex}`, args});
        if(effectIndex===0){
            this.send({address: `/track/gain/${trackIndex+1}`, args});
        }
    }

    // osc.trackUpdateEffectToggle(trackIndex, effectIndex, payload.value.on);
    trackUpdateEffectToggle(trackIndex, effectIndex, on) {
        this.send({address: `/track/effect/toggle/${trackIndex}/${effectIndex}`, args: {type: 'i', value: on ? 1 : 0}});
    }

    _toZeroOne(effectIndex, value) {
        return this._mappingFunctions[effectIndex].toZeroOne(value);
    }

    _fromZeroOne(effectIndex, value) {
        return this._mappingFunctions[effectIndex].fromZeroOne(value);
    }
}

export default  OscBridge
