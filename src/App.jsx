import React, {Component} from 'react'
import LaunchSpace from './containers/LaunchSpace.jsx';
import Flyout from './containers/Flyout.jsx';
import './App.css';

export default class App extends Component{
    render(){
        return (
            <div className='App'>
                <LaunchSpace/>
                <Flyout/>
            </div>
        )
    }
}