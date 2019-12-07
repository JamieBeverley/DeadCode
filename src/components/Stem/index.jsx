import React, {Component} from 'react'
import './index.css'

export default class Stem extends Component {
    constructor(props) {
        super(props);
        this.holdTime = new Date();
        // this.state = {
        //     holdTime: new Date()
        // }
    }

    onMouseDown() {
        this.holdTime = new Date();
    }

    onMouseUp(e) {
        console.log(e)
        e.preventDefault();
        let now = new Date();
        if (now - this.holdTime > 500) {
            this.openInFlyout();
        } else {
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
        this.holdTime = now;
    }

    render() {
        return (
            <div
                className={'Stem noselect' + (this.props.on ? ' on ' : ' off ') + (this.props.selected ? 'selected' : '')}
                tabIndex={0}
                onKeyUp={this.onKeyUp.bind(this)}
                onTouchStart={this.onMouseDown.bind(this)}
                onTouchEnd={this.onMouseUp.bind(this)}

                onMouseDown={this.onMouseDown.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}

                onContextMenu={(x) => {
                    x.preventDefault();
                    this.openInFlyout()
                }}
            >
                <div className="verticalCenter" style={{width: '100%'}}>
                    {this.props.name}
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
