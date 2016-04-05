;Section 1 - MIX STUFF. ALSO, REVERBSC!
sr = 44100
kr = 441
nchnls = 2
0dbfs = 1.0

garvbL init 0
garvbR init 0

gaoutL init 0
gaoutR init 0

gaPercBusL init 0
gaPercBusR init 0

schedule "revsc", 0, -1
schedule "globalmix",0, -1
schedule "percBus", 0, -1

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
kmastLev chnget "PercBus-Master-Send-2"
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

idur = p3
ifreq11 = cpsmidinn(p4)


iamp = 0.01
iamp = ampmidi(0.1)
irep = 0.5
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
garvbL += (ares * kreverbLevel)
garvbR += (ares * kreverbLevel)
gaoutL += (klev * ares4)
gaoutR += (klev * ares4)
endin

;-----------------------------------------;

; Section 3

; Oscillator with an LFO and an envelope. This is an example of the new function syntax that's part of Csound 6

instr 2
klforate chnget "lfo-rate" ; LFO
klforate *= 0.001
a1 oscili linseg(0,p3/2,0.8,p3/2,0), oscil(1,klforate) * cpsmidinn(p4)
klev chnget "instr-2-level"
klev *= 0.001
gaoutL += (klev * a1)
gaoutR += (klev * a1)
endin

;-----------------------------------------;

; Section 4

instr 3
; waveguide clarinet
kstiff = -0.3 ; stiffness
iatt = 0.1 ; attack
idetk = 0.1 ;time to stop
kvibf chnget "vibrato-depth" ; vibrato depth
kvibf *= 0.01 ; calc
kngain = 0.5 ; gain
asig wgclar 0.9, cpsmidinn(p4), kstiff, iatt, idetk, kngain, kvibf,0.1, 1
klev chnget "instr-3-level"
gaoutL += (klev * (asig/1000))
gaoutR += (klev * (asig/1000))
endin
;----------------------------------------;

; Section 5

instr 4
icps = cpsmidinn(p4)
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
gaoutL += (klev * apluck)
gaoutR += (klev * apluck)endin
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
