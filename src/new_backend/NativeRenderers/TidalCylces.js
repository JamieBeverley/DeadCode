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
    debugger
    udpPort.send({address, args}, "127.0.0.1", 6012);
};

const renderFnMap = {};

renderFnMap[ActionTypes.MASTER_UPDATE] = state => {
    this.evaluate(state.master.TidalCycles.code);
    this.evaluate(Renderers.TidalCycles.getTempoCode(state));
};

renderFnMap[ActionTypes.PUSH_STATE] = state => {
    this.evaluate(state.master.TidalCycles.code);
    this.evaluate(Renderers.TidalCycles.getTempoCode(state));
    this.evaluate(Renderers.TidalCycles.getCode(state));
};

renderFnMap[ActionTypes.EFFECT_UPDATE_SLIDER_VALUE] = (state, {payload}) => {
    const effectId = {type: 'i', value: payload.effectId};
    const value = {type: 'f', value: payload.value};
    sendTidalOsc("/ctrl", [effectId, value]);
};

// Note: this func is bound to NativeRenderer object.
const tidalRender = context => (state, action) => {
    const fn = renderFnMap[action.type];
    if (fn === undefined) {
        context.evaluate(Renderers.TidalCycles.getCode(state))
    } else {
        fn.call(context, state, action);
    }
};

const config = {
    interpreter:'ghci',
    interpreterOptions: ['-XOverloadedStrings'],
    bootScriptPath:'./src/backend/BootTidal.hs',
    renderer: tidalRender
};

export const TidalRenderer = new NativeRenderer(
    config.interpreter,
    config.interpreterOptions,
    config.bootScriptPath,
    config.renderer
);
TidalRenderer.renderer = tidalRender(TidalRenderer);

// // Listen for incoming OSC messages.
// udpPort.on("message", function (oscMsg, timeTag, info) {
//     console.log("An OSC message just arrived!", oscMsg);
//     console.log("Remote info is: ", info);
// });
// udpPort.send({
//     address: "/s_new",
//     args: [
//         {
//             type: "s",
//             value: "default"
//         },
//         {
//             type: "i",
//             value: 100
//         }
//     ]
// }, "127.0.0.1", 57110);
