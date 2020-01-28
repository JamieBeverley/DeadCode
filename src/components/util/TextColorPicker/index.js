import React, {Component} from "react";
import './index.css'

class TextColorPicker extends Component {
    constructor(props){
        super(props)
        this.state = {
            value:this.props.value
        }
    }

    onChange(e){
        this.setState({value:e.target.value})
    }

    render() {
        return (
            <div className={'TextColorPicker'}>
                <input type={'text'} value={this.state.value} onChange={this.onChange.bind(this)}/>
                <div style={{backgroundColor: this.state.value}}>&nbsp;</div>
            </div>
        )
    }
}

export default TextColorPicker;