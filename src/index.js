import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from './containers/App';
import React from 'react';
import logger from 'redux-logger'
import {BrowserRouter as Router, Route} from "react-router-dom";
import View from "./containers/Render";
import store from "./store";
import {addMiddleware} from 'redux-dynamic-middlewares'

addMiddleware(logger);

// export const store = createStore(DeadReducer, applyMiddleware(serverControl,logger));

// const store = store

render(
    (
        <Router basename={process.env.PUBLIC_URL}>
            <Provider store={store}>
                <Route path="/" exact component={App}/>
                <Route path="/render" exact component={View}/>
            </Provider>
        </Router>),
document.getElementById('root')
)