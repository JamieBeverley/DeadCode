# SuperCollider Support
- Stem option to toggle between Ndef and Pdef
- auto-assigned id/name, start+stop
- options for quant, fadetime
- deadcode SC extension for master effect?


## Effects
### Pdef:
- expectation is that all synths specify the 'out' param, deadcode sc extension provides that as synth param
- routes it to another instantiated synth to apply specified effects/ugens

### Ndefs:
- Each stem has ndef: Ndef(\s_12), and Ndef(\s_12_out), which feeds to Ndef(\t_2_out), and then to
Ndef(\deadcode_master), Ndef(\deadcode_master)
- In Dead: when applying a code toggle effect, variable 'sig' is available as the input signal
