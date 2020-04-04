import React, {Component} from 'react';
import './index.css';
import Effect from "../../containers/Effect";
import Macro from '../../containers/Macro';
import PlusButton from "../util/PlusButton/PlusButton";

class TrackEditor extends Component {

    deleteMacro(macroId){
        this.props.globalActions.trackDeleteMacro(this.props.id, macroId);
    }

    addMacro(){
        this.props.globalActions.trackAddMacro(this.props.id);
    }

    render() {
        return (
            <div className="TrackEditor">
                <div>
                    <h1>{this.props.name}</h1>
                </div>
                <div>
                    <div>
                        <h2>Effects</h2>
                        {this.props.effects.map(effectId=><Effect key={effectId} id={effectId}/>)}
                    </div>
                    <div className={'macroContainer'}>
                        <h2>Macros</h2>
                        {this.props.macros.map(macroId => <Macro delete={()=>{this.deleteMacro.call(this, macroId)}} key={macroId} id={macroId}/>)}
                        <PlusButton style={{width:'50%', maxWidth:'80px'}} onClick={this.addMacro.bind(this)}/>
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
