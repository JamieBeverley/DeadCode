import {ActionSpec,Actions} from "../actions";
import {Renderers} from "../renderers";

export const serverMiddleware = store => next => action => {
  if(action.type === ActionSpec.LOAD_FROM_SERVER.name){
    let state = {...store.getState(), connection:null};
    let msg = {type:'action',action:Actions.receiveState(state)};
    broadcast(msg)
  }
  return next(action);
};

let tidalCode ='';
export const renderMiddleWare = store => next => action => {
  next(action);
  let state = store.getState();
  if(action.type === ActionSpec.MASTER_UPDATE.name || action.type === ActionSpec.PUSH_STATE.name){
    evalTidal(state.master.TidalCycles.macros);
    evalTidal(Renderers.TidalCycles.getTempoCode(state));
  }
  let tc = Renderers.TidalCycles.getCode(state);
  if(tidalCode!==tc){
    evalTidal(tc);
    tidalCode = tc;
  }
};