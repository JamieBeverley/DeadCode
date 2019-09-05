import Connection from "../Connection";
import {renderTidalCycles,renderTidalCyclesTempoChange} from "./TidalCycles";
import {renderHydra} from "./Hydra";

export function renderState(state){
    renderTidalCycles(state);
    renderHydra(state)
}

export function renderTempoChange(state){
    renderTidalCyclesTempoChange(state);
}

// eventually change..
export function renderBootScript(state){
    Connection.sendCode(state.bootScript);
}