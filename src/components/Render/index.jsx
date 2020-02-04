import React, {Component} from 'react';
import {Renderers} from "../../renderers";
import Hydra from "hydra-synth";
import './index.css'
import TidalComponent from '../../renderers/TidalCycles/dom'
import HydraComponent from "../../renderers/Hydra/dom";

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

        try {
            window.hydra = new Hydra({canvas: this.hydraRef.current});
        } catch (e) {
            console.warn('Unable to start hydra');
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let hydraCode = Renderers.Hydra.getCode(this.props);
        let hydraMacros = Renderers.Hydra.getMacros(this.props);


        if (hydraMacros!== this.hydraMacros){
            try {
                eval(hydraMacros);

            } catch (e) {
                console.warn('Index Error', e);
            }
            this.hydraMacros =hydraMacros
        }

        if (hydraCode !== this.hydraCode) {
            try {
                eval(hydraCode);
            } catch (e) {
                console.warn('Index Error', e);
            }
            this.hydraCode = hydraCode;
        }

    }

    render() {
        return (
            <div style={{backgroundColor:'black',width:'100%',height:'100%'}}>
                <div className={'Render'}>
                    <TidalComponent {...this.props}/>
                    <HydraComponent {...this.props}/>
                </div>
                <canvas id={'HydraCanvas'} ref={this.hydraRef}/>
            </div>
        )
    }
}

export default Render;