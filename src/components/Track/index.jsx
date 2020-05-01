import React, {Component} from 'react'
import './index.css'
import Stem from '../../containers/Stem';
import PlusButton from "../util/PlusButton/PlusButton";
import Effect from "../../containers/Effect";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

export class TrackTitle extends Component {

    titleChange(e) {
        this.props.globalActions.trackUpdate(this.props.id, {name: e.target.value});
    }

    render() {
        return (
            <div key={`track_${this.props.id}_header`} className={'TrackTitle'}>
                <input
                    onChange={this.titleChange.bind(this)}
                    value={this.props.name}
                />
            </div>
            )

    }
}

export class TrackStems extends Component {

    stemToComponent(id, row) {
        let highlight = row < (this.props.midi.top + this.props.midi.rows) && row >= this.props.midi.top && this.props.index < (this.props.midi.left + this.props.midi.columns) && this.props.index >= this.props.midi.left;
        const leftmost = this.props.index === this.props.midi.left;
        const rightmost = this.props.index === (this.props.midi.left+this.props.midi.columns-1);

        return (
            <Stem key={id}
                  id={id}
                  highlight={highlight}
                  leftmost={leftmost}
                  rightmost={rightmost}
            />
        )
    }

    addStem() {
        this.props.globalActions.trackAddStem(this.props.id);
    }

    render() {
        let stems = this.props.stems.map(this.stemToComponent.bind(this));
        return (
            <div key={`track_${this.props.id}_stems`} className={'TrackStems'}>
                {stems}
                <div style={{padding: '5px'}}>
                    <PlusButton onClick={this.addStem.bind(this)}/>
                </div>
            </div>
        )
    }
}


export class TrackEffects extends Component {
    updateEffect(gainEffect) {
        this.props.globalActions.trackUpdate(this.props.id, {effects: [gainEffect]});
    }

    onKeyDown(e){
        e.preventDefault();
        console.log(e.key);
        if(e.key==='ArrowLeft'){
            this.props.globalActions.trackReorder(this.props.id, this.props.position-1)
        } else if (e.key==='ArrowRight'){
            this.props.globalActions.trackReorder(this.props.id, this.props.position+1)
        }
    }

    render() {
        return (
            <div tabIndex={0} key={`track_${this.props.id}_effects`} className={'TrackEffects'} onKeyDown={this.onKeyDown.bind(this)}>
                <Effect isVertical noToggle updateEffect={this.updateEffect.bind(this)}
                        id={this.props.effects[0]}/>
                <div className={'more' + (this.props.effectsOpen ? ' highlighted' : "")} onClick={() => {
                    this.props.openTrackEffects(this.props.id)
                }}><MoreHorizIcon/>
                </div>
            </div>
        )
    }
}


// export default class Track extends Component {
//     renderOld() {
//         let stems = this.props.stems.map(this.stemToComponent.bind(this));
//         return (
//             <div className='Track'>
//                 <input onChange={this.titleChange.bind(this)} value={this.props.name}/>
//                 <div style={{position: 'relative', height: '100%'}}>
//                     <div className={'stems'}>
//                         {stems}
//                         <div style={{padding: '5px'}}>
//                             <PlusButton onClick={this.addStem.bind(this)}/>
//                         </div>
//                     </div>
//                     <div className={'effects'}>
//
//                         <div className={'launchButton'}>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="var(--font-color-dark)" width="24" height="24"
//                                  viewBox="0 0 24 24">
//                                 <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
//                                 <path d="M0 0h24v24H0z" fill="none"/>
//                             </svg>
//                         </div>
//
//                         <Effect isVertical noToggle updateEffect={this.updateEffect.bind(this)}
//                                 id={this.props.effects[0]}/>
//                         <div className={'more' + (this.props.effectsOpen ? ' highlighted' : "")} onClick={() => {
//                             this.props.openTrackEffects(this.props.id)
//                         }}>. . .
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//         )
//     }
// }
