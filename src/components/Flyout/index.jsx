import React, {Component} from 'react';
import './index.css'
import MasterEditor from '../MasterEditor'
import StemEditor from "../StemEditor";

class Tab extends Component {
    render() {
        return (
            <div onClick={this.props.switchToTab} className={'Tab' + (this.props.selected ? '' : ' unselected')}>
                <label>{this.props.label}</label>
                {this.props.closeAble ?
                    <svg onClick={this.props.closeTab} xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                         viewBox="0 0 18 18">
                        <path
                            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                    </svg> : null}
                {this.props.selected ? <div className='indicator'/> : null}
            </div>
        )
    }
}

export default class Flyout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'master',
            history: []
        }
    }

    switchTab(tab) {
        let opened = this.props.stems.map(x => x.id);
        if (tab === 'master' || opened.includes(tab)) {
            let history = this.state.history.concat([tab]);
            this.setState({tab, history});
        } else {
            console.log('err tab not found')
        }
    }

    closeTab(stemId, e) {
        let tab, history;
        if (this.state.history.length - 1) {
            history = this.state.history.slice(0, -1);
            history = history.filter(x => x !== stemId);
            tab = history[history.length - 1] || 'master';
        } else {
            tab = 'master';
            history = this.state.history;
        }
        this.setState({tab, history});
        setTimeout(() => {
            this.props.globalActions.stemUpdate(stemId, {open: false});
            this.setState({tab, history});
        }, 1);
    }

    render() {
        let tabs = this.props.stems.map(x => {
            let tab = (
                <Tab
                    switchToTab={() => {this.switchTab.bind(this)(x.id)}}
                    label={x.name === '' ? '<untitled>' : x.name}
                    key={x.id+"_tab"}
                    id={x.id}
                    selected={this.state.tab === x.id}
                    closeAble={true}
                    closeTab={e => {this.closeTab.call(this, x.id, e)}}
                />);
            let content = (<StemEditor
                    style={{display: (this.state.tab === x.id ? 'block' : 'none')}}
                    key={x.id+"_editor"}
                    {...x}
                    globalActions={this.props.globalActions}
                />
            );
            return {tab, content}
        });


        return (
            <div className='Flyout' style={this.props.style}>
                <div className={'scrollbarHidden'}>
                    <div className={'TabContainer'}>
                        <Tab
                            switchToTab={() => {
                                this.switchTab.bind(this)('master')
                            }}
                            value={'master'}
                            label='master'
                            selected={this.state.tab === 'master'}
                        />
                        {tabs.map(x => x.tab)}
                    </div>
                </div>
                <div className={'content'}>
                    <MasterEditor
                        {...this.props}
                        value={'master'}
                        style={{display: this.state.tab === 'master' ? 'block' : 'none'}}
                    />
                    {tabs.map(x => x.content)}
                </div>

            </div>
        )
    }
}
