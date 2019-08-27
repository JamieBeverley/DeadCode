import React, {Component, PureComponent} from 'react';
import './index.css'
import {Grid, Slider, Switch,Input} from '@material-ui/core';
import debounce from 'lodash/debounce'

// import Slider from 'rc-slider'
// import 'rc-slider/assets/index.css';
// export class Filter extends React.Component {
//     constructor(props) {
//         super(props)
//         console.log('fuck')
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
        this.state = {value:props.value}
    }


    render(){
        return (
            <div id={Math.random()} className={'Effect horizontal'}>
                {this.props.name}
                <Switch
                    color='primary'
                    onChange={this.toggle.bind(this)}
                    checked={this.props.on}
                />
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            onChange={debounce(this.handleSliderChange.bind(this),5)}
                            min={this.props.min}
                            max={this.props.max}
                            step={this.props.step}
                            value={parseFloat(this.props.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            margin="dense"
                            onChange={this.handleInputChange.bind(this)}
                            value={this.props.value}
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

    handleSliderChange(e, newValue){
        if(newValue){
            let newEffect = Object.assign({},this.props,{value:newValue});
            delete newEffect.updateEffect;
            this.props.updateEffect(newEffect);
        }
    }

    handleInputChange(e){
        let value = e.target.value;
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

    // renderHorizontal(){
    //     return (
    //         <div id={Math.random()} className={'Effect horizontal'}>
    //             {this.props.name}
    //             <Switch
    //                 color='primary'
    //                 onChange={this.toggle.bind(this)}
    //                 checked={this.props.on}
    //             />
    //             <Grid container spacing={2} alignItems="center">
    //                 <Grid item xs>
    //                     <Filter
    //                         update={this.handleSliderChange.bind(this)}
    //                         // min={this.props.min}
    //                         // max={this.props.max}
    //                         // step={this.props.step}
    //                         // value={this.props.value}
    //                     />
    //                 </Grid>
    //                 <Grid item>
    //                     <Input
    //                         margin="dense"
    //                         onChange={this.handleInputChange.bind(this)}
    //                         value={this.props.value}
    //                         inputProps={{
    //                             step: this.props.step,
    //                             min: this.props.min,
    //                             max: this.props.max,
    //                             type: 'number',
    //                             'aria-labelledby': 'input-slider',
    //                         }}
    //                     />
    //                 </Grid>
    //             </Grid>
    //
    //
    //         </div>
    //     )
    // }

    renderVertical(){
        return (
            <div className={'Effect vertical'}>

            </div>
        )
    }
}