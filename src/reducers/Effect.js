import Actions from "../actions";


const EffectReducer =  (effects, action)=>{
    if(action.type ===Actions.Types.UPDATE_EFFECT){
        effects[action.id] = Object.assign({},effects[action.id], action.value);
        return {...effects};
    }
    return effects
}

export default EffectReducer