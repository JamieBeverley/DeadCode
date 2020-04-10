const spawn = require('child_process').spawn;
const fs = require('fs');

export default class NativeRenderer {

    constructor(interpreter, interpreterOptions, bootScriptPath, renderer, silent = false) {
        this.interpreter = interpreter;
        this.interpreterOptions = interpreterOptions;
        this.bootScriptPath = bootScriptPath;
        // this.renderer = renderer(this);
        this.silent = silent;
    }

    log(s){
        if (!this.silent) {
            console.log(s, "\n");
        }
    }

    boot() {
        this.process = spawn(this.interpreter, this.interpreterOptions);
        this.process.on('close', (code) => {this.log('Tidal process exited with code ' + code + "\n");});
        this.process.stderr.addListener("data", m => {this.log(m.toString());});
        this.process.stdout.addListener("data", m => {this.log(m.toString());});

        return new Promise((res, rej) => {
            if (this.bootScriptPath) {
                fs.readFile(this.bootScriptPath, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err + "\n");
                        rej(err);
                    }
                    this.evaluate(data);
                    this.log(`${this.interpreter} booted.`);
                    res(this.process)
                });
            } else {
                res(this.process)
            }
        });
    }

    render(state, action) {
        this.renderer(state, action);
    }

    evaluate(str) {
        str = `${str}\n`;
        this.process.stdin.write(str);
        this.log(str)
    }
}
