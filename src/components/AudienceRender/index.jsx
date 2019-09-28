import React, {Component} from 'react'
import Hydra from "hydra-synth";
import './index.css'
import {Renderers} from "../../Renderers";

export default class AudienceRender extends Component {

    constructor(props) {
        super(props)
        this.hydraRef = React.createRef();

        this.hydraCode = '';
    }

    componentDidMount() {
        window.hydra = new Hydra({canvas: this.hydraRef.current});
        // window.hydra.resize(this.hydraRef.current.getBoundingClientRect().width,this.hydraRef.current.getBoundingClientRect().height);
    }


    render() {

        let hydraDom;
        let tidalDom;
        if (this.props.tracks) {
            // debugger;
            hydraDom = Renderers.Hydra.getAudienceDom(this.props);
            tidalDom = Renderers.TidalCycles.getAudienceDom(this.props);

            const hydraCode = Renderers.Hydra.getCode(this.props);
            if (hydraCode !== this.hydraCode) {
                try {;
                    eval(hydraCode);
                } catch (e) {
                    console.warn("Hydra ERR:", e);
                }
                this.hydraCode = hydraCode;
            }
        }

        return (
            <div className={'AudienceRender'}>
                <canvas ref={this.hydraRef}></canvas>
                <div className={"code"}>
                    <div id='tidalcycles' className="column">
                        {tidalDom}
                    </div>
                    <div id='hydra' className="column">
                        {hydraDom}
                    </div>
                </div>
            </div>
        )
    }

}