import Flyout from '../components/Flyout'
import {connect} from 'react-redux';
import GlobalActions from "../actions/GlobalActions";
// import {mapStateToProps} from "./LaunchSpace";

const mapStateToProps = state => {

  let stems = Object.keys(state.stems).map(id=>{
    return Object.assign({},state.stems[id], {id})
  }).filter(x=>{return x.open});

  return {
    master:state.master,
    connection:state.connection,
    stems
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
)(Flyout);
