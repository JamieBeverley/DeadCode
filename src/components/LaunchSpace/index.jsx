import React, {Component} from 'react';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";
import languages from '../../model/LanguageModel';
import Modal from "../Modal";
import TrackEditor from "../../containers/TrackEditor";
import TrackStems from "../../containers/Track/TrackStems";
import TrackEffects from "../../containers/Track/TrackEffects";
import TrackTitle from "../../containers/Track/TrackTitle";

export default class LaunchSpace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTrack: {dialogue: false, language: languages.TidalCycles},
            openTrackEffects: [] // id's of tracks w/ effects open
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const definedOpen = this.state.openTrackEffects.filter(x => this.props.tracks.values[x] !== undefined);
        if (definedOpen.length !== this.state.openTrackEffects.length) {
            this.setState({openTrackEffects: definedOpen});
        }
    }

    trackIdToComponents(id) {
        const title = <TrackTitle key={id + 'trackTitle'} id={id}/>;
        const stems = <TrackStems key={id + 'trackStems'} id={id}/>;
        const effects = (
            <TrackEffects key={id} id={id} effectsOpen={this.state.openTrackEffects.includes(id)}
                          openTrackEffects={this.openTrackEffects.bind(this)}/>
        );
        return {title,stems,effects};
    }

    //////////////////////////////////////////
    // New Track Stuff                      //
    /////////////////////////////////////////
    openNewTrack = () => {
        const newTrack = Object.assign({}, this.state.newTrack, {dialogue: true});
        this.setState(Object.assign({}, this.state, {newTrack}));
    };

    closeNewTrackModal() {
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

    openTrackEffects(trackId) {
        let openTrackEffects;
        if (this.state.openTrackEffects.includes(trackId)) {
            openTrackEffects = this.state.openTrackEffects.filter(x => x !== trackId);
        } else {
            openTrackEffects = Object.keys(this.props.tracks.values).filter(tId => {
                return this.state.openTrackEffects.includes(tId) || tId === trackId
            });
        }
        this.setState(Object.assign({}, this.state, {openTrackEffects}));
    }

    trackEffects() {
        if (this.state.openTrackEffects.length < 1) {
            return null;
        }
        return (
            <div className="trackEffects">
                {this.state.openTrackEffects.map(trackId => {
                    return <TrackEditor key={trackId} id={trackId}></TrackEditor>
                })}
            </div>
        )
    }


    //////////////////////////////////////////
    // General                              //
    /////////////////////////////////////////

    onKeyUp(e) {
        if (e.key.toLowerCase() === 'delete') {
            let ids = Object.keys(this.props.tracks.values).map(x => {
                return this.props.tracks.values[x].stems.map(y => {
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
        const tracks = this.props.tracks.order.map(this.trackIdToComponents.bind(this));
        const newTrackModal = this.state.newTrack.dialogue ? this.newTrackModal() : null;
        const titles = tracks.map(x => x.title);
        const stems = tracks.map(x => x.stems);
        const effects = tracks.map(x => x.effects);
        const pb = (
            <button key={'pb'} onClick={this.openNewTrack.bind(this)} style={{
            backgroundColor:'var(--stem-on)',border:'none'}}> + </button>
        );
        titles.push(pb);
        return (
            <div className="LaunchSpace" style={this.props.style} tabIndex="1" onKeyUp={this.onKeyUp.bind(this)}>
                <div className={'TrackContainer'}>
                    <div className={'title'}>{titles}</div>
                    <div className={'stems'}>{stems}</div>
                    <div className={'trackGain'}>{effects}</div>
                </div>
                {newTrackModal}
                {this.trackEffects()}
            </div>
        )
    }
}
