import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './index.css'
import MasterEditor from '../MasterEditor'

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
        let openStems = this.props.tracks.map(x=>x.stems).flat().filter(x=>x.open);
        let tabs = openStems.map(x=>{
            let keyVal = x.id+'_'+x.trackId;
            let tab = (<Tab className={"Tab"} value={keyVal} label={x.name===''?'<untitled>':x.name} key={keyVal}/>);
            let content = (<StemEditor
                style={{display:(this.state.tab===keyVal?'block':'none')}}
                value={keyVal}
                key={keyVal}
                {...x}
                />
                );
            return {tab, content}
        });

        // let tabs = this.props.flyout.open.map(x=>{
        //     let stem = this.props.tracks.find(a=>{return a.id===x.trackId}).stems.find(a=>{return a.id===x.stemId});
        //     let keyVal = x.stemId+'_'+x.trackId;
        //     let tab = (<Tab value={keyVal} label={stem.name} key={keyVal}/>);
        //     let content = (<StemEditor style={{display:(this.state.tab===keyVal?'block':'none')}} value={keyVal} key={keyVal}/>);
        //     return {tab, content}
        // });

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
                        className="Tabs"
                        aria-label="scrollable auto tabs example">
                        <Tab className={'Tab'} label={'Master'} value={'master'} ></Tab>
                        {tabs.map(x=>x.tab)}
                    </Tabs>

                </AppBar>
                <MasterEditor
                    value={'master'}
                    style={{display:this.state.tab==='master'?'block':'none'}}
                    {...this.props}
                />
                {tabs.map(x=>x.content)}

            </div>
        )
    }
}