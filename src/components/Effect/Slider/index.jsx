import React, {Component} from 'react';
import './index.css'
import {Grid, Slider, Switch,Input} from '@material-ui/core';
import throttle from 'lodash/throttle'

export default class SliderEffect extends Component {
    constructor (props){
        super(props);
        let sliderValue = this.toSliderScale(this.props.properties.value);
        this.state = {value:this.props.properties.value, sliderValue};

        // TODO: fio more efficient rendering/state updating so these throttle times can be reduced
        this.updateState = throttle(this._handleSliderChange,200);
        this.handleInputChange = throttle(this._handleInputChange,200);
    }

    toSliderScale(x){
        if (this.props.properties.scale==='log'){
            let range = this.props.properties.max-this.props.properties.min;
            return Math.pow(x/range,0.5)*range;
        }
        return x
    }

    fromSliderScale(x){
        if(this.props.properties.scale==='log'){
            let range = this.props.properties.max-this.props.properties.min;
            return Math.round(Math.pow(x/range,2)*range*this.props.properties.step)/this.props.properties.step;
        }
        return x
    }

    render(){

        return (this.props.isVertical?this.renderVertical():this.renderHorizontal())
    }

    _handleSliderChange(e, newValue){
        if(newValue){
            const properties = this.props.properties;
            properties.value = newValue;
            let newEffect = Object.assign({},this.props,{properties});
            delete newEffect.updateEffect;
            this.props.updateEffect(newEffect);
        }
    }

    _handleInputChange(e){
        let value = parseFloat(e.target.value);
        const properties = this.props.properties;
        properties.value = value;
        let newEffect = Object.assign({},this.props,{properties});
        delete newEffect.updateEffect;
        this.props.updateEffect(newEffect);
    }

    toggle(e){
        let on = e.target.checked;
        // this.props.updateEffect({...this.props,on})
        console.log("______:", this.props)
        this.props.updateEffect({id:this.props.id, on,language:this.props.language});
    }

    renderHorizontal(){
        return (
            <div className={'Slider horizontal'}>
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
                            min={this.props.properties.min}
                            max={this.props.properties.max}
                            step={this.props.properties.step}
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
                                step: this.props.properties.step,
                                min: this.props.properties.min,
                                max: this.props.properties.max,
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
            <div className={'Slider vertical'}>

                <Slider
                    orientation='vertical'
                    onChange={(e,newValue)=>{
                        if(newValue){
                            this.setState({sliderValue:newValue,value:this.fromSliderScale(newValue)});
                            this.updateState(e,newValue);
                        }
                    }}
                    min={this.props.properties.min}
                    max={this.props.properties.max}
                    step={this.props.properties.step}
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
                            value={this.state.value}
                            inputProps={{
                                step: this.props.properties.step,
                                min: this.props.properties.min,
                                max: this.props.properties.max,
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