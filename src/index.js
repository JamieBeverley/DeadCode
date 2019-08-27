import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App';
import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import React from 'react';
import logger from 'redux-logger'

export const store = createStore(DeadReducer,applyMiddleware(logger));

render (
    (
        <Provider store={store}><App/> </Provider>),
document.getElementById('root')
)