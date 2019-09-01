import React, {Component} from 'react'
import './index.css'
import debounce from "lodash/debounce";
import {Button, Switch} from "@material-ui/core";

export default class CodeEditor extends Component {

    // onChange, onChangeLive, code, live
    constructor(props){
        super(props);

        this.textAreaRef = React.createRef();
        this.state = {code:this.props.code};
        this.updateCode = debounce(this.props.onChange, 1000);
    }

    render(){

        return (

            <div className={'CodeEditor'}>
                Live
                <Switch
                    color='primary'
                    onChange={(e)=>{this.props.onChangeLive(e.target.checked)}}
                    checked={this.props.live}
                />
                <Button color='primary' disabled={this.props.live} onClick={(e)=>{this.updateCode.bind(this)(e.target.value)}} variant='outlined'>eval</Button>

                <textarea
                    ref={this.textAreaRef}
                    onKeyPress={this.onKeyPress.bind(this)}
                    onChange={(e)=>{
                        this.setState({code:e.target.value});
                        if(this.props.live){
                            this.updateCode.bind(this)(e.target.value)
                        }
                    }
                    }
                    value={this.state.code}
                />

            </div>

        )
    }

    onKeyPress(e) {
        if(e.shiftKey){
            if(e.key==='Enter'){
                e.preventDefault();
                this.props.onChange(this.state.code);
                // this.props.globalActions.updateStem(this.props.trackId, this.props.id, {code:this.state.code});
                this.textAreaRef.current.classList.add('flash');
                setTimeout(()=>{this.textAreaRef.current.classList.remove('flash')},250);
            }
        }
    }
}