import React, {Component} from 'react'
import LaunchSpace from '../../containers/LaunchSpace.jsx';
import Flyout from '../../containers/Flyout.jsx';
import SplitterLayout from 'react-splitter-layout';
import './index.css';
import Header from '../../containers/Header'
import 'react-splitter-layout/lib/index.css'
import {ContentModes} from '../util/constants'
import Scratches from "../../containers/Scratches";


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: ContentModes.LaunchSpace
        }
    }

    componentDidMount() {
        this.props.globalActions.connect(window.location.hostname, this.props.connection.port);
    }

    onModeChange = (mode) => {
        this.setState({mode});
    };

    getContent(mode) {
        if (mode === ContentModes.LaunchSpace) {
            return (
                <SplitterLayout>
                    <LaunchSpace/>
                    <Flyout/>
                </SplitterLayout>
            )
        } else if (mode === ContentModes.Scratches) {
            return (
                <Scratches/>
            )
        }
        throw Error("Unrecognized mode");
    }

    render() {
        const content = this.getContent(this.state.mode);

        return (
            <div
                className='App' tabIndex="0" onKeyDown={this.macros.bind(this)}>
                <Header mode={this.state.mode} onModeChange={this.onModeChange.bind(this)}/>
                <div id={'contentContainer'}>
                    {content}
                </div>
            </div>
        )
    }

    macros(e) {
        if (e.ctrlKey) {
            if (e.key === 's') {
                e.preventDefault();
                this.props.globalActions.save();
            } else if (e.key.toLowerCase() === "l") {
                e.preventDefault();
                if (e.shiftKey) {
                    this.props.globalActions.loadFromServer();
                } else {
                    this.props.globalActions.load();
                }
            } else if (e.key === "d") {
                e.preventDefault();
                this.props.globalActions.download();
            } else if (e.key === 'o') {
                e.preventDefault();
                this.props.globalActions.open();
            } else if (e.key === 'p') {
                e.preventDefault();
                this.props.globalActions.pushState();
            }
        }
    }
}
