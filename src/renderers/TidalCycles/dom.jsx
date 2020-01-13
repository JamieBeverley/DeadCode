import React, {Component} from "react";
import {EffectsToCode} from './index'

export default class RenderComponent extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            fontSize: 36,
            isCorrectSize: true
        }
        this.justMinimized = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const diff = this.ref.current.scrollHeight - this.ref.current.clientHeight;
        const percent = diff / this.ref.current.clientHeight

        if (percent > 0) {
            this.justMinimized = true;
            this.setState({fontSize: this.state.fontSize - 1})
        } else {
            let childHeights = 0;
            this.ref.current.childNodes.forEach(x => {
                childHeights += x.clientHeight
            });
            console.log(childHeights / this.ref.current.clientHeight)
            if (childHeights / this.ref.current.clientHeight < 0.95 && childHeights !== 0 && !this.justMinimized) {
                this.justMinimized = false;
                this.setState({fontSize: this.state.fontSize + 1})
            }
            this.justMinimized = false;
        }
    }

    render() {
        let lines = Object.keys(this.props.tracks).map(x => {
            return trackToDom(this.props, this.props.tracks[x], x)
        });

        return (
            <div style={{fontSize: this.state.fontSize}} ref={this.ref} className={'code'}>
                {lines}
            </div>
        )
    }
}

function trackToDom(state, track, id) {
    let stemsDom = [];
    track.stems.forEach(x => {
        let stem = state.stems[x];
        if (stem.on && stem.code !== '' && stem.language === 'TidalCycles') {
            stemsDom.push(stemToDom(state, stem, x))
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
            effectsOn.push(effectToDom(state, effect, e));
        }
    });

    return (
        <div key={id} className={'track'}>
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

function stemToDom(state, stem, id) {
    if (stem.code === '') {
        return null
    }
    let effectsOn = [];
    stem.effects.forEach(e => {
        let effect = state.effects[e];
        if (effect.on) {
            effectsOn.push(effectToDom(state, effect, e));
        }
    });

    setTimeout(()=>{document.getElementById(id).classList.remove('justAdded')},0)

    return (
        <span id={id} key={id} className={'stem justAdded'}>
            {
                effectsOn
            }
            $
            <span>{stem.code}</span>
        </span>
    )
}

function effectToDom(state, effect, id) {
    const effectCode = EffectsToCode[effect.type](effect) + " ";
    return <span id={id} key={id} className={'effect'}>{effectCode === '(|* gain 1) ' ? '' : effectCode}</span>
}