import React, {Component} from "react";
import EffectModel from "../../model/EffectModel";
import Languages from "../../model/Languages";

function getTempoCode(state) {
    return 'setcps ' + state.master.TidalCycles.properties.tempo / 60 / 2;
}

export const EffectsToCode = {};
EffectsToCode[EffectModel.Types.SLIDER] = (x) => {
    return `(${x.properties.operator} ${x.properties.code} ${x.properties.value})`
}
EffectsToCode[EffectModel.Types.CODE_TOGGLE] = (x) => {
    return `(${x.properties.code})`
}



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
    return code
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
    ;

    stemsCode = stemsCode.join(", ");

    let effectsOn = [];
    track.effects.forEach(e => {
        let effect = state.effects[e];
        if (effect.on) {
            effectsOn.push(effectToCode(effect));
        }
    });
    let effectsCode = effectsOn.join(" $ ");
    return `${effectsCode} $ stack [${stemsCode}]`;
}

function getCode(state) {
    let stems = 'stack [';

    let tracks = Object.keys(state.tracks).map(x => {
        return trackToCode(state, state.tracks[x])
    });

    stems += tracks.filter(x => x !== '').join(", ") + ']';

    let masterEffects = [];
    state.master[Languages.TidalCycles.name].effects.forEach(x => {
        let effect = state.effects[x];
        if (effect.on) {
            masterEffects.push(effectToCode(effect));
        }
    })
    let masterEffectsCode = masterEffects.join(" $ ");

    let code = `d1 $ ${masterEffectsCode}${masterEffects.length ? ' $ ' : ''}${stems}`;
    return code;
}


export const TidalCycles = {
    language: 'TidalCycles',
    getCode,
    trackToCode,
    getTempoCode,
}