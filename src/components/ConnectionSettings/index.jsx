import React, {Component} from 'react';
import {TextField} from "@material-ui/core";
import debounce from "lodash/debounce";

class ConnectionSettings extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection:{...this.props},
        };
        this.connect = debounce(()=>{
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        },2000);
    }

    render() {
        return (
            <div className={'ConnectionSettings'}>
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
                    <button style={{width:'80%'}} onClick={this.connect}>reconnect</button>
                </div>
            </div>
        );
    }
}

export default ConnectionSettings;