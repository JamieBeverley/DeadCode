import easymidi from 'easymidi'
import prompt from 'prompt-promise'

var input,output;
const getInput = function (res) {
  try {
    const inputs = easymidi.getInputs();
    let i = 0;
    inputs.forEach(x => {
      console.log(i + " - ", x);
      i++;
    });

    prompt('enter midi input device number\n').then(device=>{
      let deviceNum = parseInt(device);
      input = new easymidi.Input(inputs[deviceNum]);
      input.on('noteoff', (m)=>{console.log(m);console.log('\n\n\n')});
      console.log('\n\n');
      res && res(input);
    })
  } catch (e) {
    console.warn("could not init midi input")
  }
}


const getOutput = function (res){
  try {
    const outputs = easymidi.getOutputs();
    let i = 0;
    outputs.forEach(x => {
      console.log(i + " - ", x);
      i++;
    });
    prompt('enter midi output device number\n').then(device=>{
      let deviceNum = parseInt(device);
      output = new easymidi.Output(outputs[deviceNum]);
      // for(let i = 0; i<127; i++){
      //   for(let j = 0; j<16; j++){
      //     for(let k = 127; k>0; k--){
      //       output.send('noteon',{note:i,channel:j,velocity:k});
      //     }
      //   }
      // }
      output.send('noteon',{note:28,channel:0,velocity:1});

      console.log('sent')
      res && res(output);
    })

  } catch (e) {
    console.warn("could not init midi output")
  }
}

function init() {
  getInput(()=>{getOutput()});
}
init();

process.stdin.resume();