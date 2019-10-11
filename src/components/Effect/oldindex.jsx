import React, {Component} from 'react';
import './index.css'
import {Grid, Slider, Switch,Input} from '@material-ui/core';
import throttle from 'lodash/throttle'

// import Slider from 'rc-slider'
// import 'rc-slider/assets/index.css';
// export class Filter extends React.Component {
//     constructor(props) {
//         super(props)
//         const { value } = this.props
//         this.state = { value }
//     }
//     setValue(e) {
//         // this.props.update({value:e});
//         this.setState({ value: e })
//     }
//     update() {
//         this.props.update(this.state)
//     }
//     render() {
//         return <Slider value={this.state.value} onChange={this.setValue.bind(this)} onAfterChange={this.update.bind(this)} min={this.props.min} max={this.props.max} step={this.props.step}/>
//     }
// }

// class Slider extends Component {
//
//     constructor(props) {
//         super(props)
//         this.img = new Image();
//         this.img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
//         this.oldVal = this.props.value;
//         this.state={
//             value:this.props.value
//         }
//     }
//
//     send(e){
//         let rect = e.target.getBoundingClientRect();
//         if(e.dataTransfer){
//             e.dataTransfer.setDragImage(this.img, 0, 0);
//         }
//         let value = Math.round(Math.max(Math.min(this.props.max, (e.clientX-rect.left)/rect.width),this.props.min)/this.props.step)*this.props.step;
//         // console.log(e.target.getBoundingClientRect().width);
//         if(value !== this.oldVal){
//             console.log(value);
//             this.props.onChange(value);
//         }
//     }
//
//     render() {
//         let pos = this.state.value/(this.props.max-this.props.min);
//         return (
//             <div className={'Slider'}
//                  draggable={true}
//                  onDragStart={this.onChange.bind(this)}
//                  onDrag={this.onChange.bind(this)}
//                  onMouseDown={this.send.bind(this)}
//                  onClick={this.onChange.bind(this)}
//             >
//                 <div className={'bar'}>
//                 </div>
//                 <div className={'indicator'} style={{left:pos+"%"}}>
//                 </div>
//             </div>
//         )
//     }
// }

export default class Effect extends Component {
    constructor (props){
        super(props)
        let sliderValue = this.toSliderScale(this.props.value);
        this.state = {value:this.props.value, sliderValue};

        // TODO: fio more efficient rendering/state updating so these throttle times can be reduced
        this.updateState = throttle(this._handleSliderChange,200);
        this.handleInputChange = throttle(this._handleInputChange,200);
    }

    toSliderScale(x){
        if (this.props.scale==='log'){
            let range = this.props.max-this.props.min;
            return Math.pow(x/range,0.5)*range;
        }
        return x
    }

    fromSliderScale(x){
        if(this.props.scale==='log'){
            let range = this.props.max-this.props.min;
            return Math.round(Math.pow(x/range,2)*range*this.props.step)/this.props.step;
        }
        return x
    }

    render(){
        return (this.props.isVertical?this.renderVertical():this.renderHorizontal())
    }

    _handleSliderChange(e, newValue){
        if(newValue){
            let newEffect = Object.assign({},this.props,{value:this.fromSliderScale(newValue)});
            delete newEffect.updateEffect;
            this.props.updateEffect(newEffect);
        }
    }

    _handleInputChange(e){
        let value = parseFloat(e.target.value);
        let newEffect = Object.assign({},this.props,{value});
        delete newEffect.updateEffect;
        this.props.updateEffect(newEffect);
    }

    toggle(e){
        let on = e.target.checked;
        let newEffect = Object.assign({},this.props,{on});
        delete newEffect.updateEffect;
        this.props.updateEffect(newEffect);
    }

    renderHorizontal(){

        return (
            <div className={'Effect horizontal'}>
                {this.props.name}
                {this.props.noToggle ? null :
                    <Switch
                        color='primary'
                        onChange={this.toggle.bind(this)}
                        checked={this.props.on}
                    />
                }
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            onChange={(e,newValue)=>{
                                if(newValue){
                                    this.setState({sliderValue:newValue,value:this.fromSliderScale(newValue)});
                                    this.updateState(e,newValue);
                                }
                            }}
                            min={this.props.min}
                            max={this.props.max}
                            step={this.props.step}
                            value={parseFloat(this.state.sliderValue)}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            margin="dense"
                            onChange={(e)=>{
                                let value = parseFloat(e.target.value);
                                e.persist()
                                this.setState({value:value, sliderValue:this.toSliderScale(value)});
                                this.handleInputChange.bind(this)(e);
                            }}
                            value={this.state.value}
                            inputProps={{
                                step: this.props.step,
                                min: this.props.min,
                                max: this.props.max,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }


    renderVertical(){
        return (
            <div className={'Effect vertical'}>

                <Slider
                    orientation='vertical'
                    onChange={(e,newValue)=>{
                        if(newValue){
                            this.setState({sliderValue:newValue,value:this.fromSliderScale(newValue)});
                            this.updateState(e,newValue);
                        }
                    }}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    value={parseFloat(this.state.sliderValue)}
                />
                        <Input
                            margin="dense"
                            onChange={(e)=>{
                                let value = parseFloat(e.target.value);
                                e.persist()
                                this.setState({value:value, sliderValue:this.toSliderScale(value)});
                                this.handleInputChange.bind(this)(e);
                            }}
                            value={this.props.value}
                            inputProps={{
                                step: this.props.step,
                                min: this.props.min,
                                max: this.props.max,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                        <div style={{textAlign:'center'}}>
                            {this.props.name}
                            {this.props.noToggle ? null :
                                <Switch
                                    color='primary'
                                    onChange={this.toggle.bind(this)}
                                    checked={this.props.on}
                                />
                            }
                        </div>
            </div>
        )
    }
}