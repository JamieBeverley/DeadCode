import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import CloseIcon from '@material-ui/icons/Close';


import './index.css'
import MasterEditor from '../MasterEditor'

import StemEditor from "../StemEditor";


const CustomTabs = withStyles({
    indicator: {
        backgroundColor: 'grey',
        width:'50%',
        minWidth:'0px'
    },
    root:{
        backgroundColor: 'var(--stem-on)',
        color: 'black'
    }
})(Tabs);

const CustomTab = withStyles({
    root: {
        color: '#black',
        opacity:0.4,
        minWidth:'80px',
        maxWidth:'130px',
        overflow:'hidden',
        padding:'2px',
        // borderRight:'1pt solid grey',
        textTransform: 'none',
        fontWeight:'regular',
        fontSize: '12px',
        float:'left',
        fontFamily:'var(--font-family)',
        '&:focus': {
            opacity: 1,
        }
    }
})(props => {
    console.log(props)
    return (
        <div style={{padding:'5px'}}>
                <Tab disableRipple {...props}/>

            {props.master?null:
                <IconButton
                    onClick={()=>{
                        props.globalActions.updateStem(props.trackId, props.id, {open:false});}
                    }
                    sizeSmall={{height:'10px'}}
                    style={{opacity:1,float:'left',height:'10px'}} size={'small'} aria-label="close">
                    <CloseIcon />
                </IconButton>}
        </div>
    )
});

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let prevOpened = this._getOpenStems(prevProps);
        let nowOpened = this._getOpenStems(this.props);
        let newOpen = nowOpened.filter(x=>{return!prevOpened.includes(x)})[0];
        let newClose = prevOpened.filter(x=>{return !nowOpened.includes(x)})[0];
        if(newOpen){
            this.setState({tab:newOpen.id+"_"+newOpen.trackId});
        } else if(newClose){
            this.setState({tab:'master'});
        }
    }

    _getOpenStems(props){
        return props.tracks.map(x=>x.stems).flat().filter(x=>x.open);
    }

    render(){
        let openStems = this.props.tracks.map(x=>x.stems).flat().filter(x=>x.open);
        let tabs = openStems.map(x=>{
            let keyVal = x.id+'_'+x.trackId;
            let tab = (
                <CustomTab
                    value={keyVal}
                    label={x.name===''?'<untitled>':x.name}
                    key={keyVal}
                    trackId={x.trackId}
                    id={x.id}
                    {...this.props}/>);
            let content = (<StemEditor
                style={{display:(this.state.tab===keyVal?'block':'none')}}
                value={keyVal}
                key={keyVal}
                {...x}
                />
                );
            return {tab, content}
        });

        return (
            <div className={'Flyout'}>
                <AppBar position="static" color="default">
                    <CustomTabs
                        value={this.state.tab}
                        onChange={this.handleChange.bind(this)}
                        scrollButtons="auto"
                        className="Tabs"
                        aria-label="scrollable auto tabs example">

                        <CustomTab master={true} label={'Master'} value={'master'} {...this.props}/>
                        {tabs.map(x=>x.tab)}
                    </CustomTabs>

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