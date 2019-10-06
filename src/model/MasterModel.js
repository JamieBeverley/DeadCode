import EffectModel from "./EffectModel";


function getNew(language,properties){
    return {
        macros:'',
        effects:EffectModel.util.defaultEffects[language],
        properties
    }
}

const MasterModel = {getNew};



export default MasterModel;