
const MasterReducer = function (master, action) {
    let newLang;
    switch (action.type) {
        case "MASTER_UPDATE":
            newLang = Object.assign({},master[action.payload.language],action.payload.value);
            master[action.payload.language] = newLang;
            return {...master};
        case "MASTER_ADD_EFFECT":
            newLang = Object.assign({},master[action.payload.language]);
            newLang.effects = newLang.effects.concat([action.payload.effectId]);
            master[action.payload.language] = newLang;
            return {...master}

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