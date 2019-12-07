import React from "react";
import "./index.css";
import EffectModel from "../../model/EffectModel";
import Model from "../../model";
export const Hydra = {
    language:'Hydra',
    getCode,
    getAudienceDom,
};






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

function trackToCode(state, track){
    let code;
    let stems = track.stems.map(x=>{return state.stems[x]}).filter(x=>{return x.on && x.code!=='' && x.language===Model.Languages.Hydra}).map(x=>stemToCode(state,x));
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

function stemToCode(state, stem){
    let effects = stem.effects.map(x=>{return state.effects[x]}).filter(e=>e.on).map(effectToCode);
    return stem.code + effects.join("");
}



function effectToCode(effect){
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
            console.warn("Hydra renderer not implemented for type " + effect.type);
    }
}





function getAudienceDom(state){
    return <div className={'code'}>{Hydra.getCode(state,"blend")}</div>
}

// function getCode(fullState, mixMethod){
//     let tracksCode = [];
//     for(let i in fullState.tracks){
//         let track = fullState.tracks[i];
//         let code = trackToCode(track, mixMethod);
//         if(code){
//             tracksCode.push([code,track.gainEffect.properties.value]);
//         }
//     }
//
//     Object.keys(fullState.tracks);
//
//     let code = 'solid(0,0,0,0)';
//
//     // [['osc()', 0.5],['noise()',0.7]]
//
//     // 'osc().blend(noise(),'
//
//
//     for (let i = 0;i<tracksCode.length;i++){
//         let trackCode = tracksCode[i][0];
//         let blendAmt = tracksCode[i][1];
//         code = `${code}.${mixMethod}(${trackCode},${blendAmt})`;
//         // code = `${code}.${mixMethod}(${trackCode}, ${blendAmt})`
//     }
//
//     code = code+".out()";
//     return code;
// }


const effectToCodeFuncs  = {}
effectToCodeFuncs[EffectModel.Types.SLIDER] = function(effect){
    return `.${effect.name}(${effect.properties.value})`
}
//
// function effectToCode(effect){
//     return effectToCodeFuncs[effect.type](effect);
// }

// function trackToCode(track,mixMethod){
//
//     let stemsCode = [];
//     for(let i in track.stems){
//         let x = track.stems[i];
//         if(x.on && x.language==='Hydra' && x.code !==''){
//             stemsCode.push(stemToCode(x));
//         }
//     }
//
//
//     if(stemsCode.length<1){
//         return null
//     };
//
//     let code = stemsCode[0];
//     for (let i = 1;i<stemsCode.length;i++){
//         code = `${code}.${mixMethod}(${stemsCode[i]})`
//     }
//     // const trackGain =
//     return code;
// }
//
// function stemToCode(stem){
//     const effects = stem.effects.filter(x=>x.on).map(effectToCode).join("");
//
//     return stem.code+effects;
// }