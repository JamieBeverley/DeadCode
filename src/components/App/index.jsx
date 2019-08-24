import React, {Component} from 'react'
import LaunchSpace from '../../containers/LaunchSpace.jsx';
import Flyout from '../../containers/Flyout.jsx';
import './index.css';

export default class App extends Component{

    constructor(props){
        super(props)
    }

    componentDidMount() {
        this.props.globalActions.load();
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
            if(e.key==='s'){
                e.preventDefault();
                this.props.globalActions.save();
            } else if (e.key ==="l"){
                e.preventDefault();
                this.props.globalActions.load();
            } else if (e.key ==="d"){
                e.preventDefault();
                this.props.globalActions.download();
            } else if (e.key ==='o'){
                e.preventDefault();
                this.props.globalActions.openFile();
            }
        }
    }
}