const Id = {index: 0};

Id.init = function (state) {
    const effects = Math.max(...Object.keys(state.effects).map(parseFloat));
    const tracks = Math.max(...Object.keys(state.tracks.values).map(parseFloat));
    const stems = Math.max(...Object.keys(state.stems).map(parseFloat));
    const macros = Math.max(...Object.keys(state.stems).map(parseFloat));
    const scratches = Math.max(...Object.keys(state.scratches || {}).map(parseFloat));
    Id.index = Math.max(effects, tracks, stems, macros, scratches) + 1;
    console.log('loaded id index: ' + Id.index);
};


Id.new = function () {
    return (Id.index++) + '';
};

export default Id
