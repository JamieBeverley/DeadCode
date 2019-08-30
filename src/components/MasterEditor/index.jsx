import React, {Component} from 'react'
import './index.css'
import {Switch, TextField, Button} from '@material-ui/core';
import debounce from 'lodash/debounce'


import Effect from '../Effect';

export default class MasterEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection:this.props.connection
        }

        this.connect = debounce(()=>{
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        },2000);
    }

    updateEffect(newEffect){
        this.props.globalActions.updateMasterEffect(newEffect);
    }

    render(){
        let effects = [];
        for(let e in this.props.masterEffects){
            let effect = this.props.masterEffects[e];
            effects.push(
                <div key={effect.id} style={{margin:'5px',marginTop:'20px'}}>
                    <Effect updateEffect={this.updateEffect.bind(this)} {...effect}/>
                </div>
                )
        }
        return (
            <div className={'MasterEditor'} style={this.props.style}>
                <div>
                    Live
                    <Switch
                        color='primary'
                        onChange={this.toggle.bind(this)}
                        checked={this.props.live}
                    />
                    <Button color='primary' disabled={this.props.live} variant='outlined'>eval</Button>
                </div>
                <div className='separator'>
                    <h3>Effects</h3>
                    {effects}
                </div>
                <div className='separator' style={{border:this.props.connection.isConnected?'1pt solid grey':'1pt solid red'}}>
                    <h3>Connection</h3>
                    <div style={{}}>
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
        // this.props.globalActions.connect(url,port)
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