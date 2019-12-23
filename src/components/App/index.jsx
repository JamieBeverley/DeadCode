import React, {Component} from 'react'
import LaunchSpace from '../../containers/LaunchSpace.jsx';
import Flyout from '../../containers/Flyout.jsx';
import './index.css';
import Header from '../../containers/Header'

// import ResizeDivider from "../ResizeDivider";

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            divider: 70, //%
            horizontalDivider: 75
        }
        this.appRef = React.createRef()
    }

    componentDidMount() {
        this.props.globalActions.connect(window.location.hostname, this.props.connection.port);
    }

    render() {
        return (
            <div
                onDragOver={(e) => {
                    e.preventDefault()
                }}
                ref={this.appRef} className='App' tabIndex="0" onKeyDown={this.macros.bind(this)}>
                <Header/>
                <div style={{height:'100%'}}>
                    <LaunchSpace style={{width: this.state.divider + "%"}}/>
                    <div id={"rightPanel"} style={{width: 100 - this.state.divider + "%"}}>
                        <Flyout style={{height: this.state.horizontalDivider + "%"}}/>
                        <iframe style={{height:(100-this.state.horizontalDivider) + "%",border:'1pt solid var(--stem-on)',borderBottom:'none',borderRight:'none'}} src={"/render"}/>
                    </div>
                </div>
            </div>
        )
    }

    dividerResize(px) {
        this.setState({divider: px * 100 / document.body.clientWidth})
    }

    dividerResizeRightPanel(px) {
        this.setState({horizontalDivider: px * 100 / document.body.clientHeight})
    }


    macros(e) {
        if (e.ctrlKey) {
            if (e.key === 's') {
                e.preventDefault();
                this.props.globalActions.save();
            } else if (e.key.toLowerCase() === "l") {
                e.preventDefault();
                if(e.shiftKey){
                    this.props.globalActions.loadFromServer();
                } else{
                    this.props.globalActions.load();
                }
            } else if (e.key === "d") {
                e.preventDefault();
                this.props.globalActions.download();
            } else if (e.key === 'o') {
                e.preventDefault();
                this.props.globalActions.open();
            } else if (e.key === 'p'){
                e.preventDefault();
                this.props.globalActions.pushState();
            }
        }
    }
}