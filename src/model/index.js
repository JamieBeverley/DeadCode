import TrackModel from "./TrackModel";
import MasterModel from "./MasterModel";


const languages = ["TidalCycles", "Hydra"];

const master = {
    'TidalCylces':MasterModel.getNew("TidalCylces",
        {
            tempo:120
        }),
    'Hydra': MasterModel.getNew("Hydra")
}

const State = {};

State.defaultState = {
    connection: {
        isConnected:false,
        url:'127.0.0.1',
        port:8001
    },
    copy:null,
    languages,
    master,
    tracks:[0,0,0,0,0].map(x=>{return TrackModel.getNew()})
}

export default State