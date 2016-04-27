;Section 1 - MIX STUFF. ALSO, REVERBSC!
sr = 44100
kr = 441
nchnls = 2
0dbfs = 1.0


;Max voice Allocs

maxalloc 1, 5
maxalloc 2, 5
maxalloc 3, 5
maxalloc 4, 5
maxalloc "rural", 1
maxalloc "city", 1
maxalloc "bar", 1
maxalloc "subway", 1
maxalloc "airport", 1
maxalloc "crowd", 1
maxalloc "rain", 1
maxalloc "wind", 1
maxalloc "fire", 1

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
kq = 1000
kQ chnget "Modal-Resonance"
kQ += 0.1

ifreq11 = icps
iamp = ampmidi(0.1)
irep = 1
ashock  mpulse  3,irep
aexc1  mode ashock,ifreq11,kq
aexc1 = aexc1*iamp
aexc2  mode ashock,ifreq11,kq
aexc2 = aexc2*iamp
aexc = (aexc1+aexc2)/2
aexc limit aexc,0,3*iamp
kfiltFreq chnget "filterFreq"
kq2 = kQ * 2
kq3 = kQ * 3.01
kq4 = kQ * 4.69
kq5 = kQ * 5.63
ares1  mode aexc,kfiltFreq,kq2
ares2  mode aexc,kfiltFreq,kq3
ares3  mode aexc,kfiltFreq,kq4
ares4  mode aexc,kfiltFreq,kq5
ares sum ares1, ares2, ares3, ares4
ares balance ares, aexc
kreverbLevel chnget "ReverbSend"
kreverbLevel = kreverbLevel/1000

garvbR += (ares * kreverbLevel)
klev init 0.5
klev chnget "instr-1-level"
klev *= 0.001
aadsr = madsr(0.2, 1, 0.9, 1)
gaoutL += (klev * ares * aadsr)
gaoutR += (klev * ares * aadsr)
endin

;-----------------------------------------;

; Section 3

; Oscillator with an LFO and an envelope. This is an example of the new function syntax that's part of Csound 6

instr 2

icps cpsmidi

klforate chnget "lfo-rate" ; LFO
klforate *= 0.001
a1 oscili ampmidi(1) * oscil(1,klforate), icps
klev chnget "instr-2-level"
klev *= 0.001
aadsr = madsr(0.1, 1, 0.9, 1)
gaoutL += (klev * a1 * aadsr)
gaoutR += (klev * a1 * aadsr)
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
aadsr = madsr(0.1, 1, 0.9, 2)
klev chnget "instr-3-level"
gaoutL += (klev * (amix/10000) * aadsr)
gaoutR += (klev * (amix/10000) * aadsr)
endin
;----------------------------------------;

; Section 5
;guitar
instr 4
icps cpsmidi
iamp = ampmidi(1)
kpick = 0.7
iplk = 0
idamp = 10
ifiltFreq chnget "WaveGuide-Filter-Freq"
ifilt = 10000
axcite oscil 0.3, 1, 1
apluck wgpluck icps, iamp, kpick, iplk, idamp, ifiltFreq, axcite
klev chnget "instr-4-level"
klev *= 0.001
aadsr = madsr(0.1, 1, 0.9, 1)
gaoutL += (klev * apluck * aadsr)
gaoutR += (klev * apluck * aadsr)
endin

;----------------------------------------;

;Section 6

instr kick
prints "kick"
aadsr = linseg(1, p3/2,1, p3/2, 0)
a1,a2 diskin2 "./http/assets/kick2.wav", 1
kperclev chnget "kick-send"
kperclev *= 0.001
gaPercBusL += (kperclev * a1 * aadsr)
gaPercBusR += (kperclev * a2 * aadsr)
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

instr rural
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/rural.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr subway
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/subway.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr airport
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/airport.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr bar
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/bar.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr city
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/city.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr crowd
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/crowd.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr rain
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/rain.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr wind
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/wind.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin

instr fire
kenv = linseg(0, 1, 0.8, (10-1), 0.8, 1, 0)
a1,a2 diskin2 "./http/assets/samples/fire.wav", 1,0,1
gaSamplrL += a1 * kenv
gaSamplrR += a2 * kenv
endin
