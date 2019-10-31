import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";
import Id from "./Id";
import EffectModel from "./EffectModel";
import StemModel from "./StemModel";


const languages = ["TidalCycles", "Hydra"];

const master = {
    'TidalCycles':MasterModel.getNew("TidalCycles",
        {
            tempo:120
        }),
    'Hydra': MasterModel.getNew("Hydra")
}

const Model = {};

function getNew(name, type, language, on=false, properties){
    return {
        name,
        id:Id.new(),
        on:false,
        type,
        language,
        properties
    }
};

Model.Languages = {
    TidalCycles: "TidalCycles",
    Hydra: "Hydra"
};

const tracks = {};
const stems = {};
const effects = {};
for(let i =0; i<5;i++){
    let trackId = Id.new();
    tracks[trackId] = TrackModel.getNew();
    for(let j = 0; j<5; j++){
        let stemId = Id.new();
        stems[stemId] = StemModel.getNew(trackId);
        for(let k = 0; k < 5; k++){
            let effectId = Id.new();
            effects[effectId] = EffectModel.getNew('',EffectModel.Types.SLIDER,false)
        }

        tracks[trackId].stems.push(stemId);
    }
}

Model.defaultState = {
    connection: {
        isConnected:false,
        url:'127.0.0.1',
        port:8001
    },
    master,
    copy:null,
    tracks,
    stems,
}

export default Model

var a = {
    'connection':{},
    'copy': null,
    'master': {
        'TidalCycles': {},
        'Hydra':{}
    },
    'tracks':{
        'track_1':{
            'name':"new track",
            'stems':['stem_1','stem_2'],
            'effects':['effect_1']
        }
    },
    'stems':{
        'stem_1':{
            name:'',
            on:false,
            selected:false,
            open:false,
            live:false,
            language:'TidalCycles',
            code:'',
            effects:['effect_1','effect_2']
        }
    },
    'effects':{
        'effect_1':{
            name:'',
            on:false,
            type:EffectModel.Types.SLIDER,
            language:'TidalCycles',
            properties:{}
        }
    }
}