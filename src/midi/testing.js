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
  width: 3,
  height:3,
  left: 0,
  right:0
}

let toPosMap = {
  buttons:{
    "0":{  // Chan
      "56": //note
    }
  }
}

let posToOutput =[[
  {
    on: {num:56,chan:0,velocity:1},
    off:{num:56,chan:0,velocity:1},
    cue:{num:56, chan:0, velocity:0}
  }
]];

function onDeviceToggle(msg){
  const pos = toPosMap.buttons.input[msg.chan][msg.num];
  pos[1] += midi.left;
  pos[0] += midi.top
  const trackId = Object.keys(state.tracks)[pos[1]];
  const stemId = state.tracks[trackId].stems[pos[0]];
  const on = !state.stems[stemId].on;
  actions.updateStem(stemId,{on});
  const outputMsg = posToOutput[pos[0]][pos[1]][on?'on':'off']
  output.send(outputMsg)
}

function onServerToggle(stemId){
  const trackIds = Object.keys(state.tracks);
  const col = trackIds.findIndex(x=>{return state.tracks[x].stems.includes(stemId)}) - offset.left;
  const row = state.tracks[trackIds[col]].stems.findIndex(x=>x===stemId) - offset.top;
  const outputMsg = posToOutput[row][col][state.stems[stemId].on?'on':'off'];
  output.send(outputMsg);
}




















//
