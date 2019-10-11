import React, {Component} from 'react';
import CodeEditor from "../../CodeEditor";
import Effect from "../../Effect";
import Model from "../../../model";
import EffectModel from "../../../model/EffectModel";

class LanguageControls extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    changeTempo(effect) {
        this.props.globalActions.updateTempo(effect.value);
    }

    getLanguageSpecific() {
        console.log(this.props.language);
        switch (this.props.language) {
            case Model.Languages.TidalCycles:
                let effect = EffectModel.getNew('tempo', EffectModel.Types.SLIDER, Model.Languages.TidalCycles, true,
                    {value: this.props.properties.tempo, min: 0, max: 300, step: 0.01, scale: 'linear'
                    });
                return (
                    <Effect noToggle key={effect.id} updateEffect={x=>{console.log('not yet implemented update tempo')}} {...effect}/>
                )
            case Model.Languages.Hydra:
                return null;
            default:
                console.warn('unrecognized language: ' + this.props.language)
                return null;
        }
    }

    updateEffect(e) {
        this.props.globalActions.updateMasterEffect(e);
    }

    render() {
        const effects = this.props.effects.map(effect => {
            return <Effect key={effect.id} updateEffect={this.updateEffect.bind(this)} {...effect}/>
        });
        const languageSpecific = this.getLanguageSpecific();
        return (
            <div className="LanguageControls">
                <CodeEditor
                    onChange={(code) => {
                        this.props.globalActions.updateBootScript(code)
                    }}
                    onChangeLive={(bootScriptLive) => {
                        this.setState({bootScriptLive})
                    }}
                    code={this.props.macros}
                    live={false}
                />

                <div className={"EffectGroup"}>
                    {effects}
                </div>

                {languageSpecific}
            </div>
        );
    }
}

export default LanguageControls;