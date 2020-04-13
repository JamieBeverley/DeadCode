import {languages} from "./old_state";
import Languages from "./LanguageModel";

function getNew(type, language, on = false, properties) {
    // TODO something to validate that properties object matches the type here
    return {
        type,
        language,
        on,
        properties
    }
}

function clone(effect) {
    return {
        ...effect,
        properties: {...effect.properties}
    }
}

const Types = {
    CODE_TOGGLE: 'CODE_TOGGLE',
    SLIDER: "SLIDER",
};

const SliderTypes = {
  float:'float',
  int:'int'
};

let PropertySpec = {
    'SLIDER': {
        code: "string",
        value: 'float',
        operator: "string",
        min: 'float',
        max: 'float',
        step: 'float',
        scale: 'string', // 'linear' or 'log'
        type:'string' // 'float' or 'int'
    },
    CODE_TOGGLE: {
        code: 'string',
    },
    CODE_SLIDER: {
        code: 'string',
        indices: 'array',
        value: 'float',
        min: 'float',
        max: 'float',
        step: 'float',
        scale: 'string'
    }
};

const defaultEffects = {};
defaultEffects[Languages.TidalCycles] = () => {
    return [
        // EffectModel.getNew(EffectModel.Types.CODE_SLIDER,'TidalCycles',false,{
        //     code:'stut  0.5 0.66',
        //     indices: [5],
        //     value: 2,
        //     min: 1,
        //     max: 0,
        //     step: 1,
        //     scale: 'linear'
        // }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", true,
            {
                code: "gain",
                value: 1,
                operator: "|*",
                min: 0,
                max: 2,
                step: 0.01,
                scale: 'linear',
                type: SliderTypes.float
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", false,
            {
                code: "lpf",
                value: 22000,
                operator: "#",
                min: 0,
                max: 22000,
                step: 10,
                scale: 'log',
                type: SliderTypes.float
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", false,
            {
                code: "hpf",
                value: 0,
                operator: "#",
                min: 0,
                max: 22000,
                step: 10,
                scale: 'log',
                type: SliderTypes.float
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", false,
            {
                code: "coarse",
                value: 0,
                operator: "#",
                min: 0,
                max: 24,
                step: 1,
                scale: 'linear',
                type: SliderTypes.int
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", false,
            {
                code: "room",
                value: 0,
                operator: "#",
                min: 0,
                max: 1,
                step: 0.01,
                scale: 'linear',
                type: SliderTypes.float
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, "TidalCycles", false,
            {
                code: "size",
                value: 0,
                operator: "#",
                min: 0,
                max: 1,
                step: 0.01,
                scale: 'linear',
                type: SliderTypes.float
            }),
        EffectModel.getNew(EffectModel.Types.CODE_TOGGLE, 'TidalCycles', false, {
            code: ''
        })
    ]
};

defaultEffects[Languages.Hydra] = () => {
    return [
        EffectModel.getNew(EffectModel.Types.SLIDER, 'Hydra', false,
            {
                code: "kaleid",
                value: 1,
                min: 0,
                max: 50,
                step: 1,
                scale: 'linear',
                type: SliderTypes.int
            }),
        EffectModel.getNew(EffectModel.Types.SLIDER, 'Hydra', false,
            {
                code: "pixelate",
                value: 1,
                min: 0,
                max: 200,
                step: 1,
                scale: 'linear',
                type: SliderTypes.int
            })
    ]
};

const util = {defaultEffects};

const EffectModel = {
    getNew,
    clone,
    Types,
    SliderTypes,
    PropertySpec,
    util
};

export default EffectModel
