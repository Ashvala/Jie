;Section 1 - MIX STUFF. ALSO, REVERBSC!
sr = 44100
kr = 441
nchnls = 2
0dbfs = 1.0



; create midi assignments here:
massign 1, 1
massign 2, 2
massign 3, 3
massign 4, 4
massign 5, 5

; global assignments.
garvbL init 0
garvbR init 0

gaPercBusL init 0
gaPercBusR init 0

gaoutL init 0
gaoutR init 0

schedule "revsc", 0, -1
schedule "globalmix",0, -1
schedule "percBus", 0, -1

;ftables

gisine = ftgen(1,0,8192,10,1)


instr revsc
kfblvl init 0.8
kfblvl chnget "reverb-feedback"
kfblvl *= 0.001
arvbL, arvbR reverbsc garvbL, garvbR, kfblvl, 10000
outs arvbL, arvbR
garvbL = 0
garvbR = 0
endin

instr globalmix
denorm gaoutL
denorm gaoutR
kmastMult chnget "Output-Level"
kmastMult *= 0.001
outs (gaoutL * kmastMult), (gaoutR * kmastMult)
clear gaoutR
clear gaoutL
endin


instr percBus
denorm gaPercBusL
denorm gaPercBusR
kmastLev chnget "Master-Send-2"
kmastLev *= 0.001
gaoutL += (kmastLev * gaPercBusL)
gaoutR += (kmastLev * gaPercBusR)
clear gaPercBusL
clear gaPercBusR
endin

;-------------------------------------------;

; Section 2

; This is the world's greatest mode synth. Watch and rejoice.


instr 1

icps cpsmidi

idur = p3
ifreq11 = icps
ifreq12 = icps * 8
kq1 chnget "Q11"
kq2 chnget "Q12"

iamp = 0.01
ifreq21 = icps * 5
ifreq22 = icps * 1.5
kq21 chnget "Q21"
kq22 chnget "Q22"
irep chnget "repeat"
irep = irep/1000
ashock  mpulse  3,irep
aexc1  mode ashock,ifreq11,kq1
aexc1 = aexc1*iamp
aexc2  mode ashock,ifreq12,kq2
aexc2 = aexc2*iamp
aexc = (aexc1+aexc2)/2
aexc limit aexc,0,3*iamp

ares1  mode aexc,ifreq21,kq21
ares2  mode aexc,ifreq22,kq22

ares = (ares1+ares2)/2
ares4 clip ares, 0, 0.9
kreverbLevel chnget "ReverbSend"
kreverbLevel = kreverbLevel/1000
garvbL += (ares4 * kreverbLevel)
garvbR += (ares4 * kreverbLevel)
klev init 0.5
klev chnget "instr-1-level"
klev *= 0.001
gaoutL += (klev * ares4)
gaoutR += (klev * ares4)
endin

;-----------------------------------------;

; Section 3

; Oscillator with an LFO and an envelope. This is an example of the new function syntax that's part of Csound 6

instr 2

icps cpsmidi

klforate chnget "lfo-rate" ; LFO
klforate *= 0.001
a1 oscili linseg(0,p3/2,0.8,p3/2,0), oscil(1,klforate) * icps
klev chnget "instr-2-level"
klev *= 0.001
gaoutL += (klev * a1)
gaoutR += (klev * a1)
endin

;-----------------------------------------;

; Section 4

instr 3
; waveguide clarinet
icps cpsmidi
kstiff = -0.3 ; stiffness
iatt = 0.1 ; attack
idetk = 0.1 ;time to stop
kvibf chnget "vibrato-depth" ; vibrato depth
kvibf *= 0.01 ; calc
kngain = 0.5 ; gain
asig wgclar 0.9, icps, kstiff, iatt, idetk, kngain, kvibf,0.1, 1
klev chnget "instr-3-level"
gaoutL += (klev * (asig/1000))
gaoutR += (klev * (asig/1000))
endin
;----------------------------------------;

; Section 5

/*instr 4
kcar chnget "carrier-freq"
kcar *= 0.001
kmod chnget "mod-freq"
kmod *= 0.001
kndx chnget "index"
kndx *= 0.001
icps cpsmidi
asig = foscil(0.8, icps, kcar, kmod, kndx, 1)
klev chnget "instr-4-lev"
klev *= 0.001
gaoutR += (klev * asig)
gaoutL += (klev * asig)
krlev chnget "reverb_send"
krlev *= 0.001
garvbL += (krlev * asig)
garvbR += (krlev * asig)
endin*/

icps cpsmidi
giFMsound = ftgen(2,0,256,1, "./http/assets/fwavblnk.aiff",0,0,0)
kc1 chnget "mod-index"
kc2 = 1
kvdepth chnget "vibrato-depth"
kvrate chnget "vibrato-rate"
kvrate *= 0.001
ifn1 = 1
ifn2 = 1
ifn3 = 1
ifn4 = 2
ivfn = 1

asig = fmrhode(.5, icps, kc1, kc2, kvdepth, kvrate, ifn1, ifn2, ifn3, ifn4, ivfn)
     outs asig, asig

;----------------------------------------;

;Section 6

instr kick
a1,a2 diskin2 "./http/assets/kick.wav", 1
kperclev chnget "kick-send"
kperclev *= 0.001
gaPercBusL += (kperclev * a1)
gaPercBusR += (kperclev * a2)
endin

instr snare
a1,a2 diskin2 "./http/assets/snare.wav", 1
kperclev chnget "snare-send"
kperclev *= 0.001
gaPercBusL += (kperclev * a1)
gaPercBusR += (kperclev * a2)
endin

instr hat
a1,a2 diskin2 "./http/assets/hat.wav", 1
kperclev chnget "hat-send"
kperclev *= 0.001
gaPercBusL += (kperclev * a1)
gaPercBusR += (kperclev * a2)
endin

;-----------------------------------------;
