function clone (macro){
    return {...macro}
};

function getNew(){
    return {
        placeholder:'',
        value:''
    }
};

const MacroModel = {
    getNew,
    clone
};

export default MacroModel
