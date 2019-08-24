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
        },
        save:()=>{
            window.localStorage.setItem('state', JSON.stringify(store.getState()));
            console.log('saved')
        },
        load: ()=>{
            let newState = window.localStorage.getItem('state');
            if(newState){
                newState = JSON.parse(newState);
                console.log(newState);
                dispatch(Actions.LOAD(newState));
            } else {
                console.warn('Tried to load state but empty')
            }
        },
        download: ()=>{
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState()));
            let anchor = document.createElement('a')
            anchor.setAttribute("href", dataStr);
            anchor.setAttribute("download", "dead_state.json");
            anchor.click();
            dispatch(Actions.DOWNLOAD());
        },
        openFile: (file)=>{
            if(!file){
                let input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e)=>{
                    input.files[0].text().then(x=>{
                        dispatch(Actions.LOAD(JSON.parse(x)));
                    });
                };
                input.click();
            } else {
                file.text().then(x=>{
                    dispatch(Actions.LOAD(JSON.parse(x)));
                });
            }
        }
    }
};

export default GlobalActions;