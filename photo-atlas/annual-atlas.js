import {day,dateLabel,drawMap,esc} from "./model.js";
import {isCity,placeLabel} from "./annual-model.js";

export const roleNames = {hometown:"老家",work:"工作地",home:"安家 / 常住",travel:"旅行地",study:"求学地"};
export const atlasModes = {cities:"城市足迹",visits:"旅行与到访",residences:"常住与迁徙"};
const number = value => value.toLocaleString("zh-CN");
const label = place => esc(placeLabel(place));
const span = (a,b) => dateLabel(a)+(a!==b?" — "+dateLabel(b):"");
const button = (action,text,value="",css="") => '<button type="button" class="'+css+'" data-action="'+action+
  '" data-value="'+esc(value)+'">'+text+'</button>';
const details = (title,markup) => '<details class="data-table"><summary>'+title+'</summary>'+markup+'</details>';
export const roleTags = roles => (roles||[]).filter(role=>roleNames[role]).map(role=>'<span class="city-role">'+roleNames[role]+'</span>').join("");

function cityRows(places,roles) {
  const ranking = places.slice().sort((a,b)=>b.days-a.days || b.items.length-a.items.length);
  return '<ol class="atlas-rows">'+ranking.map(place=>'<li>'+
    '<div>'+button("city",label(place),place.id,"place-name")+
    '<small>'+(place.first ? esc(span(place.first,place.last)) : "日期未知")+'</small></div>'+
    '<div class="place-count"><strong>'+number(place.days)+' 天</strong><small>'+number(place.items.length)+' 张</small></div>'+
    (roles[place.id]?.length?'<div class="city-roles">'+roleTags(roles[place.id])+'</div>':"")+'</li>').join("")+'</ol>';
}

function travelRecords(state,index,roles) {
  return state.visits.map((record,i)=>({record,i})).filter(({record})=>{
    const place = index.cities[record.city];
    return isCity(place) && (roles[place.id]?.includes("travel") || (
      !roles[place.id]?.includes("home") &&
      !state.atlas.residences.some(phase=>phase.city===record.city && phase.end>=record.start && phase.start<=record.end)));
  });
}

function visitRows(state,index,roles) {
  const visits = travelRecords(state,index,roles);
  if (!visits.length) return '<p class="coverage">这里会显示有日期和城市信息的外地到访记录。你可以在城市详情里标记旅行地。</p>';
  return '<ol class="atlas-rows">'+visits.slice(0,9).map(({record,i})=>{
    const place = index.cities[record.city];
    return '<li><div>'+button("visit",label(place),i,"place-name")+'<small>'+esc(span(record.start,record.end))+'</small></div>'+
      '<div class="place-count"><strong>'+new Set(record.items.map(day)).size+' 天</strong><small>'+
      (roles[place.id]?.includes("travel")?"旅行地":"到访记录")+'</small></div></li>';
  }).join("")+'</ol>'+(visits.length>9?'<p class="coverage">最近 9 段，共 '+number(visits.length)+' 段。点城市可查看该城的历次记录。</p>':"");
}

function residenceRows(state,index,roles) {
  const labeled = state.places.filter(place=>roles[place.id]?.length && isCity(place));
  const rows = state.residences.map(phase=>{
    const place = index.cities[phase.city];
    return '<li><div>'+button("city",label(place),place.id,"place-name")+'<small>'+esc(span(phase.start,phase.end))+'</small></div>'+
      '<div class="place-count"><strong>'+phase.months+' 个月</strong><small>'+phase.days+' 个支持拍摄日</small></div></li>';
  }).join("");
  return (labeled.length?'<div class="marked-cities"><h4>我标注的城市</h4>'+labeled.map(place=>
    '<div>'+button("city",label(place),place.id,"place-name")+roleTags(roles[place.id])+'</div>').join("")+'</div>':"")+
    '<h4>根据照片推断的常住阶段</h4>'+(rows?'<ol class="atlas-rows">'+rows+'</ol>':
      '<p class="coverage">还没有至少 3 个月的连续证据可以支持常住推断。</p>')+
    (state.moves.length?'<div class="migration-summary"><h4>可能的常住地变化</h4>'+state.moves.map(move=>
      '<p>'+label(index.cities[move.from.city])+' → '+label(index.cities[move.to.city])+'<small>'+
      esc(span(move.from.end,move.to.start))+'</small></p>').join("")+'</div>':"");
}

