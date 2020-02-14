import EffectModel from "../../model/EffectModel";
import Languages from "../../model/Languages";


function getTempoCode(state) {
    return 'TempoClock.default.tempo = ' + state.master.SuperCollider.properties.tempo / 60 / 2;
}

function getCode(state) {

    let trackDefs = Object.keys(state.tracks).map(trackId => getTrackDefs(state, state.tracks[trackId], trackId));
    let trackOuts = Object.keys(state.tracks).map(trackId => `Ndef(\\t_${trackId}_out)`);
    return `
    ${trackDefs.join("\n")}
    Ndef('deadcode_master',{${trackOuts.join(".ar + ")};}).play();
    `;
}

function getTrackDefs(state, track, id) {
    let stemOuts = [];
    let stemDefs = [];
    track.stems.forEach(stemId => {
        const stem = state.stems[stemId];
        if (stem.language === Languages.SuperCollider.name) {
            stemOuts.push(`Ndef(\\s_${stemId}_out)`);
            stemDefs.push(getStemDefs(state, stem, stemId))
        }
    });

    return `
    ${stemDefs.join('\n')}
    Ndef(\\t_${id}, {${stemOuts.length?stemOuts.join(" + "):0}});
    Ndef(\\t_${id}_out, {Ndef(\\t_${id})});
    `;
}

function getStemDefs(state, stem, id) {
    return `
    Ndef(\\s_${id}, {${stem.on?stem.code:0}});
    Ndef(\\s_${id}_out, {Ndef(\\s_${id})});
    `
}

export const SuperCollider = {
    language: Languages.SuperCollider.name,
    getCode,
    getTempoCode
}