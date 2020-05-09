import {Actions} from "../actions";


const getTrackEffectId = ({left}, tracks, trackIndex, effectIndex) => {
    return tracks.order[left+trackIndex] ? tracks.values[tracks.order[left+trackIndex]].effects[effectIndex] : undefined;
};

const getStemId = ({left,top}, tracks, trackIndex, stemIndex) => {
    return tracks.order[left+trackIndex]?tracks.values[tracks.order[left+trackIndex]].stems[top+stemIndex]: undefined;
};

function createActions(store) {
    return {
        // Effects
        //                this.actions.trackUpdateEffectValue(trackIndex, effectIndex, value);
        trackEffectSliderValue: (trackIndex, effectIndex, value) => {
            const {tracks,midi} = store.getState();
            const effectId = getTrackEffectId(midi, tracks, trackIndex, effectIndex);
            if (effectId !== undefined) {
                store.dispatch(Actions.effectUpdateSliderValue({effectId, value}))
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
            const {tracks,midi} = store.getState();
            const stemId = getStemId(midi, tracks, trackIndex, stemIndex);
            if(stemId!== undefined){
                store.dispatch(Actions.stemUpdate({stemId, value}));
            }
        },

        // MIDI
        midiLeft: () => {
            const {midi} = store.getState();
            const left = Math.max(0,midi.left - 1);
            store.dispatch(Actions.midiUpdate({left}));
        },
        midiUp: () => {
            const {midi} = store.getState();
            const top = Math.max(0,midi.top - 1);
            store.dispatch(Actions.midiUpdate({top}));
        },
        midiRight: () => {
            const {midi,tracks} = store.getState();
            const left = Math.min(midi.left + 1,tracks.order.length-midi.columns);
            store.dispatch(Actions.midiUpdate({left}));
        },
        midiDown: () => {
            const {midi,tracks} = store.getState();
            const {left,columns} = midi;
            const relevantTracks = tracks.order.filter((x,index)=>{
                const  val = index>=left && index < left+columns;
                if(val){
                    console.log(index)
                }
                return val
            });

            const minTop = Math.min(...relevantTracks.map(x=>{
                return tracks.values[x].stems.length
            }));
            const top = Math.min(minTop-1,midi.top + 1);
            store.dispatch(Actions.midiUpdate({top}));
        },
        midiInit: () => {
            store.dispatch(Actions.midiUpdate({top:0, left:0, rows:8, columns:8}));
        }

    }
}

export default createActions;
