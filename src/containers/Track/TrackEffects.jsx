import {TrackEffects} from '../../components/Track'
import {connect} from 'react-redux';
import GlobalActions from "../../actions/GlobalActions";

const mapStateToProps = (state, ownProps) => {
    // important for ownProps.id to refer to id of this track
    let index = state.tracks.order.findIndex(x => x === ownProps.id);
    let track = state.tracks.values[ownProps.id];
    return {...track, ...ownProps, midi: state.midi, index}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TrackEffects);
