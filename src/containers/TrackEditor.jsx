import TrackEditor from '../components/TrackEditor'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state,ownProps) => {
    let track = state.tracks[ownProps.id];
  return {...track,...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TrackEditor);
