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
window.ActionTypes = ActionTypes;
