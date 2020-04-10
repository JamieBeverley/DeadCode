

const EffectReducer = (effects, action) => {
    const payload = action.payload;
    if (action.type === 'EFFECT_UPDATE') {
        effects[action.payload.effectId] = Object.assign({}, effects[action.payload.effectId], action.payload.value);
        return {...effects};
    } else if (action.type === 'EFFECT_UPDATE_SLIDER_VALUE'){
        const effect = effects[action.payload.effectId];
        effects[action.payload.effectId] = {...effect, properties:{...effect.properties, value:payload.value}};
        return {...effects}
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
    } else if (action.type === 'TRACK_DELETE_STEM') {
        payload.effects.forEach(effectId=>{
            delete effects[effectId]
        });
        return {...effects}
    }  else if (action.type === 'TRACK_DELETE') {
        payload.effects.forEach(effectId=>{
            delete effects[effectId]
        });
        return {...effects}
    }
    return effects;
};

export default EffectReducer
