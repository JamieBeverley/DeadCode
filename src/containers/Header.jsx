import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
import Header from "../components/Header";

const mapStateToProps = (state,ownProps) => {
  // important for ownProps.id to refer to id of this stem
  return {connection:state.connection,...ownProps}
};

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header);
