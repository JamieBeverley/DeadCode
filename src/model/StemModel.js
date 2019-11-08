import EffectModel from "./EffectModel";


function clone (stem,trackId){
    return {
        ...stem,
        trackId,
        effects:[...stem.effects].map(EffectModel.clone),
    }
}

function getNew(language = "TidalCycles"){
    return {
        name:'',
        on: false,
        selected:false,
        open:false,
        live:false,
        language,
        code:"",
        effects: []
    }
};

const StemModel = {
    getNew,
    clone
}

export default StemModel
