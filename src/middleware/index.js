import Connection from "../Connection";
import {ActionSpec, ActionTypes} from "../actions";


// propogate action to server if it didn't originate from there
//



export const serverControl = store => next => action => {
    const meta = action.meta;
    if (!meta.fromServer && meta.propogateToServer){
        var newAction = {...action}
        // if pushing state, change the action to a receive for other clients
        if(newAction.type === ActionSpec.PUSH_STATE.name){
            newAction.type = ActionSpec.RECEIVE_STATE.name
        }

        // dispatch to server
        Connection.sendAction(newAction);
    }
    return next(action);
}
