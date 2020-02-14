import React, {Component} from 'react';
import CodeEditor from "../../../CodeEditor";
import Languages from "../../../../model/Languages";
import EffectComponent from "../../../Effect";

class SuperColliderMaster extends Component {
    render() {
        const tempo = {
            language: Languages.SuperCollider.name, on: true,
            properties: {
                code: 'Tempo',
                max: 300,
                min: 0,
                operator: "",
                scale: "linear",
                step: 0.01,
                value: this.props.properties.tempo
            },
            globalActions:{effectUpdate:this.props.changeTempo.bind(this)},
            noToggle: true,
            key: 'tempo',
            type:"SLIDER",
            updateEffect: this.props.changeTempo.bind(this),
        }


        return [
            <CodeEditor
                key={'SCEditorMain'}
                onChange={(macros) => {
                    this.props.globalActions.masterUpdate(this.props.language, {macros});
                }}
                onChangeLive={(bootScriptLive) => {
                    this.setState({bootScriptLive})
                }}
                code={this.props.macros}
                live={false}
            />,
            <EffectComponent {...tempo}/>,
            // <div>
            //     <span>Channels</span>
            //     <input type="number" step={1} value={this.props.properties.channels}/>
            // </div>
        ]
    }
}

export default SuperColliderMaster;