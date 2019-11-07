import Id from "./Id";
import EffectModel from "./EffectModel";
import StemModel from "./StemModel";

let getGainEffect = function () {
    return EffectModel.getNew(
        "gain",
        EffectModel.Types.SLIDER,
        '',
        true,
        {
            value: 0.5,
            operator: "#",
            min: 0,
            max: 1,
            step: 0.01,
            scale: 'linear'
        }
    )
}



function getNew(opt_language = "TidalCycles") {
    const id = Id.new();
    return {
        id,
        name: 'New Track',
        stems:[],
        effects:[]
    }
}


function clone(track) {
    const id = Id.new();
    return {
        ...track,
        id,
        stems: track.stems.map(x => {
            return StemModel.clone(x, id)
        }),
        effects: track.effects.map(EffectModel.clone)
    }
}

const TrackModel = {
    getNew,
    clone
}

export default TrackModel