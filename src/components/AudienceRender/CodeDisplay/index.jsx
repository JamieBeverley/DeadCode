import React, {Component} from 'react'
import './index.css'
export default class CodeDisplay extends Component{

    render(){
        var lines = this.props.stems.map(x=>{

            <span className="codeLine">x.code</span>
        });


        return (
            <div className={'CodeDisplay'}>
            </div>
        )
    }

}