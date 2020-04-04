import React, {Component} from 'react';

class Macro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: this.props.placeholder,
            value: this.props.value
        }
    }

    updateMacro(){
        const {placeholder, value} = this.state;
        this.props.globalActions.macroUpdate(this.props.id,{placeholder, value});
    }

    render() {
        return (
            <div className={'Macro'}>
                <input value={this.state.placeholder}/>
                <input value={this.state.value}/>
                <button onClick={this.updateMacro.bind(this)}>eval</button>
                <button onClick={this.props.delete}>delete</button>
            </div>
        );
    }
}

export default Macro;
