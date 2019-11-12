
const ConnectionReducer = function (connection, action){
    switch (action.type){
        case 'CONNECT':
            return {url: action.payload.url, port:action.payload.port, isConnected:action.payload.isConnected};
        default:
            return connection
    }
}

export default ConnectionReducer