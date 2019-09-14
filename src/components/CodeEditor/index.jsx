import React, {Component} from 'react'
import './index.css'
import debounce from "lodash/debounce";
import {Button, Switch} from "@material-ui/core";

export default class CodeEditor extends Component {

    // onChange, onChangeLive, code, live
    constructor(props){
        super(props);

        this.state = {code:this.props.code};
        this.updateCode = debounce(this.props.onChange, 1000);
        this.flashTimeout = null;
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
                    className={this.state.flash?'flash':''}
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
                clearTimeout(this.flashTimeout);
                this.setState({flash:true});
                this.flashTimeout =  setTimeout(()=>{this.setState({flash:false})},1);
            }
        }
    }
}