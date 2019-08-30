import Actions from './index.js';
import {store} from '../index.js';
import Connection from "../Connection";

function effectToCode(x){
    return `(${x.operator} ${x.name} ${x.value})`
}

function stemToCode(stem){
    let effectsOn = stem.effects.filter(x=>x.on);
    let code = effectsOn.map(effectToCode).join(" $ ");
    code += effectsOn.length?' $ ':'';
    code += stem.code;
    return code
}

function getCode(state){
    let stems = 'stack [';
    let tracks = state.tracks.map(track=>{
        return track.stems.filter(x=>x.on).map(stem=>{
            return stem.code===''?'silence':stemToCode(stem);
        });
    }).flat();
    stems += tracks.join(", ")+']';

    let onMasterEffects = state.masterEffects.filter(x=>x.on);
    let masterEffects = onMasterEffects.map(effectToCode).join(" $ ");


    let code = `d1 $ ${masterEffects}${onMasterEffects.length?' $ ':''}${stems}`;
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
        connect: (url,port)=>{
            let onOpen = ()=>{dispatch(Actions.CONNECT(url,port,true))};
            let onClose = ()=>{dispatch(Actions.CONNECT(url,port,false))};
            let onError = onClose;
            Connection.init(url,port, onOpen, onClose, onError);
        },
        addTrack: ()=>{
            dispatch(Actions.ADD_TRACK())
        },
        removeTrack: (trackId)=>{
            dispatch(Actions.REMOVE_TRACK(trackId))
        },
        addStem: (trackId)=>{
            dispatch(Actions.ADD_STEM(trackId))
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
        updateMasterEffect: (value)=>{
            dispatch(Actions.UPDATE_MASTER_EFFECT(value));
            renderState(store.getState());
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