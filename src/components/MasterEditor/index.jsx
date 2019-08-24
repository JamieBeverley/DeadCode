import React, {Component} from 'react'
import './index.css'

export default class MasterEditor extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className={'MasterEditor'} style={this.props.style}>
                <div>
                    Gain:
                    <input onChange={()=>{}} type='range'/>
                </div>
                <div>
                    Live
                    <input onChange={this.toggle.bind(this)} type='checkbox' checked={this.props.live}/>
                </div>
                <div>
                    <button>eval</button>
                </div>

            </div>
        )
    }

    toggle(e){
        this.props.globalActions.toggleLive(e.target.checked)
    }
}

