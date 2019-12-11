import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from './containers/App';
import {applyMiddleware, createStore} from "redux";
import DeadReducer from './reducers'
import React from 'react';
import logger from 'redux-logger'
import {BrowserRouter as Router, Route} from "react-router-dom";
import View from "./containers/Render";
import store from "./store";
import serverControl from "./middleware";

// export const store = createStore(DeadReducer, applyMiddleware(serverControl,logger));

// const store = store

render(
    (
        <Router>
            <Provider store={store}>
                <Route path="/" exact component={App}/>
                <Route path="/render" exact component={View}/>
            </Provider>
        </Router>),
document.getElementById('root')
)