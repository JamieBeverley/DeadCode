import React, {Component} from 'react'
import './index.css'

export default class Stem extends Component{
    constructor (props){
        super(props);
        this.state = {
            id:props.id,
            name:props.name,
            on: props.on,
            code: props.code,
            language: props.language,
            effects: props.effects
        }
    }

    render(){
        return (
            <div
                className={'Stem'+(this.props.on?' on':' off')}
                onMouseUp={this.toggle.bind(this)}
                onMouseDown={this.openInFlyout.bind(this)}
            />
        )
    }

    openInFlyout(){
        this.props.globalActions.openInFlyout(this.props.trackId,this.state.id);
    }

    toggle(){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {on:!this.props.on} )
    }
}