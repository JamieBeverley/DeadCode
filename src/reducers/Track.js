import {ActionTypes} from "../actions";
import {red} from "@material-ui/core/colors";

const valueReducerFns = {};

valueReducerFns[ActionTypes.TRACK_UPDATE] = (tracks, payload) => {
    tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId], payload.value);
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_DELETE_STEM] = (tracks, payload) => {
    tracks[payload.trackId].stems = tracks[payload.trackId].stems.filter(x => {
        return x !== payload.stemId
    });
    tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId]);
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_ADD_STEM] = (tracks, payload) => {
    let newTrack = Object.assign({}, tracks[payload.trackId]);
    newTrack.stems = newTrack.stems.concat([payload.stemId]);
    let obj = {};
    obj[payload.trackId] = newTrack;
    return Object.assign({}, tracks, obj)
};

valueReducerFns[ActionTypes.TRACK_DELETE_EFFECT] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].effects = tracks[payload.trackId].effects.filter(x => {
        return x !== payload.effectId
    });
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_ADD_EFFECT] = (tracks, payload) => {
    tracks[payload.trackId] = {
        ...tracks[payload.trackId],
        effects: [...tracks[payload.trackId].effects, payload.effectId]
    };
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_ADD] = (tracks, payload) => {
    tracks[payload.trackId] = payload.value;
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_DELETE] = (tracks, payload) => {
    delete tracks[payload.trackId];
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_ADD_MACRO] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].macros = [...tracks[payload.trackId].macros, payload.macroId];
    return {...tracks};
};

valueReducerFns[ActionTypes.TRACK_DELETE_MACRO] = (tracks, payload) => {
    tracks[payload.trackId] = {...tracks[payload.trackId]};
    tracks[payload.trackId].macros = tracks[payload.trackId].macros.filter(x => {
        return x !== payload.macroId
    });
    return {...tracks}
};

const valuesReducer = (values, {type, payload}) => valueReducerFns[type] ? valueReducerFns[type](values, payload) : values;


const orderReducerFns = {};

orderReducerFns[ActionTypes.TRACK_ADD] = (order, {trackId}) => {
    return [...order, trackId];
};

orderReducerFns[ActionTypes.TRACK_DELETE] = (order, {trackId}) => {
    return order.filter(x => x !== trackId);
};

orderReducerFns[ActionTypes.TRACK_REORDER] = (order, {trackId, position}) =>{
    const newOrder = order.filter(x=>x!==trackId);
    newOrder.splice(Math.min(Math.max(0,position),order.length), 0, trackId);
    debugger
    return [...newOrder];
};

const orderReducer = (order, {type, payload}) => orderReducerFns[type] ? orderReducerFns[type](order, payload) : order;


const TrackReducer = (tracks, action) => {
    return {
        order: orderReducer(tracks.order, action),
        values: valuesReducer(tracks.values, action)
    }
};

export default TrackReducer
