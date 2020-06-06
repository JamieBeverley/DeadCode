import {Actions} from './index.js';
import store from '../store.js';
import Connection from "../Connection";
import Id from "../model/Id";
import EffectModel from "../model/EffectModel";
import StemModel from "../model/StemModel";
import TrackModel from "../model/TrackModel";
import {ActionSpec} from "./index";
import MacroModel from '../model/MacroModel'
import ScratchModel from "../model/ScratchModel";

function getPosition(state, stemId) {
    let track = state.tracks.order.findIndex(x => {
        return state.tracks.values[x].stems.includes(stemId)
    });
    let stem = state.tracks.values[state.tracks.order[track]].stems.findIndex(x => {
        return x === stemId
    });
    return {track, stem}
}

const GlobalActions = dispatch => {
    return {
        pushState: () => {
            let providedState = {...store.getState(), connection: undefined};
            dispatch(Actions.pushState(providedState));
        },
        receiveState: (state) => {
            dispatch(Actions.receiveState(state));
        },
        connect: (url, port) => {
            let actions = Actions
            let onOpen = () => {
                dispatch(Actions.connect({url, port, isConnected: true}))
            };
            let onClose = () => {
                dispatch(actions.connect({url: url, port: port, isConnected: false}))
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

                if (newPos.track >= state.tracks.order.length) {
                    console.log('too long');
                    return
                }

                let targetTrackId = state.tracks.order[newPos.track];

                while (newPos.stem >= state.tracks.values[targetTrackId].stems.length) {
                    globalActions.trackAddStem(targetTrackId);
                    state = store.getState();
                }
                let targetStemId = state.tracks.values[targetTrackId].stems[newPos.stem];
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
            } else {
                console.warn('Tried to load state but empty');
            }
        },
        loadFromServer: () => {
            Connection.sendAction({
                type: ActionSpec.LOAD_FROM_SERVER.name,
                meta: {propagateToServer: true, fromServer: false}
            });
        },
        open: (file) => {
            if (!file) {
                let input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => {
                    input.files[0].text().then(x => {
                        let newState = JSON.parse(x);
                        Id.init(newState);
                        dispatch(Actions.load(newState));
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
        masterAddEffect: (type, language, on, properties) => {
            let effectId = Id.new();
            let value = EffectModel.getNew(type, language, on, properties);
            dispatch(Actions.masterAddEffect({language, effectId, value}));
        },
        stemUpdate: (stemId, value) => {
            dispatch(Actions.stemUpdate({stemId, value}));
        },
        // Separated to a different action so not every stemUpdate required importing the store and checking if
        // language changed.
        stemUpdateLanguage: (stemId, language) => {
            let stem = store.getState().stems[stemId];
            let globalActions = GlobalActions(dispatch);
            if (stem.language !== language) {
                stem.effects.forEach(effectId => {
                    globalActions.stemDeleteEffect({stemId, effectId})
                });
                EffectModel.util.defaultEffects[language]().forEach(effect => {
                    globalActions.stemAddEffect(stemId, effect.type, effect.language, effect.on, effect.properties);
                });
                globalActions.stemUpdate(stemId, {language: language});
            }
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
            const state = store.getState();
            const stem = state.stems[stemId];
            if (trackId===undefined){
                trackId = Object.keys(state.tracks.values).find(trackId=>{
                    return state.tracks.values[trackId].stems.includes(stemId);
                });
            }

            dispatch(Actions.trackDeleteStem({trackId, stemId, effects:stem.effects, macros:stem.macros}));
        },
        // TODO: this is ugly
        trackAddStem: (trackId, stemValue) => {
            const state = store.getState();
            const language = state.tracks.values[trackId].language;
            // create stem and assign to track
            const stemId = Id.new();
            const stem = {...StemModel.getNew(language), ...stemValue};
            dispatch(Actions.trackAddStem({trackId, stemId, value: stem}));
            // create default effects for the new stem
            EffectModel.util.defaultEffects[language]().forEach(effect => {
                GlobalActions(dispatch).stemAddEffect(stemId, effect.type, effect.language, effect.on, effect.properties);
            });
        },
        trackDeleteEffect: (trackId, effectId) => {
            dispatch(Actions.trackDeleteEffect({trackId, effectId}));
        },
        trackAddEffect: (trackId, type, language, on, properties) => {
            let effectId = Id.new();
            let value = EffectModel.getNew(type, language, on, properties);
            dispatch(Actions.trackAddEffect({trackId, effectId, value}));
        },
        trackAdd: (language) => {
            let value = TrackModel.getNew(language);
            let trackId = Id.new();
            dispatch(Actions.trackAdd({trackId, value}));
            let globalActions = GlobalActions(dispatch);
            [0, 0, 0, 0, 0, 0, 0, 0].forEach(() => {
                globalActions.trackAddStem(trackId)
            });
            EffectModel.util.defaultEffects[language]().forEach(x=>{
                globalActions.trackAddEffect(trackId, x.type, language, x.on, x.properties)
            });
        },
        trackDelete: (trackId) => {
            const state = store.getState();
            const track = state.tracks.values[trackId];
            const stems = track.stems.map(x=>state.stems[x]);
            const stemEffects = stems.map(s=>s.effects).flat();
            const trackEffects = track.effects;
            const macros = track.macros.concat(stems.map(x=>x.macros).flat());
            dispatch(Actions.trackDelete({trackId, stems:track.stems, effects: trackEffects.concat(stemEffects), macros}));
        },
        trackReorder: (trackId, position) => {
            dispatch(Actions.trackReorder({trackId, position}))
        },
        effectUpdate: (effectId, value) => {
            dispatch(Actions.effectUpdate({effectId, value}));
        },
        // Special event only for updating the effect value permits efficiency improvements in rendering, eg. for sliders.
        effectUpdateSliderValue: (effectId, value) => {
            dispatch(Actions.effectUpdateSliderValue({effectId, value}))
        },
        settingsUpdateStyle: (value) => {
            let styleElement = document.body.querySelector('#style style');
            if (styleElement === null) {
                styleElement = document.createElement('style');
                styleElement.setAttribute('id', 'style');
                document.body.append(styleElement)
            }
            styleElement.innerHTML = `:root{${
                Object.keys(value).map(key => {
                    return `${key}: ${value[key]}`
                }).join(";\n  ")
            }}`;

            dispatch(Actions.settingsUpdateStyle({value}))
        },
        ///////////////////////////////////////////////////////////////////////
        // Macros

        // Create
        trackAddMacro: (trackId) => {
            const macroId = Id.new();
            const value = MacroModel.getNew();
            dispatch(Actions.trackAddMacro({trackId, macroId, value}))
        },
        masterAddMacro: (masterId) => {
            const macroId = Id.new();
            const value = MacroModel.getNew();
            dispatch(Actions.masterAddMacro({masterId, macroId, value}))
        },
        stemAddMacro: (stemId) => {
            const macroId = Id.new();
            const value = MacroModel.getNew();
            dispatch(Actions.stemAddMacro({stemId, macroId, value}))
        },
        // Delete
        trackDeleteMacro: (trackId, macroId) => {
            dispatch(Actions.trackDeleteMacro({trackId, macroId}))
        },
        masterDeleteMacro: (masterId, macroId) => {
            dispatch(Actions.masterDeleteMacro({masterId, macroId}))
        },
        stemDeleteMacro: (stemId, macroId) => {
            dispatch(Actions.stemDeleteMacro({stemId, macroId}))
        },
        // Update
        macroUpdate: (macroId, value) => {
            dispatch(Actions.macroUpdate({macroId, value}))
        },

        /////////////////////////////////////////////////////////////////////
        // Scratches
        scratchCreate: (defaults) =>{
            const scratchId = Id.new();
            const value = {...ScratchModel.getNew(), ...defaults};
            dispatch(Actions.scratchCreate({scratchId,value}))
        },
        scratchUpdate: (scratchId, value) =>{
            dispatch(Actions.scratchUpdate({scratchId,value}))
        },
        scratchDelete: (scratchId) =>{
            dispatch(Actions.scratchDelete({scratchId}))
        },
        scratchRender: () =>{
            dispatch(Actions.scratchRender())
        },
        scratchTranslate: (scratchId) =>{
            const {scratches} = store.getState();
            const scratch = scratches[scratchId];
            const language = scratch.language;
            const globalActions = GlobalActions(dispatch);

            // Create new Track
            const value = {...TrackModel.getNew(language), name: scratch.name};
            const trackId = Id.new();
            dispatch(Actions.trackAdd({trackId, value}));
            EffectModel.util.defaultEffects[language]().forEach(x=>{
                globalActions.trackAddEffect(trackId, x.type, language, x.on, x.properties)
            });

            // Parcel scratch lines into code for stems
            const lines = scratch.code.split("\n").filter(x=>x!=='');

            // Create stems, assign to Track
            lines.forEach(code=>{
                globalActions.trackAddStem(trackId,{code})
            });

            // Dispatch translate event to mark complete
            dispatch(Actions.scratchTranslate({scratchId}))
        },
    }
};

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
