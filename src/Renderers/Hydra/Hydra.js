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
    let tracksCode = fullState.tracks.map((x)=>{return trackToCode(x,mixMethod)}).filter(x=>x!==null);
    if(tracksCode.length<1){
        return 'solid(0,0,0,0).out()'
    };

    let code = tracksCode[0];
    for (let i = 1;i<tracksCode.length;i++){
        code = `${code}.${mixMethod}(${tracksCode[i]})`
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
    let stemsCode = track.stems.filter(x=>{return x.on && x.language==="Hydra" && x.code !== ''}).map(stemToCode);
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