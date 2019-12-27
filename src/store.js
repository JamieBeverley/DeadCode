import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import {serverControl} from "./middleware/index";
import dynamicMiddlewares from 'redux-dynamic-middlewares'


// TODO: dynamic middleware added so midi could re-use same store architecture and just add a middleware for
//      midi related things - this should probably be changed so each client just instantiates its own proper store
//      from the beginning...
const store = createStore(DeadReducer, applyMiddleware(serverControl, dynamicMiddlewares));
// const store = createStore(DeadReducer, applyMiddleware(serverControl, dynamicMiddlewares));
export default store