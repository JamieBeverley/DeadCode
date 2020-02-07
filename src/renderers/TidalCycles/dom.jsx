import React, {Component} from "react";
import {EffectsToCode} from './index'
import StemEditor from "../../components/StemEditor";
import {throttle} from 'lodash'
import CodeWriter from "../../components/util/CodeWriter";
import CodeEditor from "../../components/CodeEditor";

export default class TidalComponent extends Component {
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

    // componentDidUpdate(prevProps, prevState, snapshot) {
        // const diff = this.ref.current.scrollHeight - this.ref.current.clientHeight;
        // const percent = diff / this.ref.current.clientHeight
        //
        // if (percent > 0) {
        //     this.justMinimized = true;
        //     this.setState({fontSize: this.state.fontSize - 1})
        // } else {
        //     let childHeights = 0;
        //     this.ref.current.childNodes.forEach(x => {
        //         childHeights += x.clientHeight
        //     });
        //     console.log(childHeights / this.ref.current.clientHeight)
        //     if (childHeights / this.ref.current.clientHeight < 0.9 && childHeights !== 0 && !this.justMinimized) {
        //         this.justMinimized = false;
        //         this.setState({fontSize: this.state.fontSize + 1})
        //     }
        //     this.justMinimized = false;
        // }
        // this.triggerResize()
    // }

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
        let n=14;
        const masterEffects = this.props.master.TidalCycles.effects.map(effectId=>{
            const effect = this.props.effects[effectId];
            if(effect && n<=0 && effect.on){
                return effectToDom(this.props, effect, effectId,this.triggerResize)
            }
            n--;
        }).filter(x=>x);
        let lines = Object.keys(this.props.tracks).map(x => {
            // return trackToDom(this.props, this.props.tracks[x], x)
            return trackToDom(this.props, this.props.tracks[x], x, this.triggerResize.bind(this));
        });

        return (
            <div style={{fontSize: this.state.fontSize}} ref={this.ref} className={'code'}>
                {masterEffects}
                {lines}
            </div>
        )
    }
}

function trackToDom(state, track, id, triggerResize) {
    let stemsDom = [];
    track.stems.forEach(stemId => {
        let stem = state.stems[stemId];
        if (stem.on && stem.code !== '' && stem.language === 'TidalCycles') {
            stemsDom.push(<StemToDom key={`stem_${stemId}`} state={state} stem={stem} id={stemId}
                                     triggerResize={triggerResize}/>)
        }
    });
    if (stemsDom.length < 1) {
        return null
    }
    ;

    let effectsOn = [];
    track.effects.forEach(e => {
        let effect = state.effects[e];
        if (effect.on) {
            effectsOn.push(effectToDom(state, effect, e, triggerResize));
        }
    });
    if (track.stems.filter(x => {
        return state.stems[x].on
    }).length > 0) {
    }
    return (
        <div key={`track_${id}`} id={`track_${id}`} className={'track'}>
            {
                effectsOn
            }
            $
            {
                stemsDom
            }
        </div>
    )

    // let effects = effectsOn.join(" $ ");
    // return `${effectsCode} $ stack [${stemsCode}]`;
}


class StemToDom extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        let {state, stem, id} = this.props;
        if (stem.code === '') {
            return null
        }
        let effectsOn = [];
        stem.effects.forEach(e => {
            let effect = state.effects[e];
            if (effect.on) {
                effectsOn.push(effectToDom(state, effect, e, this.props.triggerResize));
            }
        });
        return (
            <span ref={this.ref} id={`stem_${id}`} key={`stem_${id}`} className={'stem justAdded'}>
                {effectsOn}
                $
                <CodeWriter text={this.props.stem.code} rate={20} triggerResize={this.props.triggerResize}/>
            </span>
        )
    }
}

function effectToDom(state, effect, id, triggerResize) {
    const effectCode = EffectsToCode[effect.type](effect) + " ";
    return (
        <CodeWriter
            className={'effect'}
            rate={20}
            triggerResize={triggerResize}
            text={effectCode === '(|* gain 1) ' ? '' : effectCode}
        />
    )
    // return <span id={`effect_${id}`} key={`effect_${id}`}
    //              className={'effect'}>{effectCode === '(|* gain 1) ' ? '' : effectCode}</span>
}