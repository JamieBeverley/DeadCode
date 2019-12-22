import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";
import Id from "./Id";
import EffectModel from "./EffectModel";
import StemModel from "./StemModel";

import midi from './Midi'


const Model = {};

Model.Languages = {
    TidalCycles: "TidalCycles",
    Hydra: "Hydra"
};

const tracks = {};
const stems = {};
const effects = {};

const TidalCycles = MasterModel.getNew('TidalCycles',{tempo:120});
for(let i in EffectModel.util.defaultEffects['TidalCycles']()){
  let effectId = Id.new();
  effects[effectId] = EffectModel.util.defaultEffects['TidalCycles']()[i];
  TidalCycles.effects.push(effectId);
}


const Hydra = MasterModel.getNew('Hydra', {mixMethod:'blend'});
for(let i in EffectModel.util.defaultEffects['Hydra']()){
  let effectId = Id.new();
  effects[effectId] = EffectModel.util.defaultEffects['Hydra']()[i];
  Hydra.effects.push(effectId);
}

const master = {TidalCycles, Hydra}

for (let i = 0; i < 5; i++) {
    let trackId = Id.new();
    tracks[trackId] = TrackModel.getNew();
    for (let j = 0; j < 5; j++) {
        let stemId = Id.new();
        stems[stemId] = StemModel.getNew();
        EffectModel.util.defaultEffects['TidalCycles']().forEach(effect => {
            let effectId = Id.new();
            effects[effectId] = effect;
            stems[stemId].effects.push(effectId);
        });
        tracks[trackId].stems.push(stemId);
    }
    let mainEffectId = Id.new();
    effects[mainEffectId] = EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", true, {
        code: 'gain',
        value: 1,
        operator: "|*",
        min: 0,
        max: 2,
        step: 0.01,
        scale: 'linear'
    });
    tracks[trackId].effects.push(mainEffectId);
}




Model.defaultState = {
    connection: {
        isConnected: false,
        url:'',
        port: 8001
    },
    master,
    copy: null,
    tracks,
    stems,
    effects,
    midi
}

export default Model


/*
// model structure:
var a = {
    'connection': {},
    'copy': null,
    'master': {
        'TidalCycles': {},
        'Hydra': {}
    },
    'tracks': {
        'track_1': {
            'name': "new track",
            'stems': ['stem_1', 'stem_2'],
            'effects': ['effect_1']
        }
    },
    'stems': {
        'stem_1': {
            name: '',
            on: false,
            selected: false,
            open: false,
            live: false,
            language: 'TidalCycles',
            code: '',
            effects: ['effect_1', 'effect_2']
        }
    },
    'effects': {
        'effect_1': {
            name: '',
            on: false,
            type: EffectModel.Types.SLIDER,
            language: 'TidalCycles',
            properties: {}
        }
    }
}
*/