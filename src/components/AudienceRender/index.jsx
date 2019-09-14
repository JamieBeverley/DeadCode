import React, {Component} from 'react'
import Hydra from "hydra-synth";
import './index.css'
export default class AudienceRender extends Component{

    constructor(props){
        super(props)
        this.hydraRef = React.createRef();
        this.hydra = this.props.hydra;
    }

    componentDidMount() {
        window.hydra = new Hydra({canvas: this.hydraRef.current});
        // window.hydra.resize(this.hydraRef.current.getBoundingClientRect().width,this.hydraRef.current.getBoundingClientRect().height);
    }


    render(){

        if(this.props.hydra!==this.hydra){
            try{
                eval(this.props.hydra);
            } catch(e){
                console.warn("Hydra ERR:",e);
            }
            this.hydra = this.props.hydra;
        }
        return (
            <div className={'AudienceRender'}>
                <canvas ref={this.hydraRef}></canvas>
                <div id='tidalcycles'>
                    {this.props.tidalcycles}
                </div>
                <div id='hydra'>
                    {this.props.hydra}
                </div>
            </div>
        )
    }

}