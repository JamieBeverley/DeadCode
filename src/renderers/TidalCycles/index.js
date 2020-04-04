import React, {Component} from "react";
import Model from "../../model";
import EffectModel from "../../model/EffectModel";

function getTempoCode(state) {
    return 'setcps ' + state.master.TidalCycles.properties.tempo / 60 / 2;
}

export const EffectsToCode = {};
EffectsToCode[EffectModel.Types.SLIDER] = (x) => {
    return `(${x.properties.operator} ${x.properties.code} ${x.properties.value})`
};

EffectsToCode[EffectModel.Types.CODE_TOGGLE] = (x) => {
    return `(${x.properties.code})`
};



function effectToCode(x) {
    return EffectsToCode[x.type](x)
}

function stemToCode(state, stem) {
    if (stem.code === '') {
        return null
    }
    let effectsOn = [];
    stem.effects.forEach(e => {
        let effect = state.effects[e];
        if (effect.on) {
            effectsOn.push(effectToCode(effect));
        }
    });
    let code = effectsOn.join(" $ ");
    code += effectsOn.length ? ' $ ' : '';
    code += stem.code;
    return stem.macros.map(x=>state.macros[x]).reduce((acc,macro)=>{
        return acc.split(macro.placeholder).join(macro.value);
    }, code);
}

function trackToCode(state, track) {
    let stemsCode = [];
    track.stems.forEach(x => {
        let stem = state.stems[x];
        if (stem.on && stem.code !== '' && stem.language === 'TidalCycles') {
            stemsCode.push(stemToCode(state, stem))
        }
    });
    if (stemsCode.length < 1) {
        return ''
    }
    stemsCode = stemsCode.join(", ");
    const effectsOn = [];
    track.effects.forEach(e => {
        let effect = state.effects[e];
        if (effect.on) {
            effectsOn.push(effectToCode(effect));
        }
    });
    const effectsCode = `${effectsOn.join(' $ ')} ${effectsOn.length?' $ ':''}`;
    const preMacro = `${effectsCode} stack [${stemsCode}]`;
    return track.macros.map(x=>state.macros[x]).reduce((acc,macro)=>{
       return acc.split(macro.placeholder).join(macro.value);
    }, preMacro);
}

function getCode(state) {
    let stems = 'stack [';

    const tracks = Object.keys(state.tracks).map(x => {
        return trackToCode(state, state.tracks[x])
    });

    stems += tracks.filter(x => x !== '').join(", ") + ']';

    const masterEffects = [];
    const master = state.master[Model.Languages.TidalCycles];
    master.effects.forEach(x => {
        let effect = state.effects[x];
        if (effect.on) {
            masterEffects.push(effectToCode(effect));
        }
    });
    const masterEffectsCode = masterEffects.join(" $ ");

    const preMacro = `${masterEffectsCode}${masterEffects.length ? ' $ ' : ''}${stems}`;
    const code = master.macros.map(x=>state.macros[x]).reduce((acc,macro)=>{
        return acc.split(macro.placeholder).join(macro.value);
    }, preMacro);
    return `d1 $ ${code}`;
}


export const TidalCycles = {
    language: 'TidalCycles',
    getCode,
    trackToCode,
    getTempoCode,
}
