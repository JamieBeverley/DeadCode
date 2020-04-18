import React, {Component} from 'react';
import './index.css';
import Effect from "../../containers/Effect";
import Macro from '../../containers/Macro';
import PlusButton from "../util/PlusButton/PlusButton";
import EffectCreator from "../Effect/EffectCreator";
import EffectContainer from "../EffectContainer";
import MacroContainer from "../MacroContainer";

class TrackEditor extends Component {

    deleteMacro(macroId){
        this.props.globalActions.trackDeleteMacro(this.props.id, macroId);
    }

    createMacro(){
        this.props.globalActions.trackAddMacro(this.props.id);
    }

    deleteMacro(macroId){
        this.props.globalActions.trackDeleteMacro(this.props.id, macroId)
    }

    createEffect(type, properties) {
        this.props.globalActions.trackAddEffect(this.props.id, type, this.props.language, false, properties);
    }

    render() {
        return (
            <div className="TrackEditor">
                <div>
                    <h1>{this.props.name}</h1>
                </div>
                <div>
                    <EffectContainer effects={this.props.effects} createEffect={this.createEffect.bind(this)}/>
                    <MacroContainer macros={this.props.macros} createMacro={this.createMacro.bind(this)} deleteMacro={this.deleteMacro.bind(this)}/>
                    <div>
                        <h2>Move</h2>
                        <button onClick={()=>{this.props.globalActions.trackReorder(this.props.id, this.props.position-1)}}> Move Left </button>
                        <button onClick={()=>{this.props.globalActions.trackReorder(this.props.id, this.props.position+1)}}> Move Right </button>
                    </div>
                    <div>
                        <h2>Delete</h2>
                        <button onClick={()=>{this.props.globalActions.trackDelete(this.props.id)}}>delete track</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackEditor;
