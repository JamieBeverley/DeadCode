

const TrackReducer = function (tracks, action) {

    const payload = action.payload;

    if (action.type === 'TRACK_UPDATE') {
        tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId], payload.value);
        return {...tracks};
    } else if (action.type === 'TRACK_DELETE_STEM') {
        tracks[payload.trackId].stems = tracks[payload.trackId].stems.filter(x=>{return x !== payload.stemId});
        tracks[payload.trackId] = Object.assign({}, tracks[payload.trackId]);
        return {...tracks};
    } else if (action.type === 'TRACK_ADD_STEM') {
        let newTrack = Object.assign({}, tracks[payload.trackId]);
        newTrack.stems = newTrack.stems.concat([payload.stemId]);
        let obj = {};
        obj[payload.trackId] = newTrack;
        return Object.assign({},tracks, obj)
    } else if (action.type === 'TRACK_DELETE_EFFECT') {
        tracks[payload.trackId] = {...tracks[payload.trackId]};
        tracks[payload.trackId].effects = tracks[payload.track].filter(x=>{return x !== payload.effectId});
        return {...tracks};
    } else if (action.type === 'TRACK_ADD_EFFECT') {
        tracks[payload.trackId] = {...tracks[payload.trackId]};
        tracks[payload.trackId].effects.push(payload.effectId);
        return {...tracks};
    } else if (action.type === 'TRACK_ADD'){
        tracks[payload.trackId] = payload.value;
        return {...tracks};
    }
    return tracks
}


export default TrackReducer