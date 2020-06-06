import languages from './LanguageModel'

function getNew(language=languages.TidalCycles) {
    return {
        code:'',
        language,
        name: '',
        on:true
    }
}

function clone(scratch) {
    return {...scratch}
}

const ScratchModel = {
    getNew,
    clone
};

export default ScratchModel
