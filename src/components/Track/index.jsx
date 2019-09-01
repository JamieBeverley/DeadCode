import React, {Component} from 'react'
import './index.css'
import Stem from '../Stem';
import PlusButton from "../util/PlusButton/PlusButton";
import Effect from "../Effect";
import {Button} from "@material-ui/core";


export default class Track extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let stems = this.props.stems.map(x=>{
            x.globalActions = this.props.globalActions;
            return (<Stem key={x.id} {...x}/>)
        });

        // let effects = this.props.effects.map(effect=>{
        //     return <Effect updateEffect={this.updateEffect.bind(this)} {...effect}/>
        // });


        return (
            <div className='Track'>
                <input onChange={this.titleChange.bind(this)} value={this.props.name}/>

                <div className={'stems'}>
                    {stems}
                    <PlusButton onClick={this.addStem.bind(this)}/>
                </div>
                <div className={'effects'}>
                    <div className={'launchButton'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="var(--font-color-dark)" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                    </div>
                    <Effect isVertical noToggle updateEffect={this.updateEffect.bind(this)} {...this.props.effects[0]}/>
                </div>

            </div>
        )
    }


    updateEffect(newEffect){
        let newEffects = this.props.effects.map(x=>{
            if(x.id===newEffect.id){
                return newEffect
            }
            return x
        });
        this.props.globalActions.updateTrack({id:this.props.id,effects:newEffects})
    }

    addStem(){
        // let stems = this.props.stems.concat([getDefaultStem()]);
        this.props.globalActions.addStem(this.props.id);
        // this.props.globalActions.updateTrack({id:this.props.id, stems});
    }

    titleChange(e){
        this.props.globalActions.updateTrack({id:this.props.id,name:e.target.value});
    }

    // openInFlyout(id){
    //
    // }
}