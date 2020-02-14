import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";
import Id from "./Id";
import EffectModel from "./EffectModel";
import StemModel from "./StemModel";
import settings from "./Settings";
import midi from './Midi'
import Languages from "./Languages";


const Model = {};

const tracks = {};
const stems = {};
const effects = {};

const master = {};


master[Languages.TidalCycles.name] = MasterModel.getNew('TidalCycles',{tempo:120});
master[Languages.Hydra.name] = MasterModel.getNew('Hydra', {mixMethod:'blend'});
master[Languages.SuperCollider.name]  = MasterModel.getNew(Languages.SuperCollider.name, {tempo:120, channels:2});

Object.keys(Languages).forEach(language=>{
    for(let effect in EffectModel.util.defaultEffects[language]()){
        let effectId = Id.new();
        effects[effectId] = EffectModel.util.defaultEffects[language]()[effect];
        master[language].effects.push(effectId);
    }
});
for (let i = 0; i < 8; i++) {
    let trackId = Id.new();
    tracks[trackId] = TrackModel.getNew();
    for (let j = 0; j < 8; j++) {
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
        'TidalCycles': {},
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