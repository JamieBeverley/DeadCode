import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import Connection from "../Connection";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import {ActionSpec, Actions} from "../actions";


// on stem-related update, output appropriate midi msg.
const midiMiddleware = store => next => action => {
    next(action);
    if (action.type === ActionSpec.STEM_UPDATE.name && action.payload.value.on !== undefined) {
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


let midi = {
    rows:2,
    cols:4,
    left: 0,
    top: 0
}

let toPosMap = {
    buttons: {
        "0": {
            "24": [0, 0],
            "25": [0, 1],
            "26": [0, 2],
            "27": [0, 3],
            "28": [1, 0],
            "29": [1, 1],
            "30": [1, 2],
            "31": [1, 3],
        }
    }
}


let posToOutput = [[
    {
        on: {note: 24, channel: 0, velocity: 1},
        off: {note: 24, channel: 0, velocity: 0},
        cue: {note: 24, channel: 0, velocity: 0}
    },
    {
        on: {note: 25, channel: 0, velocity: 1},
        off: {note: 25, channel: 0, velocity: 0},
        cue: {note: 25, channel: 0, velocity: 0}
    },
    {
        on: {note: 26, channel: 0, velocity: 1},
        off: {note: 26, channel: 0, velocity: 0},
        cue: {note: 26, channel: 0, velocity: 0}
    },
    {
        on: {note: 27, channel: 0, velocity: 1},
        off: {note: 27, channel: 0, velocity: 0},
        cue: {note: 27, channel: 0, velocity: 0}
    }
], [
    {
        on: {note: 28, channel: 0, velocity: 1},
        off: {note: 28, channel: 0, velocity: 0},
        cue: {note: 28, channel: 0, velocity: 0}
    },
    {
        on: {note: 29, channel: 0, velocity: 1},
        off: {note: 29, channel: 0, velocity: 0},
        cue: {note: 29, channel: 0, velocity: 0}
    },
    {
        on: {note: 30, channel: 0, velocity: 1},
        off: {note: 30, channel: 0, velocity: 0},
        cue: {note: 30, channel: 0, velocity: 0}
    },
    {
        on: {note: 31, channel: 0, velocity: 1},
        off: {note: 31, channel: 0, velocity: 0},
        cue: {note: 31, channel: 0, velocity: 0}
    }
]
];


function onDeviceToggle(msg) {
    const state = store.getState();
    const pos = toPosMap.buttons[msg.channel][msg.note];
    pos[1] += midi.left;
    pos[0] += midi.top;
    const trackId = Object.keys(state.tracks)[pos[1]];
    const stemId = state.tracks[trackId].stems[pos[0]];
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
    if(col<0 || col > midi.cols) return;
    const row = (state.tracks[trackIds[col]].stems.findIndex(x => x === stemId)) - midi.top;
    if(row<0 || row > midi.rows) return;

    const outputMsg = posToOutput[row][col][state.stems[stemId].on ? 'on' : 'off'];
    console.log('row',row,'  ','col',col);
    console.log(JSON.stringify(outputMsg)+"\n\n")
    output.send('noteon', outputMsg);
}


process.stdin.resume();