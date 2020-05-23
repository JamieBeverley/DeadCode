import Connection from "../Connection";
import {ActionTypes} from "../actions";

// propagate action to server if it didn't originate from there
export const serverControl = store => next => action => {
    const meta = action.meta;
    if (!meta.fromServer && meta.propagateToServer){
        let newAction = {...action};
        // if pushing state, change the action to a receive for other clients
        if(newAction.type === ActionTypes.PUSH_STATE){
            newAction.type = ActionTypes.RECEIVE_STATE
        }
        // dispatch to server
        Connection.sendAction(newAction);
    }
    return next(action);
};

export const minimalLogger = store => next => action => {
    next(action);
    console.log('\x1b[33m%s\x1b[0m', action.type);  //yello
};
