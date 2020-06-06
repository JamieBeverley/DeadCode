import ScratchEditor from '../components/ScratchEditor'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state, ownProps) => {
    const scratch = state.scratches[ownProps.id];
    return {...scratch, ...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ScratchEditor);
