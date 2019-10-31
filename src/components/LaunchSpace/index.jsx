import React, { Component } from 'react';
import Track from '../Track';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";

export default class LaunchSpace extends Component {

    trackToDom(x){
        x.globalActions = this.props.globalActions;
        return (<Track key={x.id} {...x} />)
    }

    render(){
        let tracks = [];
        for(let i in this.props.tracks){
            let t = this.props.tracks[i]
            tracks.push(this.trackToDom(t))
        }

        return (
            <div className="LaunchSpace" style={this.props.style} tabIndex="1" onKeyUp={this.onKeyUp.bind(this)}>
                {tracks}
                <PlusButton onClick={this.newTrack.bind(this)} style={{display:'inline-block',top:'0px',width:'50px',minWidth:'50px',height:'30px',margin:'5px'}}/>
            </div>
        )
    }

    onKeyUp(e){
        if(e.key.toLowerCase()==='delete'){
            let selectedStems = this.props.tracks.map(x=>x.stems).flat().filter(x=>x.selected);
            selectedStems.forEach(x=>{this.props.globalActions.removeStem(x.trackId,x.id)});
        } else if (e.ctrlKey && e.key.toLowerCase()==='c'){
            this.props.globalActions.copyStems();
        } else if (e.key.toLowerCase()==='escape'){
            let selectedStems = this.props.tracks.map(x=>x.stems).flat().filter(x=>x.selected);
            selectedStems.forEach(x=>this.props.globalActions.updateStem(x.trackId,x.id,{selected:false}));
        }
    }

    newTrack(){
        this.props.globalActions.addTrack();
    }

}