const SuperColliderTypes = {Ndef:'Ndef', Pdef:'Pdef'};

const Languages = {};
Languages.TidalCycles = {name:"TidalCycles", defaultStemProperties:{}};
Languages.Hydra = {name:"Hydra", defaultStemProperties:{}};
Languages.SuperCollider = {name:"SuperCollider", defaultStemProperties:{type:SuperColliderTypes.Ndef, quant:0,fadeTime:0}};

export default Languages