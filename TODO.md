0) react-scripts-start issue, gh pages
1) Fix current issues: effect deletion, track deletion
2) Settings/config panel
   a) password
   c) server meters?
   d) colour theme
   e) language-specific things:
      - Tidal: superdirt layer, orbits?,
      - Index: blendmode
3) WS Server:
   a) middleware on FE for forwarding stateful actions to backend
   b) extend FE WS spec to receive remote actions
   c) password/authentication
   e) middleware on BE for broadcasting stateful actions within room

...
- connection to first is normal
- connection to second: user asked whether it should connect to first or create new 'base'/layer
- rendering happens in another window?

# mobile stuff
- accelerometer effects: global accelerometer object, with abstractions (lpfing at 3 different levels/speeds of movement)
- each connection to relay defines a new superdirt layer (d1,d2,etc...), server responds to client with that dirt layer
  so can have multiple interfaces at once

# better selection stuff
- select multiple stems and hit enter to toggle on/off
- select multiple stems and hit arrow up to increase gain of all?

# config/settings
- connection to different things
- save to name
- settings bar?

# connection
- WS state sharing?

# progressions
-  1, 2, 3, 4,

# notifcations (
- code warnings, ws connection dropped, sc late messages?)

# stem tags
- and re-order stems by tags (eg. all bass in one column, all drums in another)

# effects
- toggle (different levels to different values)
- code toggle on/off
- encoder per stem?
- redesign oepn to stem editor interaction





# + buttons
- tracks and stems

# tabs
open to tab


# multitouch

#resizing flyout/workspace


# eval bug
 actually a tidal bug:

 ```d1 $ stack [s "...", iter 2 $ s "tamb*"]```

  Will cause crash. something about combination of stack, a pattern transformer (iter 2)
  that takes a parameter, and the pattern with an empty operator.
