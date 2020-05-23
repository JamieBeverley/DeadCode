export const createRenderMiddleware = renderers => store => next => action => {
    next(action);
    renderers.forEach(x=>x.render(store.getState(),action));
};

export const minimalLogger = store => next => action => {
    console.log('\x1b[33m%s\x1b[0m', action.type);  //yello
    next(action);
};

// let tidalCode ='';
// export const renderMiddleWare = nativeRenderers => store => next => action => {
//     next(action);
//     let state = store.getState();
//     if(action.type === ActionSpec.MASTER_UPDATE.name || action.type === ActionSpec.PUSH_STATE.name){
//         evalTidal(state.master.TidalCycles.code);
//         evalTidal(Renderers.TidalCycles.getTempoCode(state));
//     }
//     let tc = Renderers.TidalCycles.getCode(state);
//     if(tidalCode!==tc){
//         evalTidal(tc);
//         tidalCode = tc;
//     }
// };
