import React, {Component} from 'react';
import './index.css'

import {throttle} from 'lodash'

export default class ResizeDivider extends Component {
    constructor (props){
        super(props)
        this.state = {
            mouseDown:false
        }
        this.onDrag = throttle(this._onDrag,100);
    }

    render(){
        return (
            <div
                draggable={true}
                onDrag={(e)=>{e.persist();this.onDrag.bind(this)(e)}}
                onDragStart={e=>{this.ignore=true}}
                className={'ResizeDivider '+(this.props.horizontal?"horizontal":"vertical")}
            />
        )
    }



    _onDrag(e){
        e.preventDefault();
        if(!this.ignore){
            const val = this.props.horizontal?e.clientY:e.clientX;
            if(val<=0) return;
            console.log(val);
            this.props.onResize(val);
        } else{
            this.ignore=false;
        }
    }

    onMouseDown(x){
        this.setState({mouseDown:true});
    }

    onMouseMove(x){
        if(this.state.mouseDown){
            console.log(x.clientX)
        }
    }

    onMouseUp(x){
        this.setState({mouseDown:false});
    }

}

