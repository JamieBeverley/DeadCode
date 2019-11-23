import {Actions} from './index.js';
import {store} from '../index.js';
import Connection from "../Connection";
import Id from "../model/Id";
import EffectModel from "../model/EffectModel";
import StemModel from "../model/StemModel";
import TrackModel from "../model/TrackModel";

function getPosition(state, stemId) {
    let track = Object.keys(state.tracks).findIndex(x => {
        return state.tracks[x].stems.includes(stemId)
    });
    let stem = state.tracks[Object.keys(state.tracks)[track]].stems.findIndex(x => {
        return x === stemId
    });
    return {track, stem}
}

const GlobalActions = dispatch => {
    return {
        connect: (url, port) => {
            let onOpen = () => {
                dispatch(Actions.connect({url, port, isConnected: true}))
            };
            let onClose = () => {
                dispatch(Actions.connect({url, port, isConnected: false}))
            };
            let onError = onClose;
            Connection.init(url, port, onOpen, onClose, onError);
        },
        stemCopy: () => {
            let state = store.getState();
            let items = Object.keys(state.stems).filter(x => {
                return state.stems[x].selected
            });
            dispatch(Actions.stemCopy({items}))
        },
        stemPaste: (stemId) => {
            let state = store.getState();
            if (!state.copy || state.copy.items.length < 1) {
                console.log('nothing copied');
                return
            }
            let pastePos = getPosition(state, stemId);
            let globalActions = GlobalActions(dispatch)
            let anchorPos = getPosition(state, state.copy.items[0]);
            let diffPos = {track: pastePos.track - anchorPos.track, stem: pastePos.stem - anchorPos.stem};
            state.copy.items.forEach(sId => {
                let cpPos = getPosition(state, sId);

                let newPos = {track: cpPos.track + diffPos.track, stem: cpPos.stem + diffPos.stem};

                if (newPos.track >= Object.keys(state.tracks).length) {
                    console.log('too long');
                    return
                }

                let targetTrackId = Object.keys(state.tracks)[newPos.track];

                while (newPos.stem >= state.tracks[targetTrackId].stems.length) {
                    globalActions.trackAddStem(targetTrackId);
                    state = store.getState();
                }
                let targetStemId = state.tracks[targetTrackId].stems[newPos.stem];
                globalActions.stemUpdate(targetStemId, state.stems[sId]);
            })
        },
        save: () => {
            window.localStorage.setItem('state', JSON.stringify(store.getState()));
            console.log('saved')
        },
        load: () => {
            let newState = window.localStorage.getItem('state');
            if (newState) {
                newState = JSON.parse(newState);
                Id.init(newState);
                dispatch(Actions.load(newState));
                // renderTempoChange(store.getState());
                // renderBootScript(store.getState());
            } else {
                console.warn('Tried to load state but empty');
            }
        },
        open: (file) => {
            if (!file) {
                let input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => {
                    input.files[0].text().then(x => {
                        dispatch(Actions.load(JSON.parse(x)));
                    });
                };
                input.click();
            } else {
                file.text().then(x => {
                    dispatch(Actions.load(JSON.parse(x)));
                });
            }
        },
        download: () => {
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState()));
            let anchor = document.createElement('a');
            anchor.setAttribute("href", dataStr);
            anchor.setAttribute("download", "dead_state.json");
            anchor.click();
            dispatch(Actions.download());
        },
        masterUpdate: (language, value) => {
            dispatch(Actions.masterUpdate({language, value}));
        },
        stemUpdate: (stemId, value) => {
            dispatch(Actions.stemUpdate({stemId, value}));
        },
        stemDeleteEffect: (stemId, effectId) => {
            dispatch(Actions.stemDeleteEffect({stemId, effectId}));
        },
        stemAddEffect: (stemId, type, language, on, properties) => {
            let effectId = Id.new();
            let value = EffectModel.getNew(type, language, on, properties);
            dispatch(Actions.stemAddEffect({stemId, effectId, value}));
        },
        trackUpdate: (trackId, value) => {
            dispatch(Actions.trackUpdate({trackId, value}));
        },
        trackDeleteStem: (trackId, stemId) => {
            dispatch(Actions.trackDeleteStem({trackId, stemId}));
        },
        // TODO: stuff like this would probably be better as sagas
        trackAddStem: (trackId, language = 'TidalCycles') => {

            // create stem and assign to track
            let stemId = Id.new();
            let stem = StemModel.getNew(language);
            dispatch(Actions.trackAddStem({trackId, stemId, value: stem}));

            // create default effects for the new stem
            EffectModel.util.defaultEffects[language]().forEach(effect => {
                GlobalActions(dispatch).stemAddEffect(stemId, effect.code, effect.type, effect.language, effect.on, effect.properties)
            });
        },
        trackDeleteEffect: (trackId, effectId) => {
            dispatch(Actions.trackDeleteEffect({trackId, effectId}));
        },
        trackAddEffect: (trackId) => {
            let effectId = Id.new();
            let value = EffectModel.getNew("gain", EffectModel.Types.SLIDER, "TidalCycles", true,
                {
                    value: 1,
                    operator: "|*",
                    min: 0,
                    max: 2,
                    step: 0.01,
                    scale: 'linear'
                });
            dispatch(Actions.trackAddEffect({trackId, effectId, value}));
        },
        trackAdd: (opt_language) => {
            let value = TrackModel.getNew(opt_language);
            let trackId = Id.new();
            dispatch(Actions.trackAdd({trackId, value}));
            let globalActions = GlobalActions(dispatch);
            [0, 0, 0, 0, 0].forEach(() => {
                globalActions.trackAddStem(trackId)
            });
            globalActions.trackAddEffect(trackId,);
        },
        trackDelete: (trackId) => {
            let state = store.getState();
            let track = state.tracks[trackId];
            let globalActions = GlobalActions(dispatch)
            track.stems.forEach(s => {
                globalActions.trackDeleteStem(trackId, s);
            });
            dispatch(Actions.trackDelete({trackId}));
        },
        effectUpdate: (effectId, value) => {
            dispatch(Actions.effectUpdate({effectId, value}));
        }
    }
}

