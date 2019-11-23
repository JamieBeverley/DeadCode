
function getNew(type, language, on=false, properties){
    // TODO something to validate that properties object matches the type here
    return {
        type,
        language,
        on,
        properties
    }
}

function clone(effect){
    return {
        ...effect,
        propertes:{...effect.properties}
    }
}

let Types = {
    SLIDER:"SLIDER",
    CODE_TOGGLE:'CODE_TOGGLE'
}

let PropertySpec = {
    'SLIDER':{
        code: "string",
        value: 'float',
        operator: "string",
        min: 'float',
        max: 'float',
        step: 'float',
        scale: 'string' // 'linear' or 'log'
    },
    CODE_TOGGLE: {
        code: 'string',
    }
}

const defaultEffects = {
    'TidalCycles': ()=>{
        return [
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",true,
                {
                    code: "gain",
                    value: 1,
                    operator: "|*",
                    min: 0,
                    max: 2,
                    step: 0.01,
                    scale: 'linear'
                }),
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    code: "lpf",
                    value: 22000,
                    operator: "#",
                    min: 0,
                    max: 22000,
                    step: 10,
                    scale: 'log'
                }),
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    code: "hpf",
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 22000,
                    step: 10,
                    scale: 'log'
                }),
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    code: "coarse",
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 24,
                    step: 1,
                    scale: 'linear'
                }),
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    code: "room",
                    value: 0,
                    operator: "#",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    scale: 'linear'
                }),
            EffectModel.getNew(EffectModel.Types.SLIDER,"TidalCycles",false,
                {
                    code: "size",
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
            EffectModel.getNew(EffectModel.Types.SLIDER,"Hydra",false,
                {
                    code: "kaleid",
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
    PropertySpec,
    util
}

export default EffectModel
