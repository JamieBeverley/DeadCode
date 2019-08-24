import React, {Component} from 'react'
import LaunchSpace from '../../containers/LaunchSpace.jsx';
import Flyout from '../../containers/Flyout.jsx';
import './index.css';

export default class App extends Component{

    constructor(props){
        super(props)
    }

    componentWillMount() {
    }

    render(){
        return (
            <div className='App' tabIndex="0" onKeyDown={this.macros.bind(this)}>
                <LaunchSpace/>
                <Flyout/>
            </div>
        )
    }

    macros(e){
        if(e.ctrlKey){
            e.preventDefault();
            if(e.key==='s'){
                this.props.globalActions.save();
            } else if (e.key ==="l"){
                this.props.globalActions.load();
            } else if (e.key ==="d"){
                this.props.globalActions.download();
            } else if (e.key ==='o'){
                this.props.globalActions.openFile();
            }
        }
    }
}