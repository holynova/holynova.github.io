import {edgeInfo,dateShift} from './schedule.mjs';
export const SHOW_START=240, SHOW_END=1680;
// Compare every directed boarding state, rather than total counts: simultaneous
// openings and closings must not cancel each other and disappear from the film.
export function buildShowPlan(date,edges,read=edgeInfo){
 const ids=[...new Set(edges.map(e=>e.line))],events=[],previous=new Uint8Array(edges.length);
 let previousCounts=null;const closingNotified=new Set();
 for(let minute=SHOW_START;minute<=SHOW_END;minute++){
  const actual=dateShift(date,Math.floor(minute/1440)),counts=Object.fromEntries(ids.map(id=>[id,0]));let changed=minute===SHOW_START;
  for(let i=0;i<edges.length;i++){
   const state=read(edges[i],actual,minute%1440).state==='open'?1:0;
   if(state!==previous[i])changed=true;previous[i]=state;counts[edges[i].line]+=state;
  }
  if(changed){const cues=[];
   if(previousCounts)for(const id of ids){
    const was=previousCounts[id],now=counts[id];
    if(!was&&now)cues.push({line:id,kind:'open',text:'开始有车可乘'});
    else if(was&&!now)cues.push({line:id,kind:'closed',text:'全部方向收车'});
    else if(minute>=720&&now<was&&!closingNotified.has(id)){closingNotified.add(id);cues.push({line:id,kind:'closing',text:'部分方向收车'});}
   }
   events.push({minute,counts,cues});previousCounts=counts;
  }
 }
 return {start:SHOW_START,end:SHOW_END,events};
}
export function nextShowStep(plan,minute){
 if(minute>=plan.end)return {minute:plan.end,fast:false};
 const next=plan.events.find(e=>e.minute>minute)?.minute??plan.end;
 const gap=next-minute;
 // Keep the last three minutes before an event at normal speed and never jump
 // across a timetable transition, even in the accelerated daytime sequence.
 const fast=gap>15;
 return {minute:Math.min(plan.end,fast?Math.min(minute+30,next-3):Math.min(minute+2,next)),fast};
}
export function crossedCues(plan,from,to){return plan.events.filter(e=>e.minute>from&&e.minute<=to).flatMap(e=>e.cues.map(c=>({...c,minute:e.minute})));}
