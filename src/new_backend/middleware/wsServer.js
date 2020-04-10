import {Actions, ActionTypes} from "../../actions";

export const createServerMiddleware = wsServer => store => next => action => {
    let msg;
    if(action.type === ActionTypes.LOAD_FROM_SERVER){
        let state = {...store.getState(), connection:null};
        msg = {type:'action',action:Actions.receiveState(state)};
        wsServer.broadcast(msg);
    } else {
        msg = {type: 'action', action:action};
        wsServer.broadcast(msg, [action.meta.sender]);
    }
    next(action)
};
