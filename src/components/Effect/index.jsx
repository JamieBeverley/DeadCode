import React, {Component} from 'react';
import './index.css'
import EffectModel from "../../model/EffectModel";
import Slider from "./Slider";
import CodeToggle from "./CodeToggle";
import CodeSlider from "./CodeSlider";

export default class Effect extends Component {
    render() {
        let component;

        if (this.props.type === EffectModel.Types.SLIDER) {
            component = <Slider {...this.props}/>;
        } else if (this.props.type === EffectModel.Types.CODE_TOGGLE) {
            component = <CodeToggle {...this.props}/>;
        } else if (this.props.type === EffectModel.Types.CODE_SLIDER) {
            component = <CodeSlider {...this.props}/>;
        } else {
            debugger;
        }

        return (
            <div className={'Effect'}>{component}</div>
        )
    }
}
