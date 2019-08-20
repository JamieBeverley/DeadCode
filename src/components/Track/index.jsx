import React, {Component} from 'react'
import './index.css'
import Stem from '../Stem';

export default class Track extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let stems = this.props.stems.map(x=>{
            x.globalActions = this.props.globalActions;
            return (<Stem key={x.id} {...x}/>)
        });

        // let effects = this.props.effects.map(x=>{
        //     return (<EffectRack props={x}/>)
        // });

        return (
            <div className='Track'>
                <h1>{this.props.name}</h1>
                {stems}

            </div>
        )
    }

    // openInFlyout(id){
    //
    // }
}