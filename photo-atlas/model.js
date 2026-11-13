export const day = (photo) => photo.stamp?.slice(0, 10) || "";
export const month = (photo) => day(photo).slice(0, 7);
export const dateLabel = (date) => date ? date.replaceAll("-", ".") : "日期未知";
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"})[c]);
export const basename = (path) => path.split(/[\\/]/).at(-1);

export function group(items, key) {
  const result = new Map();
  for (const item of items) {
    const id = key(item);
    if (!id) continue;
    if (!result.has(id)) result.set(id, []);
    result.get(id).push(item);
  }
  return result;
}

export const dayGap = (from,to) => (Date.parse(to)-Date.parse(from))/86400000;
const monthNumber = (value) => Number(value.slice(0,4))*12+Number(value.slice(5,7));

export function inferResidences(photos) {
  const monthly=new Map();
  for (const photo of photos) {
    if (!day(photo) || !photo.city || photo.source==="confirmed") continue;
    const key=month(photo);
    if (!monthly.has(key)) monthly.set(key,new Map());
    const cities=monthly.get(key);
    if (!cities.has(photo.city)) cities.set(photo.city,new Set());
    cities.get(photo.city).add(day(photo));
  }
  const leaders=[];
  for (const [key,cities] of [...monthly].sort(([a],[b])=>a.localeCompare(b))) {
    const ranking=[...cities].sort(([,a],[,b])=>b.size-a.size);
    const [[city,dates],second]=ranking;
    if (dates.size<3 || dates.size===second?.[1].size) continue;
    const ordered=[...dates].sort();
    const share=dates.size/ranking.reduce((sum,[,set])=>sum+set.size,0);
    leaders.push({key,city,start:ordered[0],end:ordered.at(-1),days:dates.size,
      strong:share>=.6 && dayGap(ordered[0],ordered.at(-1))>=10});
  }
  const runs=[];
  for (const item of leaders.filter((entry)=>entry.strong)) {
    const last=runs.at(-1);
    if (last?.city===item.city && monthNumber(item.key)-monthNumber(last.months.at(-1).key)<=8) last.months.push(item);
    else runs.push({city:item.city,months:[item]});
  }
  const stable=runs.filter(({months})=>months.length>=3 &&
    dayGap(months[0].start,months.at(-1).end)>=75 && months.reduce((n,m)=>n+m.days,0)>=12);
  const phases=[];
  for (const run of stable) {
    const first=run.months[0], last=run.months.at(-1);
    const previous=phases.at(-1);
    const next=stable[phases.length+1]?.months[0];
    const earlier=leaders.filter((m)=>m.city===run.city && m.key<first.key &&
      monthNumber(first.key)-monthNumber(m.key)<=3 && (!previous || m.start>previous.end));
    const later=leaders.filter((m)=>m.city===run.city && m.key>last.key &&
      monthNumber(m.key)-monthNumber(last.key)<=5 && (!next || m.key<next.key));
    phases.push({city:run.city,start:earlier[0]?.start || first.start,end:later.at(-1)?.end || last.end,
      months:run.months.length,days:run.months.reduce((n,m)=>n+m.days,0)});
  }
  return phases;
}

export function residenceOn(phases,date) {
  return phases.find((phase)=>date>=phase.start && date<=phase.end)?.city;
}

export function places(photos, cities) {
  const matched = [...group(photos, (p) => p.city)].map(([id, items]) => ({...cities[id], items}));
  matched.sort((a,b) => b.items.length - a.items.length || a.name.localeCompare(b.name, "zh-CN"));
  return matched;
}

export function journeys(photos, residences) {
  const ordered = photos.filter((p) => day(p) && p.city).sort((a,b) => a.stamp.localeCompare(b.stamp) || a.id-b.id);
  const records = [];
  const ongoing=new Map();
  for (const [date,items] of group(ordered,day)) {
    const home=residenceOn(residences,date);
    const cities=group(items,(photo)=>photo.city);
    for (const city of ongoing.keys()) {
      if (!cities.has(city) || city===home) ongoing.delete(city);
    }
    for (const [city,photosAtCity] of cities) {
      if (city===home) continue;
      let visit=ongoing.get(city);
      if (!visit || visit.home!==home || dayGap(visit.end,date)>7) {
        visit={id:String(photosAtCity[0].id),city,home,start:date,end:date,items:[]};
        records.push(visit);
        ongoing.set(city,visit);
      }
      visit.end=date;
      visit.items.push(...photosAtCity);
    }
  }
  return records.reverse();
}

