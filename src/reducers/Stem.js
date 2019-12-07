
const StemReducer = (stems, action) => {
    const payload = action.payload

    if (action.type === 'STEM_UPDATE') {
        stems[payload.stemId] = Object.assign({}, stems[payload.stemId], payload.value);
        return {...stems};
    } else if (action.type === 'STEM_DELETE_EFFECT') {
        stems[payload.stemId] = Object.assign({}, stems[payload.stemId]);
        stems[payload.stemId].effects = stems[payload.stemId].effects.filter(x => {
            return x !== payload.effectId
        });
        return {...stems}
    } else if (action.type === 'STEM_ADD_EFFECT') {
        stems[payload.stemId] = Object.assign({}, stems[payload.stemId]);
        stems[payload.stemId].effects.push(payload.effectId);
        return {...stems}
    } else if (action.type === 'STEM_COPY') {
        // nothing
        return stems
    } else if (action.type === 'STEM_PASTE') {
        console.log('paste not yet implemented');
        return stems
    } else if (action.type === 'TRACK_ADD_STEM') {
        stems[payload.stemId] = payload.value;
        return {...stems}
    } else if (action.type === 'TRACK_DELETE_STEM') {
        delete stems[payload.stemId];
        return {...stems}
    }

    return stems
}

export default StemReducer