
export const Hydra = {
    name:'Hydra',
    getCode,
    trackToCode,
    stemToCode
};


// export function renderHydra(state){
//     let mixMethod = 'add';
//     let code = getHydraCode(state,mixMethod);
//     console.log(code);
//     eval(code);
// }

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

function trackToCode(track,mixMethod){
    let stemsCode = track.stems.filter(x=>{return x.on && x.language==="Hydra" && x.code !== ''}).map(stemToCode);
    if(stemsCode.length<1){
        return null
    };

    let code = stemsCode[0];
    for (let i = 1;i<stemsCode.length;i++){
        code = `${code}.${mixMethod}(${stemsCode[i]})`
    }
    return code;
}

function stemToCode(stem){
    return stem.code;
}