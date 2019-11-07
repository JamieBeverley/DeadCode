import Actions from '../actions'
import Model from '../model'
import TrackReducer from "./Track";
import ConnectionReducer from "./Connection";
import MasterReducer from "./Master";
import StemModel from "../model/StemModel";
import StemReducer from './Stem.js'
import EffectReducer from "./Effect";

export default (state = Model.defaultState, action) =>{
    return {
        copy: state.copy,
        master:MasterReducer(state.master, action),
        connection: ConnectionReducer(state.connection, action),
        tracks: TrackReducer(state.tracks, action),
        stems: StemReducer(state.stems, action),
        effects: EffectReducer(state.effects, action)
    }
}



function pasteStemAtPosition(state, stem, pos) {
    if (pos.trackIndex >= state.tracks.length) return state;
    if (pos.stemIndex >= state.tracks[pos.trackIndex].stems.length) return state;
    let track = state.tracks[pos.trackIndex];
    let newStem = StemModel.clone(stem);
    newStem.trackId = track.id;
    newStem.open = false;
    track.stems = state.tracks[pos.trackIndex].stems.concat([]);//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
    track.stems[pos.stemIndex] = newStem;//insertAt(state.tracks[pos.trackIndex].stems,pos.stemIndex,newStem).concat([]);
    return Object.assign({}, state, {
        tracks: state.tracks.map(x => {
            if (x.id === track.id) {
                return track
            }
            return x
        })
    })
}

function getStemPosition(stem, state) {
    let trackIndex = state.tracks.findIndex(x => x.id === stem.trackId);
    let stemIndex = state.tracks[trackIndex].stems.findIndex(x => x.id === stem.id);
    return {trackIndex, stemIndex}
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
