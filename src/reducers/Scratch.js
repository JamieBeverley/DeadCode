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
    const newScratches = {...scratches};
    delete newScratches[payload.scratchId];
    return newScratches
};

reducerFns[ActionTypes.SCRATCH_RENDER] = scratches => scratches;

reducerFns[ActionTypes.SCRATCH_TRANSLATE] = scratches => scratches;

const ScratchReducer = (scratches, {type, payload}) => reducerFns[type] ? reducerFns[type](scratches, payload) : scratches;
export default ScratchReducer