export function filterJourneys(records,photos) {
  const ids=new Set(photos.map((photo)=>photo.id));
  return records.flatMap((record)=>{
    const items=record.items.filter((photo)=>ids.has(photo.id));
    return items.length ? [{...record,start:day(items[0]),end:day(items.at(-1)),items}] : [];
  }).sort((a,b)=>b.start.localeCompare(a.start));
}

export function journeyTitle(record, cities) {
  return cities[record.city]?.name || "未归属地点";
}

const palettes = {
  map: {water:"#11272e", land:"#23454a", border:"#416569", grid:"#1e3941", pin:"#c1f98a"},
  journal: {water:"#e7eeeb", land:"#c3d3c8", border:"#9eafa4", grid:"#cedbd4", pin:"#ac4a2c"},
  timeline: {water:"#eaf0f9", land:"#d6e1f0", border:"#a9bad1", grid:"#d4dfef", pin:"#324ac3"}
};
const radians = Math.PI / 180;
const latitudeLimit = 85.051129;
const clamp = (value,limit) => Math.max(-limit,Math.min(limit,value));
const mercatorY = (lat) => Math.log(Math.tan(Math.PI/4 + clamp(lat,latitudeLimit)*radians/2))/radians;
const mercatorLat = (y) => (2*Math.atan(Math.exp(y*radians))-Math.PI/2)/radians;

function bounds(points, width, height, box) {
  if (!box) {
    const xs=points.map((point)=>point.lon), ys=points.map((point)=>point.lat);
    box=points.length ? [Math.min(...xs)-8,Math.min(...ys)-6,Math.max(...xs)+8,Math.max(...ys)+6] :
      [-180,-66,180,78];
  }
  const [left,bottom,right,top]=box;
  const low=mercatorY(bottom), high=mercatorY(top);
  return {lat:mercatorLat((low+high)/2),lon:(left+right)/2,
    scale:Math.min(width/Math.max(.12,right-left),height/Math.max(.12,high-low))/1.12};
}

const paths = new WeakMap();
function pathFor(polygons) {
  if (paths.has(polygons)) return paths.get(polygons);
  const path = new Path2D();
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const [x,y] = ring[0];
      path.moveTo(x,mercatorY(y));
      for (let i = 1; i < ring.length; i++) path.lineTo(ring[i][0],mercatorY(ring[i][1]));
      path.closePath();
    }
  }
  paths.set(polygons,path);
  return path;
}

const sphere = {type:"Sphere"};
const sphericalGeometry = new WeakMap();
function globeGeometry(polygons) {
  if (sphericalGeometry.has(polygons)) return sphericalGeometry.get(polygons);
  const coordinates=polygons.map((polygon)=>polygon.map((ring,index)=>{
    // D3 uses clockwise exterior rings for polygons smaller than a hemisphere.
    const larger=globalThis.d3.geoArea({type:"Polygon",coordinates:[ring]})>2*Math.PI;
    return larger === (index===0) ? [...ring].reverse() : ring;
  }));
  const geometry={type:"MultiPolygon",coordinates};
  sphericalGeometry.set(polygons,geometry);
  return geometry;
}

function paintRegion(ctx,path,palette,lit,active,lineScale=1) {
  ctx.fillStyle=lit ? palette.pin : palette.land;
  ctx.strokeStyle=active ? palette.pin : palette.border;
  ctx.lineWidth=(active ? 1.7 : .65)/lineScale;
  ctx.globalAlpha=active ? .96 : lit ? .78 : 1;
  if (path) ctx.fill(path,"evenodd");
  else ctx.fill("evenodd");
  ctx.globalAlpha=1;
  if (path) ctx.stroke(path);
  else ctx.stroke();
}

