import React, {Component} from 'react';
import './index.css';
import Effect from "../../containers/Effect";
import Macro from '../../containers/Macro';
import PlusButton from "../util/PlusButton/PlusButton";

class TrackEffect extends Component {

    deleteMacro(macroId){
        this.props.globalActions.trackDeleteMacro(this.props.id, macroId);
    }

    addMacro(){
        this.props.globalActions.trackAddMacro(this.props.id);
    }

    render() {
        return (
            <div className="TrackEffect">
                <div>
                    <b>{this.props.name}</b>
                </div>
                <div>
                    <div>
                        <h1>Effects</h1>
                        {this.props.effects.map(effectId=><Effect key={effectId} id={effectId}/>)}
                    </div>
                    <div className={'macroContainer'}>
                        <h1>Macros</h1>
                        {this.props.macros.map(macroId=> <Macro delete={this.deleteMacro.bind(this)} key={macroId} id={macroId}/>)}
                        <PlusButton style={{width:'50%', maxWidth:'80px'}} onClick={this.addMacro.bind(this)}/>
                    </div>
                    <div>
                        <h1>Delete</h1>
                        <button onClick={()=>{this.props.globalActions.trackDelete(this.props.id)}}>delete track</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackEffect;
