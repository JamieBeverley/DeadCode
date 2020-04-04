function clone (macro){
    return {...macro}
};

function getNew(){
    return {
        placeholder:'x',
        value:''
    }
};

const MacroModel = {
    getNew,
    clone
};

export default MacroModel
