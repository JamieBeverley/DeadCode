import {TrackEffects} from '../../components/Track'
import {connect} from 'react-redux';
import GlobalActions from "../../actions/GlobalActions";

const mapStateToProps = (state,ownProps) => {
    let index = Object.keys(state.tracks).findIndex(x=> x===ownProps.id);
    let track = state.tracks[ownProps.id];
  return {...track,...ownProps,midi:state.midi, index}
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
