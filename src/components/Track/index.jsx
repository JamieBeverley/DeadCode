import React, {Component} from 'react'
import './index.css'
import Stem from '../Stem';
import PlusButton from "../util/PlusButton/PlusButton";
import Effect from "../Effect";


export default class Track extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) != JSON.stringify(this.props);
        return nextProps !== this.props;
    }

    stemToComponent(stem){
        return <Stem key={stem.id}
                    id={stem.id}
                    name={stem.name}
                    on={stem.on}
                    selected={stem.selected}
                    trackId={stem.trackId}
                    globalActions={this.props.globalActions}
        />
    }

    render() {
        let stems = this.props.stems.map(this.stemToComponent.bind(this));

        return (
            <div className='Track'>
                <input onChange={this.titleChange.bind(this)} value={this.props.name}/>

                <div className={'stems'}>
                    {stems}
                    <PlusButton onClick={this.addStem.bind(this)}/>
                </div>
                <div className={'effects'}>
                    <div className={'launchButton'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="var(--font-color-dark)" width="24" height="24"
                             viewBox="0 0 24 24">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                    <Effect isVertical noToggle updateEffect={this.updateEffect.bind(this)} {...this.props.gainEffect}/>
                </div>

            </div>
        )
    }


    updateEffect(gainEffect) {
        this.props.globalActions.updateTrack({id: this.props.id, gainEffect})
    }

    addStem() {
        this.props.globalActions.addStem(this.props.id);
    }

    titleChange(e) {
        this.props.globalActions.updateTrack({id: this.props.id, name: e.target.value});
    }
}