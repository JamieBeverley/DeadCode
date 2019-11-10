import {ActionTypes} from "../actions";
import Model from "../model";
import TrackModel from "../model/TrackModel";
import EffectModel from "../model/EffectModel";
import StemModel from "../model/StemModel";


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
        console.log('not yet implemented (tracks reducer');
    } else if (action.type === 'TRACK_ADD_EFFECT') {
        console.log('not yet implemented (tracks reducer');
    }
    return tracks
}


export default TrackReducer


const OldTrackReducer = function (tracks, action) {
    let oldTrack, newTrack, newTracks, newState;

    switch (action.type) {
        case ActionTypes.ADD_TRACK:
            return [...tracks, TrackModel.getNew()]
        case ActionTypes.REMOVE_TRACK:
            return tracks.filter(x => {
                return x.id !== action.trackId
            })
        case ActionTypes.ADD_STEM:
            let hmm = tracks.map(x => {
                if (x.id === action.trackId) {
                    return Object.assign({}, x, {
                        stems: [
                            ...x.stems,
                            StemModel.getNew(x.id)
                        ]
                    })
                }
                return x
            });
            return [...hmm];
        case ActionTypes.REMOVE_STEM:
            let hmmm = tracks.map(x => {
                if (x.id === action.trackId) {
                    return Object.assign({}, x, {
                        stems: x.stems.filter(y => {
                            return y.id !== action.stemId
                        })
                    })
                }
                return x
            });
            return [...hmmm];

        // oldTrack = tracks.find(x=>{return x.id === action.trackId});
        // return  Object.assign({},oldTrack,{
        //     stems:[
        //         ...oldTrack.stems.filter(x=>{return x.id!==action.stemId})
        //     ]
        // });
        case ActionTypes.ADD_STEM_EFFECT:
            let index = tracks.findIndex(x => {
                return x.id === action.trackId
            });
            oldTrack = tracks[index];
            // let effect = EffectModel.;
            newTrack = Object.assign({}, oldTrack, {
                stems: [...oldTrack.stems].map(x => {
                    if (x.id === action.stemId) {
                        return Object.assign({}, x, {effects: [...x.effects, EffectModel.getNew(action.effectType)]})
                    }
                    return x
                })
            });
            newTracks = [...tracks];
            newTracks[index] = newTrack;
            return newTracks
        case ActionTypes.UPDATE_TRACK:
            oldTrack = tracks.find(x => {
                return x.id === action.value.id
            });
            newTrack = Object.assign({}, oldTrack, action.value);
            return tracks.map(x => {
                if (x.id === newTrack.id) {
                    return newTrack
                }
                return x
            });

        default:
            return tracks
    }
}

