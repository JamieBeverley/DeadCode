import React, {Component} from 'react';
import './index.css'
import MasterEditor from '../MasterEditor'
import StemEditor from "../StemEditor";

// const CustomTab = withStyles({
//     root: {
//         color: '#black',
//         opacity:0.4,
//         minWidth:'80px',
//         maxWidth:'130px',
//         overflow:'hidden',
//         padding:'2px',
//         // borderRight:'1pt solid grey',
//         textTransform: 'none',
//         fontWeight:'regular',
//         fontSize: '12px',
//         // float:'left',
//         fontFamily:'var(--font-family)',
//         '&:focus': {
//             opacity: 1,
//         }
//     }
// })(props => {
//     return (
//         <div style={{padding:'5px'}}>
//                 <Tab disableRipple {...props}/>
//
//             {true?null:
//                 <IconButton
//                     onClick={()=>{
//                         props.globalActions.updateStem(props.trackId, props.id, {open:false});}
//                     }
//                     sizeSmall={{height:'10px'}}
//                     style={{opacity:1,height:'10px'}} size={'small'} aria-label="close">
//                     <CloseIcon />
//                 </IconButton>}
//         </div>
//     )
// });
// class TabBar extends Component {
//     constructor (props){
//         super(props)
//     }
//
//     render(){
//         return (
//             <div className='TabBar'> this.props.label</div>
//         )
//     }
// }

class Tab extends Component {
    // constructor (props){
    //     super(props)
    // }

    render(){
        return (
            <div onClick={this.props.switchToTab} className={'Tab'+(this.props.selected?'':' unselected')}>
                <label>{this.props.label}</label>
                {this.props.closeAble?
                    <svg onClick={this.props.closeTab} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                    </svg>:null}
                {this.props.selected?<div className='indicator'/>:null}
            </div>
        )
    }
}

export default class Flyout extends Component{
    constructor(props){
        super(props);
        this.state = {
            tab:'master',
            history:[]
        }
    }
    switchTab(tab){
        let opened = this._getOpenedStems().map(x=>x.id+"_"+x.trackId);
        if(tab==='master' || opened.includes(tab)){
            let history = this.state.history.concat([tab]);
            this.setState({tab,history});
        }
    }

    closeTab(trackId, stemId){

        let tab, history;
        if(this.state.history.length-1){
            history = this.state.history.slice(0,-1);
            history = history.filter(x=>x!==stemId+"_"+trackId);
            tab = history[history.length-1] || 'master';
        } else {
            tab = 'master';
            history = this.state.history;
        }
        this.setState({tab,history});
        setTimeout(()=>{
            this.props.globalActions.updateStem(trackId,stemId,{open:false});
            this.setState({tab,history});
        },1);
    }

    render(){
        let openStems = this.props.stems
        if(this.state.tab!=='master' && !openStems.map(x=>x.id+"_"+x.trackId).includes(this.state.tab)){
            this.switchTab('master');
        }
        let tabs = openStems.map(x=>{
            let keyVal = x.id+'_'+x.trackId;
            let tab = (
                <Tab
                    switchToTab={()=>{this.switchTab.bind(this)(keyVal)}}
                    value={keyVal}
                    label={x.name===''?'<untitled>':x.name}
                    key={keyVal}
                    trackId={x.trackId}
                    id={x.id}
                    selected={this.state.tab === keyVal}
                    closeAble={true}
                    closeTab={()=>{this.closeTab.bind(this)(x.trackId,x.id)}}
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
            <div className='Flyout' style={this.props.style}>
                <div className={'scrollbarHidden'}>
                    <div className={'TabContainer'}>
                        <Tab
                            switchToTab={()=>{this.switchTab.bind(this)('master')}}
                            value={'master'}
                            label='master'
                            selected={this.state.tab==='master'}
                        />
                        {tabs.map(x=>x.tab)}
                    </div>
                </div>
                <div className={'content'}>
                    <MasterEditor
                        {...this.props}
                        value={'master'}
                        style={{display:this.state.tab==='master'?'block':'none'}}
                    />
                    {tabs.map(x=>x.content)}
                </div>

            </div>
        )
    }
}
