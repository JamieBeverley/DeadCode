import React, {Component} from 'react'
import './index.css'
import {TextField} from '@material-ui/core';
import debounce from 'lodash/debounce'
import Effect from '../Effect';
import CodeEditor from "../CodeEditor";

export default class MasterEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection:this.props.connection,
            bootScript:this.props.bootScript,
            bootScriptLive:false
        };

        this.updateBootScript = debounce((x)=>{
            this.props.globalActions.updateBootScript(x)
        },4000);

        this.connect = debounce(()=>{
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        },2000);
    }

    updateEffect(newEffect){
        this.props.globalActions.updateMasterEffect(newEffect);
    }

    render(){
        let effects = [];
        for(let i=0; i < this.props.masterEffects.length; i++){
            let effect = this.props.masterEffects[i];
            effects.push(
                <div key={effect.id} style={{margin:'5px',marginTop:'20px'}}>
                    <Effect updateEffect={this.updateEffect.bind(this)} {...effect}/>
                </div>
                )
        }

        return (
            <div className={'MasterEditor'} style={this.props.style}>
                <div className='separator'>
                    <h3>Effects</h3>
                    {effects}
                </div>
                 <div className='separator'>
                    <h3>Tempo</h3>
                     <Effect
                         key={Math.random()}
                         noToggle
                         name={'Tempo'}
                         id={'tempo'}
                         on={true}
                         scale={'linear'}
                         operator={''}
                         min={0}
                         max={200}
                         value={this.props.tempo}
                         step={0.01}
                         updateEffect={this.changeTempo.bind(this)}
                     />

                </div>
                <div className='separator'>
                    <h3>Boot Script</h3>
                    <CodeEditor
                        key={Math.random()}
                        onChange={(code)=>{this.props.globalActions.updateBootScript(code)}}
                        onChangeLive={(bootScriptLive)=>{this.setState({bootScriptLive})}}
                        code={this.props.bootScript}
                        live={this.state.bootScriptLive}
                    />

                </div>

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


    changeTempo(effect){
        this.props.globalActions.updateTempo(effect.value);
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