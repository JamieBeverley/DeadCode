
const Id = {index:0};

// function getMaxId(obj){
//     let ids = [];
//     for (let i in obj){
//         if(i==='id'){
//             ids.push(obj[i])
//         } else if(typeof obj[i] === 'object'){
//             ids.push(getMaxId(obj[i]))
//         }
//     }
//     return Math.max(...ids)
// }

Id.init =  function (state){
    const effects = Math.max(...Object.keys(state.effects).map(parseFloat));
    const tracks = Math.max(...Object.keys(state.tracks.values).map(parseFloat));
    const stems = Math.max(...Object.keys(state.stems).map(parseFloat));
    const macros = Math.max(...Object.keys(state.stems).map(parseFloat));
    Id.index = Math.max(effects,tracks,stems, macros)+1;
    console.log('loaded id index: '+Id.index);
};


Id.new = function() {
    return (Id.index++)+'';
};

export default Id
