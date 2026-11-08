const assert=require('node:assert/strict');const m=require('../docs/model.js');
const N=2,SPLIT=2,ids=m.IDS,near=(a,b)=>Math.abs(a-b)<1e-9;
const currents=Object.fromEntries(ids.map((id,i)=>[id,1+i*.1])),cables={},voltages={};let v=30;
for(let n=1;n<=N;n++){if(n===SPLIT+1)v=25;let end=n<=SPLIT?SPLIT:N;let it=ids.filter(id=>+id[0]>=n&&+id[0]<=end).reduce((s,id)=>s+currents[id],0);cables['Rc'+n]=n*.1;v-=it*cables['Rc'+n];voltages[n]=v}
const input={VA:30,VB:25,voltages,currents},r=m.dimension(input);
for(let n=1;n<=N;n++)assert.ok(near(r.cables[n],cables['Rc'+n]),'Rc'+n);
for(const id of ids)assert.ok(near(r.fixed[id]*currents[id],voltages[id[0]]));
const zero=Object.fromEntries(ids.map(id=>[id,0]));const targets=Object.fromEntries(ids.map(id=>[id,.2]));
const op=m.simulate({V:30,...cables,fixed:r.fixed,rheostats:zero});
for(let n=1;n<=N;n++){assert.ok(near(op.trunks[n],op.currents[n+'1']+op.currents[n+'2']+(n<N?op.trunks[n+1]:0)));assert.ok(near((n===1?op.V:op.voltages[n-1])-op.voltages[n],op.trunks[n]*cables['Rc'+n]))}assert.ok(near(op.pError,0));
const adj=m.adjust({...cables,fixed:r.fixed,targets,maxReo:1000});assert.equal(adj.feasible,true);let solved=m.simulate({V:adj.V,...cables,fixed:r.fixed,rheostats:adj.rheostats});for(const id of ids)assert.ok(near(solved.currents[id],targets[id]));
assert.equal(m.adjust({...cables,fixed:r.fixed,targets,maxReo:.0001}).feasible,false);
assert.throws(()=>m.dimension({...input,voltages:{...voltages,1:31}}),/voltage-rise/);assert.throws(()=>m.dimension({...input,currents:{...currents,11:0}}),/invalid-input/);
if(SPLIT<N)assert.throws(()=>m.dimension({...input,voltages:{...voltages,[SPLIT+1]:26}}),/voltage-rise/);
console.log('Calibración y regulación: correctas');

