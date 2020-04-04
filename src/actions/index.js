import {createAction} from 'redux-actions'


export const ActionSpec = {
    'MIDI_UPDATE':{
        name:'MIDI_UPDATE',
        propagateToServer:true
    },
    'PUSH_STATE':{
        name: 'PUSH_STATE',
        propagateToServer:true
    },
    'RECEIVE_STATE':{
        name: 'RECEIVE_STATE',
        propagateToServer:false
    },
    'CONNECT': {
        name: 'CONNECT',
        propagateToServer: false
    },
    'SAVE': {
        name: 'SAVE',
        propagateToServer: false
    },
    'LOAD': {
        name: 'LOAD',
        propagateToServer: false
    },
    'LOAD_FROM_SERVER': {
        name: 'LOAD_FROM_SERVER',
        propagateToServer: false
    },
    'DOWNLOAD': {
        name: 'DOWNLOAD',
        propagateToServer: false
    },
    'MASTER_UPDATE': {
        name: 'MASTER_UPDATE',
        propagateToServer: true
    },
    'MASTER_ADD_EFFECT': {
        name: 'MASTER_ADD_EFFECT',
        propagateToServer: true
    },
    'STEM_UPDATE': {
        name: 'STEM_UPDATE',
        propagateToServer: true
    },
    'STEM_DELETE_EFFECT': {
        name: 'STEM_DELETE_EFFECT',
        propagateToServer: true
    },
    'STEM_ADD_EFFECT': {
        name: 'STEM_ADD_EFFECT',
        propagateToServer: true
    },
    'STEM_COPY': {
        name: 'STEM_COPY',
        propagateToServer: true
    },
    'STEM_PASTE': {
        name: 'STEM_PASTE',
        propagateToServer: true
    },
    'TRACK_UPDATE': {
        name: 'TRACK_UPDATE',
        propagateToServer: true
    },
    'TRACK_DELETE_STEM': {
        name: 'TRACK_DELETE_STEM',
        propagateToServer: true
    },
    'TRACK_ADD_STEM': {
        name: 'TRACK_ADD_STEM',
        propagateToServer: true
    },
    'TRACK_DELETE_EFFECT': {
        name: 'TRACK_DELETE_EFFECT',
        propagateToServer: true
    },
    'TRACK_ADD_EFFECT': {
        name: 'TRACK_ADD_EFFECT',
        propagateToServer: true
    },
    'TRACK_ADD': {
        name: 'TRACK_ADD',
        propagateToServer: true
    },
    'TRACK_DELETE': {
        name: 'TRACK_DELETE',
        propagateToServer: true
    },
    'EFFECT_UPDATE': {
        name: 'EFFECT_UPDATE',
        propagateToServer: true
    },
    'SETTINGS_UPDATE_STYLE':{
        name: 'SETTINGS_UPDATE_STYLE',
        propagateToServer:false
    },
    'TRACK_ADD_MACRO': {name: "TRACK_ADD_MACRO", propagateToServer:true},
    'MASTER_ADD_MACRO': {name: "MASTER_ADD_MACRO", propagateToServer:true},
    'STEM_ADD_MACRO': {name: "STEM_ADD_MACRO", propagateToServer:true},
    'TRACK_DELETE_MACRO': {name: "TRACK_DELETE_MACRO", propagateToServer:true},
    'MASTER_DELETE_MACRO': {name: "MASTER_DELETE_MACRO", propagateToServer:true},
    'STEM_DELETE_MACRO': {name: "STEM_DELETE_MACRO", propagateToServer:true},
    'MACRO_UPDATE': {name:"MACRO_UPDATE", propagateToServer: true}
};

function camel(capitalSnake) {
    let s = capitalSnake.split("_");
    s = s.map(x => {
        return x[0] + x.slice(1, x.length).toLowerCase();
    });
    s[0] = s[0].toLowerCase();
    return s.join("");
}

export let ActionTypes = {};
export let Actions = {};
for (let action in ActionSpec) {
    let meta = {propagateToServer: ActionSpec[action].propagateToServer, fromServer:false};
    Actions[camel(action)] = createAction(action, x => x, () => meta);
    ActionTypes[action] = action;
}

//
// export const ActionTypes = [
//     'CONNECT',
//     'SAVE',
//     'LOAD',
//     'DOWNLOAD',
//     'MASTER_UPDATE',
//     'MASTER_ADD_EFFECT',
//     'STEM_UPDATE',
//     'STEM_DELETE_EFFECT',
//     'STEM_ADD_EFFECT',
//     'STEM_COPY',
//     'STEM_PASTE',
//     'TRACK_UPDATE',
//     'TRACK_DELETE_STEM',
//     'TRACK_ADD_STEM',
//     'TRACK_DELETE_EFFECT',
//     'TRACK_ADD_EFFECT',
//     'TRACK_ADD',
//     'TRACK_DELETE',
//     'EFFECT_UPDATE'
// ]

// const obj = {};
// ActionTypes.forEach(x => {
//     obj[camel(x)] = createAction(x)
// });
// export const Actions = obj

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
