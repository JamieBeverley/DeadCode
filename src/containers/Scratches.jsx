import Scratches from '../components/Scratches';
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = (state,ownProps) => {
  return {
    scratches: state.scratches,
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
)(Scratches);
