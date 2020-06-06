import {ActionTypes} from "../actions";

const reducerFns = {};

reducerFns[ActionTypes.SCRATCH_CREATE] = (scratches, payload) => {
    return Object.assign({}, scratches, {[payload.scratchId]: payload.value})
};

reducerFns[ActionTypes.SCRATCH_UPDATE] = (scratches, payload) => {
    const scratch = {...scratches[payload.scratchId], ...payload.value};
    return Object.assign({}, scratches, {[payload.scratchId]:scratch});
};

reducerFns[ActionTypes.SCRATCH_DELETE] = (scratches, payload) => {
    return {...scratches, [payload.scratchId]: undefined}
};

reducerFns[ActionTypes.SCRATCH_RENDER] = scratches => scratches;

reducerFns[ActionTypes.SCRATCH_TRANSLATE] = (scratches, payload) => {

};

const ScratchReducer = (scratches, {type, payload}) => reducerFns[type] ? reducerFns[type](scratches, payload) : scratches;
export default ScratchReducer
