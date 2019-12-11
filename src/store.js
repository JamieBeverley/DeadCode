import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import logger from 'redux-logger'
import serverControl from "./middleware";

const store = createStore(DeadReducer, applyMiddleware(serverControl,logger));
export default store