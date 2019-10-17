import {store} from '../index.js';

const Actions = {};

// MASTER ACTIONS
Actions.CONNECT = function(url, port, isConnected){
    return {type:'CONNECT', url, port, isConnected}
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

Actions.ADD_STEM_EFFECT = function(trackId, stemId, effectType){
    return {type:'ADD_STEM_EFFECT', trackId, stemId, effectType}
}

Actions.UPDATE_TRACK = function(value){
    return {type:'UPDATE_TRACK', value}
};

Actions.UPDATE_MASTER = function(language,value){
    return {type:'UPDATE_MASTER', language, value}
}

Actions.UPDATE_MASTER_EFFECT = function(effect){
    return {type:'UPDATE_MASTER_EFFECT', effect}
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