export function drawMap(canvas, world, points, options = {}) {
  const {design = "journal", base = points, camera, exported = false,
    regions = [], domestic = false, selected, mode = "flat"} = options;
  const palette = palettes[design];
  const width = exported ? 1050 : Math.round(canvas.clientWidth);
  const height = exported ? 470 : Math.round(canvas.clientHeight);
  if (!width || !height) return null;
  const dpr = exported ? 1 : Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width*dpr)) canvas.width=Math.round(width*dpr);
  if (canvas.height !== Math.round(height*dpr)) canvas.height=Math.round(height*dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const clip = camera?.bounds || (domestic ? [73,17,135.2,54] : null);
  const fit = bounds(base, width, height, clip);
  const center = camera?.center || fit;
  const scale = fit.scale * (camera?.zoom || 1);
  const yCenter=mercatorY(center.lat);
  const lit = new Set(points.map((point) => point.id));
  const eligible=regions.filter((region)=>(region.domestic || lit.has(region.id)) && (!domestic || region.domestic));
  if (mode === "globe") {
    const d3=globalThis.d3;
    const radius=Math.min(width,height)*.46*(camera?.zoom || 1);
    const globe=d3.geoOrthographic().translate([width/2,height/2]).scale(radius)
      .rotate([-center.lon,-center.lat,0]).clipAngle(90).precision(.8);
    const path=d3.geoPath(globe,ctx);
    ctx.fillStyle=design==="map" ? "#0e191d" : palette.grid;
    ctx.fillRect(0,0,width,height);
    ctx.beginPath();
    path(sphere);
    ctx.fillStyle=palette.water;
    ctx.fill();
    ctx.strokeStyle=palette.border;
    ctx.lineWidth=1;
    ctx.stroke();
    ctx.beginPath();
    path(d3.geoGraticule10());
    ctx.strokeStyle=palette.grid;
    ctx.stroke();
    ctx.beginPath();
    path(globeGeometry(world));
    paintRegion(ctx,null,palette,false,false);
    for (const region of eligible) {
      ctx.beginPath();
      path(globeGeometry(region.polygons));
      paintRegion(ctx,null,palette,lit.has(region.id),region.id===selected);
    }
    return {
      width,height,center,
      pos:(lat,lon)=>d3.geoDistance([center.lon,center.lat],[lon,lat]) < Math.PI/2-.035 ? globe([lon,lat]) : null,
      hit:(x,y)=>Math.hypot(x-width/2,y-height/2)<=radius ? hitRegion(ctx,eligible,lit,...globe.invert([x,y])) : null,
      pan:(start,dx,dy)=>({
        lon:((start.lon-dx/radius/radians+180)%360+360)%360-180,
        lat:clamp(start.lat+dy/radius/radians,89)
      })
    };
  }
  const pos = (lat, lon) => [width / 2 + (lon - center.lon) * scale, height / 2 - (mercatorY(lat) - yCenter) * scale];
  ctx.fillStyle = palette.water;
  ctx.fillRect(0, 0, width, height);
  ctx.beginPath();
  const step = scale > 20 ? 5 : scale > 8 ? 10 : 20;
  for (let lon = -180; lon <= 180; lon += step) {
    const [x] = pos(0, lon);
    ctx.moveTo(x, 0); ctx.lineTo(x, height);
  }
  for (let lat = -80; lat <= 80; lat += step) {
    const [, y] = pos(lat, 0);
    ctx.moveTo(0, y); ctx.lineTo(width, y);
  }
  ctx.strokeStyle = palette.grid;
  ctx.stroke();
  const west = center.lon - width / (scale * 2), east = center.lon + width / (scale * 2);
  const south = mercatorLat(yCenter - height / (scale * 2)), north = mercatorLat(yCenter + height / (scale * 2));
  const visible = eligible.filter((region) => {
    const [left,bottom,right,top] = region.bounds;
    return right >= west && left <= east && top >= south && bottom <= north;
  });
  ctx.save();
  ctx.translate(width / 2,height / 2);
  ctx.scale(scale,-scale);
  ctx.translate(-center.lon,-yCenter);
  if (!domestic) paintRegion(ctx,pathFor(world),palette,false,false,scale);
  for (const isLit of [false,true]) {
    for (const region of visible) {
      if (lit.has(region.id) !== isLit) continue;
      paintRegion(ctx,pathFor(region.polygons),palette,isLit,region.id===selected,scale);
    }
  }
  ctx.restore();
  if (exported && points.length < 25) {
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#172b26";
    for (const point of points) {
      const [x,y] = pos(point.lat,point.lon);
      ctx.fillText(point.name,x+6,y-4);
    }
  }
  return {pos,width,height,center,
    hit:(x,y)=>hitRegion(ctx,visible,lit,west+x/scale,mercatorLat(yCenter+(height/2-y)/scale)),
    pan:(start,dx,dy)=>({
      lon:clamp(start.lon-dx/scale,180),
      lat:clamp(mercatorLat(mercatorY(start.lat)+dy/scale),latitudeLimit)
    })
  };
}

