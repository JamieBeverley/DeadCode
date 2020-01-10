import React, {Component} from 'react';
import './index.css'
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt';
import FolderIcon from '@material-ui/icons/Folder';
import Modal from "../Modal";
import HelpIcon from '@material-ui/icons/Help';
import ConnectionSettings from "../../containers/ConnectionSettings";
import Settings from '../../containers/Settings'

const modalContent = {
    'settings': <Settings/>,
    'connections':(<ConnectionSettings/>),
    'help': 'Welcome to DeadCode! Should probably fill out these docs soon...'
};


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {modal:null};
    }

    render() {
        let modal = this.getModal(this.state.modal);

        return (
            <div className={'Header'}>
                <SettingsIcon onClick={this.openSettings.bind(this)}/>
                <SaveIcon onClick={this.props.globalActions.save}/>
                <OpenInBrowserIcon onClick={this.props.globalActions.load}/>
                <SaveAltIcon onClick={this.props.globalActions.download}/>
                <FolderIcon onClick={()=>{this.props.globalActions.open()}}/>
                <SignalCellularAltIcon onClick={this.openConnections.bind(this)} style={{fill:this.props.connection.isConnected?'green':'red'}}/>
                <HelpIcon onClick={this.openHelp.bind(this)}/>
                {modal}
            </div>
        );
    }

    closeModal(){
        this.setState({modal:false});
    }

    getModal(type){
        const content = modalContent[type]
        if(!content){
            return null
        }
        return <Modal onClose={this.closeModal.bind(this)}>
            {content}
        </Modal>
    }

    openSettings(){
        this.setState({modal:'settings'});
    }

    openConnections(){
        this.setState({modal:'connections'});
    }

    openHelp(){
        this.setState({modal:'help'});
    }

}

export default Header;