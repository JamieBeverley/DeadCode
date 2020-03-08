import React, {Component} from 'react';
import Track from '../../containers/Track';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";
import languages from '../../model/LanguageModel';
import Modal from "../Modal";
import TrackEffect from "../../containers/TrackEffect";

export default class LaunchSpace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTrack: {dialogue: false, language: languages.TidalCycles},
            openTrackEffects:[] // id's of tracks w/ effects open
        }
    }

    trackIdToComponent(id) {
        return <Track key={id} id={id} effectsOpen={this.state.openTrackEffects.includes(id)} openTrackEffects={this.openTrackEffects.bind(this)}/>
    }

    //////////////////////////////////////////
    // New Track Stuff                      //
    /////////////////////////////////////////
    openNewTrack = () => {
        const newTrack = Object.assign({}, this.state.newTrack, {dialogue: true});
        this.setState(Object.assign({}, this.state, {newTrack}));
    };

    closeNewTrackModal(){
        this.setState(Object.assign({}, this.state, {
            newTrack: {
                dialogue: false,
                language: this.state.newTrack.language
            }
        }));
    }

    newTrackModal() {
        const chooseLanguage = (e) => {
            this.setState(Object.assign({}, this.state, {
                newTrack: {
                    dialogue: this.state.newTrack.dialogue,
                    language: e.target.value
                }
            }))
        };
        return (
            <Modal onClose={this.closeNewTrackModal.bind(this)}>
                Select track language:
                <div>
                    <select value={this.state.newTrack.language} onChange={chooseLanguage}>
                        {Object.values(languages).map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                </div>
                <div>
                    <button onClick={this.newTrack.bind(this)}>confirm</button>
                </div>
            </Modal>
        )
    }

    newTrack() {
        this.props.globalActions.trackAdd(this.state.newTrack.language);
        this.closeNewTrackModal()
    }


    //////////////////////////////////////////
    // Track Effects Stuff                  //
    /////////////////////////////////////////

    openTrackEffects(trackId){
        let openTrackEffects;
        if (this.state.openTrackEffects.includes(trackId)){
            openTrackEffects = this.state.openTrackEffects.filter(x=>x!==trackId);
        } else {
            openTrackEffects = Object.keys(this.props.tracks).filter(tId=>{return this.state.openTrackEffects.includes(tId) || tId===trackId});
        }
        this.setState(Object.assign({},this.state,{openTrackEffects}));
    }

    trackEffects(){
        if (this.state.openTrackEffects.length <1){
            return null;
        }

        return(
            <div className="trackEffects">
                {this.state.openTrackEffects.map(trackId=>{return <TrackEffect key={trackId} id={trackId}></TrackEffect>})}
            </div>
        )
    }


    //////////////////////////////////////////
    // General                              //
    /////////////////////////////////////////

    onKeyUp(e) {
        if (e.key.toLowerCase() === 'delete') {
            let ids = Object.keys(this.props.tracks).map(x => {
                return this.props.tracks[x].stems.map(y => {
                    return {trackId: x, stemId: y, selected: this.props.stems[y].selected}
                })
            }).flat();
            let selectedIds = ids.filter(x => x.selected);
            selectedIds.forEach(x => {
                this.props.globalActions.trackDeleteStem(x.trackId, x.stemId)
            });
        } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            this.props.globalActions.stemCopy();
        } else if (e.key.toLowerCase() === 'escape') {
            let selectedStems = Object.keys(this.props.stems).filter(x => {
                return this.props.stems[x].selected
            });
            selectedStems.forEach(x => this.props.globalActions.stemUpdate(x, {selected: false}));
        }
    }

    render() {

        const tracks = Object.keys(this.props.tracks).map(this.trackIdToComponent.bind(this));
        const newTrackModal = this.state.newTrack.dialogue ? this.newTrackModal() : null;

        return (
            <div className="LaunchSpace" style={this.props.style} tabIndex="1" onKeyUp={this.onKeyUp.bind(this)}>
                {tracks}
                <PlusButton onClick={this.openNewTrack.bind(this)} style={{
                    display: 'inline-block',
                    top: '0px',
                    width: '50px',
                    minWidth: '50px',
                    height: '30px',
                    margin: '5px'
                }}/>
                {newTrackModal}
                {this.trackEffects()}
            </div>
        )
    }

}
