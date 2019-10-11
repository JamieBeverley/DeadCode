import Actions from "../actions";

const ConnectionReducer = function (connection, action){
    switch (action.type){
        case Actions.Types.CONNECT:
            return {url: action.url, port:action.port, isConnected:action.isConnected};
        default:
            return connection
    }
}

export default ConnectionReducer