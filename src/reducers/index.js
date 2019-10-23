import Actions from '../actions'
import Model from '../model'
import TrackReducer from "./Track";
import ConnectionReducer from "./Connection";
import MasterReducer from "./Master";
import StemModel from "../model/StemModel";


export default (state = Model.defaultState, action) =>{

    // stragglers...
    switch (action.type) {
        case Actions.Types.SAVE:
            return state;
        case Actions.Types.LOAD:
            return Object.assign({}, state, action.newState);
        case Actions.Types.DOWNLOAD:
            return state;
        case Actions.Types.COPY_STEMS:
            return Object.assign({}, state, {copy: action.stems});
        case Actions.Types.PASTE_STEMS:
            if (!state.copy.length) return state;
            // Top left from copied
            // TODO: pretty sure this will just be first b.c. of how copy algorithm works
            let anchorStem = state.copy[0];
            let anchorPos = getStemPosition(anchorStem,state);
            let insertPos = getStemPosition({trackId: action.trackId, id: action.stemId}, state);
            let newState = Object.assign({}, state);
            state.copy.forEach(stem => {
                let position = getStemPosition(stem,state);
                let relativePos = {
                    trackIndex: position.trackIndex - anchorPos.trackIndex,
                    stemIndex: position.stemIndex - anchorPos.stemIndex
                };
                let newPos = {
                    trackIndex: insertPos.trackIndex + relativePos.trackIndex,
                    stemIndex: insertPos.stemIndex + relativePos.stemIndex
                };
                newState = pasteStemAtPosition(newState, stem, newPos);
            });

            return Object.assign({}, state, newState);
    }

    return {
        copy: state.copy,
        master:MasterReducer(state.master, action),
        connection: ConnectionReducer(state.connection, action),
        tracks: TrackReducer(state.tracks, action)
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
