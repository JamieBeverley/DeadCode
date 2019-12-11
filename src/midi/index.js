import easymidi from 'easymidi'
import prompt from 'prompt'
import Connection from "../Connection";

// const inputs = easymidi.getInputs();
// let i = 0;
// inputs.forEach(x => {
//     console.log(i + " - ", x);
//     i++;
// });
// console.log("enter midi input device number: ");
// prompt.get('device', (e, result) => {
//     let deviceNum = parseInt(result.device);
//     console.log(deviceNum);
//     var input = new easymidi.Input(inputs[deviceNum]);
//     input.on('noteon', function (msg) {
//         console.log(JSON.stringify(msg));
//     });
//
//     // input.on('noteoff', function (msg) {
//     //     console.log(JSON.stringify(msg));
//     // });
//
//     // Connection.init('127.0.0.1',8001);
//
// });


const outputs = easymidi.getOutputs();
let i = 0;
outputs.forEach(x => {
    console.log(i + " - ", x);
    i++;
});
console.log("enter midi output device number: ");
prompt.get('device', (e, result) => {
    let deviceNum = parseInt(result.device);
    console.log(deviceNum);
    var output = new easymidi.Output(outputs[deviceNum]);


    output.send('noteon', {
        note: 56, velocity: 2, channel: 0
    })
    //
    // input.on('noteon', function (msg) {
    //     console.log(JSON.stringify(msg));
    // });

    // input.on('noteoff', function (msg) {
    //     console.log(JSON.stringify(msg));
    // });

    // Connection.init('127.0.0.1',8001);

});


// notes[chan][note] = [0,0];


process.stdin.resume();