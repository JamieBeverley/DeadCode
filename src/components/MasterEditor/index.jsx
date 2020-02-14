import React, {Component} from 'react'
import './index.css'
import LanguageControls from "./LanguageControls";
import Languages from "../../model/Languages";

export default class MasterEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            language:Object.keys(this.props.master)[0]
        };
    }

    languageChange(e){
        this.setState(Object.assign({},this.state,{language:e.target.value}))
    }

    render(){

        // const languageOpts = Object.keys(this.props.master).map(lang=>{return <option key={lang} value={lang}>{lang}</option>});
        const languageOpts = Object.keys(Languages).map(lang=>{return <option key={lang} value={lang}>{lang}</option>});
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
            </div>
        )
    }

    toggle(e){
        this.props.globalActions.toggleLive(e.target.checked)
    }
}
