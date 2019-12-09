import {connect} from 'react-redux';
import View from '../components/Render'
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
    return {globalActions:GlobalActions(dispatch)}
};



export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(View);
