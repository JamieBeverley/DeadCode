import React, {Component} from 'react'
import './index.css'
import {TextField} from '@material-ui/core';
import debounce from 'lodash/debounce'
import LanguageControls from "./LanguageControls";

export default class MasterEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection:this.props.connection,
            language:Object.keys(this.props.master)[0]
        };

        this.connect = debounce(()=>{
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        },2000);
    }

    updateEffect(newEffect){
        this.props.globalActions.updateMasterEffect(newEffect);
    }

    languageChange(e){
        this.setState(Object.assign({},this.state,{language:e.target.value}))
    }

    render(){

        const languageOpts = Object.keys(this.props.master).map(lang=>{return <option key={lang} value={lang}>{lang}</option>});

        return (
            <div className={'MasterEditor'} style={this.props.style}>

                <select onChange={this.languageChange.bind(this)} value={this.state.language}>
                    {languageOpts}
                </select>

                <LanguageControls
                    {...this.props.master[this.state.language]}
                    language={this.state.language}
                    globalActions={this.props.globalActions}
                />

                <div className='separator' style={{border:this.props.connection.isConnected?'1pt solid var(--stem-off)':'1pt solid red'}}>
                    <h3>Connection</h3>
                    <div>
                        <TextField
                            style={{width:'50%',marginLeft:'5px'}}
                            label="URL"
                            value={this.state.connection.url}
                            onChange={(e)=>{
                                let connection = this.state.connection;
                                connection.url = e.target.value;
                                this.setState({connection});
                                this.connect();
                            }}
                            margin="normal"
                        />
                        <TextField
                            style={{width:'50%',marginLeft:'5px',maxWidth:'100px'}}
                            label="Port"
                            type='number'
                            value={this.state.connection.port}
                            onChange={(e)=>{
                                let connection = this.state.connection;
                                connection.port = parseInt(e.target.value);
                                this.setState({connection});
                                this.connect();
                            }}
                            margin="normal"
                        />
                    </div>
                </div>
            </div>
        )
    }

    connect(url=this.props.connection.url, port=this.props.connection.port){
        let connection = {url:url,port:port,isConnected:this.state.isConnected};
        this.setState({connection});
        debounce(()=> {
            this.props.globalActions.connect(url, port)
        },3000, {trailing:true})();
    }

    updateConnect(url,port){
        this.props.globalActions.connect(url,port)
    }


    toggle(e){
        this.props.globalActions.toggleLive(e.target.checked)
    }
}