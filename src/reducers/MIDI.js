
const MidiReducer = function (midi, action){
    switch (action.type){
        case 'MIDI_UPDATE':
            return Object.assign({}, midi, action.payload);
        default:
            return midi
    }
}

export default MidiReducer