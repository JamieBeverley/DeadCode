import Macro from '../components/Macro';
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state,ownProps) => {
  return {
    ...state.macros[ownProps.id],
    ...ownProps
  }
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Macro);