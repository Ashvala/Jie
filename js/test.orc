sr = 44100
kr = 441
nchnls = 2
0dbfs = 1

instr 1; 2 modes excitator

idur = p3
ifreq11 = cpsmidinn(p4)
ifreq12 = cpsmidinn(p4) * 8
iQ11    = 10
iQ12    = 20
iamp = 0.01
ifreq21 = cpsmidinn(p4) * 5
ifreq22 = cpsmidinn(p4) * 1.5
iQ21    = 800
iQ22    = 400

ashock  mpulse  3,0
aexc1  mode ashock,ifreq11,iQ11
aexc1 = aexc1*iamp
aexc2  mode ashock,ifreq12,iQ12
aexc2 = aexc2*iamp
aexc = (aexc1+aexc2)/2
aexc limit aexc,0,3*iamp 

ares1  mode aexc,ifreq21,iQ21
ares2  mode aexc,ifreq22,iQ22

ares = (ares1+ares2)/2

outs ares,ares

endin
sr = 44100
kr = 441
nchnls = 2
0dbfs = 1

instr 1

idur = p3
ifreq11 = cpsmidinn(p4)
ifreq12 = cpsmidinn(p4) * 8
iQ11    = 10
iQ12    = 20
iamp = 0.01
ifreq21 = cpsmidinn(p4) * 5
ifreq22 = cpsmidinn(p4) * 1.5
iQ21    = 800
iQ22    = 400

ashock  mpulse  3,0
aexc1  mode ashock,ifreq11,iQ11
aexc1 = aexc1*iamp
aexc2  mode ashock,ifreq12,iQ12
aexc2 = aexc2*iamp
aexc = (aexc1+aexc2)/2
aexc limit aexc,0,3*iamp 

ares1  mode aexc,ifreq21,iQ21
ares2  mode aexc,ifreq22,iQ22

ares = (ares1+ares2)/2

outs ares,ares

endin

