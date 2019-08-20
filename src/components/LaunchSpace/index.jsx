import React, { Component } from 'react';
import Track from '../Track';
import './index.css';

export default class LaunchSpace extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let tracks = this.props.tracks.map(x=>{
            x.globalActions = this.props.globalActions;
            return (<Track key={x.id} {...x} />)
        });
        return (
            <div className="LaunchSpace">
                {tracks}
            </div>
        )
    }

}