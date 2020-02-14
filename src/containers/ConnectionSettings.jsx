import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
import ConnectionSettings from "../components/Header/ConnectionSettings";

const mapStateToProps = (state,ownProps) => {
  // important for ownProps.id to refer to id of this stem
  return {...state.connection,...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectionSettings);
