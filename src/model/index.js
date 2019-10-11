import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";
import Id from "./Id";


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

Model.defaultState = {
    connection: {
        isConnected:false,
        url:'127.0.0.1',
        port:8001
    },
    copy:null,
    // languages,
    master,
    tracks:[0,0,0,0,0].map(x=>{return TrackModel.getNew()})
}

export default Model