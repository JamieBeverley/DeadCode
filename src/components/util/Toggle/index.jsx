import React , {Component} from "react";
import './index.css'

export default class Toggle extends Component {

    onClick(){
        if(this.props.onChange){
            this.props.onChange(!this.props.on);
        } else{
            console.warn('no onChange for toggle')
        }
    }

    render() {
        return (
            <div onContextMenu={this.onClick.bind(this)} onClick={this.onClick.bind(this)} className={"Toggle"+(this.props.on?" on":"")}>
                <button></button>
            </div>
        )
    }

}
