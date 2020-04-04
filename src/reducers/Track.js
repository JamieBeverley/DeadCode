import {ActionTypes} from "../actions";
import {red} from "@material-ui/core/colors";

const reducerFns = {};

reducerFns[ActionTypes.TRACK_UPDATE] = (tracks, payload) => {
    tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId], payload.value);
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_DELETE_STEM] = (tracks, payload) => {
    tracks[payload.trackId].stems = tracks[payload.trackId].stems.filter(x => {
        return x !== payload.stemId
    });
    tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId]);
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_ADD_STEM] = (tracks, payload) => {
    let newTrack = Object.assign({}, tracks[payload.trackId]);
    newTrack.stems = newTrack.stems.concat([payload.stemId]);
    let obj = {};
    obj[payload.trackId] = newTrack;
    return Object.assign({}, tracks, obj)
};

reducerFns[ActionTypes.TRACK_DELETE_EFFECT] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].effects = tracks[payload.trackId].effects.filter(x => {
        return x !== payload.effectId
    });
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_ADD_EFFECT] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].effects.push(payload.effectId);
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_ADD] = (tracks, payload) => {
    tracks[payload.trackId] = payload.value;
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_DELETE] = (tracks, payload) => {
    delete tracks[payload.trackId];
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_ADD_MACRO] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].macros = [...tracks[payload.trackId].macros, payload.macroId];
    return {...tracks};
};

reducerFns[ActionTypes.TRACK_DELETE_MACRO] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].macros = tracks[payload.trackId].macros.filter(x => {
        return x !== payload.macroId
    });
    return {...tracks}
};

const TrackReducer = (tracks, {type, payload}) => reducerFns[type]?reducerFns[type](tracks, payload):tracks;
export default TrackReducer
