import Id from "./Id";

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

function clone(effect){
    return{
        ...effect,
        id:Id.new()
    }
}

let Types = {
    SLIDER:"SLIDER"
}

const defaultEffects = {
    'TidalCycles': ()=>{
        return [
            EffectModel.getNew("gain",EffectModel.Types.SLIDER,"TidalCycles",true,
                {
                    value: 1,
                    operator: "|*",
                    min: 0,
                    max: 2,
                    step: 0.01,
                    scale: 'linear'
                }),
            EffectModel.getNew("lpf",EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    value: 22000,
                    operator: "#",
                    min: 0,
                    max: 22000,
                    step: 10,
                    scale: 'log'
                }),
            EffectModel.getNew("hpf",EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 22000,
                    step: 10,
                    scale: 'log'
                })
        ]
    },
    'Hydra':()=>{
        return [
            EffectModel.getNew("kaleid",EffectModel.Types.SLIDER,"Hydra",false,
                {
                    value: 1,
                    // operator: "#",
                    min: 0,
                    max: 500,
                    step: 1,
                    scale: 'linear'
                }),
        ]
    }
}

const util = {defaultEffects};

const EffectModel = {
    getNew,
    clone,
    Types,
    util
}

export default EffectModel