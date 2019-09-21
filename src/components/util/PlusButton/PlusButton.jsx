import React , {Component} from "react";
import './index.css'

export default class PlusButton extends Component {

    render() {
        return (
            <div {...this.props} className={"plusButton"}>
                <div>+</div>
            </div>
        )
    }

}