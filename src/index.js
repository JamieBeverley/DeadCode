import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App';
import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import React from 'react';
import logger from 'redux-logger'
import {BrowserRouter as Router,Route} from "react-router-dom";
import AudienceRender from "./containers/AudienceRender";

export const store = createStore(DeadReducer,applyMiddleware(logger));

// render (
//     (
//         <Provider store={store}><App/> </Provider>),
// document.getElementById('root')
// )



render (
    (
        <Provider store={store}>
            <Router>
                <Route path="/" exact component={App} />
                <Route path="/render" exact component={AudienceRender} />
            </Router>
        </Provider>),
    document.getElementById('root')
)