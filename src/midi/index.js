import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import Connection from "../Connection";
import store from "../store";
import {addMiddleware} from 'redux-dynamic-middlewares'
import {ActionSpec, Actions} from "../actions";
import fs from 'fs';


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

var input, output, midiMap;

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
            input.on('noteoff', onDeviceNoteOff);
            input.on('cc', onDeviceCC);
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
            typeof res === 'function' && res(output);
        })

    } catch (e) {
        console.warn("could not init midi output")
    }
}

function init() {
    getMidiMap(()=>{
        getInput(()=>{
            getOutput(()=>{
                console.log('\nMIDI Initialized\n\n')
            });
        });
    })
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




function getMidiMap(callback){
    fs.readdir('src/midi/midi-maps',(err, files)=>{
        if(err){
            console.log(err)
            return;
        }
        for(let i = 0; i<files.length; i++){
            console.log(i+". "+files[i])
        }
        prompt('select a midi map').then(opt=>{
            let filename = files[parseInt(opt)];
            fs.readFile('src/midi/midi-maps/'+filename,(err, file)=>{
                if(err){
                    console.log(err);
                    return;
                }
                midiMap = JSON.parse(file);
                let midi = {
                    rows: midiMap.meta.rows,
                    columns: midiMap.meta.columns,
                    left:0,
                    top:0
                }
                console.log('\n\n')
                store.dispatch(Actions.midiUpdate(midi));
                callback();
            })
        });
    })
}

function onDeviceNoteOff(msg) {
    const state = store.getState();
    const midi = state.midi;
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


function onDeviceCC(msg){
    const state = store.getState();
    let trackIndex = midiMap.toPosMap.faders[msg.channel][msg.controller];
    let trackId = Object.keys(state.tracks)[trackIndex];
    if(trackId===undefined){return}
    let effectId = state.tracks[trackId].effects[0]; // TODO dangerous
    if(effectId===undefined){return}
    let value = {properties:Object.assign({},state.effects[effectId].properties,{value:msg.value*2/127})}
    if(!!effectId){
        store.dispatch(Actions.effectUpdate({effectId,value}));
    } else{
        console.warn('no effect found for track '+ trackId);
    }
}

function onServerToggle(stemId) {
    const state = store.getState();
    const trackIds = Object.keys(state.tracks);
    const col = trackIds.findIndex(x => {
        return state.tracks[x].stems.includes(stemId)
    }) - state.midi.left;
    // if(col<0 || col > midi.cols) return;
    const row = (state.tracks[trackIds[col]].stems.findIndex(x => x === stemId)) - state.midi.top;
    console.log(row,col);
    // if(row<0 || row > midi.rows) return;
    const stem = state.stems[stemId]
    const buttonState = stem.on?'on':(stem.code===''?'off':'loaded');
    const outputMsg = midiMap.posToOutput[row][col][buttonState];
    console.log('row',row,'  ','col',col);
    console.log(JSON.stringify(outputMsg)+"\n\n")
    output.send('noteon', outputMsg);
}