export function atlasContent(state,index,mode,roles) {
  const cities = state.places.filter(isCity);
  const coarse = state.places.filter(place=>!isCity(place));
  const exact = cities.filter(place=>place.precision!=="nearby");
  const count = state.places.reduce((total,place)=>total+place.items.length,0);
  const modes = '<div class="atlas-tabs" role="group" aria-label="地图显示内容">'+Object.entries(atlasModes).map(([key,text])=>
    '<button type="button" data-action="atlas-mode" data-value="'+key+'" aria-pressed="'+(key===mode)+'">'+text+'</button>').join("")+'</div>';
  const heading = mode==="cities"?"拍过的城市":mode==="visits"?"近期到访":"城市角色与常住阶段";
  const map = '<div class="atlas-map"><canvas id="annual-map" aria-label="按城市汇总的照片足迹地图"></canvas>'+
    '<div id="map-pins" aria-label="地图城市"></div><div class="atlas-zoom">'+
    button("atlas-zoom","＋","in","outline")+button("atlas-zoom","－","out","outline")+button("atlas-zoom","全览","reset","outline")+
    '</div><div class="atlas-legend">'+(exact.length?'<span><i></i>匹配城市边界</span>':"")+
    (cities.length>exact.length?'<span><i class="approx"></i>附近城市</span>':"")+
    (!cities.length?'<span><i class="coarse"></i>省级或国别记录</span>':"")+
    (mode==="residences"&&state.moves.length?'<span><i class="move"></i>推断变化</span>':"")+'</div></div>';
  const side = mode==="cities" ?
    (cities.length ? cityRows(cities.slice().sort((a,b)=>b.days-a.days || b.items.length-a.items.length).slice(0,6),roles) : '<p class="coverage">当前只有省级或国家 / 地区级记录。</p>')+
    (cities.length>6 ? details("查看全部 "+cities.length+" 座城市",cityRows(cities,roles)):"")+
    (coarse.length ? details("查看 "+coarse.length+" 个省级或国家 / 地区记录",cityRows(coarse,roles)):"") :
    mode==="visits" ? visitRows(state,index,roles) : residenceRows(state,index,roles);
  return '<div class="atlas-intro"><p>'+number(cities.length)+' 座城市'+(cities.length?' · '+number(exact.length)+' 座匹配了市级边界':"")+'</p>'+
    '<span>'+number(count)+' / '+number(state.photos.length)+' 张照片有可归属的地点</span></div>'+modes+
    '<div class="map-grid atlas-grid">'+map+'<aside class="place-panel atlas-panel"><h3>'+heading+'</h3>'+side+'</aside></div>'+
    '<p class="coverage atlas-credit">底图 <a href="https://www.naturalearthdata.com/">Natural Earth</a> · 中国市级边界 '+
    '<a href="https://github.com/JayMuShui/chinese-global-compliant-geodata">CN GeoData</a> '+
    '<a href="./china-cities.LICENSE">（许可）</a> · 海外城市点 <a href="https://www.geonames.org/export/">GeoNames</a></p>';
}

function boundsFor(points) {
  const lons = points.map(place=>place.lon);
  const lats = points.map(place=>place.lat);
  const left = Math.min(...lons), right = Math.max(...lons);
  const bottom = Math.min(...lats), top = Math.max(...lats);
  if (right-left > 160) return [-180,-69,180,79];
  const xp = Math.max(2.5,(right-left)*.18), yp = Math.max(2,(top-bottom)*.2);
  return [left-xp,bottom-yp,right+xp,top+yp];
}

