import React from "react";
import './index.css';
import Model from "../../model";
import EffectModel from "../../model/EffectModel";

export const TidalCycles = {
    language: 'TidalCycles',
    getCode,
    trackToCode,
    getTempoCode,
    getAudienceDom
}

// function getAudienceDom(state){
//
//     let masterEffects = state.masterEffects.map(effectToCode).join(" $ ");
//     masterEffects= masterEffects + (state.masterEffects.length?" $ ":"");
//
//     let stack = <span>{`d1 ${masterEffects} stack [`}</span>
//     let stems = state.tracks.map(t=>t.stems).flat().filter(x=>{return x.on && x.language==='TidalCycles'}).map(stem=>{
//         return [
//             <div key={stem.id} className={'indented'}>{stemToCode(stem)}</div>,
//             (<div key={stem.id+"_c"} style={{display:'inline-block'}}>{','}</div>)
//         ]
//     });
//
//     stems = stems.flat();
//     stems = stems.slice(0,-1);
//
//     return (
//         <div>
//             {stack}
//             {stems}
//             ]
//         </div>
//     )
// }

function getAudienceDom(state){
    // let effects = state.masterEffects.filter(effect=>effect.on).map(effectToDom).filter(x=>{return x!=null});
    let tracks = [];
    for(let i in state.tracks){
        let trackDom = trackToDom((state.tracks[i]));
        if(trackDom){
            tracks.push(trackDom);
            tracks.push(",");
        }
    }
    tracks = tracks.slice(0,-1);

    let effects = state.master[Model.Languages.TidalCycles].effects.filter(effect=>effect.on).map(effectToDom).filter(x=>x);
    effects = effects.map(x=>{return [x," . "]}).flat().slice(0,-1);


    return (
        <div className={'code TidalCycles'}>

            d1 $ {effects} {effects.length?"$":""} stack [
            {tracks}
            ]

        </div>
    )

}

function trackToDom(track){
    let stems = [];
    for(let i in track.stems){
        let stem = track.stems[i];
        if(stem.on && stem.language === 'TidalCycles'){
            let code = stemToCode(stem);
            if(code){
                stems.push(code);
            }
        }
    }

    if(!stems.length){
        return null;
    }
    stems = stems.map(x=>[x,","]).flat().slice(0,-1);
    let trackGain = `(|* gain ${track.gainEffect.properties.value*2})`;
    return (
        <div key={track.id} className="trackCode">

            {trackGain} {" $ "}
            stack [
            {stems}
            ]
        </div>
    )
}

function stemToDom(stem){
    const code = stemToCode(stem);
    if(code==='' || code ==='silence'){
        return null;
    }

    let effects = stem.effects.filter(effect=>effect.on).map(effectToDom).filter(x=>x);
    effects = effects.map(x=>{return [x," . "]}).flat().slice(0,-1);
    return (
        <div key={stem.id} className="stemCode">
            {effects} {code}
        </div>
    )

}

function effectToDom(effect){
    if (!effect.on) {return null}
    let code = effectToCode(effect);
    return (
        <div className={'effectCode'}>{code}</div>
    )
}

function getTempoCode(state){
    return 'setcps ' + state.master.TidalCycles.properties.tempo/60/2;
}

const EffectsToCode = {};
EffectsToCode[EffectModel.Types.SLIDER] = (x)=>{
    return `(${x.properties.operator} ${x.properties.code} ${x.properties.value})`
}
EffectsToCode[EffectModel.Types.CODE_TOGGLE] = (x)=>{
    return `(${x.properties.code})`
}


function effectToCode(x){
    return EffectsToCode[x.type](x)
}

function stemToCode(state, stem){
    if(stem.code==='') {return ''}
    let effectsOn = [];
    stem.effects.forEach(e=>{
        let effect = state.effects[e];
        if(effect.on){
            effectsOn.push(effectToCode(effect));
        }
    });
    let code = effectsOn.join(" $ ");
    code += effectsOn.length?' $ ':'';
    code += stem.code;
    return code
}

function trackToCode(state, track){
    let stemsCode = [];
    track.stems.forEach(x=> {
        let stem = state.stems[x];
        if (stem.on && stem.language === 'TidalCycles') {
            stemsCode.push(stemToCode(state, stem))
        }
    });
    if (stemsCode.length<1){return ''};

    stemsCode = stemsCode.join(", ");

    let effectsOn = [];
    track.effects.forEach(e=>{
        let effect = state.effects[e];
        if(effect.on){
            effectsOn.push(effectToCode(effect));
        }
    });
    let effectsCode = effectsOn.join(" $ ");
    return `${effectsCode} $ stack [${stemsCode}]`;
}

function getCode(state){
    let stems = 'stack [';

    let tracks = Object.keys(state.tracks).map(x=>{return trackToCode(state, state.tracks[x])});

    stems += tracks.filter(x=>x!=='').join(", ")+']';

    let masterEffects = [];
    let onMasterEffects = state.master[Model.Languages.TidalCycles].effects.forEach(x=> {
        let effect = state.effects[x];
        if(effect.on){
            masterEffects.push(effectToCode(effect));
        }
    })
    let masterEffectsCode = masterEffects.join(" $ ");

    let code = `d1 $ ${masterEffectsCode}${masterEffects.length?' $ ':''}${stems}`;
    return code;
}