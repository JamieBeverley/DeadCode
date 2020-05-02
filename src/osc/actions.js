import {Actions} from "../actions";


const getTrackEffectId = (tracks, trackIndex, effectIndex) => {
    return tracks.order[trackIndex] ? tracks.values[tracks.order[trackIndex]].effects[effectIndex] : undefined;
};

const getStemId = (tracks, trackIndex, stemIndex) => {
    return tracks.order[trackIndex]?tracks.values[tracks.order[trackIndex]].stems[stemIndex]: undefined;
};

function createActions(store) {
    return {
        // Effects
        //                this.actions.trackUpdateEffectValue(trackIndex, effectIndex, value);
        trackEffectSliderValue: (trackIndex, effectIndex, value) => {
            const tracks = store.getState().tracks;
            const effectId = getTrackEffectId(tracks, trackIndex, effectIndex);
            if (effectId !== undefined) {
                console.log(value,effectId);
                store.dispatch(Actions.effectUpdateSliderValue({effectId, value: {properties: {value}}}))
            }
        },
        //  this.actions.trackUpdateEffectToggle(trackIndex, effectIndex, on);
        trackEffectToggle: (trackIndex, effectIndex, on) => {
            const tracks = store.getState().tracks;
            const effectId = getTrackEffectId(tracks, trackIndex, effectIndex);
            if (effectId !== undefined) {
                store.dispatch(Actions.effectUpdate({effectId, value: {on}}))
            }
        },
        // Stem
        stemUpdate: (trackIndex, stemIndex, value) => {
            const tracks = store.getState().tracks;
            const stemId = getStemId(tracks, trackIndex, stemIndex);
            if(stemId!== undefined){
                store.dispatch(Actions.stemUpdate({stemId, value}));
            }
        },

        // MIDI
        midiLeft: () => {
            const {midi} = store.getState();
            const left = midi.left - 1;
            store.dispatch(Actions.midiUpdate({left}));
        },
        midiUp: () => {
            const {midi} = store.getState();
            const top = midi.top + 1
            store.dispatch(Actions.midiUpdate({top}));
        },
        midiRight: () => {
            const {midi} = store.getState();
            const left = midi.left + 1;
            store.dispatch(Actions.midiUpdate({left}));
        },
        midiDown: () => {
            const {midi} = store.getState();
            const top = midi.top + 1;
            store.dispatch(Actions.midiUpdate({top}));
        },

    }
}

export default createActions;
