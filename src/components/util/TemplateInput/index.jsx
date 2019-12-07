import React, {Component} from 'react';
import './index.css'
import debounce from 'lodash/debounce'

class AutosizeInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0
        }
        this.spanRef = React.createRef()
    }

    onChange(e) {
        this.spanRef.current.innerText = e.target.value;
        let width = this.spanRef.current.scrollWidth;
        this.setState({width});
        this.props.onChange(e);
    }

    render() {
        let style = this.props.style || {};
        style.width = this.state.width + 'px';
        return (
            <div>
                <input {...this.props} style={style} onChange={this.onChange.bind(this)}/>
                <span ref={this.spanRef} style={{color:'transparent',backgroundColor:'transparent',pointerEvents:'none',position:'absolute'}}>{this.props.value}</span>
            </div>
        );
    }
}



class TemplateInput extends Component {

    constructor(props) {
        super(props);
        // this.props.value;
        this.state = {
            text: this.props.text,
            indices: this.props.indices,
        }
        this.onChange = debounce(this._onChange, 500);
    }

    _onChange() {

    }

    textChange(e) {
    // debugger;
    }

    render() {
        let key = 0;
        let text = [<AutosizeInput onChange={this.textChange.bind(this)} key={key + 'text'} className={'text'}/>];
        key++;
        let str = this.state.text;
        this.state.indices.forEach(i => {
            let left = str.slice(0, i);
            let right = str.slice(i);
            str = right;
            text.push(<AutosizeInput onChange={this.textChange.bind(this)} key={key + 'text'} className={'text'}
                                     value={left}/>);
            text.push(<AutosizeInput key={key + 'placeholder'} className={'placeholder'} value={this.props.value}/>);
            key++
        });
        text.push(<AutosizeInput onChange={this.textChange.bind(this)} key={key + 'text'} className={'text'}
                                 value={str}/>);


        return (
            <div className={'TemplateInput'}>
                <div className={'text'}>
                    {text}
                </div>
                <button>insert</button>
            </div>
        );
    }
}

export default TemplateInput;