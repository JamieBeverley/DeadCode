import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App';
import {createStore} from "redux";
import DeadReducer from './reducers'
import React from 'react';

export const store = createStore(DeadReducer);

render (
    (
        <Provider store={store}><App/> </Provider>),
document.getElementById('root')
)