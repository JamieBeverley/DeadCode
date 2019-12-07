

const EffectReducer = (effects, action) => {
    if (action.type === 'EFFECT_UPDATE') {
        effects[action.payload.effectId] = Object.assign({}, effects[action.payload.effectId], action.payload.value);
        return {...effects};
    } else if (action.type === "STEM_ADD_EFFECT") {
        effects[action.payload.effectId] = action.payload.value;
        return {...effects};
    } else if (action.type === "STEM_DELETE_EFFECT") {
        delete effects[action.payload.effectId];
        return {...effects}
    } else if (action.type === 'TRACK_ADD_EFFECT') {
        effects[action.payload.effectId] = action.payload.value;
        return {...effects};
    } else if (action.type === "TRACK_DELETE_EFFECT") {
        delete effects[action.payload.effectId];
        return {...effects}
    } else if (action.type === "MASTER_ADD_EFFECT") {
        effects[action.payload.effectId] = action.payload.value;
        return {...effects};
    }
    return effects;
}
export default EffectReducer