export default GlobalActions

// const GlobalActions = dispatch=> {
//     return {
//         connect: (url,port)=>{
//             let onOpen = ()=>{
//                 dispatch(Actions.CONNECT(url,port,true));
//             };
//             let onClose = ()=>{dispatch(Actions.CONNECT(url,port,false))};
//             let onError = onClose;
//             Connection.init(url,port, onOpen, onClose, onError);
//         },
//         updateMaster:(language, value) =>{
//             dispatch(Actions.UPDATE_MASTER(language, value));
//         },
//         updateMasterEffect:(effect) =>{
//             dispatch(Actions.UPDATE_MASTER_EFFECT(effect));
//         },
//         copyStems:(x)=>{
//             dispatch(Actions.COPY_STEMS(x))
//         },
//         pasteStems:(trackId, stemId)=>{
//             dispatch(Actions.PASTE_STEMS(trackId, stemId));
//             let state = store.getState();
//             state.tracks.forEach(track=>{
//                 track.stems.filter(x=>x.selected).forEach(stem=>{
//                     dispatch(Actions.UPDATE_STEM(stem.trackId,stem.id,{selected:false}));
//                 })
//             })
//         },
//         addTrack: ()=>{
//             dispatch(Actions.ADD_TRACK())
//         },
//         removeTrack: (trackId)=>{
//             dispatch(Actions.REMOVE_TRACK(trackId))
//         },
//         addStem: (trackId)=>{
//             dispatch(Actions.ADD_STEM(trackId))
//             // renderState(store.getState());
//         },
//         removeStem: (trackId, stemId)=>{
//             dispatch(Actions.REMOVE_STEM(trackId,stemId))
//             // renderState(store.getState());
//         },
//         updateStem: (trackId, stemId, value)=>{
//             dispatch(Actions.UPDATE_STEM(stemId, value));
//         },
//         openInFlyout: (trackId, stemId)=> {
//             dispatch(Actions.OPEN_IN_FLYOUT(trackId,stemId))
//         },
//         updateTrack: (value)=>{
//             dispatch(Actions.UPDATE_TRACK(value))
//             // renderState(store.getState());
//         },
//         addStemEffect:(trackId, stemId,type)=>{
//             dispatch(Actions.ADD_STEM_EFFECT(trackId, stemId,type))
//         },
//         // toggleLive: (value)=>{
//         //     dispatch(Actions.TOGGLE_LIVE(value))
//         // },
//         save:()=>{
//             window.localStorage.setItem('state', JSON.stringify(store.getState()));
//             console.log('saved')
//         },
//         load: ()=>{
//             let newState = window.localStorage.getItem('state');
//             if(newState){
//                 newState = JSON.parse(newState);
//                 Id.init(newState);
//                 newState.tracks.forEach(track=>{
//                     track.stems.forEach(stem=>{
//                         stem.trackId = track.id
//                     });
//                 });
//                 dispatch(Actions.LOAD(Model.defaultState));
//                 dispatch(Actions.LOAD(newState));
//                 // renderTempoChange(store.getState());
//                 // renderBootScript(store.getState());
//             } else {
//                 console.warn('Tried to load state but empty')
//             }
//         },
//         download: ()=>{
//             let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState()));
//             let anchor = document.createElement('a')
//             anchor.setAttribute("href", dataStr);
//             anchor.setAttribute("download", "dead_state.json");
//             anchor.click();
//             dispatch(Actions.DOWNLOAD());
//         },
//         openFile: (file)=>{
//             if(!file){
//                 let input = document.createElement('input');
//                 input.type = 'file';
//                 input.onchange = (e)=>{
//                     input.files[0].text().then(x=>{
//                         dispatch(Actions.LOAD(JSON.parse(x)));
//                     });
//                 };
//                 input.click();
//             } else {
//                 file.text().then(x=>{
//                     dispatch(Actions.LOAD(JSON.parse(x)));
//                 });
//             }
//         }
//     }
// };
//
// export default GlobalActions;
