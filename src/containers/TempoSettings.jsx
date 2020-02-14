import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
import TempoSettings from "../components/Header/TempoSettings";

const mapStateToProps = (state, ownProps) => {
  return {master:state.master, ...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TempoSettings);
