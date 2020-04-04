import Model from '../model'
import TrackReducer from "./Track";
import ConnectionReducer from "./Connection";
import MasterReducer from "./Master";
import StemReducer from './Stem.js'
import EffectReducer from "./Effect";
import {ActionSpec} from "../actions";
import MidiReducer from "./MIDI";
import SettingsReducer from "./Settings";
import MacroReducer from "./Macros";

const CopyReducer = (copy, action)=>{
    if (action.type==='STEM_COPY'){
        return {type:'stems', items:action.payload.items};
    }
    return copy
};


export default (state = Model.defaultState, action) =>{
    if(action.type === 'LOAD'){
        return action.payload
    } else if (action.type === ActionSpec.RECEIVE_STATE.name){
        return {...action.payload, connection: state.connection};
    }
    return {
        connection: ConnectionReducer(state.connection, action),
        copy: CopyReducer(state.copy,action),
        effects: EffectReducer(state.effects, action),
        macros: MacroReducer(state.macros, action),
        master:MasterReducer(state.master, action),
        midi: MidiReducer(state.midi, action),
        settings: SettingsReducer(state.settings, action),
        stems: StemReducer(state.stems, action),
        tracks: TrackReducer(state.tracks, action)
    }
}



// function pasteStemAtPosition(state, stem, pos) {
//     if (pos.trackIndex >= state.tracks.length) return state;
//     if (pos.stemIndex >= state.tracks[pos.trackIndex].stems.length) return state;
//     let track = state.tracks[pos.trackIndex];
//     let newStem = StemModel.clone(stem);
//     newStem.trackId = track.id;
//     newStem.open = false;
//     track.stems = state.tracks[pos.trackIndex].stems.concat([]);//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
//     track.stems[pos.stemIndex] = newStem;//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
//     return Object.assign({}, state, {
//         tracks: state.tracks.map(x => {
//             if (x.id === track.id) {
//                 return track
//             }
//             return x
//         })
//     })
// }
//
// function getStemPosition(stem, state) {
//     let trackIndex = state.tracks.findIndex(x => x.id === stem.trackId);
//     let stemIndex = state.tracks[trackIndex].stems.findIndex(x => x.id === stem.id);
//     return {trackIndex, stemIndex}
// }


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
