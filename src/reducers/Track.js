import Actions from "../actions";
import Model from "../model";
import TrackModel from "../model/TrackModel";
import EffectModel from "../model/EffectModel";
import StemModel from "../model/StemModel";

const TrackReducer = function (tracks, action){
    let oldTrack, newTrack, newTracks, newState;

    switch (action.type){
        case Actions.Types.ADD_TRACK:
            return [...tracks,TrackModel.getNew()]
        case Actions.Types.REMOVE_TRACK:
            return tracks.filter(x=>{return x.id!==action.trackId})
        case Actions.Types.ADD_STEM:
            let hmm = tracks.map(x=>{
                if(x.id===action.trackId){
                    return Object.assign({},x,{
                        stems:[
                            ...x.stems,
                            StemModel.getNew(x.id)
                        ]
                    })
                }
                return x
            });
            return [...hmm];
        case Actions.Types.REMOVE_STEM:
            let hmmm = tracks.map(x=>{
                if(x.id===action.trackId){
                    return Object.assign({},x,{
                        stems:x.stems.filter(y=>{return y.id!==action.stemId})
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
        case Actions.Types.UPDATE_STEM:
            // tracks[action.trackId].stems[action.stemId] = Object.assign({},tracks[action.trackId].stems[action.stemId],action.value);
            // return Object.assign({},tracks);
            oldTrack = tracks[action.trackId];
            let newStemObj = {...oldTrack.stems};
            newStemObj[action.stemId] = Object.assign({}, tracks[action.trackId].stems[action.stemId], action.value);
            // newTrack = Object.assign({},oldTrack,{
            //     // stems: Object.assign({},oldTrack.stems,newStemObj)
            //     stems: newStemObj
            // });
            newTrack = {oldTrack},oldTrack,{
                // stems: newStemObj
            // });
            let obj ={};
            obj[newTrack.id] = newTrack;
            return Object.assign({},tracks,obj);
        case Actions.Types.ADD_STEM_EFFECT:
            let index = tracks.findIndex(x=>{return x.id === action.trackId});
            oldTrack = tracks[index];
            // let effect = EffectModel.;
            newTrack = Object.assign({},oldTrack,{
                stems: [...oldTrack.stems].map(x=>{
                    if(x.id===action.stemId){
                        return Object.assign({}, x, {effects:[...x.effects, EffectModel.getNew(action.effectType)]})
                    }
                    return x
                })
            });
            newTracks = [...tracks];
            newTracks[index] = newTrack;
            return newTracks
        case Actions.Types.UPDATE_TRACK:
            oldTrack = tracks.find(x=>{return x.id === action.value.id});
            newTrack = Object.assign({},oldTrack,action.value);
            return tracks.map(x=>{
                if(x.id === newTrack.id){
                    return newTrack
                }
                return x
            });

        default:
            return tracks
    }
}

export default TrackReducer