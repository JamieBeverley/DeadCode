# DeadCode

Dead is a browser-based, language-agnostic, and tablet-friendly environment for audio-visual live coding 
and Code Jockeying. Dead provides an interface for authoring code snippets that can be toggled on and off 
on a grid of buttons (called ‘stems’). The interface contains sliders and other continuous control inputs 
to facilitate smooth transitioning between stems and ‘tracks’ (columns of stems). Currently Dead supports 
the [TidalCycles](https://tidalcycles.org/index.php/Welcome) and [Index](https://github.com/ojack/hydra) live 
coding languages, with the capability (and desire!) to include renderers for other languages in future versions.

For more info on how to use Dead see this [demo video](https://youtu.be/nTBwdGbfgmU) and [this short performance](https://www.youtube.com/watch?v=kuJlpd2i25k)

### Installing/Running

Dependencies:
- NodeJS, npm or yarn
- [TidalCycles](https://tidalcycles.org/index.php/Installation)
- for MIDI, you may need to install dependencies for the npm [node-midi](https://www.npmjs.com/package/midi) and [easymidi](https://www.npmjs.com/package/easymidi) packages
- Chrome web browser (currently untested on other browsers)

##### Clone and build JS dependencies:
```bash
git clone https://github.com/JamieBeverley/DeadCode
cd DeadCode
yarn install
```

##### Running Dead:

Run the Dead interface (should open your web browser to the address localhost:3000)
```bash
yarn start
```
To evaluate TidalCycles code, Dead connects to a small NodeJS WebSocket server application (run locally on 
your machine) that receives TidalCycles code from the browser, and pipes it to the Haskell interpreter.

To run the NodeJS relay (in a new terminal):
```bash
yarn backend
```

`src/backend/` contains a Tidal boot file 'BootTidal.hs' - to specify different Tidal Boot params edit/replace this file.