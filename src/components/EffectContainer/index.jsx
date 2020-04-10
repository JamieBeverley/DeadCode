import React, {Component} from 'react';
import Effect from "../../containers/Effect";
import EffectCreator from "../Effect/EffectCreator";
import './index.css';

class EffectContainer extends Component {
    render() {
        return (
            <div className={"EffectContainer"}>
                <h2>Effects</h2>
                {this.props.effects.map(effectId => <Effect key={effectId} id={effectId}/>)}
                <EffectCreator onCreate={this.props.createEffect}/>
            </div>
        );
    }
}

export default EffectContainer;
