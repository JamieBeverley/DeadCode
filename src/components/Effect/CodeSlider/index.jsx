import React, {Component} from 'react';
import Toggle from "../../util/Toggle";
import TemplateInput from "../../util/TemplateInput";

/*
    CODE_SLIDER:{
        code: 'string',
        injectIndices: 'array',
        value: 'float',
        min: 'float',
        max: 'float',
        step: 'float',
        scale: 'string'
    }
 */

class CodeSlider extends Component {

    onToggle(on){
        this.props.globalActions.effectUpdate(this.props.id, {on});
    }

    onChange(...args){
        console.log(...args)
    }

    render() {
        return (
            <div className={'CodeSlider'}>
                <div>
                    <Toggle on={this.props.on} onChange={this.onToggle.bind(this)}/>
                    <div className={'text'}><div>Code Slider</div></div>
                </div>
                <TemplateInput onChange={this.onChange.bind(this)} text={this.props.properties.code} indices={this.props.properties.indices} value={this.props.properties.value} />

            </div>
        );
    }
}

export default CodeSlider;