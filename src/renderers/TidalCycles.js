import Connection from "../Connection";

// export function renderTidalCycles(state){
//     let tidalState = state.tracks.map(track=>{
//         let newStems = track.stems.filter(x=> x.on && x.language==="TidalCycles");
//         track.stems = newStems;
//         return track
//     });
//     let code = getTidalCode(tidalState);
//     Connection.sendCode(code);
// }




export function renderTidalCyclesTempoChange(state){
    Connection.sendCode(getTempoCode(state));
};

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
    let stemsCode = track.stems.filter(x=>{return x.on&&(x.language==="TidalCylces")&&x.code!==""}).map(stemToCode).join(", ");
    if (stemsCode ===''){
        return ''
    }

    let trackEffects = track.effects.map(effectToCode).join(" $ ");
    let effectsCode= trackEffects + (track.effects.length?" $ ":"");
    return `${effectsCode} stack [${stemsCode}]`;
}

export function getTidalCyclesCode(state){
    let stems = 'stack [';
    let tracks = state.tracks.map(trackToCode).filter(x=>x!=='');
    stems += tracks.join(", ")+']';

    let onMasterEffects = state.masterEffects.filter(x=>x.on);
    let masterEffects = onMasterEffects.map(effectToCode).join(" $ ");

    let code = `d1 $ ${masterEffects}${onMasterEffects.length?' $ ':''}${stems}`;
    return code;
}