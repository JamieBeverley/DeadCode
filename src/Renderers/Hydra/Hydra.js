import React from "react";
import "./index.css";
import EffectModel from "../../model/EffectModel";
export const Hydra = {
    language:'Hydra',
    getCode,
    getAudienceDom,
};


function getAudienceDom(state){
    return <div className={'code'}>{Hydra.getCode(state,"blend")}</div>
}

function getCode(fullState, mixMethod){
    let tracksCode = [];
    for(let i in fullState.tracks){
        let track = fullState.tracks[i];
        let code = trackToCode(track, mixMethod);
        if(code){
            tracksCode.push([code,track.gainEffect.properties.value]);
        }
    }

    Object.keys(fullState.tracks);
    // if(tracksCode.length<1){
    //     return 'solid(0,0,0,0).out()'
    // };

    let code = 'solid(0,0,0,0)';

    // [['osc()', 0.5],['noise()',0.7]]

    // 'osc().blend(noise(),'


    for (let i = 0;i<tracksCode.length;i++){
        let trackCode = tracksCode[i][0];
        let blendAmt = tracksCode[i][1];
        code = `${code}.${mixMethod}(${trackCode},${blendAmt})`;
        // code = `${code}.${mixMethod}(${trackCode}, ${blendAmt})`
    }

    code = code+".out()";
    return code;
}


const effectToCodeFuncs  = {}
effectToCodeFuncs[EffectModel.Types.SLIDER] = function(effect){
    return `.${effect.name}(${effect.properties.value})`
}

function effectToCode(effect){
    return effectToCodeFuncs[effect.type](effect);
}

function trackToCode(track,mixMethod){

    let stemsCode = [];
    for(let i in track.stems){
        let x = track.stems[i];
        if(x.on && x.language==='Hydra' && x.code !==''){
            stemsCode.push(stemToCode(x));
        }
    }


    if(stemsCode.length<1){
        return null
    };

    let code = stemsCode[0];
    for (let i = 1;i<stemsCode.length;i++){
        code = `${code}.${mixMethod}(${stemsCode[i]})`
    }
    // const trackGain =
    return code;
}

function stemToCode(stem){
    const effects = stem.effects.filter(x=>x.on).map(effectToCode).join("");

    return stem.code+effects;
}