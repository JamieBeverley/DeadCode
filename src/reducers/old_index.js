import Actions from '../actions'
import Model from '../model'


export default (state = Model.defaultState, action) =>{
    let oldTrack, newTrack, newState;

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
                    Object.assign({},Model.getDefaultTrack())
                ]
            }));
        case Actions.Types.REMOVE_TRACK:
            newState =  Object.assign({},state,{
               tracks: [...state.tracks].filter(x=>{return x.id !== action.trackId})
            });
            break;
        case Actions.Types.UPDATE_BOOT_SCRIPT:
            return Object.assign({},state,{bootScript:action.bootScript});
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

            // function insertAt(list,pos, item){
            //     return list.slice(0,pos).concat([item]).concat(list.slice(pos));
            // }


            function pasteStemAtPosition(state, stem, pos){
                if(pos.trackIndex>=state.tracks.length) return state;
                if(pos.stemIndex>=state.tracks[pos.trackIndex].stems.length) return state;
                let track = state.tracks[pos.trackIndex];
                let newStem = Model.cloneStem(stem);
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
                    Model.getDefaultStem(oldTrack.id)
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
            const index = state.tracks.findIndex(x=>{return x.id === action.trackId});
            oldTrack = state.tracks[index];

            newTrack = Object.assign({},oldTrack,{
                stems: [...oldTrack.stems].map(x=>{
                    if(x.id===action.stemId){
                        return Object.assign({}, x, action.value);
                    }
                    return x
                })
            });
            const newTracks = [...state.tracks];
            // const newTracks = Object.assign({},state.tracks);
            newTracks[index] = newTrack;
            newState = Object.assign({},state);
            newState.tracks = newTracks;
            return newState
            // state.tracks = newTracks;
            // state.tracks[index] = newTrack;

            // oldTrack.stems = oldTrack.stems.map(x=>{
            //     if(x.id===action.stemId){
            //         return Object.assign({}, x, action.value);
            //     }
            //     return x
            // });
            // state.tracks[index] = oldTrack;

            // return state;
            // debugger;
            return Object.assign({},state);



            // const oldTrack = state.tracks.find(x=>{return x.id === action.trackId});
            // newTrack = Object.assign({},oldTrack,{
            //     stems: [...oldTrack.stems].map(x=>{
            //         if(x.id===action.stemId){
            //             return Object.assign({}, x, action.value);
            //         }
            //         return x
            //     })
            // });
            // return Object.assign({}, state, {
            //     tracks: state.tracks.map(x=>{return x.id===action.trackId?newTrack:x;})
            // });
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
