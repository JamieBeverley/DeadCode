import Id from "./Id";
import EffectModel from "./EffectModel";





function clone (stem,trackId){
    return {
        ...stem,
        id:Id.new(),
        trackId,
        effects:[...stem.effects].map(EffectModel.clone),
    }
}

function getNew(trackId, language = "TidalCycles"){
    return {
        id: Id.new(),
        trackId,
        name:'',
        on: false,
        selected:false,
        open:false,
        live:false,
        language,
        code:"",
        effects: EffectModel.util.defaultEffects[language]()
    }
};

const StemModel = {
    getNew,
    clone
}

export default StemModel