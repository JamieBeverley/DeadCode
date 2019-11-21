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

# reimplement loading

# stem tags
- and re-order stems by tags (eg. all bass in one column, all drums in another)

# effects 
- toggle (different levels to different values)
- code toggle on/off

- encoder per stem?
- redesign oepn to stem editor interaction

# effects
- per track

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