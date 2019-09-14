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
        this.iframeRef = React.createRef();
        this.tempo = '';
        this.bootScript = props.bootScript;
        this.tidalCode = '';
        this.hydraCode = '';
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

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


        this.tidalCode = tidal;
        this.hydraCode = hydra;

        if(this.iframeRef.current && this.iframeRef.current.contentWindow){
            const msg = {tidalcycles:tidal,hydra}
            this.iframeRef.current.contentWindow.postMessage(msg);
            if(this.poppedOut){
                this.poppedOut.postMessage(msg);
            }
            // debugger;
        }
        return false;
    }

    render() {
        return (
            <div className="Render">
                <button onClick={this.popoutRender.bind(this)}>popout</button>
                <iframe ref={this.iframeRef} src={"/render"}/>
            </div>
        )
    }

    popoutRender(){
        console.log("??")
        // this.poppedOut = this.iframeRef.current.cloneNode(false);
        // document.appendChild(this.poppedOut);
        this.poppedOut = window.open("/render");
        console.log(this.poppedOut)
    }
}