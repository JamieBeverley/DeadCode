import {ActionTypes} from "../actions";
import Model from "../model";

const MasterReducer = function (master, action) {
    let obj,newVal;
    switch (action.type) {
        case "MASTER_UPDATE":
            let newLang = Object.assign({},master[action.language],action.value);
            master[action.language] = newLang;
            return {...master};

        // case ActionTypes.UPDATE_MASTER:
        //     newVal = Object.assign({}, master[action.language], action.value);
        //     obj = {};
        //     obj[action.language] = newVal;
        //     return Object.assign({}, master, obj);
        // case ActionTypes.UPDATE_MASTER_EFFECT:
        //     let previousMaster = master[action.effect.language];
        //     newVal = Object.assign({}, previousMaster, {
        //         effects: previousMaster.effects.map(x => {
        //             if (x.id === action.effect.id) {
        //                 return Object.assign({}, x, action.effect);
        //             }
        //             return x
        //         })
        //     });
        //     obj = {};
        //     obj[action.effect.language] = newVal;
        //     return Object.assign({},master,obj);
        default:
            return master
    }
}

export default MasterReducer;