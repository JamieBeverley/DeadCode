import {createAction} from 'redux-actions'

export const ActionSpec = {
    'MIDI_UPDATE': {name: 'MIDI_UPDATE', propagateToServer: true, render: false},
    'PUSH_STATE': {name: 'PUSH_STATE', propagateToServer: true, render: true},
    'RECEIVE_STATE': {name: 'RECEIVE_STATE', propagateToServer: false, render: true},
    'CONNECT': {name: 'CONNECT', propagateToServer: false, render: false},
    'SAVE': {name: 'SAVE', propagateToServer: false, render: false},
    'LOAD': {name: 'LOAD', propagateToServer: false, render: false},
    'LOAD_FROM_SERVER': {name: 'LOAD_FROM_SERVER', propagateToServer: false, render: true},
    'DOWNLOAD': {name: 'DOWNLOAD', propagateToServer: false, render: false},
    'MASTER_UPDATE': {name: 'MASTER_UPDATE', propagateToServer: true, render: true},
    'MASTER_ADD_EFFECT': {name: 'MASTER_ADD_EFFECT', propagateToServer: true, render: true},
    'STEM_UPDATE': {name: 'STEM_UPDATE', propagateToServer: true, render: true},
    'STEM_DELETE_EFFECT': {name: 'STEM_DELETE_EFFECT', propagateToServer: true, render: true},
    'STEM_ADD_EFFECT': {name: 'STEM_ADD_EFFECT', propagateToServer: true, render: true},
    'STEM_COPY': {name: 'STEM_COPY', propagateToServer: true, render: false},
    'STEM_PASTE': {name: 'STEM_PASTE', propagateToServer: true, render: true},
    'TRACK_UPDATE': {name: 'TRACK_UPDATE', propagateToServer: true, render: true},
    'TRACK_DELETE_STEM': {name: 'TRACK_DELETE_STEM', propagateToServer: true, render: true},
    'TRACK_ADD_STEM': {name: 'TRACK_ADD_STEM', propagateToServer: true, render: true},
    'TRACK_DELETE_EFFECT': {name: 'TRACK_DELETE_EFFECT', propagateToServer: true, render: true},
    'TRACK_ADD_EFFECT': {name: 'TRACK_ADD_EFFECT', propagateToServer: true, render: true},
    'TRACK_ADD': {name: 'TRACK_ADD', propagateToServer: true, render: true},
    'TRACK_DELETE': {name: 'TRACK_DELETE', propagateToServer: true, render: true},
    'TRACK_REORDER': {name: 'TRACK_REORDER', propagateToServer: true, render: false},
    'EFFECT_UPDATE': {name: 'EFFECT_UPDATE', propagateToServer: true, render: true},
    'EFFECT_UPDATE_SLIDER_VALUE': {name: 'EFFECT_UPDATE_SLIDER_VALUE', propagateToServer: true, render: true},
    'SETTINGS_UPDATE_STYLE': {name: 'SETTINGS_UPDATE_STYLE', propagateToServer: false, render: false},
    'TRACK_ADD_MACRO': {name: "TRACK_ADD_MACRO", propagateToServer: true, render: true},
    'MASTER_ADD_MACRO': {name: "MASTER_ADD_MACRO", propagateToServer: true, render: true},
    'STEM_ADD_MACRO': {name: "STEM_ADD_MACRO", propagateToServer: true, render: true},
    'TRACK_DELETE_MACRO': {name: "TRACK_DELETE_MACRO", propagateToServer: true, render: true},
    'MASTER_DELETE_MACRO': {name: "MASTER_DELETE_MACRO", propagateToServer: true, render: true},
    'STEM_DELETE_MACRO': {name: "STEM_DELETE_MACRO", propagateToServer: true, render: true},
    'MACRO_UPDATE': {name: "MACRO_UPDATE", propagateToServer: true, render: true},

    // Scratch Actions
    'SCRATCH_CREATE':{name:'SCRATCH_CREATE', propagateToServer:true, render:false},
    'SCRATCH_UPDATE':{name:'SCRATCH_UPDATE', propagateToServer:true, render:true},
    'SCRATCH_DELETE':{name:'SCRATCH_DELETE', propagateToServer:true, render:false},
    'SCRATCH_RENDER':{name:'SCRATCH_RENDER', propagateToServer:true, render:true},
    'SCRATCH_TRANSLATE':{name:'SCRATCH_TRANSLATE', propagateToServer:true, render:true}
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
    const meta = {
        propagateToServer: ActionSpec[action].propagateToServer,
        fromServer: false,
        render: ActionSpec[action].render
    };
    Actions[camel(action)] = createAction(action, x => x, () => meta);
    ActionTypes[action] = action;
}
