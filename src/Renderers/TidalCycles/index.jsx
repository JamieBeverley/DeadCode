import React from "react";
import './index.css';

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
    let tracks = state.tracks.map(trackToDom).filter(x=>x);
    tracks = tracks.map(x=>[x,","]).flat().slice(0,-1);

    let effects = state.masterEffects.filter(effect=>effect.on).map(effectToDom).filter(x=>x);
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
    let stems = track.stems.filter(stem=>{return stem.on && stem.language==="TidalCycles"}).map(stemToDom).filter(x=>x);
    if(!stems.length){
        return null;
    }
    stems = stems.map(x=>[x,","]).flat().slice(0,-1);
    let effects = track.effects.filter(effect=>effect.on).map(effectToDom).filter(x=>x);
    effects = effects.map(x=>{return [x," . "]}).flat().slice(0,-1);

    return (
        <div key={track.id} className="trackCode">

            {effects} {effects.length?" $ ":" "}
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
    return 'setcps ' +state.tempo/60/2;
}


function effectToCode(x){
    return `(${x.operator} ${x.name} ${x.value})`
}

function stemToCode(stem){
    let effectsOn = stem.effects.filter(x=>x.on);
    let code = effectsOn.map(effectToCode).join(" $ ");
    code += effectsOn.length?' $ ':'';
    code += stem.code;
    return code
}

function trackToCode(track){
    let stemsCode = track.stems.filter(x=>{return x.on&&(x.language==="TidalCycles")&&x.code!==""}).map(stemToCode).join(", ");
    if (stemsCode ===''){
        return ''
    }

    let trackEffects = track.effects.map(effectToCode).join(" $ ");
    let effectsCode= trackEffects + (track.effects.length?" $ ":"");
    return `${effectsCode} stack [${stemsCode}]`;
}

function getCode(state){
    let stems = 'stack [';
    let tracks = state.tracks.map(trackToCode).filter(x=>x!=='');
    stems += tracks.join(", ")+']';

    let onMasterEffects = state.masterEffects.filter(x=>x.on);
    let masterEffects = onMasterEffects.map(effectToCode).join(" $ ");

    let code = `d1 $ ${masterEffects}${onMasterEffects.length?' $ ':''}${stems}`;
    return code;
}