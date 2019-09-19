import React, {Component} from 'react'
import LaunchSpace from '../../containers/LaunchSpace.jsx';
import Flyout from '../../containers/Flyout.jsx';
import Render from '../../containers/Render'
import './index.css';
import ResizeDivider from "../ResizeDivider";

export default class App extends Component{

    constructor(props){
        super(props)
        this.state = {
            divider:70, //%
            horizontalDivider:75
        }
        this.appRef = React.createRef()
    }

    componentDidMount() {
        this.props.globalActions.connect(this.props.connection.url, this.props.connection.port);
    }

    render(){
        return (
            <div
                onDragOver={(e)=>{e.preventDefault()}}
                ref={this.appRef} className='App' tabIndex="0" onKeyDown={this.macros.bind(this)}>
                <LaunchSpace style={{width:this.state.divider+"%"}} />
                {/*<ResizeDivider onResize={this.dividerResize.bind(this)}vertical/>*/}
                <div id={"rightPanel"} style={{width:100-this.state.divider+"%"}}>
                    <Flyout style={{height:this.state.horizontalDivider+"%"}}/>
                    {/*<ResizeDivider horizontal onResize={this.dividerResizeRightPanel.bind(this)}/>*/}
                    <Render style={{height:(100-this.state.horizontalDivider)+"%"}}/>
                </div>
            </div>
        )
    }

    dividerResize(px){
        this.setState({divider:px*100/document.body.clientWidth})
    }

    dividerResizeRightPanel(px){
        this.setState({horizontalDivider:px*100/document.body.clientHeight})
    }


    macros(e){
        if(e.ctrlKey){
            if(e.key==='s'){
                e.preventDefault();
                this.props.globalActions.save();
            } else if (e.key ==="l"){
                e.preventDefault();
                this.props.globalActions.load();
            } else if (e.key ==="d"){
                e.preventDefault();
                this.props.globalActions.download();
            } else if (e.key ==='o'){
                e.preventDefault();
                this.props.globalActions.openFile();
            }
        }
    }
}