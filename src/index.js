import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from './containers/App';
import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import React from 'react';
import logger from 'redux-logger'
import {BrowserRouter as Router, Route} from "react-router-dom";
import AudienceRender from "./containers/AudienceRender";

import serverControl from "./middleware";

export const store = createStore(DeadReducer, applyMiddleware(serverControl,logger));

render(
    (
        <Router>
            <Provider store={store}>
                <Route path="/" exact component={App}/>
            </Provider>
                <Route path="/render" exact component={AudienceRender}/>
        </Router>),
document.getElementById('root')
)