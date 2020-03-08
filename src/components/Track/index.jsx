import React, {Component} from 'react'
import './index.css'
import Stem from '../../containers/Stem';
import PlusButton from "../util/PlusButton/PlusButton";
import Effect from "../../containers/Effect";


export default class Track extends Component {
    stemToComponent(id, row) {

        let highlight = row < (this.props.midi.top+this.props.midi.rows) && row >= this.props.midi.top && this.props.index< (this.props.midi.left+this.props.midi.columns) && this.props.index >= this.props.midi.left;
        return <Stem key={id}
                     id={id}
                     highlight={highlight}
        />
    }

    render() {
        let stems = this.props.stems.map(this.stemToComponent.bind(this));
        return (
            <div className='Track'>
                <input onChange={this.titleChange.bind(this)} value={this.props.name}/>
                <div style={{position:'relative',height:'100%'}}>
                    <div className={'stems'}>
                        {stems}
                        <div style={{padding:'5px'}}>
                            <PlusButton onClick={this.addStem.bind(this)}/>
                        </div>
                    </div>
                    <div className={'effects'}>

                        <div className={'launchButton'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="var(--font-color-dark)" width="24" height="24"
                                 viewBox="0 0 24 24">
                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                        </div>

                        <Effect isVertical noToggle updateEffect={this.updateEffect.bind(this)}
                                id={this.props.effects[0]}/>
                        <div className={'more'}>. . .</div>

                    </div>
                </div>

            </div>
        )
    }


    updateEffect(gainEffect) {
        this.props.globalActions.trackUpdate(this.props.id, {effects: [gainEffect]});
    }

    addStem() {
        this.props.globalActions.trackAddStem(this.props.id);
    }

    titleChange(e) {
        this.props.globalActions.trackUpdate(this.props.id, {name: e.target.value});
    }

}
