import React, {Component} from 'react';
import './index.css'
import {Grid, Input, Slider} from '@material-ui/core';
import Toggle from "../../util/Toggle";


export default class SliderEffect extends Component {
    constructor(props) {
        super(props);
        let sliderValue = this.toSliderScale(this.props.properties.value);
        this.state = {value: this.props.properties.value, sliderValue};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.properties.value !== prevProps.properties.value) {
            const sliderValue = this.toSliderScale(this.props.properties.value);
            this.setState({value: this.props.properties.value, sliderValue});
        }
    }

    toSliderScale(x) {
        if (this.props.properties.scale === 'log') {
            let range = this.props.properties.max - this.props.properties.min;
            return Math.pow(x / range, 0.5) * range;
        }
        return x
    }

    fromSliderScale(x) {
        if (this.props.properties.scale === 'log') {
            let range = this.props.properties.max - this.props.properties.min;
            return Math.pow(x / range, 2) * range
        }
        return x
    }

    render() {
        return (this.props.isVertical ? this.renderVertical() : this.renderHorizontal())
    }

    handleSliderChange(e, newValue) {
        if (newValue) {
            const properties = this.props.properties;
            properties.value = newValue;
            this.props.globalActions.effectUpdate(this.props.id, {properties});
        }
    }

    handleInputChange(e) {
        let value = parseFloat(e.target.value);
        const properties = this.props.properties;
        properties.value = value;
        this.props.globalActions.effectUpdate(this.props.id, {properties});
    }

    toggle(on) {
        this.props.globalActions.effectUpdate(this.props.id, {on})
    }

    getSlider(vertical=false) {
        return (
            <input
                vertical={vertical.toString()}
                className={'the-slider'}
                type={'range'}
                onChange={(e, newValue) => {
                    this.setState({sliderValue: e.target.value, value: this.fromSliderScale(e.target.value)});
                    this.handleSliderChange(e, e.target.value);
                }}
                min={this.props.properties.min}
                max={this.props.properties.max}
                step={this.props.properties.step}
                value={parseFloat(this.state.sliderValue)}
            />
        )
    }

    renderHorizontal() {
        return (
            <div className={'Slider horizontal'}>
                {this.props.noToggle ? null : <Toggle onChange={this.toggle.bind(this)} on={this.props.on}/>}
                <div className={'text'}>
                    <div>{this.props.properties.code}</div>
                </div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        {this.getSlider()}
                        {/*<Slider*/}
                        {/*    onChange={(e,newValue)=>{*/}
                        {/*        if(newValue){*/}
                        {/*            this.setState({sliderValue:newValue,value:this.fromSliderScale(newValue)});*/}
                        {/*            this.handleSliderChange(e,newValue);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*    min={this.props.properties.min}*/}
                        {/*    max={this.props.properties.max}*/}
                        {/*    step={this.props.properties.step}*/}
                        {/*    value={parseFloat(this.state.sliderValue)}*/}
                        {/*/>*/}

                        {/*<Slider*/}
                        {/*    value={this.state.value}*/}
                        {/*    onChange={(e,newValue)=>{*/}
                        {/*        this.setState({sliderValue:newValue, value:this.fromSliderScale(newValue)});*/}
                        {/*        this.handleSliderChange(e,newValue);*/}
                        {/*    }}*/}
                        {/*    {...this.props.properties}*/}
                        {/*/>*/}
                    </Grid>
                    <Grid item>
                        <input
                            margin="dense"
                            onChange={(e) => {
                                let value = parseFloat(e.target.value);
                                e.persist();
                                this.setState({value: value, sliderValue: this.toSliderScale(value)});
                                this.handleInputChange.bind(this)(e);
                            }}
                            value={this.state.value}
                            step={this.props.properties.step}
                            min={this.props.properties.min}
                            max={this.props.properties.max}
                            type={'number'}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }


    renderVertical() {
        return (
            <div className={'Slider vertical'}>

                <Slider
                    orientation='vertical'
                    onChange={(e, newValue) => {
                        if (newValue) {
                            this.setState({sliderValue: newValue, value: this.fromSliderScale(newValue)});
                            this.handleSliderChange(e, newValue);
                        }
                    }}
                    min={this.props.properties.min}
                    max={this.props.properties.max}
                    step={this.props.properties.step}
                    value={parseFloat(this.state.sliderValue)}
                />
                <Input
                    margin="dense"
                    onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        e.persist()
                        this.setState({value: value, sliderValue: this.toSliderScale(value)});
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
                <div style={{textAlign: 'center'}}>
                    {this.props.properties.code}
                    {this.props.noToggle ? null :
                        <Toggle onChange={this.toggle.bind(this)} on={this.props.on}/>
                    }
                </div>
            </div>
        )
    }
}
