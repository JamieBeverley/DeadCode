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
            let ids = Object.keys(this.props.tracks).map(x=>{return this.props.tracks[x].stems.map(y=>{return {trackId:x,stemId:y,selected:this.props.stems[y].selected}})}).flat();
            let selectedIds = ids.filter(x=>x.selected);
            selectedIds.forEach(x=>{this.props.globalActions.trackDeleteStem(x.trackId,x.stemId)});
        }else if (e.ctrlKey && e.key.toLowerCase()==='c'){
            this.props.globalActions.stemCopy();
        } else if (e.key.toLowerCase()==='escape'){
            let selectedStems = Object.keys(this.props.stems).filter(x=>{return this.props.stems[x].selected});
            selectedStems.forEach(x=>this.props.globalActions.stemUpdate(x,{selected:false}));
        }
    }

    newTrack(){
        this.props.globalActions.trackAdd();
    }

}
