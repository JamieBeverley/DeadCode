import easymidi from 'easymidi'
import prompt from 'prompt'

const inputs = easymidi.getInputs();
let i = 0;
inputs.forEach(x=>{
    console.log(i+" - ", x);
    i++;
});
console.log("enter midi device number: ");
prompt.get('device',(e,result)=>{
    let deviceNum = parseInt(result.device);
    console.log(deviceNum);
    var input = new easymidi.Input(inputs[deviceNum]);
    input.on('noteon', function (msg) {
        console.log(JSON.stringify(msg));
    });

    input.on('noteoff', function (msg) {
        console.log(JSON.stringify(msg));
    });
})



process.stdin.resume();