import React, {Component} from 'react'
import './index.css'
import debounce from "lodash/debounce";
import Toggle from "../util/Toggle";

export default class CodeEditor extends Component {

    // onChange, onChangeLive, code, live
    constructor(props) {
        super(props);

        this.state = {code: this.props.code};
        this.updateCode = debounce(this.props.onChange, 1000);
        this.flashTimeout = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.code !== this.props.code && (this.props.code !== this.state.code)) {
            this.setState({code: this.props.code});
        }
    }

    render() {

        let inputComponent;
        if (this.props.inputComponent) {
            const InputComponent = this.props.inputComponent;
            inputComponent = <InputComponent
                className={this.state.flash ? 'flash' : ''}
                onKeyPress={this.onKeyPress.bind(this)}
                onChange={(e) => {
                    this.setState({code: e.target.value});
                    if (this.props.live) {
                        this.updateCode.bind(this)(e.target.value)
                    }
                }
                }
                value={this.state.code}
            />
        } else {
            inputComponent = <textarea
                className={this.state.flash ? 'flash' : ''}
                onKeyPress={this.onKeyPress.bind(this)}
                onChange={(e) => {
                    this.setState({code: e.target.value});
                    if (this.props.live) {
                        this.updateCode.bind(this)(e.target.value)
                    }
                }
                }
                value={this.state.code}
            />
        }

        return (
            <div className={'CodeEditor'}>
                <div className={'Liveness'}>
                    <div>
                        <div className={'verticalCenter'}>Live</div>
                    </div>
                    <Toggle onChange={(e) => {
                        this.props.onChangeLive(e)
                    }} on={this.props.live}/>
                    <button disabled={this.props.live} onClick={(e) => {
                        this.props.onChange(this.state.code)
                    }}>eval
                    </button>
                </div>
                {inputComponent}
            </div>
        )
    }

    onKeyPress(e) {
        if (e.shiftKey) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.props.onChange(this.state.code);
                clearTimeout(this.flashTimeout);
                this.setState({flash: true});
                this.flashTimeout = setTimeout(() => {
                    this.setState({flash: false})
                }, 1);
            }
        }
    }
};
