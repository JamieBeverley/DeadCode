import React, {Component} from 'react';
import './index.css'
import CloseIcon from '@material-ui/icons/Close';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current && this.ref.current.focus();
    }

    render() {
        return (
            <div ref={this.ref} className={'Modal'} onKeyUp={this.onKeyPress.bind(this)} tabIndex={2}>
                <div className={'modalBody'}>
                    <div className={'modalClose'} >
                        <CloseIcon onClick={this.props.onClose}/>
                    </div>
                    <div className={'modalContent'}>
                    {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

    onKeyPress(e){
        if (e.key.toLowerCase()==='escape'){
            this.props.onClose();
        }
    }
}

export default Modal;