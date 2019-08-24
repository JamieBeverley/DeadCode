import Actions from './index.js';
import {store} from '../index.js';
import Connection from "../Connection";

function getCode(state){
    let code = 'd1 $ stack [';
    let tracks = state.tracks.map(track=>{
        return track.stems.map(stem=>{
            if(stem.on){
                return stem.code===''?'silence':stem.code
            }
            return 'silence';
        });
    }).flat();
    code += tracks.join(", ")+']';
    console.log(code);
    return code;
}

var lastCode = ''
function renderState(state){
    let code = getCode(state);
    if (code !== lastCode) Connection.sendCode(code);
}


const GlobalActions = dispatch=> {
    return {
        addTrack: ()=>{
            dispatch(Actions.ADD_TRACK())
        },
        removeTrack: (trackId)=>{
            dispatch(Actions.REMOVE_TRACK(trackId))
        },
        addStem: (trackId, stemId)=>{
            dispatch(Actions.ADD_STEM(trackId,stemId))
        },
        removeStem: (trackId, stemId)=>{
            dispatch(Actions.REMOVE_STEM(trackId,stemId))
        },
        updateStem: (trackId, stemId, value)=>{
            dispatch(Actions.UPDATE_STEM(trackId, stemId, value));
            renderState(store.getState());
        },
        openInFlyout: (trackId, stemId)=> {
            dispatch(Actions.OPEN_IN_FLYOUT(trackId,stemId))
        },
        updateTrack: (value)=>{
            dispatch(Actions.UPDATE_TRACK(value))
        },
        toggleLive: (value)=>{
            dispatch(Actions.TOGGLE_LIVE(value))
        }
    }
};

export default GlobalActions;