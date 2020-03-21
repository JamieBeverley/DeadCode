import React, {Component} from 'react';
import './index.css';
import Effect from "../../containers/Effect";

class TrackEffect extends Component {
    render() {
        return (
            <div className="TrackEffect">
                <div>
                    <b>{this.props.name}</b>
                </div>
                <div>
                    {this.props.effects.map(effectId=><Effect key={effectId} id={effectId}/>)}
                    <button onClick={()=>{this.props.globalActions.trackDelete(this.props.id)}}>delete track</button>
                </div>
            </div>
        );
    }
}

export default TrackEffect;
