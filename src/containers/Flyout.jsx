import Flyout from '../components/Flyout'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
import {mapStateToProps} from "./LaunchSpace";

// const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        globalActions: GlobalActions(dispatch)
    }
};



export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Flyout);