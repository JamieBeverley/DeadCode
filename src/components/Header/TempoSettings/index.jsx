import './index.css'

import React, {Component} from 'react';
import Languages from "../../../model/Languages";

class TempoSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state[Languages.TidalCycles.name] = {nudge: 0.125, tempo: this.props.master[Languages.TidalCycles.name].properties.tempo};
        this.state[Languages.SuperCollider.name] = {nudge: 0.125, tempo: this.props.master[Languages.SuperCollider.name].properties.tempo};
    }

    nudge(language){
        this.props.globalActions.tempoNudge(language, this.state[language].nudge);
    }

    updateTempo(language, tempo){
        const properties = {...this.props.master[language].properties, tempo};
        this.props.globalActions.masterUpdate(language, {properties});
        this.setState({[language]:{...this.state[language], tempo}})
    }

    resetBeats(){
        this.props.globalActions.tempoBeatsReset([Languages.SuperCollider.name, Languages.TidalCycles.name]);
    }

    render() {
        return (
            <div className={"TempoSettings"}>
                {
                    [Languages.SuperCollider.name, Languages.TidalCycles.name].map(language=>{
                        return (
                            <div key={language}>
                                {language}
                                <div>
                                    tempo
                                    <input
                                        type="number"
                                        value={this.state[language].tempo}
                                        onChange={x=>this.updateTempo.call(this, language, parseInt(x.target.value))}
                                    />
                                </div>
                                <div>
                                    nudge
                                    <input
                                        type="text"
                                        value={this.state[language].nudge}
                                        onChange={x=>{this.setState({[language]:{...this.state[language], nudge:x.target.value}})}}
                                    />
                                    <button onClick={()=>this.nudge.call(this, language)}> > </button>
                                </div>
                            </div>
                        )
                    })
                }
                <button onClick={this.resetBeats.bind(this)}>Reset Beats</button>
            </div>
        );
    }
}

export default TempoSettings;