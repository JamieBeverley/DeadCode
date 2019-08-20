import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './index.css'

import StemEditor from "../StemEditor";

export default class Flyout extends Component{
    constructor(props){
        super(props);
        this.state = {
            tab:'master'
        }
    }
    handleChange(e,tab){
        this.setState({tab});
    }

    render(){
        let tabs = this.props.flyout.open.map(x=>{
            let stem = this.props.tracks.find(a=>{return a.id===x.trackId}).stems.find(a=>{return a.id===x.stemId});
            let keyVal = x.stemId+'_'+x.trackId;
            let tab = (<Tab value={keyVal} label={stem.name} key={keyVal}/>);
            let content = (<StemEditor style={{display:(this.state.tab===keyVal?'block':'none')}} value={keyVal} key={keyVal}/>);
            return {tab, content}
        });

        return (
            <div className={'Flyout'}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.tab}
                        onChange={this.handleChange.bind(this)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example">

                        <Tab label={'Master'} value={'master'} ></Tab>
                        {tabs.map(x=>x.tab)}
                    </Tabs>

                    <div value={'master'} style={{display:this.state.tab==='master'?'block':'none'}}><textarea/></div>
                    {tabs.map(x=>x.content)}
                </AppBar>
            </div>
        )
    }
}