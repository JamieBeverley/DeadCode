import React, {Component} from 'react'
import './index.css'
import {Button, Switch} from "@material-ui/core";
import Effect from "../Effect";

export default class StemEditor extends Component {
    constructor(props){
        super(props)
    }


    updateEffect(newEffect){
        let newEffects = this.props.effects.map(x=>{
            if(x.id===newEffect.id){
                return newEffect
            }
            return x
        });
        this.props.globalActions.updateStem(this.props.trackId, this.props.id,{effects:newEffects})
    }

    render(){
        console.log(this.props)
        let effects = [];
        for(let e in this.props.effects){
            let effect = this.props.effects[e];
            effects.push(
                <div key={effect.id} style={{marginTop:'20px'}}>
                    <Effect updateEffect={this.updateEffect.bind(this)} {...effect}/>
                </div>
            )
        }

        return (
            <div className={'StemEditor'} style={this.props.style}>
                Name:
                <input
                    onChange={this.updateName.bind(this)}
                    type='text'
                    value={this.props.name}
                />
                <div>
                    Live
                    <Switch
                        color='primary'
                        onChange={this.updateLive.bind(this)}
                        checked={this.props.live}
                    />
                    <Button color='primary' disabled={this.props.live} variant='outlined'>eval</Button>
                </div>
                Code:
                <textarea
                    onChange={this.updateCode.bind(this)}
                    value={this.props.code}
                />
                {effects}
            </div>
        )
    }

    updateLive(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {live:e.target.checked});
    }

    updateName(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {name:e.target.value})
    }

    updateCode(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {code:e.target.value})
    }

}