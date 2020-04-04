import MacroModel from './MacroModel';
import EffectModel from "./EffectModel";


function clone (stem){
    return {
        ...stem,
        effects:[...stem.effects].map(EffectModel.clone),
        macros:[...stem.macros].map(MacroModel.clone)
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
        effects: [],
        macros:[]
    }
};

const StemModel = {
    getNew,
    clone
}

export default StemModel
