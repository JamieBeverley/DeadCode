import React, {Component} from 'react'
import './index.css'

export default class Stem extends Component {
    constructor(props) {
        super(props);
        this.holdTime = new Date();
        this.dragToggle = false;
        this.ref = React.createRef();
        this.timeout = null;
        this.touchMoveCount = 0;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.leftmost && !prevProps.leftmost){
            this.ref.current.scrollIntoView();
        }
        if(this.props.rightmost && !prevProps.right){
            this.ref.current.scrollIntoView();
        }
    }

    flash(){
        this.ref.current.classList.add('flash');
        // setTimeout(()=>{this.ref.current.classList},500)
        setTimeout(()=>{this.ref.current.classList.remove('flash')},500)
    }

    onMouseDown() {
        this.timeout = setTimeout(()=>{
            this.openInFlyout();
        },500);
        this.holdTime = new Date();
        this.dragToggle = false;
    }

    onMouseUp(e) {
        e.preventDefault();
        this.touchMoveCount = 0;
        let now = new Date();
        if(!this.dragToggle){
            if (now - this.holdTime < 500) {
                clearTimeout(this.timeout);
                if (e.shiftKey) {
                    this.props.globalActions.stemUpdate(this.props.id, {selected: !this.props.selected});
                } else {
                    if (e.button) {
                        e.preventDefault();
                    } else {
                        this.toggle()
                    }
                }
            }
        }

        this.holdTime = now;
        this.dragToggle = false;
    }

    onTouchMove(e){
        this.touchMoveCount++;
        // e.preventDefault();
        if(this.touchMoveCount>5){
            clearTimeout(this.timeout);
            this.dragToggle = true;
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render() {
        return (
            <div
                ref={this.ref}
                className={'Stem noselect' +' '+(this.props.highlight?'highlight':'')}
                onKeyUp={this.onKeyUp.bind(this)}
                onTouchStart={this.onMouseDown.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onTouchEnd={this.onMouseUp.bind(this)}
                onTouchMove={this.onTouchMove.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}

                onContextMenu={(x) => {
                    x.preventDefault();
                    this.openInFlyout()
                }}
            >
                <div className={'stemButton' + (this.props.selected ? ' selected' : '') + (this.props.on ? ' on ' : ' off ')}>
                    <div className="verticalCenter" style={{width: '100%'}}>
                        {this.props.name}
                    </div>
                </div>
            </div>
        )
    }

    onKeyUp(e) {
        if (e.ctrlKey && e.key === 'v') {
            this.props.globalActions.stemPaste(this.props.id);
        }
    }

    onTouchStart() {
        this.toggle();
    }

    mouseUp(e) {
        if (e.shiftKey) {
            this.props.globalActions.stemUpdate(this.props.id, {selected: !this.props.selected});
        } else {
            if (e.button) {
                e.preventDefault();
            } else {
                this.toggle()
            }
        }
    }

    openInFlyout() {
        this.props.globalActions.stemUpdate(this.props.id, {open: true});
    }

    toggle() {
        this.props.globalActions.stemUpdate(this.props.id, {on: !this.props.on});
    }
}
