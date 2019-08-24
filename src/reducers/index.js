import Actions from '../actions'
import {uniqueId} from 'lodash';
import Connection from "../Connection";

function getDefaultTrack (){
    let id = uniqueId();
    return {
        id,
        name:'New Track',
        stems:([0,0,0,0,0]).map(x=>{return getDefaultStem(id)}),
        effects:[]
    }
}

function getDefaultStem (trackId){
    return {
        id: uniqueId(),
        trackId,
        name:'',
        on: false,
        open:false,
        live:true,
        language:'TidalCylces',
        code:"",
        effects:[]
    }
}

let defaultState = {
    live:true,
    tracks: ([0,0,0,0,0]).map(x=>{return getDefaultTrack()})
};

export default (state = defaultState, action) =>{
    let oldTrack, newTrack, oldFlyout,newFlyout,newState;
    if(!Connection.ws || !Connection.ws.isOpen){
        Connection.init();
    }
    switch (action.type){
        case Actions.Types.ADD_TRACK:
            newState =  (Object.assign({}, state,{
                tracks:[
                    ...state.tracks,
                    Object.assign({},getDefaultTrack())
                ]
            }));
            break;
        case Actions.Types.REMOVE_TRACK:
            newState =  Object.assign({},state,{
               tracks: [...state.tracks].filter(x=>{return x.id !== action.trackId})
            });
            break;
        case Actions.Types.UPDATE_TRACK:
            oldTrack = state.tracks.find(x=>{return x.id === action.value.id});
            newTrack = Object.assign({},oldTrack,action.value);
            return Object.assign({},state,{
                tracks: state.tracks.map(x=>{
                    if(x.id === newTrack.id){
                        return newTrack
                    }
                    return x
                })
            });
        case Actions.Types.ADD_STEM:
            oldTrack = state.tracks.filter(x=>{return x.id === action.trackId});
            newTrack = Object.assign({},oldTrack,{
                stems:[
                    ...oldTrack.stems,
                    getDefaultStem(newTrack.id)
                ]
            });
            return Object.assign({}, state, {
                tracks: [...state.tracks].map(x=>{return x.id===action.trackId?newTrack:x;})
            });
        case Actions.Types.REMOVE_STEM:
            oldTrack = state.tracks.filter(x=>{return x.id === action.trackId});
            newTrack = Object.assign({},oldTrack,{
                stems:[
                    ...oldTrack.stems.filter(x=>{return x.id!==action.stemId})
                ]
            });
            return Object.assign({}, state, {
                tracks: state.tracks.map(x=>{return x.id===action.trackId?newTrack:x;})
            });
        case Actions.Types.UPDATE_STEM:
            oldTrack = state.tracks.find(x=>{return x.id === action.trackId});
            newTrack = Object.assign({},oldTrack,{
                stems: [...oldTrack.stems].map(x=>{
                    if(x.id===action.stemId){
                        if(x.open !== action.value.open){
                            newFlyout = x.id+'_'+x.trackId;
                        }
                        return Object.assign({}, x, action.value);
                    }
                    return x
                })
            });
            return Object.assign({}, state, {
                tracks: state.tracks.map(x=>{return x.id===action.trackId?newTrack:x;})
            });
        case Actions.Types.TOGGLE_LIVE:
            return Object.assign({},state,{live:action.live});
        //         // case Actions.Types.OPEN_IN_FLYOUT:
        //     oldTrack = state.tracks.find(x=>{return x.id === action.trackId});
        //     newTrack = Object.assign({},oldTrack,{
        //         stems: [...oldTrack.stems].map(x=>{
        //             return x.id===action.stemId?Object.assign({},x,action.):x
        //         })
        //     });
        //     return Object.assign({}, state, {
        //         tracks: state.tracks.map(x=>{return x.id===action.trackId?newTrack:x;})
        //     });
        // case Actions.Types.CLOSE_IN_FLYOUT:
        //     newFlyout = Object.assing({}, state.flyout,{
        //         open: [...state.flyout.open].filter(x=>{return x.trackId !== action.trackId && x.stemId !== action.stemId})
        //     });
        //     return Object.assign({}, state, {
        //         flyout:newFlyout
        //     });
        case Actions.Types.SAVE:
            console.warn('Not yet implemented '+action.type);
            break;
        default:
            console.warn('Unrecognized or unimplemented action: '+action.type);
            console.log(Actions.Types);
            console.log(action);
            return state;
    }
}


/*
Actions:
______________
add track
add stem row
update value
open in flyout
close in flyout
save
load

Store:
____________
 */
