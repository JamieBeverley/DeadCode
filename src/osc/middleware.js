import {ActionTypes} from "../actions";
import EffectModel from "../model/EffectModel";


const getStemPosition = (tracks, stemId) => {
    const trackId = Object.keys(tracks.values).find(x => tracks.values[x].stems.includes(stemId));
    const trackIndex = tracks.order.findIndex(x => x === trackId);
    const stemIndex = tracks.values[trackId].stems.findIndex(x => x === stemId);
    return {trackIndex, stemIndex};
};

const getTrackEffectPosition = (tracks, trackId, effectId) => {
    return {
        trackIndex: tracks.order.findIndex(x => x === trackId),
        effectIndex: tracks.values[trackId].effects.findIndex(x => x === effectId)
    };
};

const stemIsInside = ({left, top, width, height}, x, y) => {
    return (x >= left) && (x < (left + width)) && (y >= top) && (y < (top + height))
};

const trackEffectIsInside = ({left, width}, trackIndex, effectIndex) => {
    return trackIndex >= left && trackIndex < (left + width) && effectIndex < 4;
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
            osc.toggleStem(trackIndex, stemIndex, payload.value.on);
        }
    } else if (type === ActionTypes.EFFECT_UPDATE) {
        const trackId = getEffectTrack(tracks, payload.effectId);
        if (trackId === -1) return;

        const {trackIndex, effectIndex} = getTrackEffectPosition(tracks, trackId, payload.effectId);
        if (!trackEffectIsInside(midi, trackIndex, effectIndex)) return;

        // Value change
        if (payload.value.properties && payload.value.properties.value) {
            osc.trackUpdateEffectValue(trackIndex, effectIndex, payload.value.properties.value);
            // Toggle change:
        } else if (payload.value.on !== undefined) {
            osc.trackUpdateEffectToggle(trackIndex, effectIndex, payload.value.on);
        }
    } else if (type === ActionTypes.RECEIVE_STATE || type === ActionTypes.MIDI_UPDATE) {
        setAllStems(osc, midi, tracks, stems);
        setAllTrackEffects(osc, midi, tracks);
    }
};

const setAllTrackEffects = (osc, {left, top, width, height}, tracks, effects) => {
    for (let column = left; column < (left + width); column++) {
        for (let row = 0; row < 4; row++) {
            const trackId = tracks.order[column]
            if (trackId) {
                const effectId = tracks.values[trackId].effects[row];
                if (effectId) {
                    const effect = effects[effectId];
                    if (effect.type === EffectModel.Types.SLIDER) {
                        osc.trackUpateEffectValue(column, row, effect.properties.value);
                        osc.trackUpateEffectToggle(column, row, effect.on);
                    }
                }
            }
        }
    }
};

const setAllStems = (osc, {left, top, width, height}, tracks, stems) => {
    for (let column = left; column < (left + width); column++) {
        for (let row = top; row < (top + height); row++) {
            const trackId = tracks.order[column];
            if (trackId) {
                const stemId = tracks.values[trackId].stems[row];
                if (stemId) {
                    osc.toggleStem(column, row, stems[stemId].on);
                }
            }
        }
    }
};

export default createOscMiddleware
