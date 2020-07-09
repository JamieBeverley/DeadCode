import React, {Component} from 'react';
import './index.css';
import CloseIcon from '@material-ui/icons/Close';
import ScratchEditor from "../../containers/ScratchEditor";

const navTab = (props) =>{
    return (
        <div
            onClick={props.onClick}
            className={props.selected?'selected':''}
            key={props.id}
        >
            <span>{props.name}</span>
            <CloseIcon onClick={(e)=>{e.stopPropagation();props.onClose(props.id)}}/>
        </div>
    )
};


class Scratches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: Object.keys(this.props.scratches)[0] || null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.selected===null && Object.keys(this.props.scratches).length){
            this.setState({selected:Object.keys(this.props.scratches)[0]});
        }
    }

    newScratch = () =>{
        this.props.globalActions.scratchCreate({name:'untitled'});
    };

    render() {
        const navTabs = Object.keys(this.props.scratches).map((id,index)=>{
            const onClick = ()=> this.setState({selected:id});
            const onClose = () =>{
                const confirm = window.confirm("Are you sure you want to delete this scratch?");
                if(confirm){

                    this.props.globalActions.scratchDelete(id);
                    const nextSelected = (Object.keys(this.props.scratches)[index+1] || Object.keys(this.props.scratches)[index+1]) || null;
                    this.setState({selected:nextSelected});
                }
            };
            const props  = {...this.props.scratches[id], id, selected:id===this.state.selected, onClick, onClose};
            return navTab(props);
        });


        return (
            <div className={'Scratches'}>
                <div className={'nav'}>
                    {navTabs}
                    <button onClick={this.newScratch.bind(this)}>+</button>
                </div>
                {
                    this.state.selected === null ? null : <ScratchEditor id={this.state.selected}/>
                }
            </div>
        );
    }
}

export default Scratches;
