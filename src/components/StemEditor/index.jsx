import React, {Component} from 'react'
import './index.css'

export default class StemEditor extends Component {
    constructor(props){
        super(props)
    }

    render(){
        console.log(this.props);
        return (
            <div className={'StemEditor'} style={this.props.style}>
                Name:
                <input
                    onChange={this.updateName.bind(this)}
                    type='text'
                    value={this.props.name}
                />
                Code:
                <textarea
                    onChange={this.updateCode.bind(this)}
                    value={this.props.code}
                />
                Live:
                <input type='checkbox' checked={this.props.live} onChange={this.updateLive.bind(this)}/>
            </div>
        )
    }

    updateLive(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {live:e.target.checked});
    }

    updateName(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {name:e.target.value})
    }

    updateCode(e){
        this.props.globalActions.updateStem(this.props.trackId, this.props.id, {code:e.target.value})
    }

}