import React, {Component} from 'react';
import Track from '../../containers/Track';
import './index.css';
import PlusButton from "../util/PlusButton/PlusButton";
import languages from '../../model/LanguageModel';
import Modal from "../Modal";

export default class LaunchSpace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTrack: {dialogue: false, language: languages.TidalCycles}
        }
    }

    trackIdToComponent(id) {
        return <Track key={id} id={id}/>
    }

    render() {

        const tracks = Object.keys(this.props.tracks).map(this.trackIdToComponent.bind(this));
        const newTrackModal = this.state.newTrack.dialogue ? this.newTrackModal() : null;
        const openNewTrack = () => {
            const newTrack = Object.assign({}, this.state.newTrack, {dialogue: true});
            this.setState(Object.assign({}, this.state, {newTrack}));
        };

        return (
            <div className="LaunchSpace" style={this.props.style} tabIndex="1" onKeyUp={this.onKeyUp.bind(this)}>
                {tracks}
                <PlusButton onClick={openNewTrack} style={{
                    display: 'inline-block',
                    top: '0px',
                    width: '50px',
                    minWidth: '50px',
                    height: '30px',
                    margin: '5px'
                }}/>
                {newTrackModal}
            </div>
        )
    }

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

    newTrack(e) {
        this.props.globalActions.trackAdd(this.state.newTrack.language);
        this.closeNewTrackModal()
    }

}
