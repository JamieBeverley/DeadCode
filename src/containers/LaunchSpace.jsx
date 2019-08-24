import LaunchSpace from '../components/LaunchSpace'
import GlobalActions from "../actions/GlobalActions";
import {connect} from 'react-redux';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
      globalActions: GlobalActions(dispatch)
  }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LaunchSpace);