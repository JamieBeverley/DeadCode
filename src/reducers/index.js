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
    tracks: ([0,0,0,0,0]).map(x=>{return getDefaultTrack()}),
    masterEffects:[
        {
            name:'gain',
            id:uniqueId(),
            on:false,
            operator: "|+|",
            value:0,
            min:-2,
            max:2,
            step:0.01
        },
        {
            name:'lpf',
            operator: "#",
            id:uniqueId(),
            on:false,
            value:22000,
            min:0,
            max:22000,
            step:10
        },
        {
            name:'hpf',
            id:uniqueId(),
            operator: "#",
            on:false,
            value:0,
            min:0,
            max:22000,
            step:10
        }
        ]
};

function getDefaultEffect(name='gain'){
    return {
        name,
        id:uniqueId(),
        on:false,
        value:1,
        min:0,
        max:1,
        step:0.01
    }
}


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
        case Actions.Types.UPDATE_MASTER_EFFECT:
            let i = state.masterEffects.findIndex(x=>x.id===action.value.id);
            state.masterEffects[i] = action.value;
            // let newEffects = state.masterEffects.map(x=>{
            //     if(action.value.id===x.id) {
            //         x = action.value;
            //     }
            //     return x
            // });
            return Object.assign({}, state, {masterEffects: state.masterEffects.concat([])});
        case Actions.Types.TOGGLE_LIVE:
            return Object.assign({},state,{live:action.live});
        case Actions.Types.SAVE:
            console.warn('Not yet implemented '+action.type);
            break;
        case Actions.Types.LOAD:
            return Object.assign({},state,action.newState);
        case Actions.Types.DOWNLOAD:
            // no change to state here....
            return state;
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
