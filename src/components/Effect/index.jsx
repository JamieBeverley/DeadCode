import React, {Component} from 'react';
import './index.css'
import throttle from 'lodash/throttle'
import EffectModel from "../../model/EffectModel";
import Id from "../../model/Id";
import Slider from "./Slider";

export default class Effect extends Component {
    render(){
        switch (this.props.type) {
            case EffectModel.Types.SLIDER:
                return (<Slider {...this.props}/>)
            default:
                console.warn('unrecognized effect type: '+this.props.type);
                return null;
        }
    }
}
