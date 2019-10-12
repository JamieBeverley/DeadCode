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
        let val = this.props
        val.properties.tempo = effect.properties.value;
        this.props.globalActions.updateMaster(Model.Languages.TidalCycles,val);
    }

    getLanguageSpecific() {
        console.log(this.props.language);
        switch (this.props.language) {
            case Model.Languages.TidalCycles:
                let effect = EffectModel.getNew('tempo', EffectModel.Types.SLIDER, Model.Languages.TidalCycles, true,
                    {
                        value: this.props.properties.tempo, min: 0, max: 300, step: 0.01, scale: 'linear'});
                return [
                    <CodeEditor
                        onChange={(macros) => {
                            this.props.globalActions.updateMaster(this.props.language,{macros});
                        }}
                        onChangeLive={(bootScriptLive) => {
                            this.setState({bootScriptLive})
                        }}
                        code={this.props.macros}
                        live={false}
                    />,
                    <Effect noToggle key={effect.id} updateEffect={this.changeTempo.bind(this)} {...effect}/>
                ]
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
                {languageSpecific}
                {effects}
            </div>
        );
    }
}

export default LanguageControls;