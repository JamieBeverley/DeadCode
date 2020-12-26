import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import Connection from "../Connection";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import {Actions} from "../actions";
import {spread} from "../util";
import {setTerminalTitle} from "../util";
import EffectModel from "../model/EffectModel";

setTerminalTitle("Launchkey");

const PauseStates = {
    Active: "Active",
    Sleep: "Sleep",
};

let pauseState = PauseStates.Active;
const timeoutDuration = 30 * (60 * 1000); // 30 minutes
const sleep = () => {
    pauseState = PauseStates.Sleep;
};

let timeoutTimeout = setTimeout(sleep, timeoutDuration);

const resetTimeout = () => {
    pauseState = PauseStates.Active;
    clearInterval(timeoutTimeout);
    timeoutTimeout = setTimeout(sleep, timeoutDuration);
};


// on stem-related update, output appropriate midi msg.
const midiMiddleware = store => next => action => {
    next(action);
    resetTimeout();
};

addMiddleware(midiMiddleware);

var input, output, midiMap, spreadSend;

const getMidiInputDevice = function (res) {
    try {
        const inputs = easymidi.getInputs();
        // for(let i =0; i<inputs.length; i++){
        //     if(inputs[i].includes("Launch Control")){
        //         console.log(inputs[i]);
        //         input = new easymidi.Input(inputs[i])
        //         res(input)
        //         return input;
        //     }
        // }

        let i = 0;
        inputs.forEach(x => {
            console.log(i + " - ", x);
            i++;
        });
        prompt('enter midi input device number\n').then(device => {
            let deviceNum = parseInt(device);
            input = new easymidi.Input(inputs[deviceNum]);
            input.on('noteoff', onDeviceNote(false));
            input.on('noteon', onDeviceNote(true));
            input.on('cc', onDeviceCC);
            console.log('\n\n');
            res && res(input);
        })
    } catch (e) {
        console.log(e)
        console.warn("could not init midi input")
    }
};


const getMidiOutputDevice = function (res) {
    try {
        const outputs = easymidi.getOutputs();
        // for(let i =0; i<outputs.length; i++){
        //     if(outputs[i].includes("Launch Control")){
        //         input = new easymidi.Input(outputs[i])
        //         res(input);
        //         return;
        //     }
        // }
        let i = 0;
        outputs.forEach(x => {
            console.log(i + " - ", x);
            i++;
        });
        prompt('enter midi output device number\n').then(device => {
            let deviceNum = parseInt(device);
            output = new easymidi.Output(outputs[deviceNum]);
            spreadSend = spread((...x) => {
                output.send(...x)
            }, 0.125);
            typeof res === 'function' && res(output);
        })

    } catch (e) {
        console.warn("could not init midi output")
    }
};

function init() {
    getMidiInputDevice(() => {
        getMidiOutputDevice(() => {
            console.log('\nMIDI Initialized\n\n')
        });
    });
}

function reconnect() {
    prompt('disconnected, hit enter to reconnect').then(x => {
        if (midiMap && input && output) {
            Connection.init('127.0.0.1', 8001, () => {
                console.log('connected')
            }, reconnect, console.log);
        } else {
            Connection.init('127.0.0.1', 8001, init, reconnect, console.log);

        }
    })
}

Connection.init('127.0.0.1', 8001, init, reconnect, console.log);


function toggleTrack(midi, state, trackId, on) {
    const track = state.tracks.values[trackId];
    store.dispatch(Actions.trackToggleAll({trackId, stems:track.stems, on}))
}

function toggleTrackEffect(midi, state, trackId, on) {
    const track = state.tracks.values[trackId];
    const effects = track.effects.map(id => {
        return {
            ...state.effects[id],
            id
        }
    });
    const effect = effects.filter(x => x.type === EffectModel.Types.CODE_TOGGLE)[0];
    if (effect) {
        console.log("Toggle Effect", effect.id, on)
        store.dispatch(Actions.effectUpdate({effectId: effect.id, on}))
    } else{
        console.warn("NO EFFECT FOUND")
    }
}

const onDeviceNote = on => msg => {
    const state = store.getState();
    const midi = state.midi;
    console.log(msg)
    // Row of buttons
    if (msg.note < 16) {
        const trackIndex = Math.floor(msg.note / 2);
        const trackId = state.tracks.order[trackIndex + midi.left];
        // Bottom button row, toggle track on/off
        if (msg.note / 2 === trackIndex) {
            toggleTrack(midi, state, trackId, on)
        } else {
            toggleTrackEffect(midi, state, trackId, on)
        }
    }
}

const effectMap = {
    0: {index: 0, mapping: x => x / 127},
    1: {index: 3, mapping: x => x / 127},
    2: {index: 1, mapping: x => x / 127},
    3: {index: 2, mapping: x => x / 127},
}


function onDeviceCC(msg) {
    const state = store.getState();
    const midi = state.midi;
    const trackIndex = Math.floor(msg.controller / 4);
    const trackId = state.tracks.order[trackIndex + midi.left];
    console.log(Object.values(msg))
    console.log(trackIndex)
    const effectMapping = effectMap[msg.controller%4];
    const effectId = state.tracks.values[trackId].effects[effectMapping.index];
    if (!effectId) return;
    const value = effectMapping.mapping(msg.value);
    console.log(value)
    store.dispatch(Actions.effectUpdateSliderValue({effectId, value}));
}
