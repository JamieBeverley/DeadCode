function getNew(code, type, language, on=false, properties){
    return {
        code,
        on,
        type,
        language,
        properties
    }
};

function clone(effect){
    return {
        ...effect,
        propertes:{...effect.properties}
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
                }),
            EffectModel.getNew("coarse",EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 24,
                    step: 1,
                    scale: 'linear'
                }),
            EffectModel.getNew("room",EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    scale: 'linear'
                }),
            EffectModel.getNew("size",EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    scale: 'linear'
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
                    max: 50,
                    step: 1,
                    scale: 'linear'
                }),
            EffectModel.getNew('pixelate',EffectModel.Types.SLIDER,'Hydra',false,{
                value:1,
                min:0,
                max:200,
                step:1,
                scale:'linear'
            })
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
