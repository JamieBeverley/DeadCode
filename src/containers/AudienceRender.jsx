import React, {Component} from 'react'
import AudienceRenderComponent from "../components/AudienceRender";

export default class AudienceRender extends Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener('message',(e)=>{
            console.log(e.data);
            if(e.origin!== window.location.origin) return;
            this.setState(e.data.state);
        })
    }

    render(){


        return (
                <AudienceRenderComponent {...this.state}/>
        )
    }

}