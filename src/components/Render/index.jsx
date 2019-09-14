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
                <svg onClick={this.popoutRender.bind(this)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
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