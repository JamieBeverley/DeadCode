import React, {Component} from 'react';
import './index.css'
import Toggle from "../../util/Toggle";
import {debounce} from 'lodash';

class CodeToggle extends Component {

    constructor(props){
        super(props)
        this.state = {
            code:this.props.properties.code
        }
        this.effectUpdate = debounce((code)=>{this.props.globalActions.effectUpdate(this.props.id,{properties:{code}})},500);
    }

    onChange(e){
        const code = e.target.value;
        this.setState({code});
        this.effectUpdate(code);
    }

    onToggle(on){
        this.props.globalActions.effectUpdate(this.props.id, {on});
    }

    render() {
        return (
            <div className={'CodeToggle'}>
                <div>
                    <div className={'text'}><div>Code Toggle</div></div>
                    <Toggle on={this.props.on} onChange={this.onToggle.bind(this)}/>
                </div>
                <div>
                    <input type={'text'} onChange={this.onChange.bind(this)} value={this.state.code}/>
                </div>
            </div>
        );
    }
}

export default CodeToggle;