import React, {Component} from 'react';
import './index.css'
class Macro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: this.props.placeholder,
            value: this.props.value
        }
    }

    // TODO is this necessary? eg. for updates from serer to register in this component...
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     const {placeholder, value} = this.props;
    //     this.setState({placeholder,value});
    // }

    updateMacro(){
        const {placeholder, value} = this.state;
        this.props.globalActions.macroUpdate(this.props.id,{placeholder, value});
    }

    handleChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    render() {
        return (
            <div className={'Macro'}>
                <input placeholder="macro" onChange={this.handleChange.bind(this)} name='placeholder' value={this.state.placeholder}/>
                <input placeholder="value" onChange={this.handleChange.bind(this)} name='value' value={this.state.value}/>
                <button onClick={this.updateMacro.bind(this)}>eval</button>
                <button onClick={()=>{this.props.delete(this.props.id)}}>delete</button>
            </div>
        );
    }
}

export default Macro;
