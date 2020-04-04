import Languages from "../LanguageModel";
import Model from "../index";
const readlineSync = require('readline-sync');
const fs = require('fs');
const nopt = require('nopt');
const path = require('path');
const knownOpts = {'inputFile':path, outputFile:path};
const parsed = nopt(knownOpts, {},process.argv);
const file = fs.readFileSync(parsed.inputFile);
const state = JSON.parse(file);

function addTrackLanguages(state){
    const languages = Object.values(Languages);
    const languageString = languages.map((x,i)=>{return `${i}. ${x}`}).join("\n");
    Object.keys(state.tracks).forEach(trackId=>{
        const track = state.tracks[trackId];
        if(track.language===undefined){
            const languageChoice = readlineSync.question(`Enter Language for Track: ${track.name} (${trackId}).\n${languageString}\n`);
            console.log(languages[languageChoice]);
            state.tracks[trackId].language = languages[languageChoice];
        }
    });
    return state;
}

const stateComponents = Object.keys(Model.defaultState).reduce((acc,x)=>{acc[x]=x; return acc}, {});

function _applyTo(state, stateComponent, fn){
    if(!Object.values(stateComponents).includes(stateComponent)){
        throw Error(`Invalid state component ${stateComponent}`)
    }
    const newComponent = Object.keys(state[stateComponent]).reduce((acc,v)=>{
        acc[v] = fn(state[stateComponent][v]);
        return acc;
    },{});
    state[stateComponent] = newComponent;
    return state;
}

function addEmptyMacros(state){
    const addMacros = x => Object.assign(x,{macros:[]});
    state = _applyTo(state, stateComponents.stems, addMacros);
    state = _applyTo(state, stateComponents.master, addMacros);
    state = _applyTo(state, stateComponents.tracks, addMacros);
    state.macros = {};
    return state
}

function writeNewState(state, path){
    if(!path){
        path = `new_state_${new Date().getTime()}.json`
    }
    console.log(`Writing state to ${path}`);
    fs.writeFileSync(path, JSON.stringify(state));
}

// const newState = addTrackLanguages(state);
const newState = addEmptyMacros(state);
writeNewState(newState, parsed.outputFile);

console.log('done');
