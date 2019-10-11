import Actions from "../actions";
import Model from "../model";
import TrackModel from "../model/TrackModel";

const TrackReducer = function (tracks, action){
    let oldTrack, newTrack, newState;

    switch (action.type){
        case Actions.Types.ADD_TRACK:
            return [...tracks,TrackModel.getNew()]
        case Actions.Types.REMOVE_TRACK:
            return tracks.filter(x=>{return x.id!==action.trackId})
        case Actions.Types.ADD_STEM:
            oldTrack = tracks.find(x=>{return x.id === action.trackId});
            return Object.assign({},oldTrack,{
                stems:[
                    ...oldTrack.stems,
                    Model.getDefaultStem(oldTrack.id)
                ]
            });
        case Actions.Types.REMOVE_STEM:
            oldTrack = tracks.find(x=>{return x.id === action.trackId});
            return  Object.assign({},oldTrack,{
                stems:[
                    ...oldTrack.stems.filter(x=>{return x.id!==action.stemId})
                ]
            });
        case Actions.Types.UPDATE_STEM:

            const index = tracks.findIndex(x=>{return x.id === action.trackId});
            oldTrack = tracks[index];
            newTrack = Object.assign({},oldTrack,{
                stems: [...oldTrack.stems].map(x=>{
                    if(x.id===action.stemId){
                        return Object.assign({}, x, action.value);
                    }
                    return x
                })
            });
            const newTracks = [...tracks];
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