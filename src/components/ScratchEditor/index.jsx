import React, {Component} from 'react';
import './index.css';
import debounce from 'lodash/debounce'
import Toggle from "../util/Toggle";

class ScratchEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontSize: 36
        };
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.focus();
    }

    onNameChange = (e) => {
        this.props.globalActions.scratchUpdate(this.props.id, {name: e.target.value});
    };

    onCodeChange = (e) => {
        this.props.globalActions.scratchUpdate(this.props.id, {code: e.target.value});
    };

    onOnChange = on => {
        this.props.globalActions.scratchUpdate(this.props.id, {on});
    };

    exportToTrack = () => {
      this.props.globalActions.scratchTranslate(this.props.id);
    };

    onKeyPress = e => {
        if (e.ctrlKey) {
            if (e.keyCode === 187) {
                e.preventDefault();
                this.setState({fontSize: this.state.fontSize + 1});
            } else if (e.keyCode === 189) {
                e.preventDefault();
                this.setState({fontSize: this.state.fontSize - 1});
            }
        }
        if (e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
            this.props.globalActions.scratchRender();
        }
    };

    render() {
        return (
            <div className="ScratchEditor">
                <div className="header">
                    <input value={this.props.name} onChange={this.onNameChange.bind(this)}/>
                    <Toggle on={this.props.on} onChange={this.onOnChange.bind(this)}/>
                    <button onClick={this.exportToTrack.bind(this)}>export to track</button>
                </div>
                <textarea style={{fontSize: this.state.fontSize}} onKeyDown={this.onKeyPress.bind(this)}
                          value={this.props.code}
                          onChange={this.onCodeChange.bind(this)}
                          ref={this.ref}
                />
            </div>
        );
    }
}

export default ScratchEditor;
