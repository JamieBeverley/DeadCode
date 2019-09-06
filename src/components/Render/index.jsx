import React, {Component} from 'react'
import './index.css'
import Connection from "../../Connection";
import {getHydraCode} from "../../renderers/Hydra";
import {getTidalCyclesCode} from '../../renderers/TidalCycles'
import uniqueId from 'lodash'

import Hydra from 'hydra-synth'

export default class Render extends Component {
    constructor(props) {
        super(props);
        this.hydraRef = React.createRef();
        this.tidalCode = '';
        this.hydraCode = '';
    }

    componentDidMount() {
        window.hydra = new Hydra({canvas: this.hydraRef.current});
    }

    render() {
        var tidal = getTidalCyclesCode(this.props);
        var hydra = getHydraCode(this.props, "add");

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
        return (
            <div key={uniqueId()} id="Render" className={"Render"}>
                <canvas id="hydra" ref={this.hydraRef}></canvas>
            </div>
        )
    }
}