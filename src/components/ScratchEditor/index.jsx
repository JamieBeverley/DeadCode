import React, {Component} from 'react';
import './index.css';

class ScratchEditor extends Component {

    onCodeChange = (e) =>{
        this.props.globalActions.scratchUpdate(this.props.id,{code:e.target.value});
    };

    onKeyPress = e => {
        // console.log(e.key, e.keyCode);
    };

    render() {
        return (
            <div className={'ScratchEditor'}>
                <textarea onKeyDown={this.onKeyPress.bind(this)} value={this.props.code} onChange={this.onCodeChange.bind(this)}/>
            </div>
        );
    }
}


export default ScratchEditor;
