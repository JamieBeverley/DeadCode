import React, { Component } from 'react';
import Track from '../Track';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";

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
                <PlusButton onClick={this.newTrack.bind(this)} style={{display:'inline-block',top:'0px',width:'50px',minWidth:'50px',height:'30px',margin:'5px'}}/>
            </div>
        )
    }

    newTrack(){
        this.props.globalActions.addTrack();
    }

}