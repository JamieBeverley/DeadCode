'use strict';
import Languages from "../LanguageModel";
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

function writeNewState(state, path){
    console.log(`Writing state to ${path}`);
    fs.writeFileSync(path, JSON.stringify(state));
}

const newState = addTrackLanguages(state);
writeNewState(newState, parsed.outputFile);

console.log('done');
