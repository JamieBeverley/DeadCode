import EffectModel from "./EffectModel";
import Languages from './Languages';

function clone (stem){
    return {
        ...stem,
        effects:[...stem.effects].map(EffectModel.clone),
    }
}

function getNew(language = Languages.TidalCycles.name){
    return {
        name:'',
        on: false,
        selected:false,
        open:false,
        live:false,
        language,
        code:"",
        effects: [],
        properties:Languages[language].defaultStemProperties
    }
};

const StemModel = {
    getNew,
    clone
}

export default StemModel
