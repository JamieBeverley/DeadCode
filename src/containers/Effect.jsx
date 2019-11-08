import Effect from '../components/Effect'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state,ownProps) => {
  return {
    ...state.effects[ownProps.id],
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
)(Effect);
