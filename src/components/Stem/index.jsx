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
            effects: props.effects,
            holdTime: new Date()
        }
    }

    render(){
        return (
            <div
                className={'Stem noselect'+(this.props.on?' on':' off')}
                onMouseUp={this.mouseUp.bind(this)}
                onMouseDown={this.mouseDown.bind(this)}
                onContextMenu={(x)=>{x.preventDefault();}}
                // onTouchStart={this.mouseDown.bind(this)}
                onTouchEnd={this.mouseUp.bind(this)}
            >
                <div className="verticalCenter" style={{width:'100%'}}>
                    {this.props.name}
                </div>
            </div>
        )
    }

    mouseUp(){
        if((new Date())-this.state.holdTime > 1000){
            this.openInFlyout();
        } else{
            this.toggle();
        }
    }

    mouseDown(){
        this.setState({holdTime:(new Date())})
    }

    openInFlyout(){
        this.props.globalActions.updateStem(this.props.trackId,this.state.id, {open:true});
    }

    toggle(){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {on:!this.props.on} )
    }
}