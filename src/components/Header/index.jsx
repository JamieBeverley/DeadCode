import React, {Component} from 'react';
import './index.css'
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import FolderIcon from '@material-ui/icons/Folder';
import Modal from "../Modal";
import HelpIcon from '@material-ui/icons/Help';
import ConnectionSettings from "../../containers/ConnectionSettings";
import SignalWifi4Bar from '@material-ui/icons/SignalWifi4Bar';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import Settings from '../../containers/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import SubjectIcon from '@material-ui/icons/Subject';
import {ContentModes} from '../util/constants'

const modalContent = {
    'settings': <Settings/>,
    'connections': (<ConnectionSettings/>),
    'help': (
        <a href="https://github.com/JamieBeverley/DeadCode/blob/master/README.md" target="_blank">See docs here</a>)
};


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {modal: null};
    }

    render() {
        let modal = this.getModal(this.state.modal);

        return (
            <div className={'Header'}>
                <AppsIcon className={this.props.mode===ContentModes.LaunchSpace?'active':''} onClick={()=>this.props.onModeChange(ContentModes.LaunchSpace)}/>
                <SubjectIcon className={this.props.mode===ContentModes.Scratches?'active':''} onClick={()=>this.props.onModeChange(ContentModes.Scratches)}/>
                <SettingsIcon onClick={this.openSettings.bind(this)}/>
                <SaveIcon onClick={this.props.globalActions.save}/>
                <OpenInBrowserIcon onClick={this.props.globalActions.load}/>
                <SaveAltIcon onClick={this.props.globalActions.download}/>
                <FolderIcon onClick={() => {
                    this.props.globalActions.open()
                }}/>
                {
                    this.props.connection.isConnected?
                        <SignalWifi4Bar onClick={this.openConnections.bind(this)}/> :
                        <SignalWifiOff onClick={this.openConnections.bind(this)}/>
                }
                <HelpIcon onClick={this.openHelp.bind(this)}/>
                    {modal}
            </div>
        );
    }

    closeModal() {
        this.setState({modal: false});
    }

    getModal(type) {
        const content = modalContent[type]
        if (!content) {
            return null
        }
        return <Modal onClose={this.closeModal.bind(this)}>
            {content}
        </Modal>
    }

    openSettings() {
        this.setState({modal: 'settings'});
    }

    openConnections() {
        this.setState({modal: 'connections'});
    }

    openHelp() {
        this.setState({modal: 'help'});
    }

}

export default Header;
