import {Renderers} from "../../renderers";
import NativeRenderer from './NativeRenderer'
import osc from 'osc';
import {ActionTypes} from "../../actions";

// Create an osc.js UDP Port listening on port 57121.
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 6011,
    metadata: true
});

// Open the socket.
udpPort.open();


// When the port is read, send an OSC message to, say, SuperCollider
udpPort.on("ready", function () {

});

const sendTidalOsc = (address, args) => {
    udpPort.send({address, args}, "127.0.0.1", 6010);
};

function EVAL_MASTER_UPDATE (state) {
    this.evaluate(state.master.TidalCycles.code);
    this.evaluate(Renderers.TidalCycles.getTempoCode(state));
}

function EVAL_PUSH_STATE (state) {
    this.evaluate(state.master.TidalCycles.code);
    this.evaluate(Renderers.TidalCycles.getTempoCode(state));
    this.evaluate(Renderers.TidalCycles.getCode(state));
}

function EVAL_EFFECT_UPDATE_SLIDER_VALUE (state, {payload}){
    const effectId = {type: 'i', value: payload.effectId};
    const value = {type: 'f', value: payload.value};
    sendTidalOsc("/ctrl", [effectId, value]);
}

function EVAL_SCRATCH_RENDER (state){
    const code = Renderers.TidalCycles.getScratchCode(state)
    console.log(code);
    this.evaluate(code);
}


function EVAL_SCRATCH_UPDATE (state, {payload}){
    console.log(payload);
    if(payload.value === undefined || payload.value.on === undefined){
        return;
    }
    const code = Renderers.TidalCycles.getScratchCode(state);
    console.log(code);
    this.evaluate(code);
}


// Note: this func is bound to NativeRenderer object.
function tidalRender(state, action){
    console.log("hmm");
    console.log(action);
    if(!action.meta.render){
        return
    }
    // Don't crash if render fails, warn instead...
    try {
        switch (action.type) {
            case ActionTypes.MASTER_UPDATE:
                EVAL_MASTER_UPDATE.call(this, state, action);
                return;
            case ActionTypes.PUSH_STATE:
                EVAL_PUSH_STATE.call(this, state, action);
                return;
            case ActionTypes.EFFECT_UPDATE_SLIDER_VALUE:
                EVAL_EFFECT_UPDATE_SLIDER_VALUE.call(this, state, action);
                return;
            case ActionTypes.SCRATCH_RENDER:
                EVAL_SCRATCH_RENDER.call(this, state);
                return;
            case ActionTypes.SCRATCH_UPDATE:
                EVAL_SCRATCH_UPDATE.call(this, state, action);
                return;
            default:
                this.evaluate(Renderers.TidalCycles.getCode(state))
        }
    } catch(e){
        console.error(e);
    }
}

export const TidalRenderer = new NativeRenderer(
    'ghci',
    ['-XOverloadedStrings'],
    './src/backend/BootTidal.hs',
    tidalRender
);
