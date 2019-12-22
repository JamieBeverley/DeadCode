import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import Connection from "../Connection";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import {ActionSpec, Actions} from "../actions";


// on stem-related update, output appropriate midi msg.
const midiMiddleware = store => next => action => {
    next(action);
    if (action.type === ActionSpec.STEM_UPDATE.name && (action.payload.value.on !== undefined || action.payload.value.code !== undefined)) {
        onServerToggle(action.payload.stemId);
    } else if (action.type === ActionSpec.RECEIVE_STATE.name){
        Object.keys(store.getState().stems).forEach(onServerToggle)
    }
}


addMiddleware(midiMiddleware);

var input, output;

const getInput = function (res) {
    try {
        const inputs = easymidi.getInputs();
        let i = 0;
        inputs.forEach(x => {
            console.log(i + " - ", x);
            i++;
        });

        prompt('enter midi input device number\n').then(device => {
            let deviceNum = parseInt(device);
            input = new easymidi.Input(inputs[deviceNum]);
            input.on('noteoff', onDeviceToggle);
            console.log('\n\n');
            res && res(input);
        })
    } catch (e) {
        console.warn("could not init midi input")
    }
}


const getOutput = function (res) {
    try {
        const outputs = easymidi.getOutputs();
        let i = 0;
        outputs.forEach(x => {
            console.log(i + " - ", x);
            i++;
        });
        prompt('enter midi output device number\n').then(device => {
            let deviceNum = parseInt(device);
            output = new easymidi.Output(outputs[deviceNum]);
            res && res(output);
        })

    } catch (e) {
        console.warn("could not init midi output")
    }
}

function init() {
    getInput(() => {
        getOutput()
    });
}

Connection.init('127.0.0.1', 8001, init, console.log, console.log);


// notes[chan][note] = [0,0];


/*
midi has slightly different state with additional positions component

.. this doesn't really help, large number of remappings
2d array with stemIds, updated with any delete/create operations on stems and midi grid move operations


on device toggle (chan,num provided):
  - look up stemId in map from midi num and channel
  - toggle that stem
  - look up output msg from midi num and channel

on server toggle (stemId provided):
  - search for position in state
  - lookup midi out given position
  - output to appropriate one


  var a = (new Array(100)).fill(0).map(x=>{return (new Array(5000)).fill(0)})
  a[99][4] = 23;
  var t1 = new Date();
  var v = a.find(x=>{return x.includes(23)});
  t2 = new Date();
  console.log(t2-t1);
  function(){
    let start = new Date();

  }
*/



// let posToOutput = [[
//     {
//         on: {note: 24, channel: 0, velocity: 1},
//         off: {note: 24, channel: 0, velocity: 0},
//         cue: {note: 24, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 25, channel: 0, velocity: 1},
//         off: {note: 25, channel: 0, velocity: 0},
//         cue: {note: 25, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 26, channel: 0, velocity: 1},
//         off: {note: 26, channel: 0, velocity: 0},
//         cue: {note: 26, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 27, channel: 0, velocity: 1},
//         off: {note: 27, channel: 0, velocity: 0},
//         cue: {note: 27, channel: 0, velocity: 0}
//     }
// ], [
//     {
//         on: {note: 28, channel: 0, velocity: 1},
//         off: {note: 28, channel: 0, velocity: 0},
//         cue: {note: 28, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 29, channel: 0, velocity: 1},
//         off: {note: 29, channel: 0, velocity: 0},
//         cue: {note: 29, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 30, channel: 0, velocity: 1},
//         off: {note: 30, channel: 0, velocity: 0},
//         cue: {note: 30, channel: 0, velocity: 0}
//     },
//     {
//         on: {note: 31, channel: 0, velocity: 1},
//         off: {note: 31, channel: 0, velocity: 0},
//         cue: {note: 31, channel: 0, velocity: 0}
//     }
// ]
// ];

let midi = {
    rows:2,
    cols:4,
    left: 0,
    top: 0
}


let posToOutput = [];

for (let row = 0; row <8; row ++){
    let rowEntry = [];
    for (let column = 0; column<8; column++){
        rowEntry.push({
            on: {note: column+(row*8), channel: 0, velocity: 1},
            off: {note: column+(row*8), channel: 0, velocity: 0},
            loaded: {note: column+(row*8), channel: 0, velocity: 5},
            cue: {note: column+(row*8), channel: 0, velocity: 0}
        })
    }
    posToOutput.push(rowEntry)
}
posToOutput = posToOutput.reverse()


let notes = {}
for(let note =0; note<(64); note++){
    notes[note] = [7-Math.floor(note/8), note%8];
}

console.log(notes);

let toPosMap = {
    buttons: {
        "0": notes
    }
}

let midiMap = {toPosMap, posToOutput}



function onDeviceToggle(msg) {
    const state = store.getState();
    const pos = midiMap.toPosMap.buttons[msg.channel][msg.note];
    pos[1] += midi.left;
    pos[0] += midi.top;
    const trackId = Object.keys(state.tracks)[pos[1]];
    if(trackId===undefined) return;
    const stemId = state.tracks[trackId].stems[pos[0]];
    if(stemId===undefined) return;
    const on = !state.stems[stemId].on;

    store.dispatch(Actions.stemUpdate({stemId, value: {on}}));
    // actions.updateStem(stemId, {on});
    // const outputMsg = posToOutput[pos[0]][pos[1]][on ? 'on' : 'off']
    // output.send(outputMsg)
}


function onServerToggle(stemId) {
    const state = store.getState();
    const trackIds = Object.keys(state.tracks);
    const col = trackIds.findIndex(x => {
        return state.tracks[x].stems.includes(stemId)
    }) - midi.left;
    // if(col<0 || col > midi.cols) return;
    const row = (state.tracks[trackIds[col]].stems.findIndex(x => x === stemId)) - midi.top;
    console.log(row,col);
    // if(row<0 || row > midi.rows) return;
    const stem = state.stems[stemId]
    const buttonState = stem.on?'on':(stem.code===''?'off':'loaded');
    const outputMsg = midiMap.posToOutput[row][col][buttonState];
    console.log('row',row,'  ','col',col);
    console.log(JSON.stringify(outputMsg)+"\n\n")
    output.send('noteon', outputMsg);
}


process.stdin.resume();