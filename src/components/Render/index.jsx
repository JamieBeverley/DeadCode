import React, {Component} from 'react';
import {Renderers} from "../../renderers";
import Hydra from "hydra-synth";
import './index.css'
class Render extends Component {

    constructor(props) {
        super(props);
        this.hydraRef = React.createRef();
        this.hydraCode = Renderers.Hydra.getCode(this.props);
        this.hydraMacros = Renderers.Hydra.getMacros(this.props);
        // this.tidalCode = Renderers.TidalCycles.getCode();
    }

    componentDidMount() {
        this.props.globalActions.connect(window.location.hostname, this.props.connection.port);

        try{
            window.hydra = new Hydra({canvas: this.hydraRef.current});
        } catch (e){
            console.warn('Unable to start hydra');
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let hydraCode = Renderers.Hydra.getCode(this.props);
        let hydraMacros = Renderers.Hydra.getMacros(this.props);
        console.log("????")
        if(hydraMacros !== this.hydraMacros){
            try {
                eval(hydraMacros);
            } catch(e){
                console.warn('Hydra Error',e);
            }
            this.hydraMacros = hydraMacros;
        }

        if(hydraCode !== this.hydraCode){
            try {
                eval(hydraCode);
            } catch(e){
                console.warn('Hydra Error',e);
            }
            this.hydraCode = hydraCode;
        }

    }

    render() {
        console.log("????")

        // if(this.props.connection.isConnected){
        //     console.log(this.tidalCycles.tempo, this.props.master.TidalCycles.properties.tempo);
        //     if(this.tidalCycles.tempo !== this.props.master.TidalCycles.properties.tempo){
        //         Connection.sendCode(Renderers.TidalCycles.getTempoCode(this.props));
        //         this.tidalCycles.tempo = this.props.master.TidalCycles.properties.tempo;
        //         console.log('TidalCycles tempo: '+this.tidalCycles.tempo);
        //     }
        //     if(this.tidalCycles.macros !== this.props.master.TidalCycles.macros){
        //         Connection.sendCode(this.props.master.TidalCycles.macros);
        //         this.tidalCycles.macros = this.props.master.TidalCycles.macros;
        //     }
        //     const tidalCode = Renderers.TidalCycles.getCode(this.props);
        //     if(this.tidalCycles.code!==tidalCode){
        //         console.log('tidal:', tidal);
        //         Connection.sendCode(tidal);
        //         this.tidalCycles.code = tidalCode;
        //     }
        // }



        return (
            <div className={'Render'}>
                <canvas ref={this.hydraRef}/>
            </div>
        )
    }
}

export default Render;