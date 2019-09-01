import React, {Component} from 'react'
import './index.css'
import throttle from 'lodash/throttle'

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
                className={'Stem noselect'+(this.props.on?' on ':' off ')+ (this.props.selected?'selected':'')}
                // onMouseUp={this.mouseUp.bind(this)}
                tabIndex={0}
                onKeyUp={this.onKeyUp.bind(this)}
                onMouseUp={this.mouseDown.bind(this)}
                onContextMenu={(x)=>{x.preventDefault();this.openInFlyout()}}
                // onTouchMove={this.onTouchStart.bind(this)}
                // onTouchStart={this.toggle.bind(this)}
                // onTouchEnd={this.mouseUp.bind(this)}
            >
                <div className="verticalCenter" style={{width:'100%'}}>
                    {this.props.name}
                </div>
            </div>
        )
    }

    onKeyUp(e){
        if(e.ctrlKey && e.key==='v'){
            this.props.globalActions.pasteStems(this.props.trackId,this.props.id);
        }

    }

    mouseUp(){
        if((new Date())-this.state.holdTime > 1000){
            this.openInFlyout();
        } else{
            this.toggle();
        }
    }

    onTouchStart(){
        this.toggle();
    }

    mouseDown(e){
        if(e.shiftKey){
            this.props.globalActions.updateStem(this.props.trackId, this.props.id,{selected:!this.props.selected});
        } else {
            if(e.button){
                e.preventDefault();
            } else{
                this.toggle()
            }
        }
    }

    openInFlyout(){
        this.props.globalActions.updateStem(this.props.trackId,this.state.id, {open:true});
    }

    toggle(){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {on:!this.props.on} )
    }
}