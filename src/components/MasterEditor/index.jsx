import React, {Component} from 'react'
import './index.css'
import {Switch, Button} from '@material-ui/core';
import {uniqueId} from 'lodash';


import Effect from '../Effect';

export default class MasterEditor extends Component {
    constructor(props){
        super(props);
    }

    updateEffect(newEffect){
        this.props.globalActions.updateMasterEffect(newEffect);
    }

    render(){
        let effects = [];
        for(let e in this.props.masterEffects){
            let effect = this.props.masterEffects[e];
            effects.push(
                <div key={effect.id} style={{margin:'5px',marginTop:'20px'}}>
                    <Effect updateEffect={this.updateEffect.bind(this)} {...effect}/>
                </div>
                )
        }

        return (
            <div id={Math.random()} className={'MasterEditor'} style={this.props.style}>
                <div>
                    Live
                    <Switch
                        color='primary'
                        onChange={this.toggle.bind(this)}
                        checked={this.props.live}
                    />
                    <Button color='primary' disabled={this.props.live} variant='outlined'>eval</Button>
                </div>
                {effects}
            </div>
        )
    }

    toggle(e){
        this.props.globalActions.toggleLive(e.target.checked)
    }
}