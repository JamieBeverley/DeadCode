import EffectModel from "./EffectModel";
import StemModel from "./StemModel";
import languages from './LanguageModel'

function getNew(language=languages.TidalCycles) {
    return {
        name: 'New Track',
        stems:[],
        effects:[],
        language
    }
}

function clone(track) {
    return {
        ...track,
        stems: track.stems.map(x => {
            return StemModel.clone(x)
        }),
        effects: track.effects.map(EffectModel.clone)
    }
}

const TrackModel = {
    getNew,
    clone
};

export default TrackModel
