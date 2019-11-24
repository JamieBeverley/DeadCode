import React, {Component} from 'react';
import CodeEditor from "../../CodeEditor";
import Effect from "../../../containers/Effect";
import EffectComponent from "../../Effect";
import Model from "../../../model";
import EffectModel from "../../../model/EffectModel";
import EffectCreator from "../../Effect/EffectCreator";

class LanguageControls extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    changeTempo(id, effect) {
        let val = this.props
        val.properties.tempo = effect.properties.value;
        this.props.globalActions.masterUpdate(Model.Languages.TidalCycles, val);
    }

    onChangeLive(value){

    }

    getLanguageSpecific() {
        switch (this.props.language) {
            case Model.Languages.TidalCycles:
                let e = {
                    language: "TidalCycles", on: true,
                    properties: {
                        code: 'Tempo',
                        max: 300,
                        min: 0,
                        operator: "",
                        scale: "linear",
                        step: 0.01,
                        value: this.props.properties.tempo
                    },
                    globalActions:{effectUpdate:this.changeTempo.bind(this)},
                    noToggle: true,
                    key: 'tempo',
                    type:"SLIDER",
                    updateEffect: this.changeTempo.bind(this),
                }

                return [
                    <CodeEditor
                        key={'tidalEditorMain'}
                        onChange={(macros) => {
                            this.props.globalActions.updateMaster(this.props.language, {macros});
                        }}
                        onChangeLive={(bootScriptLive) => {
                            this.setState({bootScriptLive})
                        }}
                        code={this.props.macros}
                        live={false}
                    />,
                    <EffectComponent {...e}/>
                ]
            case Model.Languages.Hydra:
                return null
            default:
                console.warn('unrecognized language: ' + this.props.language)
                return null;
        }
    }

    newEffect(type, properties){
        this.props.globalActions.masterAddEffect(type, this.props.language,false,properties);
    }

    updateEffect(e) {
        this.props.globalActions.updateMasterEffect(e);
    }

    effectIdToComponent(id) {
        return <Effect key={id} id={id} updateEffect={this.updateEffect.bind(this)}/>
    }

    render() {
        const effects = this.props.effects.map(this.effectIdToComponent.bind(this));
        const languageSpecific = this.getLanguageSpecific();
        return (
            <div className="LanguageControls">
                {languageSpecific}
                {effects}
                <EffectCreator onCreate={this.newEffect.bind(this)}/>
            </div>
        );
    }
}

export default LanguageControls;
