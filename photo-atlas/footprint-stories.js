import {dateLabel,dayGap,esc,group} from "./model.js";
import {numbers} from "./footprint-model.js";

const placeName = place => place.name+(place.precision==="nearby" ? "附近" : "");
const dateRange = (a,b) => dateLabel(a)+(a===b ? "" : " — "+dateLabel(b));
const city = place => place.level==="city";
const rad = Math.PI/180;

function distance(a,b) {
  const lat=(b.lat-a.lat)*rad/2, lon=(b.lon-a.lon)*rad/2;
  const h=Math.sin(lat)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(lon)**2;
  return 12742*Math.asin(Math.sqrt(Math.min(1,h)));
}

export function footprintHighlights(data,state) {
  const {places,cities,visits,first,last,year,activeDays}=state;
  if (!first) return {reunions:[],records:[],bookends:[]};
  const byId=new Map(places.map(place=>[place.id,place]));
  const matching=places.filter(place=>city(place) && place.first);
  const startCity=matching.slice().sort((a,b)=>a.first.localeCompare(b.first))[0];
  const bookends=[["最早的地点记录",first],["最近的地点记录",last]].slice(0,first===last?1:2).map(([label,date])=>({
    label,date,places:places.filter(place=>place.dates.includes(date)),
  }));
  const reunions=[];
  for (const [id,runs] of group(data.visits.filter(run=>run.dates.length && city(byId.get(run.id)||{})),run=>run.id)) {
    const ordered=runs.slice().sort((a,b)=>a.dates[0].localeCompare(b.dates[0]));
    for (let i=1;i<ordered.length;i++) {
      const before=ordered[i-1].dates, after=ordered[i].dates;
      const gap=dayGap(before.at(-1),after[0]);
      if (gap<7 || (year!=="all" && !after[0].startsWith(year+"-"))) continue;
      reunions.push({place:byId.get(id),gap,before,after});
    }
  }
  reunions.sort((a,b)=>b.gap-a.gap||a.after[0].localeCompare(b.after[0]));
  const records=[];
  const best=cities[0];
  if (best?.days) records.push({label:"记录日最多",place:best,value:best.days,unit:"天",note:dateRange(best.first,best.last),ratio:best.days/activeDays});
  const cityVisits=visits.filter(run=>city(byId.get(run.id)||{}));
  const longest=cityVisits.slice().sort((a,b)=>b.days-a.days||a.first.localeCompare(b.first))[0];
  if (longest?.days>1) records.push({label:"最长到访记录",place:byId.get(longest.id),value:longest.days,unit:"个记录日",
    note:dateRange(longest.first,longest.last),ratio:longest.days/(dayGap(longest.first,longest.last)+1)});
  if (startCity && matching.length>1) {
    const [far,km]=matching.map(place=>[place,distance(startCity,place)]).reduce((a,b)=>a[1]>=b[1]?a:b);
    if (km>=20) records.push({label:"离起点最远",place:far,value:Math.round(km),unit:"公里",note:placeName(startCity)+" → "+placeName(far)+" · 直线估算",path:true});
  }
  const firstVisit=new Map();
  for (const run of data.visits) {
    const origin=run.dates[0];
    if (origin && (!firstVisit.has(run.id) || origin<firstVisit.get(run.id))) firstVisit.set(run.id,origin);
  }
  const repeats=cityVisits.filter(run=>run.origin>firstVisit.get(run.id));
  const popular=[...group(repeats,run=>run.id)].sort((a,b)=>b[1].length-a[1].length)[0];
  if (popular) records.push({label:"回访次数最多",place:byId.get(popular[0]),value:popular[1].length,unit:"次",
    note:"统计首次记录之后的到访段",ratio:popular[1].length/Math.max(1,repeats.length)});
  return {reunions,records,bookends};
}

const button = (action,label,value,cls="inline-action") => '<button type="button" class="'+cls+'" data-action="'+action+
  '" data-value="'+esc(value)+'">'+esc(label)+'</button>';

export function reunionCard(record,{imageFor,cityAction,visitAction}={}) {
  if (!record) return "";
  const {place,gap,before,after}=record;
  const side=(days,label,which)=>{
    const preview=imageFor ? imageFor(place,days) : "";
    return '<div class="reunion-stop">'+preview+'<div class="reunion-meta"><span>'+label+'</span><strong>'+
      esc(dateLabel(which==="previous"?days.at(-1):days[0]))+'</strong><small>'+esc(dateRange(days[0],days.at(-1)))+
      ' · '+numbers(days.length)+' 个记录日</small>'+
      (visitAction?button(visitAction,"展开这段记录",which):"")+'</div></div>';
  };
  return '<article class="reunion-card"><div class="reunion-head"><h3>时隔 '+numbers(gap)+' 天，又见'+esc(placeName(place))+'</h3>'+
    (cityAction?button(cityAction,"地图上定位 →",place.id):"")+'</div>'+
    '<div class="reunion-grid">'+side(before,"上一次","previous")+'<div class="reunion-gap" aria-hidden="true"><i></i><span>'+numbers(gap)+
    ' 天</span><i></i></div>'+side(after,"这一次","recent")+'</div></article>';
}

export function bookendCards(items,{cityAction,imageFor}={}) {
  return items.length ? '<div class="bookend-grid">'+items.map(item=>{
    const primary=item.places[0];
    const picture=primary && imageFor ? imageFor(primary,[item.date]) : "";
    return '<article class="bookend-card">'+picture+'<div><span>'+item.label+'</span><strong>'+
      esc(dateLabel(item.date))+'</strong><p>'+item.places.slice(0,4).map(x=>esc(placeName(x))).join("、")+
      (item.places.length>4?' 等':"")+'</p>'+
      (primary && cityAction?button(cityAction,"查看地点 →",primary.id):"")+'</div></article>';
  }).join("")+'</div>' : "";
}

export function recordCards(records,cityAction) {
  return records.length ? '<div class="record-grid">'+records.map(record=>'<article><span>'+record.label+'</span>'+
    '<strong>'+numbers(record.value)+' <small>'+record.unit+'</small></strong><p>'+esc(placeName(record.place))+'</p>'+
    '<div class="record-mark'+(record.path?' distance':'')+'" aria-hidden="true">'+
    (record.path?'<i></i><i></i>':'<i style="--mark:'+Math.max(4,Math.round(record.ratio*100))+'%"></i>')+'</div>'+
    '<small>'+esc(record.note)+'</small>'+(cityAction?button(cityAction,"查看地点 →",record.place.id):"")+'</article>').join("")+'</div>' : "";
}
