import LaunchSpace from '../components/LaunchSpace'
import Actions from '../actions';
import {connect} from 'react-redux';


const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
      globalActions:{
          addTrack: ()=>{dispatch(Actions.ADD_TRACK())},
          removeTrack: (trackId)=>{dispatch(Actions.REMOVE_TRACK(trackId))},
          addStem: (trackId, stemId)=>{dispatch(Actions.ADD_STEM(trackId,stemId))},
          removeStem: (trackId, stemId)=>{dispatch(Actions.REMOVE_STEM(trackId,stemId))},
          updateStem: (trackId, stemId, value)=>{dispatch(Actions.UPDATE_STEM(trackId, stemId, value))},
          openInFlyout: (trackId, stemId)=>{dispatch(Actions.OPEN_IN_FLYOUT(trackId,stemId))},
      }
  }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LaunchSpace);