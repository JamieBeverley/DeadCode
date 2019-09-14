import React, {PureComponent} from 'react'
import './index.css'
import Connection from "../../Connection";
import {getHydraCode} from "../../renderers/Hydra";
import {
    getTidalCyclesCode,
    renderTidalCyclesBootScript,
    renderTidalCyclesTempoChange
} from '../../renderers/TidalCycles'
import uniqueId from 'lodash'

import Hydra from 'hydra-synth'

export default class Render extends PureComponent {
    constructor(props) {
        super(props);
        this.hydraRef = React.createRef();
        this.tempo = '';
        this.bootScript = props.bootScript;
        this.tidalCode = '';
        this.hydraCode = '';
    }

    componentDidMount() {
        window.hydra = new Hydra({canvas: this.hydraRef.current});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log('render');

        var tidal = getTidalCyclesCode(nextProps);
        var hydra = getHydraCode(nextProps, "add");

        if(this.tempo!==nextProps.tempo){
            renderTidalCyclesTempoChange(nextProps)
        }

        if(this.bootScript!==nextProps.bootScript){
            renderTidalCyclesBootScript(nextProps)
        }

        if (this.tidalCode != tidal) {
            console.log('tidal:', tidal);
            Connection.sendCode(tidal);
        }

        if (this.hydraCode != hydra) {
            console.log('hydra:', hydra);
            try {
                eval(hydra)
            } catch (e) {
                console.warn('Hydra ERR:', e)
            }
        }

        this.tidalCode = tidal;
        this.hydraCode = hydra;
        return false;
    }

    render() {
        return (
            <div id="Render" className={"Render"}>
                <canvas id="hydra" ref={this.hydraRef}></canvas>
            </div>
        )
    }
}