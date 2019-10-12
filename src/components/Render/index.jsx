import React, {Component} from 'react'
import './index.css'
import Connection from "../../Connection";
import {Renderers} from "../../Renderers";

export default class Render extends Component {
    constructor(props) {
        super(props);
        this.iframeRef = React.createRef();
        this.tidalCylces = {
            code:'',
            tempo:null,
            macros:''
        };
        this.hydra = {
            code:'',
            macros:''
        };
        this.poppedOut = [];
    }

    componentDidMount() {
    }



    render() {
        var tidal = Renderers.TidalCycles.getCode(this.props);
        // var hydra = Renderers.Hydra.getCode(this.props, "add");
        // let send = false;

        // Render Tidal
        if(this.tidalCylces.tempo !== this.props.master.TidalCycles.properties.tempo){
            Connection.sendCode(Renderers.TidalCycles.getTempoCode(this.props));
            this.tidalCylces.tempo = this.props.master.TidalCycles.properties.tempo;
        }
        if(this.tidalCylces.macros !== this.props.master.TidalCycles.macros){
            Connection.sendCode(this.props.master.TidalCycles.macros);
            this.tidalCylces.macros = this.props.master.TidalCycles.macros;
        }
        const tidalCode = Renderers.TidalCycles.getCode(this.props);
        if(this.tidalCylces.code!==tidalCode){
            console.log('tidal:', tidal);
            Connection.sendCode(tidal);
            this.tidalCylces.code = tidalCode;
        }

        if(this.iframeRef.current && this.iframeRef.current.contentWindow){
            // debugger;
            const msg = JSON.parse(JSON.stringify(this.props));
            this.iframeRef.current.contentWindow.postMessage({state:msg});
            if(this.poppedOut.length){
                this.poppedOut.forEach(iframe=>{iframe.postMessage({state:msg})});
            }
        }


        return (
            <div className="Render" style={this.props.style}>
                <svg onClick={this.popoutRender.bind(this)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                <iframe title={"Audience Render"} ref={this.iframeRef} src={"/render"}/>
            </div>
        )
    }

    popoutRender(){
        this.poppedOut.push(window.open("/render"));
    }
}