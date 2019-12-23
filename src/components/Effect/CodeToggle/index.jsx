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

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if props are different from state the let props override (eg. from server)
        // but only if theres an actual difference in prev props and current props
        if(prevProps.properties.code!== this.props.properties.code && this.props.properties.code!==this.state.code){
            this.setState({...this.state, code:this.props.properties.code});
        }
    }

    render() {
        return (
            <div className={'CodeToggle'}>
                <div>
                    <Toggle on={this.props.on} onChange={this.onToggle.bind(this)}/>
                    <div className={'text'}><div>Code Toggle</div></div>
                </div>
                <div>
                    <input type={'text'} onChange={this.onChange.bind(this)} value={this.state.code}/>
                </div>
            </div>
        );
    }
}

export default CodeToggle;