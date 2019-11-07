import LaunchSpace from '../components/LaunchSpace'
import GlobalActions from "../actions/GlobalActions";
import {connect} from 'react-redux';

export const mapStateToProps = state => {
    let newState = {
        connection:state.connection,
        master:state.master,
        tracks:[]
    };

    newState.tracks = Object.keys(state.tracks).map((x)=>{return populateTrack(state, x)});
    return newState;
    // Object.keys(state.tracks).forEach(trackId=>{
    //     let stems = state.tracks[trackId].stems.map(x=>{return state.stems[x]});
    // });
};

function populateTrack(state, trackId){
    let track = Object.assign({},state.tracks[trackId]);
    // let track = state.tracks[trackId];
    track.stems = track.stems.map(x=>{return populateStem(state, x)});
    //TODO temp hack
    // track.gainEffect = track.effects.map(x=>{return state.effects[x]});
    track.gainEffect = state.effects[track.effects[0]];
    return track
}

function populateStem(state, stemId){
    let stem = Object.assign({},state.stems[stemId]);
    // let stem = state.stems[stemId];
    stem.id = stemId;
    stem.effects = stem.effects.map(id=>{return populateEffect(state, id)});
    return stem
}

function populateEffect(state, effectId){
    let effect = Object.assign({},state.effects[effectId]);
    // let effect = state.effects[effectId];
    effect.id = effectId;
    return effect;
}

const mapDispatchToProps = dispatch => {
  return {
      globalActions: GlobalActions(dispatch)
  }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LaunchSpace);