import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import Connection from "../Connection";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import {Actions, ActionSpec} from "../actions";
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

function findLaunchControl(inputs) {
    return (inputs.filter(x => x.includes("Launch Control"))[0])
}

function attachInputNoteOns(input, output) {
    input.on('noteoff', onDeviceNote(output, false));
    input.on('noteon', onDeviceNote(output, true));
    input.on('cc', onDeviceCC);
}

const getMidiDevice = function (res) {
    try {
        const inputs = easymidi.getInputs();
        const lc = findLaunchControl(inputs);
        let input, output;

        if (lc) {
            input = new easymidi.Input(lc);
            output = new easymidi.Output(lc);
            attachInputNoteOns(input,output);
            res && res(input, output);
            return {input, output};
        }

        let i = 0;
        inputs.forEach(x => {
            console.log(i + " - ", x);
            i++;
        });
        prompt('enter midi input device number\n').then(device => {
            let deviceNum = parseInt(device);
            input = new easymidi.Input(inputs[deviceNum]);
            output = new easymidi.Ouput(inputs[deviceNum]);
            attachInputNoteOns(input, output)
            console.log('\n\n');
            res && res(input,output);
            return {input,output};
        })
    } catch (e) {
        console.log(e)
        console.warn("could not init midi input")
    }
};

function init() {
    getMidiDevice(() => {
        const midi = {
            left: 0,
            right: 0,
            rows: 8,
            columns: 8
        }
        console.log('\n\n');
        store.dispatch(Actions.midiUpdate(midi));
        Connection.sendAction({
            type: ActionSpec.LOAD_FROM_SERVER.name,
            meta: {propagateToServer: true, fromServer: false}
        });
        console.log('\nMIDI Initialized\n\n')
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
    store.dispatch(Actions.trackToggleAll({trackId, stems: track.stems, on}))
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
        store.dispatch(Actions.effectUpdate({effectId: effect.id, value: {on}}))
    } else {
        console.warn("NO EFFECT FOUND")
    }
}

function lightButton(output, note, on){
    if(on){
        output.send('noteon', {note, channel:15, velocity:1});
    } else {
        output.send('noteoff', {note, channel:15, velocity:0})
    }
}

const onDeviceNote = (output, on) => msg => {
    const state = store.getState();
    const midi = state.midi;
    console.log(msg)
    // Row of buttons
    if (msg.note < 16) {
        lightButton(output, msg.note, on)
        const trackIndex = Math.floor(msg.note / 2);
        const trackId = state.tracks.order[trackIndex + midi.left];
        // Bottom button row, toggle track on/off
        if (msg.note / 2 === trackIndex) {
            toggleTrack(midi, state, trackId, on)
        } else {
            toggleTrackEffect(midi, state, trackId, on)
        }
    } else if (!on) {
        lightButton(output, msg.note, on)
        const tracks = state.tracks;
        const f = {
            60: () => store.dispatch(Actions.midiUpdate({top: Math.max(0, midi.top - 1)})),
            61: () => {
                const tracks = state.tracks;
                const {left, columns} = midi;
                const relevantTracks = tracks.order.filter((x, index) => {
                    return index >= left && index < left + columns;
                });
                const minTop = Math.min(...relevantTracks.map(x => {
                    return tracks.values[x].stems.length
                }));
                const top = Math.min(minTop - 1, midi.top + 1);
                store.dispatch(Actions.midiUpdate({top}));
            },
            62: () => store.dispatch(Actions.midiUpdate({left: Math.max(0, midi.left - 1)})),
            63: () => store.dispatch(Actions.midiUpdate({left: Math.min(midi.left + 1, tracks.order.length - midi.columns)}))
        }[msg.note]
        if (f) f();
    }
}

const effectMap = {
    0: {index: 0, mapping: x => x * 1.5 / 127},
    1: {index: 3, mapping: x => Math.round(x * 24 / 127)},
    // TODO figure out why filters invert after around here...
    2: {index: 1, mapping: x => Math.pow(x / 127, 3) * 17500},
    3: {index: 2, mapping: x => Math.pow(x / 127, 3) * 17500},
}


function onDeviceCC(msg) {
    const state = store.getState();
    const midi = state.midi;
    const trackIndex = Math.floor(msg.controller / 4);
    const trackId = state.tracks.order[trackIndex + midi.left];
    console.log(Object.values(msg))
    console.log(trackIndex)
    const effectMapping = effectMap[msg.controller % 4];
    const effectId = state.tracks.values[trackId].effects[effectMapping.index];
    if (!effectId) return;
    const value = effectMapping.mapping(msg.value);
    console.log(value)
    store.dispatch(Actions.effectUpdateSliderValue({effectId, value}));
}
