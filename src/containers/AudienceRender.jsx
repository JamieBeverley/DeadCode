import React, {Component} from 'react'
import AudienceRenderComponent from "../components/AudienceRender";


export default class AudienceRender extends Component{

    constructor(props){
        super(props)
        this.state = {};
        this.state.tidalcycles = '';
        this.state.hydra = '';
    }

    componentDidMount() {
        window.addEventListener('message',(e)=>{
            console.log(e.data);
            if(e.origin!== window.location.origin) return;
            this.setState({tidalcycles:e.data.tidalcycles, hydra:e.data.hydra})
        })
    }

    render(){
        return (
            <AudienceRenderComponent
                tidalcycles={this.state.tidalcycles}
                hydra={this.state.hydra}
            />
        )
    }

}