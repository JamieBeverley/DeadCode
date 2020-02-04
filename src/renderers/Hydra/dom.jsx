import React, {Component, useDebugValue} from 'react';
import "./index.css";
import {effectToCode, stemToCode} from './index'
import {throttle} from "lodash";
import CodeWriter from "../../components/util/CodeWriter";

class HydraComponent extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            fontSize: 36,
            isCorrectSize: true
        }
        this.justMinimized = false;
        // this.componentDidUpdate = throttle(this.componentDidUpdate.bind(this),100,{leading:false, trailing:true})
        this.triggerResize = throttle(this.triggerResize.bind(this), 2, {leading: false, trailing: true})
    }


    triggerResize() {
        const diff = this.ref.current.scrollHeight - this.ref.current.clientHeight;
        const percent = diff / this.ref.current.clientHeight

        if (percent > 0) {
            this.justMinimized = true;
            this.setState({fontSize: this.state.fontSize - 1})
            this.triggerResize()
        } else {
            let childHeights = 0;
            this.ref.current.childNodes.forEach(x => {
                childHeights += x.clientHeight
            });
            console.log(childHeights / this.ref.current.clientHeight)
            if (childHeights / this.ref.current.clientHeight < 0.95 && childHeights !== 0 && !this.justMinimized) {
                this.justMinimized = false;
                this.setState({fontSize: this.state.fontSize + 1})
                this.triggerResize()
            }
            this.justMinimized = false;
        }
    }

    render() {
        let lines = Object.keys(this.props.tracks).map(x => {
            return (
                <TrackToDom
                    key={`track_${x}`}
                    state={this.props}
                    track={this.props.tracks[x]}
                    id={x}
                    triggerResize={this.triggerResize.bind(this)}
                />
            )
        });

        return (
            <div style={{fontSize: this.state.fontSize}} ref={this.ref} className={'code'}>
                {lines}
            </div>
        )
    }
}

export default HydraComponent;


class TrackToDom extends Component {
    render() {
        // const text = trackToCode(this.props.state, this.props.track)
        const stems = this.props.track.stems.map(stemId => {
            let stem = this.props.state.stems[stemId]
            if (stem.on && stem.language === 'Hydra' && stem.code.trim() !== '') {
                return <StemToDom state={this.props.state} triggerResize={this.props.triggerResize} stem={stem}
                                  id={stemId} key={`stem_${stemId}`}/>
            }
            return null
        }).filter(x=>x);
        if (stems.length<1){
            return null
        }
        const effects = this.props.track.effects.map(effectId => {
            let effect = this.props.state.effects[effectId]
            if (effect.on && effectToCode(effect).trim() !== '') {
                return <EffectToDom state={this.props.state} triggerResize={this.props.triggerResize} effect={effect}
                                    id={effectId} key={`effect_${effectId}`}/>
            }
        });
        return (
            <div className={'track'} id={`track_${this.props.id}`} key={`track_${this.props.id}`}>
                {stems}
                {/*{effects}*/}
            </div>
        );
    }
}

class StemToDom extends Component {
    render() {

        return (
            <CodeWriter
                text={this.props.stem.code}
                rate={20}
                triggerResize={this.props.triggerResize}
            />
        )
    }
}

class EffectToDom extends Component {
    render() {
        return (
            <CodeWriter
                text={effectToCode(this.props.effect)}
                rate={20}
                triggerResize={this.props.triggerResize}
            />
        )
    }
}