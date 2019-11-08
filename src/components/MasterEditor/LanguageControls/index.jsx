import React, {Component} from 'react';
import CodeEditor from "../../CodeEditor";
import Effect from "../../../containers/Effect";
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
        switch (this.props.language) {
            case Model.Languages.TidalCycles:
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
                    null
                    // <Effect noToggle key={effect.id} updateEffect={this.changeTempo.bind(this)} {...effect}/>
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

    effectIdToComponent(id){
        return <Effect key={id} id={id} updateEffect={this.updateEffect.bind(this)} />
    }

    render() {
        const effects = this.props.effects.map(this.effectIdToComponent.bind(this));
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
