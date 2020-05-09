import {ActionTypes} from "../actions";
import EffectModel from "../model/EffectModel";


const getStemPosition = (tracks, stemId) => {
    const trackId = Object.keys(tracks.values).find(x => tracks.values[x].stems.includes(stemId));
    const trackIndex = tracks.order.findIndex(x => x === trackId);
    const stemIndex = tracks.values[trackId].stems.findIndex(x => x === stemId);
    console.log('actions', trackIndex, stemIndex)
    return {trackIndex, stemIndex};
};

const getTrackEffectPosition = (tracks, trackId, effectId) => {
    return {
        trackIndex: tracks.order.findIndex(x => x === trackId),
        effectIndex: tracks.values[trackId].effects.findIndex(x => x === effectId)
    };
};

const stemIsInside = ({left, top, columns, rows}, x, y) => {
    return (x >= left) && (x < (left + columns)) && (y >= top) && (y < (top + rows))
};

const trackEffectIsInside = ({left, columns}, trackIndex, effectIndex) => {
    return trackIndex >= left && trackIndex < (left + columns) && effectIndex < 4;
};

const getEffectTrack = (tracks, effectId) => {
    return Object.keys(tracks.values).find(x => tracks.values[x].effects.includes(effectId));
};

const createOscMiddleware = osc => store => next => action => {
    next(action);
    const {tracks, stems, effects, midi} = store.getState();
    const {type, payload} = action;

    if (type === ActionTypes.STEM_UPDATE && (payload.value.on !== undefined)) {
        const {trackIndex, stemIndex} = getStemPosition(tracks, payload.stemId);
        if (stemIsInside(midi, trackIndex, stemIndex)) {
            osc.toggleStem(trackIndex - midi.left, stemIndex - midi.top, payload.value.on);
        }
    } else if (type === ActionTypes.EFFECT_UPDATE_SLIDER_VALUE) {
        const trackId = getEffectTrack(tracks, payload.effectId);
        if (trackId === -1) return;

        const {trackIndex, effectIndex} = getTrackEffectPosition(tracks, trackId, payload.effectId);
        if (!trackEffectIsInside(midi, trackIndex, effectIndex)) return;

        if (payload.value !== undefined) {
            console.log('value change');
            osc.trackUpdateEffectValue(trackIndex, effectIndex, payload.value);
        }

    } else if (type === ActionTypes.EFFECT_UPDATE) {
        const trackId = getEffectTrack(tracks, payload.effectId);
        if (trackId === -1) return;

        const {trackIndex, effectIndex} = getTrackEffectPosition(tracks, trackId, payload.effectId);
        if (!trackEffectIsInside(midi, trackIndex, effectIndex)) return;

        if (payload.value.properties && payload.value.properties.value !== undefined) {
            console.log('value change');
            osc.trackUpdateEffectValue(trackIndex, effectIndex, payload.value.properties.value);
        }

        if (payload.value.on !== undefined) {
            osc.trackUpdateEffectToggle(trackIndex, effectIndex, payload.value.on);
        }

    } else if (type === ActionTypes.RECEIVE_STATE || type === ActionTypes.MIDI_UPDATE) {
        console.log('MIDI_UPDATE');
        setAllStems(osc, midi, tracks, stems);
        setAllTrackEffects(osc, midi, tracks, effects);
    }

};

const setAllTrackEffects = (osc, {left, top, columns, rows}, tracks, effects) => {
    for (let column = 0; column < columns; column++) {
        const trackId = tracks.order[column + left];
        if (trackId !== undefined) {
            for (let row = 0; row < 4; row++) {
                const effectId = tracks.values[trackId].effects[row];
                if (effectId !== undefined) {
                    const effect = effects[effectId];
                    if (effect.type === EffectModel.Types.SLIDER) {
                        osc.trackUpdateEffectValue(column, row, effect.properties.value);
                        osc.trackUpdateEffectToggle(column, row, effect.on);
                    }

                }
            }
        }
    }
    // for (let column = left; column < (left + columns); column++) {
    //     for (let row = 0; row < 4; row++) {
    //         const trackId = tracks.order[column];
    //         if (trackId) {
    //             const effectId = tracks.values[trackId].effects[row];
    //             if (effectId) {
    //                 const effect = effects[effectId];
    //                 if (effect.type === EffectModel.Types.SLIDER) {
    //                     osc.trackUpdateEffectValue(column, row, effect.properties.value);
    //                     osc.trackUpdateEffectToggle(column, row, effect.on);
    //                 }
    //             }
    //         }
    //     }
    // }
};

const setAllStems = (osc, {left, top, columns, rows}, tracks, stems) => {
    for (let column = 0; column < columns; column++) {
        const trackId = tracks.order[column + left];
        if (trackId !== undefined) {
            for (let row = 0; row < rows; row++) {
                const stemId = tracks.values[trackId].stems[row + top];
                if (stemId !== undefined) {
                    osc.toggleStem(column, row, stems[stemId].on);
                }
            }
        }
    }
    // let i = 0;
    // console.log(left, top, columns, rows);
    // for (let column = left; column < (left + columns); column++) {
    //     for (let row = top; row < (top + rows); row++) {
    //         const trackId = tracks.order[column];
    //         if (trackId!==undefined) {
    //             const stemId = tracks.values[trackId].stems[row];
    //             if (stemId!==undefined) {
    //                 setTimeout(()=>{
    //                     if(stems[stemId].on){
    //                         console.log("toggled", column, row);
    //                     }
    //                     osc.toggleStem(column, row, stems[stemId].on);
    //                 }, i*40);
    //                 i++;
    //             }
    //         }
    //     }
    // }
};

export default createOscMiddleware
