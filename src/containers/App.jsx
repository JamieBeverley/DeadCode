import App from '../components/App'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};



export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);