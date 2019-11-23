import React, {Component} from 'react';
import './index.css'
import throttle from 'lodash/throttle'
import EffectModel from "../../model/EffectModel";
import Id from "../../model/Id";
import Slider from "./Slider";
import CodeToggle from "./CodeToggle";

export default class Effect extends Component {
    render(){
        switch (this.props.type) {
            case EffectModel.Types.SLIDER:
                return (<div className={'Effect'}><Slider {...this.props}/></div>)
            case EffectModel.Types.CODE_TOGGLE:
                return (<div className={'Effect'}><CodeToggle {...this.props}/></div>)
            default:
                console.warn('unrecognized effect type: '+this.props.type);
                debugger;
                return null;
        }
    }
}
