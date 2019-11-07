import Actions from "../actions";


const StemReducer =  (stems, action)=>{
    if(action.type ===Actions.Types.UPDATE_STEM){
        stems[action.id] = Object.assign({},stems[action.id], action.value);
        return {...stems};
    }
    return stems
}

export default StemReducer