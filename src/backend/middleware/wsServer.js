import {Actions, ActionTypes} from "../../actions";
import {throttle} from "lodash";

const effectThrottles = {};

export const createServerMiddleware = wsServer => store => next => action => {
    let msg;
    if(action.type === ActionTypes.LOAD_FROM_SERVER){
        let state = {...store.getState(), connection:null};
        msg = {type:'action',action:Actions.receiveState(state)};
        wsServer.broadcast(msg);
    } else if(action.type ===ActionTypes.EFFECT_UPDATE_SLIDER_VALUE){
        msg = {type: 'action', action:action};
        // Ease load on server by throttling broadcast of effect updates (does not throttle/slow evaluation)
        effectThrottles[action.payload.effectId] = effectThrottles[msg.action.payload.effectId] || throttle(wsServer.broadcast,500);
        effectThrottles[action.payload.effectId](msg,[action.meta.sender]);
    } else {
        msg = {type: 'action', action:action};
        console.log("semder:", action.meta.sender);
        wsServer.broadcast(msg, [action.meta.sender]);
    }
    next(action)
};
