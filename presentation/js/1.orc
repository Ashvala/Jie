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
ashock  mpulse  3, 0.33
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
kreverbLevel = 600/1000
garvbL += (ares4 * kreverbLevel)
garvbR += (ares4 * kreverbLevel)
klev init 0.5
gaoutL += (klev * ares4)
gaoutR += (klev * ares4)
endin
