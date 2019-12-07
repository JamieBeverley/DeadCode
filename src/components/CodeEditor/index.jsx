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

    render() {
        return (
            <div className={'CodeEditor'}>
                <div className={'Liveness'}>
                    <div><div className={'verticalCenter'}>Live</div></div>
                    <Toggle onChange={(e)=>{this.props.onChangeLive(e)}} on={this.props.live}/>
                    <button disabled={this.props.live} onClick={(e) => {
                        this.updateCode.call(this, e.target.value)
                    }}>eval
                    </button>
                </div>
                <textarea
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
}