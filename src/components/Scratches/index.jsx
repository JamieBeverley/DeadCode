import React, {Component} from 'react';
import './index.css';
import CloseIcon from '@material-ui/icons/Close';
import ScratchEditor from "../../containers/ScratchEditor";

const NavTab = (props) =>{
    return (
        <div
            onClick={props.onClick}
            className={props.selected?'selected':''}
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
        };
        this.ref = React.createRef();
    }

    componentDidMount() {
        if(!Object.keys(this.props.scratches).length){
            this.ref.current.focus()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.selected===null && Object.keys(this.props.scratches).length){
            this.setState({selected:Object.keys(this.props.scratches)[0]});
        }
    }

    newScratch = () =>{
        this.props.globalActions.scratchCreate({name:'untitled'});
        setTimeout(()=>{
            const ids = Object.keys(this.props.scratches);
            this.setState({selected: ids[ids.length-1]});
        })
    };

    onKeyDown(e){
        if(e.altKey){
            //Left
            if (e.keyCode===37){
                e.preventDefault();
                const ids = Object.keys(this.props.scratches);
                if(!ids.length){return;}
                const selected = ids[Math.max(0,ids.findIndex(x=>x===this.state.selected)-1)];
                this.setState({selected})
                // Right
            } else if (e.keyCode===39){
                e.preventDefault();
                const ids = Object.keys(this.props.scratches);
                if(!ids.length){return;}
                const selected = ids[Math.min(ids.length-1,ids.findIndex(x=>x===this.state.selected)+1)];
                this.setState({selected})
            } else if (e.key === 'n'){
                e.preventDefault();
                this.newScratch();
            }
        }
    }

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
            return <NavTab key={id} {...props}/>
        });


        return (
            <div className="Scratches" onKeyDown={this.onKeyDown.bind(this)} tabIndex="0" ref={this.ref}>
                <div className="nav">
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
