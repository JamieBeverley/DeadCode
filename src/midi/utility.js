import easymidi from 'easymidi'
import prompt from 'prompt-promise'
import fs from 'fs';

var input,output;
var json = {};
const getInput = function (res) {
  try {
    const inputs = easymidi.getInputs();
    let i = 0;
    inputs.forEach(x => {
      console.log(i + " - ", x);
      i++;
    });

    prompt('enter midi input device number\n').then(device=>{
      let deviceNum = parseInt(device);
      input = new easymidi.Input(inputs[deviceNum]);
      input.on('noteoff', (m)=>{console.log(m);console.log('\n\n\n')});
      input.on('cc',x=> console.log(x,'\n\n'));
      console.log('\n\n');
      res && res(input);
    })
  } catch (e) {
    console.warn("could not init midi input")
  }
}


const getOutput = function (res){
  try {
    const outputs = easymidi.getOutputs();
    let i = 0;
    outputs.forEach(x => {
      console.log(i + " - ", x);
      i++;
    });
    prompt('enter midi output device number\n').then(device=>{
      let deviceNum = parseInt(device);
      output = new easymidi.Output(outputs[deviceNum]);
      // for(let i = 0; i<127; i++){
      //   for(let j = 0; j<16; j++){
      //     for(let k = 127; k>0; k--){
      //       output.send('noteon',{note:i,channel:j,velocity:k});
      //     }
      //   }
      // }
      // output.send('noteon',{note:28,channel:0,velocity:1});

      // console.log('sent')
      res && res(output);
    })

  } catch (e) {
    console.warn("could not init midi output")
  }
}

function init() {
  getInput(()=>{getOutput()});
}
init();


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
posToOutput = posToOutput.reverse();


let notes = {}
for(let note =0; note<(64); note++){
  notes[note] = [7-Math.floor(note/8), note%8];
}




let up = {note:64, channel:0};
let down = {note:65, channel:0};
let left = {note:66, channel:0};
let right = {note:67, channel:0};

let faders = {};

for (let track = 0; track< 8; track++){
  faders[48+track] = track;
}

let toPosMap = {
  buttons: {
    "0": notes
  },
  faders: {
    '0': faders
  }

}

let midiMap = {toPosMap, posToOutput, meta:{rows:8, columns:8}};

fs.writeFile('src/midi/midi-maps/akai-lpd8.json',JSON.stringify(midiMap));



process.stdin.resume();