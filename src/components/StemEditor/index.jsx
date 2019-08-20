import React, {Component} from 'react'
import './index.css'

export default class StemEditor extends Component {
    constructor(props){
        super(props)
    }

    render(){

        return (
            <div className={'StemEditor'} style={this.props.style}>
                Name:<input type='text'/>
                Code:<textarea/>
            </div>
        )
    }

}