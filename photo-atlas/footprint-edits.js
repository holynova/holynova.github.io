import {esc} from "./model.js";

const validDate = value => typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const validPlace = place => place && typeof place.id==="string" && typeof place.name==="string" &&
  typeof place.country==="string" && Number.isFinite(place.lat) && Number.isFinite(place.lon);

export function readEdits(key,base) {
  let value;
  try { value=JSON.parse(localStorage.getItem(key)); } catch {}
  const demoTargets=base.kind==="demo" ? base.places.filter(place=>["CN-350500","CN-330100","geo-1850147","geo-2988507"].includes(place.id))
    .map(({id,name,lat,lon,country,province,domestic})=>({id,name,lat,lon,country,province,domestic})) : [];
  return {manual:(Array.isArray(value?.manual)?value.manual:[]).filter(item=>validPlace(item?.place)),
    targets:(Array.isArray(value?.targets)?value.targets:demoTargets).filter(validPlace)};
}

export function extendFootprint(base,manual) {
  const places=new Map(base.places.map(place=>[place.id,place]));
  const visits=base.visits.slice();
  for (const entry of manual) {
    const {place}=entry;
    const existing=places.get(place.id);
    const date=validDate(entry.date) ? entry.date : "";
    const dates=new Set(existing?.dates || []);
    if (date && !dates.has(date)) visits.push({id:place.id,dates:[date]});
    if (date) dates.add(date);
    places.set(place.id,{...place,...existing,level:"city",precision:existing?.precision || "manual",
      dates:[...dates].sort(),undated:Boolean(existing?.undated || !date),manual:true});
  }
  return {...base,places:[...places.values()],visits};
}

export function cityMatches(list,query) {
  const term=query.trim().toLocaleLowerCase().replace(/市$/,"");
  if (!term) return [];
  return list.filter(([,name,,,country,province])=>[name,country,province].some(value=>value?.toLocaleLowerCase().includes(term)))
    .sort((a,b)=>Number(b[1].toLocaleLowerCase()===term)-Number(a[1].toLocaleLowerCase()===term)||
      Number(b[1].toLocaleLowerCase().startsWith(term))-Number(a[1].toLocaleLowerCase().startsWith(term))||
      a[1].localeCompare(b[1],"zh-CN")).slice(0,24);
}

export function catalogPlace([id,name,lon,lat,country,province]) {
  return {id,name,lon,lat,country,province,domestic:country==="CHN"};
}

export function targetCards(targets,marked,placeExists) {
  if (!targets.length) return '<p class="coverage">添加一座想去的城市，开始记录打卡进度。</p>';
  return '<ul class="stamp-grid">'+targets.map(place=>{
    const done=marked(place.id);
    return '<li class="'+(done?"stamped":"")+'"><div class="stamp-ring" aria-hidden="true">'+(done?'✓':'○')+'</div>'+
      '<div><strong>'+esc(place.name)+'</strong><small>'+(done?"已打卡":placeExists(place.id)?"有足迹 · 待确认":"待打卡")+'</small></div>'+
      '<button class="inline-action" type="button" data-action="'+(placeExists(place.id)?"target-city":"target-checkin")+
      '" data-value="'+esc(place.id)+'">'+(placeExists(place.id)?"查看记录":"补打卡")+'</button>'+
      '<button type="button" class="inline-action target-remove" data-action="remove-target" data-value="'+esc(place.id)+
      '" aria-label="移出'+esc(place.name)+'">移出</button></li>';
  }).join("")+'</ul>';
}
