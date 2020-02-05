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

Run the Dead browser interface. Your browser should open to localhost:3000. You can open the application on tablets and other devices by navigating to `<ip address running the server>:3000`
```bash
yarn start
```
Run the Dead websocket server. This NodeJS app shares state between all connected clients (eg. your browser on your desktop/tablet).
and is responsible for passing TidalCycles code to GHCI.
```
yarn backend
```

`src/backend/` contains a Tidal boot file 'BootTidal.hs' - to specify different Tidal Boot params edit/replace this file.

### Using the Performance Interface

Each button on the left side of the interface (called a 'Stem') contains some code that will be toggled on/off
when the button is clicked/tapped. To edit a Stem's code, right click on a button and it will appear in the 
menu on the right of the interface.

#### Stems
You can give a name to the Stem, choose which language it runs, edit its code, and add effects to apply to 
that stem. Enter code in the text box and hit 'eval' or shift+enter to evaluate it - if the stem is toggled on you should 
see/hear the result. TidalCycles code should omit the dirt layer (eg. no `d1` `d2`, etc...) - all stems are combined into 
a single`stack` expression.

#### Effects
Stems have effects below the code editor that can be toggled on/off. There are 2 types of effects: sliders and 'code toggles':
Sliders can be used to control parameters that take one numerical value. Code toggles take code in the language of the stem 
and apply them to that stem's code when toggled.

`TidalCycles`: Effects for stems are pre-pended to the code for that stem. Eg. a code toggle effect with the code
`(linger 0.5) . (# speed 2)` applied to a stem with code `s "kick hat clap hat"` would produce `(linger 0.5) . (# speed 2) $ s "kick hat clap hat"`

`Hydra`: Effects for hydra stems are appended to the code for that stem: Eg. a code toggle effect with the code
`.modulate(noise())` applied to a stem with code `osc()` would produce `osc().modulate(noise())`.

#### Master Settings
Master effects and settings can be defined under the `master` tab in the menu on the right.
Macros that are evaluated prior to any stem evaluation can be entered here as well.

For instance you may want a global varialbe `melody` accessible to your Tidal stems. In the `master`
tab you could define: `let melody = "0 3 7 14 19"` and use the `melody` variable in your stems.

`Tempo` for Tidal can also be defined in the master settings.

#### Saving and Loading
You can download a `.json` containing your set with CTRL-D (or the download icon) and open a `.json` file with CTRL-O (or the folder icon).

To save a set to local browser storage hit CTRL+S or hit the floppy disk icon at the top of the interface. You can load 
the state from browser storage with CTRL+L, or hitting the icon next to the save button. 

**Note:** Be careful if saving only to local storage if running on `localhost` - another `localhost` application may write-over 
your saved data (always download the state as well just in case)

#### Connecting to the WebSocket Server + Pushing the State
If you lose connection to the websocket server the icon in the top bar will turn red. To re-conenct, click the icon and 
click reconnect (you can specify a different address/port here too for the WS Server).

Sometimes you need to force-push the state of the browser to all connected clients. For instance, if you load a set 
from a `.json` file on your desktop browser and want the state to be re synchronized on a tablet that is also connected 
you could click on the network icon in the menu bar, and click the 'Push State to Other Clients' button (or CTRL+P).

The WebSocket Server also needs an up-to-date version of the state when you load a set (to render TidalCycles)
so hitting CTRL+P after loading a set is common. 