function hitRegion(ctx,regions,lit,lon,lat) {
  ctx.save();
  ctx.resetTransform();
  const y=mercatorY(lat);
  const region=regions.find((item)=>{
    const [left,bottom,right,top]=item.bounds;
    return lit.has(item.id) && lon>=left && lon<=right && lat>=bottom && lat<=top &&
      ctx.isPointInPath(pathFor(item.polygons),lon,y,"evenodd");
  });
  ctx.restore();
  return region?.id;
}

export function makeReport(photos, cities, world, regions, domestic, records, annual) {
  const points = places(photos, cities);
  const matched = points;
  const canvas = document.createElement("canvas");
  drawMap(canvas, world, points, {exported:true,regions,domestic});
  const dates = photos.map(day).filter(Boolean).sort();
  const range = dates.length ? dateLabel(dates[0]) + " — " + dateLabel(dates.at(-1)) : "日期未知";
  const rows = matched.map((p) => {
    const days = p.items.map(day).filter(Boolean).sort();
    return '<tr><td>' + esc(p.name) + '</td><td>' + p.items.length + '</td><td>' + dateLabel(days[0]) + '</td><td>' + dateLabel(days.at(-1)) + '</td></tr>';
  }).join("");
  const entries = records.map((r) => '<article><time>' + dateLabel(r.start) +
    (r.end !== r.start ? " — " + dateLabel(r.end) : "") + '</time><h3>' + esc(journeyTitle(r,cities)) + '</h3><p>' +
    r.items.length + ' 条演示记录</p><details><summary>查看示例记录</summary><ul>' + r.items.map((p) =>
    '<li>' + esc(p.path) + ' · ' + esc(dateLabel(day(p))) +
    '</li>').join("") + '</ul></details></article>').join("");
  return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>照片足迹演示报告</title>' +
    '<style>body{max-width:1040px;margin:3rem auto;padding:0 1rem;color:#23332b;background:#f7f5ed;font:16px/1.7 system-ui,sans-serif}h1{font-size:clamp(2rem,6vw,4rem);margin-bottom:0}h2{border-bottom:1px solid #ccc;padding-bottom:.4em;margin-top:2em}h3,p{margin:.3em 0}img{width:100%;display:block;margin-top:1rem}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:.4em;border-bottom:1px solid #ddd}article{border-bottom:1px solid #ddd;padding:1rem 0}li{overflow-wrap:anywhere}@media print{body{margin:0}}</style>' +
    '<body><h1>照片足迹演示报告</h1><p>' + range + ' · ' + photos.length + ' 条演示记录 · ' + matched.length +
    ' 个记录区划 · ' + (domestic ? "国内" : "全球") + '</p><img alt="照片足迹地图" src="' + canvas.toDataURL("image/png") +
    '"><small>区划边界 · Natural Earth</small><h2>行政区记录</h2>' +
    '<table><thead><tr><th>行政区</th><th>记录</th><th>首条日期</th><th>末条日期</th></tr></thead><tbody>' +
    rows + '</tbody></table>' + annual + '<h2>行程年鉴</h2>' + (entries || '<p>当前范围没有同时具备日期与地点的记录。</p>') +
    '<p>此报告由虚构数据生成，仅用于演示。</p></body></html>';
}
