import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";
import Id from "./Id";
import EffectModel from "./EffectModel";
import StemModel from "./StemModel";
import settings from "./Settings";
import midi from './Midi'
import languages from './LanguageModel'
// import MacroModel from './MacroModel';

const Model = {};

Model.Languages = languages;

const tracks = {};
const stems = {};
const effects = {};

const TidalCycles = MasterModel.getNew(languages.TidalCycles,{tempo:120});
for(let i in EffectModel.util.defaultEffects[languages.TidalCycles]()){
  let effectId = Id.new();
  effects[effectId] = EffectModel.util.defaultEffects[languages.TidalCycles]()[i];
  TidalCycles.effects.push(effectId);
}


const Hydra = MasterModel.getNew(languages.Hydra, {mixMethod:'blend'});
for(let i in EffectModel.util.defaultEffects[languages.Hydra]()){
  let effectId = Id.new();
  effects[effectId] = EffectModel.util.defaultEffects[languages.Hydra]()[i];
  Hydra.effects.push(effectId);
}

const master = {TidalCycles, Hydra};

for (let i = 0; i < 8; i++) {
    let trackId = Id.new();
    tracks[trackId] = TrackModel.getNew();

    // Create Stems for Track
    for (let j = 0; j < 8; j++) {
        let stemId = Id.new();
        stems[stemId] = StemModel.getNew();
        EffectModel.util.defaultEffects[languages.TidalCycles]().forEach(effect => {
            let effectId = Id.new();
            effects[effectId] = effect;
            stems[stemId].effects.push(effectId);
        });
        tracks[trackId].stems.push(stemId);
    }

    // Create Effects for Track
    const defaultEffects = EffectModel.util.defaultEffects[languages.TidalCycles]();
    for(let effectIndex=0; effectIndex<defaultEffects.length; effectIndex++){
        let effectId = Id.new();
        effects[effectId] = EffectModel.util.defaultEffects[languages.TidalCycles]()[effectIndex];
        tracks[trackId].effects.push(effectId);
    }
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
    midi,
    settings
}

export default Model


/*
// model structure:
var a = {
    'connection': {},
    'copy': null,
    'master': {
        languages.TidalCycles: {},
        'Index': {}
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
            language: languages.TidalCycles,
            code: '',
            effects: ['effect_1', 'effect_2']
        }
    },
    'effects': {
        'effect_1': {
            name: '',
            on: false,
            type: EffectModel.Types.SLIDER,
            language: languages.TidalCycles,
            properties: {}
        }
    }
}
*/
