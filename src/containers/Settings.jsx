import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
import Settings from "../components/Settings";

const mapStateToProps = (state,ownProps) => {
  return {...state.settings,...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);
