sr = 44100
kr = 441
nchnls = 2
0dbfs = 1.0

garvbL init 0
garvbR init 0

schedule 400, 0, 5000

instr 1

idur = p3
ifreq11 = cpsmidinn(p4)
ifreq12 = cpsmidinn(p4) * 8
kq1 chnget "Q11"
kq2 chnget "Q12"

iamp = 0.01
ifreq21 = cpsmidinn(p4) * 5
ifreq22 = cpsmidinn(p4) * 1.5
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
outs ares4,ares4
kreverbLevel chnget "ReverbSend"
kreverbLevel = kreverbLevel/1000
garvbL += (ares4 * kreverbLevel)
garvbR += (ares4 * kreverbLevel)
endin

;-----------------------------------------;

instr kick
a1,a2 diskin2 "./http/assets/kick.wav", 1
outs a1,a2
endin
instr snare
a1,a2 diskin2 "./http/assets/snare.wav", 1
outs a1,a2
endin
instr hat
a1,a2 diskin2 "./http/assets/hat.wav", 1
outs a1,a2
endin

;-----------------------------------------;



instr 400
kfilt chnget "revfiltfreq"
kfblvl chnget "revfblvl"
kfblvl = kfblvl/1000
arvbL, arvbR reverbsc garvbL, garvbR, kfblvl, kfilt
outs arvbL, arvbR
garvbL = 0
garvbR = 0
endin