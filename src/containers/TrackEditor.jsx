import TrackEditor from '../components/TrackEditor'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state, ownProps) => {
    const track = state.tracks.values[ownProps.id];
    const position = state.tracks.order.findIndex(x => x === ownProps.id);
    return {...track, ...ownProps, position}
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
