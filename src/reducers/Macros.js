import {ActionTypes} from "../actions";

const reducerFns = {};

// CREATE
const addMacro = (macros, payload) => {
    macros[payload.macroId] = payload.value;
    return {...macros}
};

reducerFns[ActionTypes.TRACK_ADD_MACRO] = addMacro;
reducerFns[ActionTypes.STEM_ADD_MACRO] = addMacro;
reducerFns[ActionTypes.MASTER_ADD_MACRO] = addMacro;

const deleteMacro = (macros, payload) => {
    delete macros[payload.macroId];
    return {...macros}
};

reducerFns[ActionTypes.TRACK_DELETE_MACRO] = deleteMacro;
reducerFns[ActionTypes.STEM_DELETE_MACRO] = deleteMacro;
reducerFns[ActionTypes.MASTER_DELETE_MACRO] = deleteMacro;


// DELETE
const deleteMacros = (macros, payload) => {
    payload.macros.forEach(x=>{
       delete macros[x]
    });
    return {...macros}
};

reducerFns[ActionTypes.TRACK_DELETE_STEM] = deleteMacros;
reducerFns[ActionTypes.TRACK_DELETE] = deleteMacros;


// UPDATE
reducerFns[ActionTypes.MACRO_UPDATE] = (macros, payload) => {
    macros[payload.macroId] = {...macros[payload.macroId], ...payload.value};
    return {...macros};
};

const MacroReducer = (tracks, {type, payload}) => reducerFns[type]?reducerFns[type](tracks, payload):tracks;
export default MacroReducer
