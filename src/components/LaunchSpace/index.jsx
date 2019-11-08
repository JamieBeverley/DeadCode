import React, { Component } from 'react';
import Track from '../../containers/Track';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";

export default class LaunchSpace extends Component {

    trackToDom(x){
        x.globalActions = this.props.globalActions;
        return (<Track key={x.id} {...x} />)
    }

    trackIdToComponent(id){
      return <Track key={id} id={id}/>
        // let track = this.populateTrack(this.props, this.props.tracks[id]);
        // let stems = {};
        // track.stems.forEach(x=>{stems[x] = this.props.stems[x]});
        // let effects = {};track.effects.map(x=>{return this.props.effects[x]}).concat(stems.map(x=>{return this.props.effects[x]})).flat();
        // let props = {
        //     stems,
        //     effects,
        //     key:id
        // }
    }

    render(){

        let tracks = Object.keys(this.props.tracks).map(this.trackIdToComponent.bind(this));

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
