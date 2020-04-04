import {ActionTypes} from "../actions";

const reducerFns = {};

reducerFns[ActionTypes.MASTER_UPDATE] = (master, payload) => {
    let newLang;
    newLang = Object.assign({}, master[payload.language], payload.value);
    master[payload.language] = newLang;
    return {...master};
};

reducerFns[ActionTypes.MASTER_ADD_EFFECT] = (master, payload) => {
    let newLang = Object.assign({}, master[payload.language]);
    newLang.effects = newLang.effects.concat([payload.effectId]);
    master[payload.language] = newLang;
    return {...master}
};

reducerFns[ActionTypes.MASTER_ADD_MACRO] = (master, payload) => {
    master[payload.masterId] = {...master[payload.masterId]};
    master[payload.masterId].macros.push(payload.masterId);
    return {...master}
};


const MasterReducer = (master, {type, payload}) => reducerFns[type] ? reducerFns[type](master, payload) : master;
export default MasterReducer
