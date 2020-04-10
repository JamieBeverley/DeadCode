import React, {Component} from 'react';
import Macro from "../../containers/Macro";
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";

class MacroContainer extends Component {
    render() {
        return (
            <div className={"MacroContainer"}>
                <h2>Macros</h2>
                {this.props.macros.map(macroId => <Macro key={macroId} id={macroId} delete={this.props.deleteMacro}/>)}
                <PlusButton style={{width:'50%', maxWidth:'80px'}} onClick={this.props.createMacro}/>
            </div>
        );
    }
}

export default MacroContainer;
