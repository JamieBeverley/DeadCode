import React, {Component} from 'react';
import debounce from "lodash/debounce";
import './index.css'

const SettingsWidgetMap = {
    '--bg-image': (props) => <input value={props.value} type='text'/>,
    '--launchspace-bg-color': (props) => <input value={props.value} type="color"/>,
    '--border-radius': (props) => <input value={props.value} type="number"/>,
    '--stem-on': (props) => <input value={props.value} type="color"/>,
    '--stem-off': (props) => <input value={props.value} type="color"/>,
    '--stem-editor-color': (props) => <input value={props.value} type="color"/>,
    '--font-family': (props) => <input value={props.value} type="text"/>,
    '--font-color-dark': (props) => <input value={props.value} type="color"/>,
    '--font-color-light': (props) => <input value={props.value} type="color"/>,
    '--scrollbar-width': (props) => <input value={props.value} type="number"/>,
    '--track-border-color': (props) => <input value={props.value} type="color"/>,
    '--select-color': (props) => <input value={props.value} type="color"/>,
    '--settings-background-color': (props) => <input value={props.value} type="color"/>,
    '--settings-font-color': (props) => <input value={props.value} type="color"/>,
    '--midi-background-color': (props) => <input value={props.value} type="color"/>
}


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connection: {...this.props},
        };
        this.connect = debounce(() => {
            this.props.globalActions.connect(this.state.connection.url, this.state.connection.port)
        }, 2000);
    }


    render() {
        let widgets = Object.keys(SettingsWidgetMap).map(x => {
            let Widget = SettingsWidgetMap[x]
            debugger
            return (
                <div key={x}>
                    {x}
                    <Widget value={this.props[x]}/>
                </div>
            )
        });

        return (
            <div id={'Settings'}>
                <div className={'Setting'}>
                    <h1>Style</h1>
                    <form>
                        {widgets}
                    </form>
                </div>
            </div>
        )


    }
}

export default Settings;