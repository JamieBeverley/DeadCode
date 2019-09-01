import {store} from '../index.js';

/*
Actions:
______________
add track
remove track
add stem
remove stem
update stem
open in flyout
close in flyout
save
load

copy/paste
move stems around
move tracks around
 */

const Actions = {};

// MASTER ACTIONS
Actions.CONNECT = function(url, port, isConnected){
    return {type:'CONNECT', url, port, isConnected}
};

Actions.UPDATE_TEMPO = function(tempo){
    return {type:"UPDATE_TEMPO",tempo}
};

// copy's given stems. if no argument copy's selected stems
Actions.COPY_STEMS = function(opt_stems){
    let stems = opt_stems;
    if(!stems){
        let state = store.getState();
        stems = state.tracks.map(x=>x.stems).flat().filter(x=>x.selected);
    }
    return {type:"COPY_STEMS", stems};
};

Actions.PASTE_STEMS = function(trackId, stemId){
    return {type:"PASTE_STEMS",trackId,stemId}
};

Actions.ADD_TRACK = function(){
    return {type:'ADD_TRACK'}
};

Actions.REMOVE_TRACK = function(trackId){
    return {type:'ADD_TRACK', trackId};
};

Actions.ADD_STEM = function(trackId){
    return {type:'ADD_STEM',trackId};
};

Actions.REMOVE_STEM = function(trackId, stemId){
    return {type:'REMOVE_STEM', trackId, stemId};
};

Actions.UPDATE_STEM = function(trackId,stemId, value){
    return {type:'UPDATE_STEM', trackId, stemId, value}
};

Actions.UPDATE_TRACK = function(value){
    return {type:'UPDATE_TRACK', value}
};

Actions.TOGGLE_LIVE = function(value){
    return {type:'TOGGLE_LIVE',live:value};
};

Actions.UPDATE_MASTER_EFFECT = function(value){
    return {type:'UPDATE_MASTER_EFFECT', value}
}


// Saving / Loading
Actions.SAVE = function(){
    return {type:'SAVE'}
};

Actions.LOAD = function(newState){
    return {type:'LOAD',newState}
};

Actions.DOWNLOAD = function(){
    return {type:'DOWNLOAD'}
};

Actions.Types = {};
Object.keys(Actions).forEach(x=>{
    Actions.Types[x] = x;
});

export default Actions