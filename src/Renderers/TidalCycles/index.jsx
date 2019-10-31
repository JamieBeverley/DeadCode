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
//                 ]
//     });
//
//     stems = stems.flat();
//     stems = stems.slice(0,-1);
//
//     return (
//         <div>
//             {stack}
//             {stems}
//                 ]
//         </div>
//     )
// }

// function renderTidalCyclesBootScript(state){
//     Connection.sendCode(state.bootScript);
// }
//
// function renderTidalCyclesTempoChange(state){
//     Connection.sendCode(getTempoCode(state));
// };

function getTempoCode(state){
    return 'setcps ' + state.master.TidalCycles.properties.tempo/60/2;
}


const EffectsToCode = {};
EffectsToCode[EffectModel.Types.SLIDER] = (x)=>{
    return `(${x.properties.operator} ${x.name} ${x.properties.value})`
}


function effectToCode(x){
    return EffectsToCode[x.type](x)
}

function stemToCode(stem){
    let effectsOn = stem.effects.filter(x=>x.on);
    let code = effectsOn.map(effectToCode).join(" $ ");
    code += effectsOn.length?' $ ':'';
    code += stem.code;
    return code
}

function trackToCode(track){
    // let stemsCode = track.stems.filter(x=>{return x.on&&(x.language==="TidalCycles")&&x.code!==""}).map(stemToCode).join(", ");
    let stemsCode = [];
    for(let i in track.stems){
        let s = track.stems[i]
        if(s.on && s.language==='TidalCycles' && s.code!==''){
            stemsCode.push(stemToCode(s));
        }
    }
    stemsCode = stemsCode.join(", ");

    if (stemsCode ===''){
        return ''
    }
    // let trackGain = effectToCode(track.gainEffect);
    let trackGain = `(|* gain ${track.gainEffect.properties.value*2} )`;
    return `${trackGain} $ stack [${stemsCode}]`;
}

function getCode(state){
    let stems = 'stack [';

    let tracks = [];
    for(let i in state.tracks){
        tracks.push(trackToCode(state.tracks[i]));
    }

    stems += tracks.filter(x=>x!=='').join(", ")+']';

    let onMasterEffects = state.master[Model.Languages.TidalCycles].effects.filter(x=>x.on);
    let masterEffects = onMasterEffects.map(effectToCode).join(" $ ");

    let code = `d1 $ ${masterEffects}${onMasterEffects.length?' $ ':''}${stems}`;
    console.log("Tidalcycles: ", code);
    return code;
}