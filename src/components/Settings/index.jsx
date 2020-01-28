import React, {Component} from 'react';
import debounce from "lodash/debounce";
import './index.css'
import TextColorPicker from "../util/TextColorPicker";

const SettingsWidgetMap = {
    '--bg-image': (props) => <input onChange={props.onChange} value={props.value} type='text'/>,
    '--border-radius': (props) => <input onChange={props.onChange} value={props.value} type="text"/>,
    '--stem-on': (props) => <input onChange={props.onChange} value={props.value} type="text"/>,
    '--stem-off': (props) => <input onChange={props.onChange} value={props.value} type="text"/>,
    '--font-family': (props) => <input onChange={props.onChange} value={props.value} type="text"/>,
    '--scrollbar-width': (props) => <input onChange={props.onChange} value={props.value} type="text"/>,
    '--launchspace-bg-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--stem-editor-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--font-color-dark': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--font-color-light': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--track-border-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--select-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--settings-background-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--settings-font-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>,
    '--midi-background-color': (props) => <TextColorPicker onChange={props.onChange} value={props.value}/>
};


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connection: {...this.props},
            styleForm:{}
        };
        this.connect = debounce(() => {
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        }, 2000);
    }

    updateStyleForm(e){
        this.setState({
            styleForm: Object.assign({}, this.state.styleForm, {[e.target.name]:e.target.value})
        })
    }

    updateStyle(){
        this.props.globalActions.settingsUpdateStyle(this.state.styleForm)
    }

    render() {
        let widgets = Object.keys(SettingsWidgetMap).map(x => {
            let Widget = SettingsWidgetMap[x]
            return (
                <div key={x}>
                    <div>{x}</div>
                    <Widget onChange={this.updateStyleForm.bind(this)} value={this.props.style[x]}/>
                </div>
            )
        });

        return (
            <div id={'Settings'}>
                <div className={'Setting'}>
                    <div className="style">
                        <h1>Style</h1>
                        {widgets}
                        <button onClick={this.updateStyle.bind(this)}>Apply</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings;