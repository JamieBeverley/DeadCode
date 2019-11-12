
const Id = {index:0};

function getMaxId(obj){
    let ids = [];
    for (let i in obj){
        if(i==='id'){
            ids.push(obj[i])
        } else if(typeof obj[i] === 'object'){
            ids.push(getMaxId(obj[i]))
        }
    }
    return Math.max(...ids)
}

Id.init =  function (state){
    Id.index = getMaxId(state);
}


Id.new = function() {
    return (Id.index++)+'';
};

export default Id