import React, {Component} from 'react'
import './index.css'
import {Button} from "@material-ui/core";
import Effect from "../../containers/Effect";
import debounce from 'lodash/debounce'
import CodeEditor from "../CodeEditor";
import Model from "../../model";
import EffectCreator from "../Effect/EffectCreator";


export default class StemEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {code: this.props.code};
        this.updateCode = debounce(this._updateCode, 1000);
        this.textAreaRef = React.createRef();
    }

    effectIdToComponent(id) {
        return <Effect key={id} id={id}/>
    }

    render() {
        let effects = this.props.effects.map(this.effectIdToComponent.bind(this))

        return (
            <div className={'StemEditor'} style={this.props.style}>
                Name:
                <input
                    style={{backgroundColor: 'var(--stem-off)'}}
                    onChange={this.updateName.bind(this)}
                    type='text'
                    value={this.props.name}
                />

                <select
                    value={this.props.language}
                    onChange={this.handleLanguageChange.bind(this)}
                    name='language'
                >
                    {Object.keys(Model.Languages).map(x => <option key={x} value={x}>{x}</option>)}
                </select>

                <CodeEditor
                    onChange={(code) => this.props.globalActions.stemUpdate(this.props.id, {code})}
                    onChangeLive={(live) => this.props.globalActions.stemUpdate(this.props.id, {live})}
                    code={this.props.code}
                    live={this.props.live}
                />
                <div>
                    {effects}

                    <EffectCreator onCreate={this.createEffect.bind(this)}/>
                    {/*<PlusButton style={{maxWidth: '60px', maxHeight: '30px', marginLeft: '10px'}}*/}
                    {/*            onClick={this.newEffect.bind(this)}/>*/}
                </div>
                <Button style={{marginTop: '5px'}} onClick={this.delete.bind(this)} color='primary'
                        variant='outlined'>delete</Button>
            </div>
        )
    }

    createEffect(type, properties) {
        this.props.globalActions.stemAddEffect(this.props.id,type,this.props.language,false,properties);
    }

    handleLanguageChange(e) {
        this.props.globalActions.stemUpdateLanguage(this.props.id, e.target.value);
    }

    maybeEval(e) {
        if (e.shiftKey) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.props.globalActions.stemUpdate(this.props.id, {code: this.state.code});
                this.textAreaRef.current.classList.add('flash');
                setTimeout(() => {
                    this.textAreaRef.current.classList.remove('flash')
                }, 250);
            }
        }
    }

    delete() {
        this.props.globalActions.removeStem(this.props.trackId, this.props.id);
    }


    updateEffect(newEffect) {
        let newEffects = this.props.effects.map(x => {
            if (x.id === newEffect.id) {
                return Object.assign(x, newEffect, {});
            }
            return x
        });
        this.props.globalActions.stemUpdate(this.props.id, {effects: newEffects})
    }

    updateName(e) {
        this.props.globalActions.stemUpdate(this.props.id, {name: e.target.value})
    }

    _updateCode(e) {
        this.props.globalActions.stemUpdate(this.props.id, {code: e.target.value})
    }

}
