import React, {Component} from 'react';
import './index.css'
import PropTypes from 'prop-types';
import {throttle} from 'lodash';


class Slider extends Component {
    constructor(props) {
        super(props);
        const defaultThrottle = 50;
        this.state = {
            value: this.props.value,
            step: this.props.step===undefined?1:this.props.step
        };
        this._onEvent = throttle(this._onMouseDown.bind(this), this.props.throttle === undefined ? defaultThrottle : this.props.throttle, {leading:true, trailing:true});
        this.onEvent = (e) => {
            e.persist();
            this._onEvent(e)
        };
        this._throttledOnTouchEvent = throttle(this._onTouchEvent.bind(this), this.props.throttle === undefined ? defaultThrottle : this.props.throttle);
        this.onTouchEvent = (e) => {
            e.preventDefault();
            e.persist();
            this._throttledOnTouchEvent(e);
        };
        this.ref = React.createRef()
    }

    componentDidMount() {
        function preventBehavior(e) {
            e.preventDefault();
        };
        this.ref.current.addEventListener("touchmove", preventBehavior, {passive: false});
    }

    _onTouchEvent(e) {
        const rect = e.nativeEvent.target.getBoundingClientRect();
        const x = e.targetTouches[0].pageX - rect.left;
        const value = Math.round(Math.max(this.props.min, Math.min(x * this.props.max / e.target.clientWidth, this.props.max))/this.props.step)*this.props.step;
        this.props.onChange(e, value)
    }

    _onMouseDown(e) {
        const value = Math.round(Math.max(this.props.min, Math.min(this.props.max, e.nativeEvent.offsetX * this.props.max / e.target.clientWidth))/this.props.step)*this.props.step;
        this.props.onChange(e, value)
    }

    render() {
        if (this.props.vertical) {
            return this.renderVertical()
        }
        const amt = `${this.props.value * 100 / this.props.max}%`;
        return (
            <div className='slider'>
                <div ref={this.ref} className='clickCapture' draggable onTouchMove={this.onTouchEvent.bind(this)}
                     onMouseDown={this.onEvent.bind(this)}
                     onDragStart={this.onEvent.bind(this)} onDrag={this.onEvent.bind(this)}></div>
                <div className='indicator' style={{width: amt}}></div>
                <div className="tab" style={{left: amt}}></div>
                <input type="number" value={this.props.value} step={this.props.step} min={this.props.min} max={this.props.max}/>
            </div>
        );
    }

    renderVertical() {
        return null;
    }
}

Slider.propTypes = {
    throtte: PropTypes.number,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    vertical: PropTypes.bool
};

export default Slider;
