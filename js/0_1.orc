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

gaSamplrL init 0
gaSamplrR init 0

gaoutL init 0
gaoutR init 0

schedule "revsc", 0, -1
schedule "globalmix",0, -1
schedule "percBus", 0, -1
schedule "samplerBus", 0, -1
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
kmastMult chnget "Output-Level" ;local
kmastMult *= 0.01
outs (gaoutL * kmastMult), (gaoutR * kmastMult)
clear gaoutR
clear gaoutL
endin


instr percBus
denorm gaPercBusL
denorm gaPercBusR
kmastLev = 1
gaoutL += (kmastLev * gaPercBusL)
gaoutR += (kmastLev * gaPercBusR)
clear gaPercBusL
clear gaPercBusR
endin

instr samplerBus
denorm gaSamplrL
denorm gaSamplrR
koutLev chnget "Sampler-Out-Level"
koutLev *= 0.001
gaoutL += (koutLev * gaSamplrL)
gaoutR += (koutLev * gaSamplrR)
kSamplerReverb chnget "Sampler-Reverb-Level"
kSamplerReverb *= 0.001
garvbL += (gaSamplrL * kSamplerReverb)
garvbR += (gaSamplrR * kSamplerReverb)
clear gaSamplrL
clear gaSamplrR
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
a1 oscili ampmidi(1), oscil(1,klforate) * icps
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
asig wgclar 0.5, icps, kstiff, iatt, idetk, kngain, kvibf,0.1, 1
iq1 = 3
iq2 = iq1 * 3.4
iq3 = iq1 * 2.1
iq6 = iq1 * 1

a1 mode asig, icps, iq1
a2 mode asig, icps, iq2
a3 mode asig, icps, iq6

amix = (a1 + a2 + a3)/3
klev chnget "instr-3-level"
gaoutL += (klev * (amix/10000))
gaoutR += (klev * (amix/10000))
endin
;----------------------------------------;

; Section 5

instr 4
icps cpsmidi
iamp = ampmidi(1)
kpick = 0.7
iplk = 0
idamp = 10
ifilt = 10000
axcite oscil 0.3, 1, 1
apluck wgpluck icps, iamp, kpick, iplk, idamp, ifilt, axcite
klev chnget "instr-4-level"
klev *= 0.001
outs apluck * klev, apluck *klev
endin

;----------------------------------------;

;Section 6

instr kick
prints "kick"
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
prints "hat"
a1,a2 diskin2 "./http/assets/hat.wav", 1
kperclev chnget "hat-send"
kperclev *= 0.001
gaPercBusL += (kperclev * a1)
gaPercBusR += (kperclev * a2)
endin

;-----------------------------------------;

;Sampler. No one sees this

instr sampler
kenv = linseg(0, 1, 0.8, (p3-1), 0.8, 1, 0)
a1,a2 diskin2 p4, 1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin
