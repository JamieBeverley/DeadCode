import Actions from '../actions'
import {uniqueId} from 'lodash';

export function getDefaultTrack (){
    let id = uniqueId();
    return {
        id,
        name:'New Track',
        stems:([0,0,0,0,0]).map(x=>{return getDefaultStem(id)}),
        effects:[
            {
                name:'gain',
                id:uniqueId(),
                on:true,
                scale:'linear',
                operator: "|*",
                value:1,
                min:0,
                max:2,
                step:0.01
            }
        ]
    }
}

function cloneStem(stem){
    return {
        ...stem,
        effects:[...stem.effects].map(x=>{return Object.assign({},x)}),
        id:uniqueId()
    }
}

export function getDefaultStem (trackId){
    return {
        id: uniqueId(),
        trackId,
        name:'',
        on: false,
        selected:false,
        open:false,
        live:false,
        language:'TidalCylces',
        code:"",
        effects:getDefaultEffects()
    }
}

let defaultState = {
    live:true,
    tempo:120,
    copy: null,
    tracks: ([0,0,0,0,0]).map(x=>{return getDefaultTrack()}),
    masterEffects:[
        {
            name:'gain',
            id:uniqueId(),
            on:false,
            scale:'linear',
            operator: "|*",
            value:1,
            min:0,
            max:2,
            step:0.01
        },
        {
            name:'lpf',
            operator: "#",
            id:uniqueId(),
            on:false,
            scale:'log',
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
            scale:'log',
            value:0,
            min:0,
            max:22000,
            step:10
        }
        ],
    connection:{
        isConnected:false,
        url:'127.0.0.1',
        port:8000
    }
};

export function getDefaultEffects(){
    return [
        {
            name:'gain',
            id:uniqueId(),
            on:false,
            scale:'linear',
            operator: "|*",
            value:1,
            min:0,
            max:2,
            step:0.01
        },
        {
            name:'lpf',
            operator: "#",
            id:uniqueId(),
            on:false,
            scale:'log',
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
            scale:'log',
            value:0,
            min:0,
            max:22000,
            step:10
        }
    ];
}

export function getDefaultEffect(name='gain'){
    return {
        name,
        id:uniqueId(),
        on:false,
        scale:'linear',
        operator:"|*",
        value:1,
        min:0,
        max:1,
        step:0.01
    }
}


export default (state = defaultState, action) =>{
    let oldTrack, newTrack, oldFlyout,newFlyout,newState;

    switch (action.type){
        case Actions.Types.CONNECT:
            let connection = {url: action.url, port:action.port, isConnected:action.isConnected};
            return Object.assign({},state,{connection});
        case Actions.Types.UPDATE_TEMPO:
            return Object.assign({},state,{tempo:action.tempo});
        case Actions.Types.ADD_TRACK:
            return (Object.assign({}, state,{
                tracks:[
                    ...state.tracks,
                    Object.assign({},getDefaultTrack())
                ]
            }));
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
        case Actions.Types.COPY_STEMS:
            return Object.assign({},state,{copy:action.stems});
        case Actions.Types.PASTE_STEMS:
            if(!state.copy.length) return state;

            function getStemPosition(stem){
                let trackIndex = state.tracks.findIndex(x=>x.id===stem.trackId);
                let stemIndex = state.tracks[trackIndex].stems.findIndex(x=>x.id===stem.id);
                return {trackIndex, stemIndex}
            }

            function insertAt(list,pos, item){
                return list.slice(0,pos).concat([item]).concat(list.slice(pos));
            }


            function pasteStemAtPosition(state, stem, pos){
                if(pos.trackIndex>=state.tracks.length) return state;
                if(pos.stemIndex>=state.tracks[pos.trackIndex].stems.length) return state;
                let track = state.tracks[pos.trackIndex];
                let newStem = cloneStem(stem);
                newStem.trackId = track.id;
                newStem.open = false;
                track.stems = state.tracks[pos.trackIndex].stems.concat([]);//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
                track.stems[pos.stemIndex] = newStem;//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
                // track.stems[pos.stemIndex] = insertAt(track.stems,pos.stemIndex,newStem);
                return Object.assign({},state,{
                    tracks:state.tracks.map(x=>{
                        if(x.id===track.id){
                            return track
                        }
                        return x
                    })
                })
            }

            // Top left from copied
            // TODO: pretty sure this will just be first b.c. of how copy algorithm works
            let anchorStem = state.copy[0];
            let anchorPos = getStemPosition(anchorStem);
            let insertPos = getStemPosition({trackId:action.trackId,id:action.stemId});
            newState = Object.assign({},state);
            state.copy.forEach(stem=>{
               let position = getStemPosition(stem);
               let relativePos = {
                   trackIndex:position.trackIndex-anchorPos.trackIndex,
                   stemIndex:position.stemIndex-anchorPos.stemIndex
               };
               let newPos = {
                   trackIndex:insertPos.trackIndex+relativePos.trackIndex,
                   stemIndex:insertPos.stemIndex+relativePos.stemIndex
               };
               newState = pasteStemAtPosition(newState, stem,newPos);
            });

            return Object.assign({},state,newState);
        case Actions.Types.ADD_STEM:
            oldTrack = state.tracks.find(x=>{return x.id === action.trackId});
            newTrack = Object.assign({},oldTrack,{
                stems:[
                    ...oldTrack.stems,
                    getDefaultStem(oldTrack.id)
                ]
            });
            return Object.assign({}, state, {
                tracks: [...state.tracks].map(x=>{return x.id===action.trackId?newTrack:x;})
            });
        case Actions.Types.REMOVE_STEM:
            oldTrack = state.tracks.find(x=>{return x.id === action.trackId});
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
            //     return X
            // });
            return Object.assign({}, state, {masterEffects: state.masterEffects.concat([])});
        case Actions.Types.TOGGLE_LIVE:
            return Object.assign({},state,{live:action.live});
        case Actions.Types.SAVE:
            // console.warn('Not yet implemented '+action.type);
            return;
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
