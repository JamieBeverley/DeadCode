import Actions from '../actions'
import {uniqueId} from 'lodash';

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
        name:'new stem',
        on: false,
        language:'TidalCylces',
        code:"",
        effects:[]
    }
}

let defaultState = {
    tracks: ([0,0,0,0,0]).map(x=>{return getDefaultTrack()}),
    flyout:{
        open:[]
    }
};

export default (state = defaultState, action) =>{
    let oldTrack, newTrack, oldFlyout,newFlyout;
    switch (action.type){
        case Actions.Types.ADD_TRACK:
            return (Object.assign({}, state,{
                tracks:[
                    ...state.tracks,
                    Object.assign({},getDefaultTrack())
                ]
            }));
        case Actions.Types.REMOVE_TRACK:
            return Object.assign({},state,{
               tracks: [...state.tracks].filter(x=>{return x.id !== action.trackId})
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
                    return x.id===action.stemId?Object.assign({},x,action.value):x
                })
            });
            return Object.assign({}, state, {
                tracks: state.tracks.map(x=>{return x.id===action.trackId?newTrack:x;})
            });
        case Actions.Types.OPEN_IN_FLYOUT:
            newFlyout = Object.assign({},state.flyout,{
                open:[
                    {trackId:action.trackId, stemId:action.stemId},
                    ...state.flyout.open
                ]
            });
            return Object.assign({}, state, {
                flyout:newFlyout
            });
        case Actions.Types.CLOSE_IN_FLYOUT:
            newFlyout = Object.assing({}, state.flyout,{
                open: [...state.flyout.open].filter(x=>{return x.trackId !== action.trackId && x.stemId !== action.stemId})
            });
            return Object.assign({}, state, {
                flyout:newFlyout
            });
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
