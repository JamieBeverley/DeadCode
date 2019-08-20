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

Actions.ADD_TRACK = function(){
    return {type:'ADD_TRACK'}
};

Actions.REMOVE_TRACK = function(trackId){
    return {type:'ADD_TRACK', trackId};
};

Actions.ADD_STEM = function(trackId){
    return {type:'ADD_STEM',trackId:'trackId'};
};

Actions.REMOVE_STEM = function(trackId, stemId){
    return {type:'REMOVE_STEM', trackId, stemId};
};

Actions.UPDATE_STEM = function(trackId,stemId, value){
    return {type:'UPDATE_STEM', trackId, stemId, value}
};

Actions.OPEN_IN_FLYOUT = function(trackId,stemId){
    return {type:'OPEN_IN_FLYOUT', trackId, stemId}
};

Actions.CLOSE_IN_FLYOUT = function(trackId,stemId){
    return {type:'OPEN_IN_FLYOUT', trackId, stemId}
};

Actions.SAVE = function(){
    return {type:'SAVE'}
};

Actions.Types = {};
Object.keys(Actions).forEach(x=>{
    Actions.Types[x] = x;
});

export default Actions