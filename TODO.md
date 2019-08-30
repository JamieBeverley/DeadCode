# config/settings
- connection to different things
- boot script/macros
- save to name?

# effects
- per track
- log scales for frequencies

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