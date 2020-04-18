import {uniqueId} from "lodash";

export const languages = ["TidalCycles","Hydra"];

var State = {}

State.getDefaultEffects = function (){
    return [
        {
            name:'gain',
            id:uniqueId(),
            on:false,
            scale:'linear',
            operator: "|*",
            value:1,
            min:0,
            max:2,
            step:0.01
        },
        {
            name:'lpf',
            operator: "#",
            id:uniqueId(),
            on:false,
            scale:'log',
            value:22000,
            min:0,
            max:22000,
            step:10
        },
        {
            name:'hpf',
            id:uniqueId(),
            operator: "#",
            on:false,
            scale:'log',
            value:0,
            min:0,
            max:22000,
            step:10
        }
    ];
}

State.getDefaultTrack = function  (){
    let id = uniqueId();
    return {
        id,
        name:'',
        stems:([0,0,0,0,0]).map(x=>{return State.getDefaultStem(id)}),
        effects:[
            {
                name:'gain',
                id:uniqueId(),
                on:true,
                scale:'linear',
                operator: "|*",
                value:1,
                min:0,
                max:2,
                step:0.01
            }
        ]
    }
}

State.cloneStem = function(stem){
    return {
        ...stem,
        effects:[...stem.effects].map(x=>{return Object.assign({},x)}),
        id:uniqueId()
    }
}

State.getDefaultStem = function  (trackId){
    return {
        id: uniqueId(),
        trackId,
        name:'',
        on: false,
        selected:false,
        open:false,
        live:false,
        language:'TidalCycles',
        code:"",
        effects: State.getDefaultEffects()
    }
};

State.defaultState = {
    live:true,
    tempo:120,
    copy: null,
    languages,
    bootScript:'',
    tracks: ([0,0,0,0,0]).map(x=>{return State.getDefaultTrack()}),
    masterEffects:[
        {
            name:'gain',
            id:uniqueId(),
            on:false,
            scale:'linear',
            operator: "|*",
            value:1,
            min:0,
            max:2,
            step:0.01
        },
        {
            name:'lpf',
            operator: "#",
            id:uniqueId(),
            on:false,
            scale:'log',
            value:22000,
            min:0,
            max:22000,
            step:10
        },
        {
            name:'hpf',
            id:uniqueId(),
            operator: "#",
            on:false,
            scale:'log',
            value:0,
            min:0,
            max:22000,
            step:10
        }
    ],
    connection:{
        isConnected:false,
        url:'127.0.0.1',
        // url:'127.0.0.1',
        port:8001
    }
    // connection:{
    //     isConnected:false,
    //     url:'192.168.0.117',
    //     // url:'127.0.0.1',
    //     port:8000
    // }
};



State.getDefaultEffect = function (name='gain'){
    return {
        name,
        id:uniqueId(),
        on:false,
        scale:'linear',
        operator:"|*",
        value:1,
        min:0,
        max:1,
        step:0.01
    }
};



export default State