function markerLabel(x,y,name,width,height,positions,labels) {
  const w = Math.min(135,[...name].length*11+10), h = 17;
  const candidates = [
    [x-w/2,y+11],[x+12,y-h/2],[x-w-12,y-h/2],[x-w/2,y-h-11],
  ];
  const hit = ([l,t,r,b],[a,c,d,e]) => l<d && r>a && t<e && b>c;
  for (const [left,top] of candidates) {
    const box = [left,top,left+w,top+h];
    if (left<5 || top<5 || box[2]>width-5 || box[3]>height-33) continue;
    if (labels.some(used=>hit(used,box))) continue;
    if (positions.some(({x:cx,y:cy})=>hit([cx-8,cy-8,cx+8,cy+8],box))) continue;
    labels.push(box);
    return ' style="left:'+Math.round(left-x)+'px;top:'+Math.round(top-y)+'px"';
  }
  return "";
}

export function paintAtlas(canvas,world,regions,state,index,mode,roles,view) {
  const listed = state.places;
  const cities = listed.filter(isCity);
  const base = cities.length ? cities : listed;
  if (!canvas || !base.length) return;
  let points = base;
  if (mode==="visits") {
    const visited = new Set(travelRecords(state,index,roles).map(({record})=>record.city));
    points = base.filter(place=>visited.has(place.id));
  }
  if (mode==="residences") {
    const homes = new Set(state.residences.map(item=>item.city));
    for (const {from,to} of state.moves) { homes.add(from.city); homes.add(to.city); }
    points = base.filter(place=>homes.has(place.id) || roles[place.id]?.length);
  }
  const domestic = base.every(place=>place.domestic);
  const projection = drawMap(canvas,world,points,{design:"journal",regions,domestic,base,
    camera:{bounds:boundsFor(base),...view}});
  if (!projection) return;
  const layer = canvas.parentElement.querySelector("#map-pins");
  const {pos,width,height} = projection;
  const positions = points.slice().sort((a,b)=>b.days-a.days).map(place=>{
    const [x,y] = pos(place.lat,place.lon);
    return {x,y,place};
  }).filter(({x,y})=>x>=11 && x<=width-11 && y>=11 && y<=height-11);
  const labels = [];
  layer.innerHTML = positions.map(({place,x,y})=>{
    const plain = placeLabel(place);
    const position = markerLabel(x,y,plain,width,height,positions,labels);
    const description = plain+" · "+place.days+" 个拍摄日"+(roles[place.id]?.length?" · "+roles[place.id].map(role=>roleNames[role]).join("、"):"");
    const marker = !isCity(place) ? " coarse" : place.precision==="nearby" ? " nearby" : "";
    return '<button type="button" class="atlas-pin'+marker+'" data-action="city" data-value="'+
      esc(place.id)+'" style="left:'+Math.round(x)+'px;top:'+Math.round(y)+'px" aria-label="'+esc(description)+'" title="'+esc(description)+'">'+
      '<i></i>'+(position?'<span aria-hidden="true"'+position+'>'+esc(plain)+'</span>':"")+'</button>';
  }).join("");
  if (mode !== "residences") return projection;
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.strokeStyle = "#674533";
  ctx.lineWidth = 1.8;
  for (const {from,to} of state.moves) {
    const a = index.cities[from.city], b = index.cities[to.city];
    if (!(a && b) || Math.abs(a.lon-b.lon)>180) continue;
    const [ax,ay] = pos(a.lat,a.lon), [bx,by] = pos(b.lat,b.lon);
    const bend = 48;
    ctx.setLineDash([6,5]);
    ctx.beginPath();
    ctx.moveTo(ax,ay);
    ctx.quadraticCurveTo((ax+bx)/2,(ay+by)/2-bend,bx,by);
    ctx.stroke();
    const t = .76;
    const x = ax+(bx-ax)*t, y = ay+(by-ay)*t-2*bend*t*(1-t);
    const angle = Math.atan2(by-ay-2*bend*(1-2*t),bx-ax);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x-8*Math.cos(angle-.48),y-8*Math.sin(angle-.48));
    ctx.lineTo(x,y);
    ctx.lineTo(x-8*Math.cos(angle+.48),y-8*Math.sin(angle+.48));
    ctx.stroke();
  }
  ctx.restore();
  return projection;
}
