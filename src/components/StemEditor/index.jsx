import React, {Component} from 'react'
import './index.css'
import {Button, Switch} from "@material-ui/core";
import Effect from "../Effect";
import debounce from 'lodash/debounce'
import CodeEditor from "../CodeEditor";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {languages} from "../../reducers/State";


export default class StemEditor extends Component {
    constructor(props){
        super(props);
        this.state = {code: this.props.code};
        this.updateCode = debounce(this._updateCode, 1000);
        this.textAreaRef = React.createRef();
    }

    render(){
        let effects = [];
        for(let e in this.props.effects){
            let effect = this.props.effects[e];
            effects.push(
                <div key={Math.random()} style={{marginTop:'20px'}}>
                    <Effect key={effect.id} updateEffect={this.updateEffect.bind(this)} {...effect}/>
                </div>
            )
        }

        return (
            <div className={'StemEditor'} style={this.props.style}>
                Name:
                <input
                    style={{backgroundColor:'var(--stem-off)'}}
                    onChange={this.updateName.bind(this)}
                    type='text'
                    value={this.props.name}
                />

                <select
                    value={this.props.language}
                    onChange={this.handleLanguageChange.bind(this)}
                    name='language'
                >
                    {languages.map(x=><option key={x} value={x}>{x}</option>)}
                </select>

                <CodeEditor
                    onChange={(code)=>this.props.globalActions.updateStem(this.props.trackId,this.props.id,{code})}
                    onChangeLive={(live)=>this.props.globalActions.updateStem(this.props.trackId,this.props.id,{live})}
                    code={this.props.code}
                    live={this.props.live}
                />
                {effects}
                <Button style={{marginTop:'5px'}} onClick={this.delete.bind(this)} color='primary' variant='outlined'>delete</Button>
            </div>
        )
    }

    handleLanguageChange(e){
        this.props.globalActions.updateStem(this.props.trackId,this.props.id, {language:e.target.value});
    }

    maybeEval(e) {
        if(e.shiftKey){
            if(e.key==='Enter'){
                e.preventDefault();
                this.props.globalActions.updateStem(this.props.trackId, this.props.id, {code:this.state.code});
                this.textAreaRef.current.classList.add('flash');
                setTimeout(()=>{this.textAreaRef.current.classList.remove('flash')},250);
            }
        }
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