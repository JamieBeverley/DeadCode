import React, {Component} from 'react'
import './index.css'
import {Button, Switch} from "@material-ui/core";
import Effect from "../Effect";
import debounce from 'lodash/debounce'

export default class StemEditor extends Component {
    constructor(props){
        super(props);
        this.state = {code: this.props.code};
        this.updateCode = debounce(this._updateCode, 1000);
    }

    render(){
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
                    onChange={(e)=>{
                        e.persist();
                        this.setState({code:e.target.value});
                        this.updateCode.bind(this)(e)
                    }
                    }
                    value={this.state.code}
                />
                {effects}
                <Button style={{marginTop:'5px'}} onClick={this.delete.bind(this)} color='primary' variant='outlined'>delete</Button>
            </div>
        )
    }

    delete(){
        this.props.globalActions.removeStem(this.props.trackId, this.props.id);
    }

    updateLive(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {live:e.target.checked});
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

    updateName(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {name:e.target.value})
    }

    _updateCode(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {code:e.target.value})
    }

}