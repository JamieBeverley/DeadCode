import React, {Component} from 'react';
import EffectModel from "../../../model/EffectModel";
import './index.css'

function getInput(id, type) {
    return {
        'string': (<input id={id} className={'specInput'} type='text'/>),
        'float': (<input id={id} className={'specInput'} type='number'/>),
        'integer': (<input id={id} className={'specInput'} type='number'/>),
        'boolean': (<input id={id} className={'specInput'} type='checkbox'/>)
    }[type]
}

function parseValue(value, type){
    switch(type){
        case 'string':
            return value;
        case 'float':
            return parseFloat(value);
        case 'integer':
            return parseInt(value);
        case 'boolean':
            return value=='true';
    }
}

class EffectCreator extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            creating: false,
            progress: 'plus',
            type: null
        }
    }

    transitionToSpec() {
        let input = this.ref.current.querySelector('#effect_creator_type_input');
        if (!input) {
            console.warn('this shouldnt happen');
            return
        }
        let type = input.value;
        this.setState({type, progress: 'spec'});
    }

    render() {
        let inside = [];

        if (this.state.progress === 'plus') {
            inside.push(
                <button key={'plus'} onClick={() => {
                    this.setState({progress: 'type'})
                }}> + </button>
            )
        } else if (this.state.progress === 'type') {
            let options = [];
            Object.keys(EffectModel.Types).forEach(x=>{
                x = EffectModel.Types[x];
                options.push(<option key={x} value={x}>{x.toLowerCase()}</option>)
            });
            let select = (
                <select key={"effect_creator_type_input"} id={"effect_creator_type_input"}>
                    {options}
                </select>
            );
            let next = (<button key={"effect_creator_next"} onClick={this.transitionToSpec.bind(this)}> next </button>)
            let cancel = (<button key={"effect_creator_cancel"} onClick={()=>{this.setState({progress:'plus'})}}> cancel </button>)
            inside.push([select, next, cancel]);
        } else if (this.state.progress === 'spec') {
            let widgets = [];
            Object.keys(EffectModel.PropertySpec[this.state.type]).forEach(prop => {
                let type = EffectModel.PropertySpec[this.state.type][prop];
                let widget = getInput(prop, type);
                widgets.push(
                    <div key={prop}>
                        <div>{prop}</div>
                        {widget}
                    </div>
                )
            });
            inside.push(widgets)

                inside.push(<button key={'create'} onClick={this.onClick.bind(this)}>create</button>)
                inside.push(<button key={"effect_creator_cancel"} onClick={()=>{this.setState({progress:'plus'})}}> cancel </button>)

            } else {
            console.warn('something bad has happened');
            inside.push(
                <button onClick={() => {
                    this.setState({progress: 'type'})
                }}> + </button>
            )
        }

        return (
            <div ref={this.ref} className={'EffectCreator'}>
                <div><div>New Effect</div></div>
                {inside}
            </div>
        );
    }

    onClick() {
        let obj = {}
        Object.keys(EffectModel.PropertySpec[this.state.type]).forEach(prop=>{
            let val = this.ref.current.querySelector('#' + prop).value;
            let type = EffectModel.PropertySpec[this.state.type][prop];
            let parsed = parseValue(val,type);
            obj[prop] = parsed
        })
        if(this.props.onCreate){
            this.props.onCreate(this.state.type, obj);
        } else{
            console.warn('onCreate not defineed for effect creator')
        }
        this.setState({progress:'plus'});
    }
}

export default EffectCreator;