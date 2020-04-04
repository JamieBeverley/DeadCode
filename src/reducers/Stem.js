import {ActionTypes} from "../actions";

const reducerFns = {};

reducerFns[ActionTypes.STEM_UPDATE] = (stems, payload) => {
    stems[payload.stemId] = Object.assign({}, stems[payload.stemId], payload.value);
    return {...stems};
};

reducerFns[ActionTypes.STEM_DELETE_EFFECT] = (stems, payload) => {
    stems[payload.stemId] = Object.assign({}, stems[payload.stemId]);
    stems[payload.stemId].effects = stems[payload.stemId].effects.filter(x => {
        return x !== payload.effectId
    });
    return {...stems}
};

reducerFns[ActionTypes.STEM_ADD_EFFECT] = (stems, payload) => {
    stems[payload.stemId] = Object.assign({}, stems[payload.stemId]);
    stems[payload.stemId].effects.push(payload.effectId);
    return {...stems}
};

reducerFns[ActionTypes.STEM_COPY] = (stems, payload) => {
    // nothing
    return stems
};

reducerFns[ActionTypes.STEM_PASTE] = (stems, payload) => {
    console.log('paste not yet implemented');
    return stems
};

reducerFns[ActionTypes.TRACK_ADD_STEM] = (stems, payload) => {
    stems[payload.stemId] = payload.value;
    return {...stems}
};

reducerFns[ActionTypes.TRACK_DELETE_STEM] = (stems, payload) => {
    delete stems[payload.stemId];
    return {...stems}
};

reducerFns[ActionTypes.TRACK_DELETE] = (stems, payload) => {
    payload.stems.forEach(stemId=>{
        delete stems[stemId]
    });
    return {...stems}
};

reducerFns[ActionTypes.STEM_ADD_MACRO] = (stems, payload) => {
    stems[payload.stemId] = {...stems[payload.stemId]};
    stems[payload.stemId].macros.push(payload.stemId);
    return {...stems}
};

const StemReducer = (stems, {type, payload}) => reducerFns[type]?reducerFns[type](stems, payload):stems;
export default StemReducer
