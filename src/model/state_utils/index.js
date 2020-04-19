import Languages from "../LanguageModel";
import Model from "../index";
import EffectModel from "../EffectModel";
const readlineSync = require('readline-sync');
const fs = require('fs');
const nopt = require('nopt');
const path = require('path');
const knownOpts = {'inputFile':path, outputFile:path};
const parsed = nopt(knownOpts, {},process.argv);
const file = fs.readFileSync(parsed.inputFile);
const state = JSON.parse(file);

// Before orders were added for tracks...
function addTrackLanguages(state){
    const languages = Object.values(Languages);
    const languageString = languages.map((x,i)=>{return `${i}. ${x}`}).join("\n");
    Object.keys(state.tracks).forEach(trackId=>{
        const track = state.tracks.values[trackId];
        if(track.language===undefined){
            const languageChoice = readlineSync.question(`Enter Language for Track: ${track.name} (${trackId}).\n${languageString}\n`);
            console.log(languages[languageChoice]);
            state.tracks.values[trackId].language = languages[languageChoice];
        }
    });
    return state;
}

const stateComponents = Object.keys(Model.defaultState).reduce((acc,x)=>{acc[x]=x; return acc}, {});

function _applyTo(state, stateComponent, fn){
    if(!Object.values(stateComponents).includes(stateComponent)){
        throw Error(`Invalid state component ${stateComponent}`)
    }
    state[stateComponent] = Object.keys(state[stateComponent]).reduce((acc,v)=>{
        acc[v] = fn(state[stateComponent][v]);
        return acc;
    },{});
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

function notifyEffectBugs(state){
    const stemEffects = Object.keys(state.stems).map(x=>({stemName:state.stems[x].name, effects:state.stems[x].effects}));
    const effectDNE = e => state.effects[e] === undefined;
    const bugs = stemEffects.filter(x=>{
        return x.effects.filter(effectDNE).length;
    }).forEach(x=>{
       console.log(JSON.stringify({stemName: x.stemName, missingEffects: x.effects.filter(effectDNE)}));
    });
}

function deleteNonExistingStemEffects(state){
    for (let i in state.stems){
        state.stems[i].effects = state.stems[i].effects.filter(x=>state.effects[x]);
    }
    return state
}

// For effect refactor
function assignSliderTypes(state){
    function applyType(effect){
        if(effect.type===EffectModel.Types.SLIDER){
            if(effect.properties.code==='coarse'){
                effect.properties.type = EffectModel.SliderTypes.int;
            } else {
                effect.properties.type = EffectModel.SliderTypes.float;
            }
        }
        return effect
    }
    return _applyTo(state, stateComponents.effects, applyType);
}

function addTrackOrders(state){
    state.tracks = {
        values: state.tracks,
        order: Object.keys(state.tracks)
    };
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
// const newState = addEmptyMacros(state);
// const newState = deleteNonExistingStemEffects(state);
// const newState = assignSliderTypes(state);

/*
commit 62d7609f6731abba3c4671a52030dd1e3dc15356 (HEAD -> orders)
Author: JamieBeverley <jamie_beverley@hotmail.com>
Date:   Sat Apr 18 19:12:26 2020 -0400
 */
const newState = addTrackOrders(state);

writeNewState(newState, parsed.outputFile);
console.log('done');
