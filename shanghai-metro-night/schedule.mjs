import data from './official-data.mjs';
import {lines} from './network.mjs';
export {data};
export function parseTime(s){if(!s||s.includes('到达')||!s.match(/\d\d:\d\d/))return null;const [h,m]=s.match(/\d\d:\d\d/)[0].split(':').map(Number);return h*60+m+(s.includes('次')?1440:0);}
export function dateShift(date,days){return new Date(Date.parse(date+'T12:00:00Z')+days*86400000).toISOString().slice(0,10);}
export function extended(date){return [5,6].includes(new Date(date+'T12:00:00Z').getUTCDay());}
export function todayShanghai(date=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function dayWindow(line,i,d,date){const row=data.lines[line]?.[i];if(!row)return null;let first,last,regularLast,extra=[],destination,notes=[];
 if(line==='1'){const north=d===1;first=parseTime(row[north?1:3]);const early=north?parseTime(row[2]):null;if(early!==null){first=Math.min(first,early);notes.push('清晨首班仅到上海火车站；往富锦路首班 '+row[1]);}last=parseTime(row[extended(date)?north?6:7:north?4:5]);destination=north?'富锦路':'莘庄';regularLast=last;}
 else if(line==='8'){first=parseTime(row[d===1?2:1]);last=parseTime(row[extended(date)?d===1?6:5:d===1?4:3]);regularLast=last;destination=d===1?'市光路':'沈杜公路';}
 else if(line==='4'){
 first=parseTime(row[d===1?1:2]);last=parseTime(row[d===1?5:6]);regularLast=last;destination='宜山路';
 notes.push((d===1?'内圈':'外圈')+'；末班终到宜山路，不保证还能绕行一圈');
 notes.push('全程末班 '+row[d===1?3:4]+'；之后的班次终到宜山路');
 }
 else if(['3','6','12','14','15','18'].includes(line)){
 const forward=d===1,reverse=['6','14','18'].includes(line);
 first=parseTime(row[forward?(reverse?2:1):(reverse?1:2)]);
 last=parseTime(row[forward?(reverse?4:3):(reverse?3:4)]);regularLast=last;
 const names=lines.find(l=>l.id===line).names;destination=forward?names.at(-1):names[0];
 notes.push('采用官方常规首末班表；不套用其他线路的周末延时');
 }
 else if(['7','9','13'].includes(line)){
 const forward=d===1,reverseColumns=line==='13';
 first=parseTime(row[forward?(reverseColumns?2:1):(reverseColumns?1:2)]);
 const normalIndex=forward?(reverseColumns?4:3):(reverseColumns?3:4);
 const lateIndex=line==='7'?(forward?5:6):line==='9'?(forward?5:7):(forward?6:5);
 last=parseTime(row[extended(date)?lateIndex:normalIndex]);
 destination=forward?lines.find(l=>l.id===line).names.at(-1):lines.find(l=>l.id===line).names[0];
 if(extended(date)){
  const shortIndex=line==='7'?(forward?null:7):line==='9'?(forward?6:8):(forward?7:null);
  const short=shortIndex===null?null:parseTime(row[shortIndex]);
  if(short!==null&&short>last){notes.push('往'+destination+'末班 '+serviceTime(last));last=short;destination=line==='7'?'祁华路':line==='9'?(forward?'杨高中路':'佘山'):'华鹏路';}
  notes.push({'7':'周五/周六仅祁华路—花木路区段延时','9':'周五/周六仅佘山—杨高中路区段延时','13':'周五/周六仅金运路—华鹏路区段延时'}[line]);
 }
 regularLast=last;
 }
 else if(line==='2'){first=parseTime(row[d===1?1:2]);regularLast=parseTime(row[d===1?3:4]);last=regularLast;destination=d===1?'浦东1号2号航站楼':'蟠祥路·国家会计学院';if(d===1){const short=parseTime(row[5]);if(short!==null&&short>last){last=short;destination='广兰路';notes.push('往浦东1号2号航站楼末班 '+row[3]+'；之后的常规车只到广兰路');}const boarding=data.extraTrains.boarding.find(x=>x.station===row[0]);if(boarding){extra=boarding.times.map(parseTime);last=Math.max(last,...extra);destination='龙阳路';notes.push('加班车 '+boarding.times.join(' / ')+'，终点龙阳路；中途仅指定站下客');}else if(data.extraTrains.alightingOnly.includes(row[0]))notes.push('夜间定点加班车在本站只下不上，不延长本站可上车时间');}}
 if(first==null||last==null)return null;return {first,last,regularLast,destination,notes,extra,date};
}
export function directionInfo(line,i,d,date,minute){const current=dayWindow(line,i,d,date),previous=dayWindow(line,i,d,dateShift(date,-1));if(!current)return {state:'unknown'};const previousEnd=previous?previous.last-1440:-Infinity;const carry=previousEnd>minute;const w=carry?previous:current;const open=carry||(minute>=current.first&&minute<current.last);const extraOnly=open&&line==='2'&&d===1&&w.extra.length>0&&minute>=parseTime(data.lines[line][i][5]);return {...w,state:open?'open':'closed',reason:open?(extraOnly?'仅剩定点加班车':carry?'前一运营日服务延续':'仍在服务时段'):minute<current.first?'首班尚未开始':'本站该方向已收车',extraOnly,carry,remaining:open?(carry?previousEnd:current.last)-minute:null};}
export function serviceTime(m){if(m==null)return '—';return (m>=1440?'次日 ':'')+String(Math.floor(m%1440/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}

const line10=lines.find(l=>l.id==='10');
const main10=line10.names.slice(0,34),branch10=[...line10.names.slice(34),...line10.names.slice(4,34)];
function tenRecord(name){const r=data.lines['10'].find(r=>r[0]===name);if(!r)return null;const split=r.length===14;
return split?{first:[r[1]==='--'?r[2]:r[1],r[3],r[4]],last:[r[5]==='--'?r[6]:r[5],r[7],r[8]],late:[r[9]==='--'?r[10]:r[9],r[11],r[13]],short:r[12]}:{first:r.slice(1,4),last:r.slice(4,7),late:[r[7],r[8],r[10]],short:r[9]};}
function tenWindow(edge,date){const r=tenRecord(edge.from);if(!r)return null;const candidates=[],notes=[];const add=(path,destination,first,last,extra=false)=>{const i=path.indexOf(edge.from);if(i<0||path[i+1]!==edge.to)return;const f=parseTime(first),l=parseTime(last);if(f===null||l===null)return;candidates.push({first:f,last:l,destination,extra});};
const last=extended(date)?r.late:r.last;
add(main10,'基隆路',r.first[0],last[0]);add(branch10,'基隆路',r.first[0],last[0]);
add([...branch10].reverse(),'航中路',r.first[1],last[1]);add([...main10].reverse(),'虹桥火车站',r.first[2],last[2]);
if(extended(date))add(main10.slice(0,28),'新江湾城',r.first[0],r.short);
const extraStops={'虹桥火车站':['22:45','23:00'],'虹桥2号航站楼':['22:46','23:01'],'虹桥1号航站楼':['22:49','23:04']};
if(!extended(date)&&extraStops[edge.from]){const times=extraStops[edge.from];add(main10.slice(0,24),'五角场',r.first[0],times[1],true);if(main10[main10.indexOf(edge.from)+1]===edge.to)notes.push('定点加班车 '+times.join(' / ')+'，终点五角场；中途指定站只下不上');}
const regular=candidates.filter(c=>!c.extra);if(!regular.length)return null;
const unique=[...new Map(regular.map(c=>[c.destination,c])).values()];for(const c of unique)notes.push('往'+c.destination+'末班 '+serviceTime(c.last));
if(extended(date))notes.push('周五/周六仅虹桥火车站—新江湾城区段延时；航中路支线和新江湾城以北不延时');
else if(['上海动物园','伊犁路','虹桥路','陕西南路','南京东路','海伦路','四平路'].includes(edge.from))notes.push('定点加班车在本站只下不上，不延长上车时间');
const latest=candidates.reduce((a,b)=>a.last>b.last?a:b);return {first:Math.min(...regular.map(c=>c.first)),last:latest.last,regularLast:Math.max(...regular.map(c=>c.last)),destination:latest.destination,notes,date};
}
export function edgeInfo(edge,date,minute){if(edge.line!=='10'){const l=lines.find(l=>l.id===edge.line),i=l.names.indexOf(edge.from),j=l.names.indexOf(edge.to);const d=edge.line==='4'?((i+1)%l.names.length===j?1:-1):Math.sign(j-i);const result=directionInfo(edge.line,i,d,date,minute);return {...result,directionLabel:edge.line==='4'?(d===1?'内圈':'外圈'):null};}
const current=tenWindow(edge,date),previous=tenWindow(edge,dateShift(date,-1));if(!current)return {state:'unknown',reason:'数据待核实',notes:[],remaining:null};const carry=previous&&previous.last-1440>minute;const w=carry?previous:current;const t=carry?minute+1440:minute;const open=carry||(minute>=w.first&&minute<w.last),extraOnly=!!open&&t>=w.regularLast;return {...w,state:open?'open':'closed',reason:open?(extraOnly?'仅剩定点加班车':carry?'前一运营日服务延续':'仍在服务时段'):minute<current.first?'首班尚未开始':'本站该方向已收车',extraOnly,carry:!!carry,remaining:open?w.last-t:null};}
