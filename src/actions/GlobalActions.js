import Actions from './index.js';
import {store} from '../index.js';
import Connection from "../Connection";
import {uniqueId} from 'lodash';
import State from '../reducers/State.js'
// import {renderBootScript, renderTempoChange,renderState} from '../render'


function reassignIDs(obj){
    for (let i in obj){
        if(i==='id'){
            obj[i] = uniqueId();
        } else if(typeof obj[i] === 'object'){
            obj[i] = reassignIDs(obj[i]);
        }
    }
    return obj
}

const GlobalActions = dispatch=> {
    return {
        connect: (url,port)=>{
            let onOpen = ()=>{
                dispatch(Actions.CONNECT(url,port,true));

                let state = store.getState();
                // renderTempoChange(state)
                // renderBootScript(state)

            };
            let onClose = ()=>{dispatch(Actions.CONNECT(url,port,false))};
            let onError = onClose;
            Connection.init(url,port, onOpen, onClose, onError);
        },
        updateTempo: (tempo)=>{
            dispatch(Actions.UPDATE_TEMPO(tempo));
            // renderTempoChange(store.getState());
        },
        updateBootScript:(bootScript) =>{
            dispatch(Actions.UPDATE_BOOT_SCRIPT(bootScript));
            let state = store.getState();
            // renderBootScript(state);
            // renderState(state);
            // Connection.sendCode(state.bootScript);
            // Connection.sendCode(getCode(state));
        },
        copyStems:(x)=>{
            dispatch(Actions.COPY_STEMS(x))
        },
        pasteStems:(trackId, stemId)=>{
            dispatch(Actions.PASTE_STEMS(trackId, stemId));
            let state = store.getState();
            state.tracks.forEach(track=>{
                track.stems.filter(x=>x.selected).forEach(stem=>{
                    dispatch(Actions.UPDATE_STEM(stem.trackId,stem.id,{selected:false}));
                })
            })
        },
        addTrack: ()=>{
            dispatch(Actions.ADD_TRACK())
        },
        removeTrack: (trackId)=>{
            dispatch(Actions.REMOVE_TRACK(trackId))
        },
        addStem: (trackId)=>{
            dispatch(Actions.ADD_STEM(trackId))
            // renderState(store.getState());
        },
        removeStem: (trackId, stemId)=>{
            dispatch(Actions.REMOVE_STEM(trackId,stemId))
            // renderState(store.getState());
        },
        updateStem: (trackId, stemId, value)=>{
            dispatch(Actions.UPDATE_STEM(trackId, stemId, value));
            // renderState(store.getState());
        },
        openInFlyout: (trackId, stemId)=> {
            dispatch(Actions.OPEN_IN_FLYOUT(trackId,stemId))
        },
        updateTrack: (value)=>{
            dispatch(Actions.UPDATE_TRACK(value))
            // renderState(store.getState());
        },
        updateMasterEffect: (value)=>{
            dispatch(Actions.UPDATE_MASTER_EFFECT(value));
            // renderState(store.getState());
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
                newState = reassignIDs(newState);
                newState.tracks.forEach(track=>{
                    track.stems.forEach(stem=>{
                        stem.trackId = track.id
                    });
                });
                dispatch(Actions.LOAD(State.defaultState));
                dispatch(Actions.LOAD(newState));
                // renderTempoChange(store.getState());
                // renderBootScript(store.getState());
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