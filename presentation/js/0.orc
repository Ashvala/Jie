;Section 1 - MIX STUFF. ALSO, REVERBSC!
sr = 44100
kr = 441
nchnls = 2
0dbfs = 1.0

garvbL init 0
garvbR init 0

gaoutL init 0
gaoutR init 0
schedule "revsc", 0, -1
schedule "globalmix",0, -1

gisine = ftgen(1,0,8192,10,1)

instr revsc
kfblvl init 0.8
arvbL, arvbR reverbsc garvbL, garvbR, kfblvl, 10000
outs arvbL, arvbR
garvbL = 0
garvbR = 0
endin

instr globalmix
denorm gaoutL
denorm gaoutR
kmastMult = 0.6
outs (gaoutL * kmastMult), (gaoutR * kmastMult)
clear gaoutR
clear gaoutL
endin


instr 1
; waveguide clarinet
kstiff = -0.3 ; stiffness
iatt = 0.1 ; attack
idetk = 0.1 ;time to stop
kvibf init 100; vibrato depth
kvibf *= 0.01 ; calc
kngain = 0.5 ; gain
asig wgclar 0.9, cpsmidinn(p4), kstiff, iatt, idetk, kngain, kvibf,0.1, 1
klev = 800
gaoutL += (klev/1000 * (asig))
gaoutR += (klev/1000 * (asig))
endin
