import React, {Component} from 'react'
import './index.css'
import {Button} from "@material-ui/core";
import Effect from "../../containers/Effect";
import CodeEditor from "../CodeEditor";
import EffectCreator from "../Effect/EffectCreator";


export default class StemEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {code: this.props.code};
    }

    effectIdToComponent(id) {
        return <Effect key={id} id={id}/>
    }

    render() {
        let effects = this.props.effects.map(this.effectIdToComponent.bind(this))

        return (
            <div className={'StemEditor'} style={this.props.style}>
                <div>
                    Name:
                    <input
                        style={{backgroundColor: 'var(--stem-off)'}}
                        onChange={this.updateName.bind(this)}
                        type='text'
                        value={this.props.name}
                    />
                </div>
                <CodeEditor
                    onChange={(code) => this.props.globalActions.stemUpdate(this.props.id, {code})}
                    onChangeLive={(live) => this.props.globalActions.stemUpdate(this.props.id, {live})}
                    code={this.props.code}
                    live={this.props.live}
                />
                <div className={'effects'}>
                    {effects}
                    <EffectCreator onCreate={this.createEffect.bind(this)}/>
                </div>
                <button style={{marginTop: '5px'}} onClick={this.delete.bind(this)}>delete</button>
            </div>
        )
    }

    createEffect(type, properties) {
        this.props.globalActions.stemAddEffect(this.props.id, type, this.props.language, false, properties);
    }


    delete() {
        this.props.globalActions.trackDeleteStem(this.props.trackId, this.props.id)
    }

    updateName(e) {
        this.props.globalActions.stemUpdate(this.props.id, {name: e.target.value})
    }

}
