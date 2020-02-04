import React, {Component} from 'react';

class CodeWriter extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.text !== prevProps.text) {
            this.ref.current.innerText = '';
            this.interval && clearInterval(this.interval);
            let i = 0;
            this.interval = setInterval(() => {
                    if (i < this.props.text.length) {
                        this.ref.current.innerText = this.props.text.substring(0, i);
                    } else if (i === this.props.text.length) {
                        this.ref.current.innerText = this.props.text.substring(0, i);
                        this.props.triggerResize();
                    } else {
                        clearInterval(this.interval)
                    }
                    i = i + 1;
                },
                this.props.rate);
        }
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval)
        this.ref.current.innerText = '';
        this.props.triggerResize();
    }

    componentDidMount() {
        this.componentDidUpdate({text:null})
    }

    render() {
        return (
            <span ref={this.ref} {...this.props} >
            </span>
        );
    }
}

export default CodeWriter;