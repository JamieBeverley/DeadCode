import Connection from "../Connection";


// propogate action to server if it didn't originate from there
//

const serverControl = store => next => action => {
    const meta = action.meta;
    if (!meta.fromServer && meta.propogateToServer){
        // dispatch to server
        Connection.sendAction(action);
    }
    return next(action);
}

export default serverControl