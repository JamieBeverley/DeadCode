import {store} from '../index.js';
import {createAction} from 'redux-actions'

export const ActionTypes = [
    'CONNECT',
    'SAVE',
    'LOAD',
    'DOWNLOAD',

    'MASTER_UPDATE',
    'MASTER_ADD_EFFECT',

    'STEM_UPDATE',
    'STEM_DELETE_EFFECT',
    'STEM_ADD_EFFECT',
    'STEM_COPY',
    'STEM_PASTE',

    'TRACK_UPDATE',
    'TRACK_DELETE_STEM',
    'TRACK_ADD_STEM',
    'TRACK_DELETE_EFFECT',
    'TRACK_ADD_EFFECT',
    'TRACK_ADD',
    'TRACK_DELETE',

    'EFFECT_UPDATE'
]

function camel(capitalSnake) {
    let s = capitalSnake.split("_");
    s = s.map(x => {
        return x[0] + x.slice(1, x.length).toLowerCase();
    })
    s[0] = s[0].toLowerCase();
    return s.join("");
}

const obj = {};
ActionTypes.forEach(x => {
    obj[camel(x)] = createAction(x)
});
export const Actions = obj

// // MASTER ACTIONS
// Actions.CONNECT = function(url, port, isConnected){
//     return {type:'CONNECT', url, port, isConnected}
// };
//
// // copy's given stems. if no argument copy's selected stems
// Actions.COPY_STEMS = function(opt_stems){
//     let stems = opt_stems;
//     if(!stems){
//         let state = store.getState();
//         stems = state.tracks.map(x=>x.stems).flat().filter(x=>x.selected);
//     }
//     return {type:"COPY_STEMS", stems};
// };
//
// Actions.PASTE_STEMS = function(trackId, stemId){
//     return {type:"PASTE_STEMS",trackId,stemId}
// };
//
// Actions.ADD_TRACK = function(){
//     return {type:'ADD_TRACK'}
// };
//
// Actions.REMOVE_TRACK = function(trackId){
//     return {type:'ADD_TRACK', trackId};
// };
//
// Actions.ADD_STEM = function(trackId){
//     return {type:'ADD_STEM',trackId};
// };
//
// Actions.REMOVE_STEM = function(trackId, stemId){
//     return {type:'REMOVE_STEM', trackId, stemId};
// };
//
// Actions.UPDATE_STEM = function(id, value){
//     return {type:'UPDATE_STEM', id, value}
// };
//
// Actions.ADD_STEM_EFFECT = function(trackId, stemId, effectType){
//     return {type:'ADD_STEM_EFFECT', trackId, stemId, effectType}
// }
//
// Actions.UPDATE_TRACK = function(value){
//     return {type:'UPDATE_TRACK', value}
// };
//
// Actions.UPDATE_MASTER = function(language,value){
//     return {type:'UPDATE_MASTER', language, value}
// }
//
// Actions.UPDATE_MASTER_EFFECT = function(effect){
//     return {type:'UPDATE_MASTER_EFFECT', effect}
// }
//
// Actions.UPDATE_EFFECT = function (effectId, effect){
//     return {type: "UPDATE_EFFECT", id:effectId, value:effect}
// }
//
// // Saving / Loading
// Actions.SAVE = function(){
//     return {type:'SAVE'}
// };
//
// Actions.LOAD = function(newState){
//     return {type:'LOAD',newState}
// };
//
// Actions.DOWNLOAD = function(){
//     return {type:'DOWNLOAD'}
// };
//
// ActionTypes = {};
// Object.keys(Actions).forEach(x=>{
//     ActionTypes[x] = x;
// });
//
// export default Actions
