import React from "react";
// import "./index.css";
import EffectModel from "../../model/EffectModel";
import Model from "../../model";
import Languages from "../../model/Languages";
export const Index = {
    language:'Index',
    getCode,
    getMacros
    // getAudienceDom,
};


function getMacros(state) {
    return state.master['Hydra'].macros
}



function getCode(state){
    let mixMethod = state.master.Hydra.properties.mixMethod;

    let tracks = Object.keys(state.tracks).map(x=>{return trackToCode(state, state.tracks[x],mixMethod)}).filter(x=>x);

    let code;
    if(tracks.length>0){
        code = tracks[0];
    }
    for(let i = 1; i<tracks.length; i++){
        code += `.${state.master.Hydra.properties.mixMethod}(${tracks[i]},${1/tracks.length})`;
    }

    let effects = state.master.Hydra.effects.map(x=>{return state.effects[x]}).filter(e=>e.on).map(effectToCode);

    if(!code){
        code = 'solid(0,0,0,0)';
    }
    return code + effects.join("")+".out()";
}

export function trackToCode(state, track){
    let code;
    let stems = track.stems.map(x=>{return state.stems[x]}).filter(x=>{return x.on && x.code!=='' && x.language===Languages.Hydra.name}).map(x=>stemToCode(state,x));
    stems.join(state.master.Hydra.properties.mixMethod+"("+1/stems.length+"")

    if(stems.length>0){
        code = stems[0];
    } else {
        return null;
    }

    for(let i = 1; i<stems.length; i++){
        code += `.${state.master.Hydra.properties.mixMethod}(${stems[i]},${1/stems.length})`;
    }

    let effects = track.effects.map(x=>{return state.effects[x]}).filter(e=>e.on).map(effectToCode);

    return code + effects.join("");
}

export function stemToCode(state, stem){
    let effects = stem.effects.map(x=>{return state.effects[x]}).filter(e=>e.on).map(effectToCode);
    return stem.code + effects.join("");
}



export function effectToCode(effect){
    switch (effect.type) {
        case EffectModel.Types.CODE_TOGGLE:
            return effect.properties.code;
        case EffectModel.Types.SLIDER:
            // TODO make this cleaner
            if(effect.properties.code==='gain'){
                return `.blend(solid(0,0,0,0),${1-effect.properties.value/2})`;
            }
            return  `.${effect.properties.code}(${effect.properties.value})`;
        default:
            debugger
            console.warn("Index renderer not implemented for type " + effect.type);
    }
}

const effectToCodeFuncs  = {}
effectToCodeFuncs[EffectModel.Types.SLIDER] = function(effect){
    return `.${effect.name}(${effect.properties.value})`
}