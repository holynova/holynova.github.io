import {boundaryFor,boundaryPoints,outline} from "./footprint-boundaries.js";
import {dateLabel,drawMap,esc} from "./model.js";
import {cardMetrics,commonCountryNames,footprintDiscoveries,footprintYears,numbers,scopeFootprint} from "./footprint-model.js";
import {cardRange,drawFootprintCard,shareSummary,worldBounds} from "./footprint-share.js";
import {bookendCards,footprintHighlights,recordCards,reunionCard} from "./footprint-stories.js";
import {extractRoleFields,roleKeys,roleNames,readRoleTracks,roleEditFields,roleTimeline} from "./city-roles.js";
import {catalogPlace,cityMatches,extendFootprint,readEdits,targetCards} from "./footprint-edits.js";

const get = selector => document.querySelector(selector);
const root = get("#footprint");
const dialog = get("#footprint-dialog");
const share = get("#open-footprint-share");
const dialogContent = get("#dialog-content");
const query = new URLSearchParams(location.search);
const scan = query.get("scan");
const validId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const geographies = {all:"全球",domestic:"中国",overseas:"海外"};
let data,baseData,world,countries,regions,names,stats,currentCheckins,checkinsKey;
let edits,editsKey,roleTracks,rolesKey,catalog,pendingPlace,highlights;
let reunionIndex=0,playbackFrame=-1,playbackTimer,mapYears=[];
let year=query.get("year")||"all", geography=Object.hasOwn(geographies,query.get("scope"))?query.get("scope"):"all";
let country="", mode=query.get("map")==="globe"?"globe":"flat", camera={zoom:1}, marker, projection, drag, moved;
let animation;
const countryName = code => commonCountryNames[code] || names.get(code) || code;
const periodTitle = () => year==="all" ? "全部年份" : year+" 年";
const title = () => periodTitle() + " · " + (country ? countryName(country) : geographies[geography]);
const button = (action,label,value="",style="") => '<button type="button" class="'+style+'" data-action="'+action+'" data-value="'+esc(value)+'">'+esc(label)+'</button>';
const option = (label,value,selected=false) => '<option value="'+esc(value)+'"'+(selected?' selected':'')+'>'+esc(label)+'</option>';
const selected = id => stats.places.find(place=>place.id===id);
const marked = id => currentCheckins.has(id) || edits.manual.some(entry=>entry.place.id===id);
const yearsInMap = () => mapYears;
const activeReunion = () => highlights.reunions[reunionIndex] || highlights.reunions[0];

async function json(url,{footprint=false}={}) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("无法读取这份足迹报告。");
  if (footprint && response.headers.get("X-Photo-Atlas-Local")==="1") {
    get("#footprint-scan").href = "./scan";
  }
  return response.json();
}

function persistURL() {
  const url = new URL(location);
  url.searchParams.set("year",year);
  url.searchParams.set("scope",geography);
  url.searchParams.set("map",mode);
  if (country) url.searchParams.set("country",country);
  else url.searchParams.delete("country");
  history.replaceState(null,"",url);

}

function filters() {
  const all = footprintYears(data);
  const countryList = [...new Set(stats.options.map(place=>place.country).filter(Boolean))].sort((a,b)=>countryName(a).localeCompare(countryName(b),"zh-CN"));
  return '<div class="fp-filters"><label>时间范围<select id="fp-year">'+option("全部年份","all",year==="all")+
    all.map(item=>option(item+" 年",item,item===year)).join("")+'</select></label>'+
    '<div class="fp-segments" role="group" aria-label="地理范围">'+Object.entries(geographies).map(([key,label])=>
      '<button type="button" data-action="scope" data-value="'+key+'" aria-pressed="'+(key===geography)+'">'+label+'</button>').join("")+'</div>'+
    '<label>国家／地区<select id="fp-country">'+option("全部","",!country)+countryList.map(code=>option(countryName(code),code,country===code)).join("")+'</select></label></div>';
}

function dashboard() {
  const lead=stats.cities.find(place=>boundaryFor(place,regions)?.id===place.id);
  return '<section class="yearbook-cover"><div><p class="fp-period">'+esc(cardRange(stats))+
    (data.kind==="demo"?" · 示例数据":"")+'</p><h1>在生活的地方扎根，<br>向远方出发。</h1>'+
    '<p class="cover-note">我的足迹年鉴 · '+esc(periodTitle())+'</p></div>'+
    (lead?'<div class="cover-outline">'+outline(lead,regions,{decorative:true})+'</div>':"")+'</section>'+
    '<dl class="fp-metrics">'+cardMetrics(stats).map(([key,value])=>'<div><dt>'+key+'</dt><dd>'+value+'</dd></div>').join("")+'</dl>'+filters();
}

function countryList() {
  if (!stats.countries.length) return '<p class="fp-empty">这个范围没有地点记录。</p>';
  return '<ol class="fp-country-list">'+stats.countries.map(item=>'<li><button type="button" data-action="country" data-value="'+
    esc(item.code)+'"><span class="fp-country"><i aria-hidden="true"></i>'+esc(countryName(item.code))+'</span>'+
    '<span>'+numbers(item.cities)+' 城 · '+numbers(item.days)+' 天</span></button></li>').join("")+'</ol>';
}

function mapSection() {
  return '<section id="map" class="fp-map-grid" aria-labelledby="fp-map-title"><div class="fp-map-panel"><div class="fp-map-header"><h2 id="fp-map-title">生活与旅行的版图</h2>'+
    '<div class="fp-map-modes" role="group" aria-label="地图视图"><button type="button" data-action="mode" data-value="globe" aria-pressed="'+
    (mode==="globe")+'">地球仪</button><button type="button" data-action="mode" data-value="flat" aria-pressed="'+(mode==="flat")+'">平面地图</button></div></div>'+
    playbackMarkup()+'<div class="fp-map-body'+(mode==="globe"?" is-globe":"")+'"><canvas id="fp-map" aria-label="可点击行政区轮廓的足迹地图；也可从下方城市清单选择城市"></canvas>'+
    ''+
    '<div class="fp-map-nav">'+button("zoom","＋","in")+button("zoom","－","out")+button("zoom","全览","reset")+'</div>'+
    '<p id="fp-map-label" class="fp-map-label">'+(mode==="globe"?"拖动旋转地球仪":"拖动平移地图")+'</p></div>'+
    '<div class="fp-map-foot"><span><i></i> 有记录的行政区</span>'+
    (stats.cities.some(place=>boundaryFor(place,regions)?.id!==place.id)?'<span><i class="near-key"></i> 境外以国家轮廓展示，市级边界待补充</span>':"")+
    '<a href="https://www.naturalearthdata.com/">Natural Earth</a></div></div>'+
    '<aside class="fp-countries"><h2>国家／地区</h2>'+countryList()+
    '<button type="button" class="inline-action" data-action="find-cities">查看城市清单 ↓</button></aside></section>';
}

function citiesSection() {
  const show = (list,coarse) => list.map(place=>'<li><button type="button" data-action="city" data-value="'+esc(place.id)+'">'+
    '<span><strong>'+esc(place.name)+'</strong><small>'+esc(countryName(place.country))+' · '+esc(coarse ? "地区级记录" : place.status)+'</small></span>'+
    '<span class="fp-city-days">'+(marked(place.id)?'<small>已确认打卡</small>':"")+
    '<strong>'+numbers(place.days)+' 天</strong></span></button></li>').join("");
  const top = stats.cities.slice(0,12);
  const remaining = stats.cities.slice(12);
  const coarse = stats.places.filter(place=>place.level!=="city");
  return '<section id="cities" class="fp-section"><header><h2>城市清单</h2><span>'+
    numbers(stats.cities.filter(place=>marked(place.id)).length)+' 座已确认打卡</span></header>'+
    (top.length?'<ol class="fp-city-list">'+show(top,false)+'</ol>':'<p class="fp-empty">这些记录目前只能归到省级或国家／地区。</p>')+
    (remaining.length?'<details><summary>查看其余 '+numbers(remaining.length)+' 座城市</summary><ol class="fp-city-list">'+show(remaining,false)+'</ol></details>':"")+
    (coarse.length?'<details><summary>查看 '+numbers(coarse.length)+' 个地区级记录</summary><ol class="fp-city-list">'+show(coarse,true)+'</ol></details>':"")+'</section>';
}

function playbackMarkup() {
  const years=yearsInMap();
  if (year!=="all" || years.length<2) return "";
  const current=playbackFrame<0?years.length-1:Math.min(playbackFrame,years.length-1);
  return '<div class="fp-playback"><div class="fp-play-top">'+button("play-years",playbackTimer?"暂停":"逐年点亮","", "fp-play-btn")+
    '<output for="fp-play-year" id="fp-play-label">'+esc(playbackFrame<0?"全部年份":years[current]+" 年")+'</output>'+
    button("all-years","全部足迹","","inline-action")+'</div><div class="fp-play-rail"><span>'+years[0]+'</span>'+
    '<input id="fp-play-year" type="range" min="0" max="'+(years.length-1)+'" value="'+current+'" aria-label="地图回放年份"><span>'+
    years.at(-1)+'</span></div><div id="fp-new-cities" class="fp-new-cities" aria-label="本年点亮的城市" hidden></div></div>';
}

function mapFrame() {
  if (playbackFrame<0) return stats;
  const limit=yearsInMap()[playbackFrame];
  const places=stats.places.filter(place=>place.first?.slice(0,4)<=limit).map(place=>{
    const dates=place.dates.filter(day=>day.slice(0,4)<=limit);
    return {...place,dates,days:dates.length};
  });
  const codes=new Set(places.map(place=>place.country));
  return {...stats,places,cities:places.filter(place=>place.level==="city"),countries:stats.countries.filter(item=>codes.has(item.code))};
}

function syncPlayback() {
  const control=get("#fp-play-year");
  if (control) {
    const years=yearsInMap();
    const frame=mapFrame();
    const current=years[playbackFrame];
    const added=current?frame.cities.filter(place=>place.first?.startsWith(current)):[];
    control.value=playbackFrame<0?years.length-1:playbackFrame;
    control.setAttribute("aria-valuetext",current?current+" 年":"全部年份");
    get("#fp-play-label").textContent=current?current+" 年 · 新增 "+added.length+" 城 · 累计 "+frame.cities.length+" 城":"全部年份 · "+stats.cities.length+" 城";
    get('[data-action="play-years"]').textContent=playbackTimer?"暂停":playbackFrame>=0 && playbackFrame<years.length-1?"继续":"逐年点亮";
    const chips=get("#fp-new-cities");
    if (chips.dataset.year!==(current||"")) {
      chips.dataset.year=current||"";
      chips.hidden=!added.length;
      chips.innerHTML=added.map(place=>button("play-focus",place.name,place.id)).join("");
    }
  }
  paintMap();
}

function haltPlayback() {
  clearInterval(playbackTimer);
  playbackTimer=null;
}

function toggleYears() {
  const years=yearsInMap();
  if (playbackTimer) { haltPlayback(); return syncPlayback(); }
  if (years.length<2) return;
  if (playbackFrame<0 || playbackFrame>=years.length-1) { playbackFrame=0; reset(); }
  playbackTimer=setInterval(()=>{
    if (playbackFrame<years.length-1) playbackFrame++;
    if (playbackFrame===years.length-1) haltPlayback();
    syncPlayback();
  },850);
  syncPlayback();
}

function reunionMarkup() {
  return reunionCard(activeReunion(),{cityAction:"reunion-focus",visitAction:"reunion-visit"});
}

function visualStories() {
  const {bookends,records,reunions}=highlights;
  const compare=reunions.length>1?'<label class="story-picker">选择重逢记录<select id="fp-reunion">'+reunions.slice(0,150).map((item,i)=>
    option(item.place.name+" · "+numbers(item.gap)+" 天 · "+item.after[0].slice(0,4),i,i===reunionIndex)).join("")+'</select></label>':"";
  return (reunions.length?'<section class="fp-section" id="reunions"><header><h2>重逢时刻</h2>'+compare+
    '</header><div id="fp-reunion-story">'+reunionMarkup()+'</div></section>':"")+
    (bookends.length?'<section class="fp-section" id="bookends"><header><h2>第一次与最近一次</h2></header>'+
    bookendCards(bookends,{cityAction:"city"})+'</section>':"")+
    (records.length?'<section class="fp-section" id="records"><header><h2>'+(year==="all"?"多年之最":"年度之最")+
    '</h2></header>'+recordCards(records,"city")+'</section>':"");
}

function reunionDetails(which) {
  const story=activeReunion();
  const dates=which==="previous"?story.before:story.after;
  showDialog(story.place.name+" · "+(which==="previous"?"上一次":"这一次")+'到访',
    '<p class="fp-detail-meta">'+numbers(dates.length)+' 个记录日</p><ol class="story-date-list">'+dates.map(date=>
    '<li><time datetime="'+esc(date)+'">'+esc(dateLabel(date))+'</time></li>').join("")+'</ol>'+
    button("focus","在地图上定位",story.place.id,"share-button"));
}

function roleSection() {
  const timeline=roleTimeline(roleTracks,stats.cities,stats);
  return '<section class="fp-section" id="roles"><header><h2>城市角色时间线</h2></header><div class="story-panel">'+
    (timeline||'<p class="coverage">从地图打开一座城市，可以标注老家、工作地、常住地等角色，并填上日期。</p>')+
    '</div></section>';
}

function checklist() {
  const done=edits.targets.filter(place=>marked(place.id)).length;
  return '<section class="fp-section" id="stamps"><header><h2>我的打卡清单</h2><span>'+done+' / '+edits.targets.length+' 已打卡</span></header>'+
    '<div class="story-panel"><div class="stamp-toolbar"><progress max="'+Math.max(1,edits.targets.length)+'" value="'+done+'" aria-label="打卡清单进度"></progress>'+
    button("open-catalog","添加目标","target","outline")+button("open-catalog","补历史城市","manual","share-button")+'</div>'+
    targetCards(edits.targets,marked,id=>data.places.some(place=>place.id===id))+'</div></section>';
}

function saveEdits(next) {
  try {
    localStorage.setItem(editsKey,JSON.stringify(next));
    edits=next;
    data=extendFootprint(baseData,edits.manual);
    haltPlayback();
    playbackFrame=-1;
    render();
    return true;
  } catch {
    const note=get("#fp-message");
    if (note) note.textContent="当前浏览器无法保存。";
    return false;
  }
}

function updateTarget(action,id) {
  const place=selected(id);
  const targets=edits.targets.filter(record=>record.id!==id);
  if (action==="add-target" && place) {
    const {id,name,country,province,lat,lon,domestic}=place;
    targets.push({id,name,country,province,lat,lon,domestic});
  }
  if (!saveEdits({...edits,targets})) return;
  if (dialog.open && place) cityDetails(id);
}

function unfilterCity(id) {
  if (selected(id)) return id;
  year="all"; geography="all"; country=""; resetScope(); render();
  return id;
}

function editCityRole(id) {
  const place=selected(id);
  if (!place) return;
  showDialog("标注"+place.name,roleEditFields(roleTracks[id])+
    '<p class="fp-detail-meta">开始和结束日期可留空。用勾选决定是否保留该角色。</p><div class="fp-actions">'+
    button("save-role","保存角色时间线",id,"share-button")+button("city","返回城市",id,"outline")+
    '</div><p id="fp-message" role="alert"></p>');
}

function saveCityRole(id) {
  try {
    const next={...readRoleTracks(rolesKey,baseData.sampleRoles),[id]:extractRoleFields(dialogContent)};
    localStorage.setItem(rolesKey,JSON.stringify(next));
    roleTracks=next;
    render();
    cityDetails(id);
    get("#fp-message").textContent="已保存城市角色。";
  } catch (error) {
    get("#fp-message").textContent=error.message || "当前浏览器无法保存。";
  }
}

async function openCatalog(purpose) {
  showDialog(purpose==="target"?"添加打卡目标":"补录历史城市",
    '<div id="fp-catalog" data-purpose="'+esc(purpose)+'"><label>搜索城市<input id="fp-catalog-query" type="search" autocomplete="off" placeholder="例如 成都、东京、巴黎"></label>'+
    '<p id="fp-message" role="status">正在载入离线城市目录…</p><div id="fp-catalog-results"></div></div>');
  try {
    const list=await (catalog ??= json("./city-catalog.json").catch(error=>{ catalog=null; throw error; }));
    if (!dialog.open || !get("#fp-catalog-query")) return;
    get("#fp-catalog-query").focus();
    updateCatalog(list);
  } catch {
    const note=get("#fp-catalog #fp-message");
    if (note) note.textContent="无法读取离线城市目录，请重试。";
  }
}

function updateCatalog(list) {
  const field=get("#fp-catalog-query");
  if (!field) return;
  const term=field.value.trim();
  const matches=cityMatches(list,term);
  get("#fp-catalog #fp-message").textContent=term && !matches.length?"没有找到这个城市。":"";
  get("#fp-catalog-results").innerHTML='<ul class="catalog-list">'+matches.map(([id,name,,,country,province])=>
    '<li>'+button("save-catalog",name+(province?" · "+province:" · "+countryName(country)),id)+'</li>').join("")+'</ul>';
}

async function saveCatalog(id) {
  const purpose=get("#fp-catalog")?.dataset.purpose;
  const match=(await catalog)?.find(item=>item[0]===id);
  if (!match || !purpose || !dialog.open) return;
  const place=catalogPlace(match);
  if (purpose==="manual") {
    const entry=edits.manual.find(item=>item.place.id===id);
    return openManual(place,entry?.date||"");
  }
  const targets=edits.targets.some(target=>target.id===id)?edits.targets:[...edits.targets,place];
  if (saveEdits({...edits,targets})) {
    dialog.close();
    get("#stamps").scrollIntoView({block:"start"});
  }
}

function openManual(place,date) {
  pendingPlace=place;
  showDialog("补录"+place.name,'<p class="fp-detail-meta">'+esc(countryName(place.country))+'</p>'+
    '<label class="manual-date">到访日期（选填）<input type="date" id="fp-manual-date" value="'+esc(date)+'"></label>'+
    '<div class="fp-actions">'+button("save-manual","保存打卡",place.id,"share-button")+
    (edits.manual.some(entry=>entry.place.id===place.id)?button("remove-manual","移除补录",place.id,"outline"):"")+
    '</div><p id="fp-message" role="alert"></p>');
}

function saveManual() {
  if (!pendingPlace) return;
  const place=pendingPlace;
  const entry={place,date:get("#fp-manual-date").value};
  const manual=[...edits.manual.filter(item=>item.place.id!==place.id),entry];
  if (saveEdits({...edits,manual})) cityDetails(unfilterCity(place.id));
}

function removeManual(id) {
  const next={...edits,manual:edits.manual.filter(entry=>entry.place.id!==id)};
  if (saveEdits(next)) {
    if (selected(id)) cityDetails(id);
    else dialog.close();
  }
}

function discoveries() {
  const insights = footprintDiscoveries(data,stats);
  if (!insights.length) return "";
  return '<section id="insights" class="fp-section"><header><h2>足迹里的发现</h2><span>'+numbers(insights.length)+' 条记录</span></header>'+
    '<div class="fp-discoveries">'+insights.map(item=>'<article><h3>'+esc(item.title)+'</h3><p>'+esc(item.note)+'</p>'+
    (item.id?button("city","查看城市 →",item.id,"inline-action"):"")+'</article>').join("")+'</div></section>';
}

function trend() {
  const years = footprintYears(data).filter(item=>year==="all" || item===year);
  if (year!=="all" || years.length<2) return "";
  const rows = years.map(item=>[item,scopeFootprint(data,item,geography,country)]).filter(([,range])=>range.places.length);
  if (!rows.length) return "";
  const known = new Set();
  const computed = new Map();
  for (const [item,range] of rows.slice().reverse()) {
    const before = known.size;
    for (const city of range.cities) known.add(city.id);
    computed.set(item,[known.size-before,known.size]);
  }
  const bars='<div class="story-panel"><h3>累计点亮的城市</h3><div class="year-bars">'+rows.slice().reverse().map(([item])=>{
    const count=computed.get(item)[1];
    return '<button type="button" class="year-bar" data-action="year" data-value="'+item+
      '" aria-label="'+item+' 年累计 '+numbers(count)+' 座城市"><strong>'+item+'</strong><i style="--mark:'+
      Math.round(count*100/Math.max(1,known.size))+'%"></i><span>'+numbers(count)+'</span></button>';
  }).join("")+'</div></div>';
  return '<section class="fp-section" id="years"><header><h2>历年足迹</h2></header>'+
    bars+'<div class="fp-trend"><table><thead><tr><th scope="col">年份</th><th scope="col">城市</th><th scope="col">国家／地区</th>'+
    '<th scope="col">有地点记录的天数</th><th scope="col">新城市</th><th scope="col">累计城市</th></tr></thead><tbody>'+
    rows.map(([item,range])=>'<tr><th scope="row">'+button("year",item+" 年",item,"inline-action")+'</th><td>'+numbers(range.cities.length)+
      '</td><td>'+numbers(range.countries.length)+'</td><td>'+numbers(range.activeDays)+'</td><td>'+numbers(computed.get(item)[0])+
      '</td><td>'+numbers(computed.get(item)[1])+'</td></tr>').join("")+'</tbody></table></div></section>';
}

function lifeChapter() {
  const roles=roleKeys(roleTracks,year);
  const labeled=stats.cities.filter(place=>roles[place.id]?.some(role=>["home","hometown","work","study"].includes(role)));
  const places=(labeled.length?labeled:stats.cities).slice(0,3);
  if (!places.length) return "";
  return '<section class="fp-section" id="life"><header><h2>有的地方是远方，有的成了家</h2></header>'+
    '<div class="life-grid">'+places.map(place=>'<button class="life-card" data-action="city" data-value="'+esc(place.id)+'">'+
      '<span>'+esc(roles[place.id]?.map(role=>roleNames[role]).join(" · ") || "记录日最多的城市")+'</span>'+
      outline(place,regions)+'<h3>'+esc(place.name)+'</h3><p>'+numbers(place.days)+' 个记录日</p><small>'+
      (place.first?esc(dateLabel(place.first)+" — "+dateLabel(place.last)):"日期未知")+'</small></button>').join("")+'</div>'+
    '<details class="chapter-details"><summary>标注与生活时间线</summary>'+roleSection()+'</details></section>';
}

function travelChapter() {
  const roles=roleKeys(roleTracks,year);
  const visits=stats.visits.filter(visit=>!roles[visit.id]?.some(role=>["home","work","hometown"].includes(role)));
  const longest=visits.slice().sort((a,b)=>b.days-a.days||b.first.localeCompare(a.first))[0];
  if (!longest) return "";
  const place=selected(longest.id);
  return '<section class="fp-section travel-chapter" id="travel"><div class="travel-outline">'+outline(place,regions)+'</div>'+
    '<div><p class="eyebrow">一段到访记录</p><h2>'+esc(place.name)+'，在这段时光里</h2><p>'+
    esc(dateLabel(longest.first)+" — "+dateLabel(longest.last))+'</p><strong>'+numbers(longest.days)+' 个记录日</strong>'+
    '<p>'+button("city","查看这座城市的历次到访 →",place.id,"inline-action")+'</p></div></section>';
}

function render() {
  stats = scopeFootprint(data,year,geography,country);
  if (country && !stats.options.some(place=>place.country===country)) {
    country = "";
    stats = scopeFootprint(data,year,geography,country);
  }
  mapYears=[...new Set(stats.places.flatMap(place=>place.dates.map(date=>date.slice(0,4))))].sort();
  const selectedBefore = document.activeElement;
  const oldAction = selectedBefore?.dataset.action, oldValue = selectedBefore?.dataset.value, oldId = selectedBefore?.id;
  highlights=footprintHighlights(data,stats);
  root.innerHTML = dashboard()+mapSection()+lifeChapter()+travelChapter()+visualStories()+trend()+
    '<details class="chapter-details"><summary>更多足迹发现</summary>'+discoveries()+'</details>'+citiesSection()+
    '<details class="chapter-details"><summary>管理打卡清单</summary>'+checklist()+'</details>'+
    '<footer class="fp-footer"><details><summary>统计与定位口径</summary><p>同一天在多个地方有拍摄记录，总天数只算一天。首尾跨度包含首日和末日。城市以边界匹配或附近城市为依据，国家／地区按归属去重。境外市级边界缺失时，地图展示所属国家轮廓。</p>'+
    '<p>日期来自相机记录和手动打卡。到访段依据记录日期归并，角色标注和打卡保存在这个浏览器。</p></details>'+
    '<a href="#footprint">返回顶部 ↑</a></footer>';
  root.setAttribute("aria-busy","false");
  share.hidden = !stats.places.length;
  resize.disconnect();
  resize.observe(get("#fp-map"));
  persistURL();
  if (oldAction) [...root.querySelectorAll("[data-action]")].find(item=>item.dataset.action===oldAction && item.dataset.value===oldValue)?.focus({preventScroll:true});
  if (oldId) document.getElementById(oldId)?.focus({preventScroll:true});
}

function defaultCenter() {
  if (camera.center) return camera.center;
  if (country || geography==="domestic") {
    const place = stats.cities[0] || stats.places[0];
    if (place) return {lat:place.lat,lon:place.lon};
  }
  const first = stats.cities.find(place=>!place.domestic) || stats.cities[0];
  return first ? {lat:first.lat/2,lon:first.lon} : {lat:20,lon:110};
}

function paintMap() {
  if (!stats) return;
  const canvas = get("#fp-map");
  const center = mode==="globe" ? defaultCenter() : camera.center;
  const frame=mapFrame();
  const points=boundaryPoints(frame,regions);
  const cityIds=new Set(points.filter(region=>!region.id.startsWith("country-")).map(region=>region.id));
  const mapRegions=regions.filter(region=>cityIds.has(region.id)||points.some(point=>point.id===region.id))
    .sort((a,b)=>Number(a.id.startsWith("country-"))-Number(b.id.startsWith("country-")));
  projection = drawMap(canvas,world,points,{design:"footprint",mode,regions:mapRegions,base:stats.places,
    selected:marker&&boundaryFor(selected(marker)||{},regions)?.id,
    camera:{bounds:worldBounds(stats),zoom:camera.zoom,center}});
  if (!projection) return;
  const active = marker && selected(marker);
  get("#fp-map-label").textContent = active ? active.name : mode==="globe" ? "拖动旋转地球仪" : "拖动平移地图";
}
const resize = new ResizeObserver(paintMap);
function scheduleMap() {
  if (!animation) animation=requestAnimationFrame(()=>{animation=null;paintMap();});
}

function showDialog(title,body) {
  get("#dialog-title").textContent=title;
  dialogContent.innerHTML=body;
  if (!dialog.open) dialog.showModal();
  dialogContent.scrollTop=0;
}

function cityDetails(id) {
  const place = selected(id);
  if (!place) return;
  if (playbackTimer) { haltPlayback(); syncPlayback(); }
  marker = id;
  const visits = stats.visits.filter(visit=>visit.id===id).sort((a,b)=>b.last.localeCompare(a.last));
  const canMark = place.level==="city";
  const checked = marked(id);
  const isManual=edits.manual.some(entry=>entry.place.id===id);
  const isTarget=edits.targets.some(entry=>entry.id===id);
  showDialog(place.name,outline(place,regions)+'<p class="fp-detail-meta">'+esc(countryName(place.country))+' · '+esc(place.status)+'</p>'+
    '<dl class="fp-detail-stats"><div><dt>有地点记录的天数</dt><dd>'+numbers(place.days)+'</dd></div><div><dt>到访记录</dt><dd>'+
    numbers(visits.length)+'</dd></div></dl>'+
    (place.first?bookendCards([
      {label:"第一次记录",date:place.first,places:[place]},
      ...(place.first===place.last?[]:[{label:"最近一次记录",date:place.last,places:[place]}]),
    ]):'<p class="fp-detail-meta">日期未知</p>')+
    '<div class="fp-actions">'+button("focus","在地图上定位",id,"outline")+
    (canMark && !isManual?button("checkin",checked?"取消确认打卡":"确认打卡",id,checked?"outline":"share-button"):"")+
    (canMark?button("edit-role","标注城市角色",id,"outline")+button(isTarget?"remove-target":"add-target",
      isTarget?"移出打卡清单":"加入打卡清单",id,"outline"):"")+
    (isManual?button("edit-manual","编辑补录",id,"outline"):"")+'</div>'+
    (canMark?roleTimeline(roleTracks,[place],{first:place.first,last:place.last}):"")+
    (visits.length?'<details class="fp-visits"><summary>历次到访记录（'+numbers(visits.length)+'）</summary><ol>'+
    visits.map(visit=>'<li><span>'+esc(dateLabel(visit.first))+(visit.first!==visit.last?' — '+esc(dateLabel(visit.last)):"")+
    '</span><strong>'+numbers(visit.days)+' 个拍摄日</strong></li>').join("")+'</ol></details>':'')+
    '<p id="fp-message" role="status"></p>');
}

function saveCheckin(id) {
  const next = new Set(currentCheckins);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  try {
    localStorage.setItem(checkinsKey,JSON.stringify([...next]));
    currentCheckins = next;
    render();
    cityDetails(id);
    get("#fp-message").textContent = next.has(id) ? "已确认打卡" : "已取消打卡";
  } catch {
    get("#fp-message").textContent = "当前浏览器无法保存打卡。";
  }
}

function openShare() {
  const system = typeof navigator.share==="function" && typeof navigator.canShare==="function";
  showDialog("分享城市足迹",'<p class="fp-detail-meta">'+esc(title())+'</p>'+
    '<label class="story-picker">分享范围<select id="fp-share-scope"><option value="current">当前筛选</option>'+
    '<option value="marked">已打卡城市</option><option value="custom">选择城市</option></select></label>'+
    '<fieldset id="fp-share-choices" hidden><legend>包含哪些城市</legend>'+stats.cities.map(place=>
    '<label><input type="checkbox" name="share-city" value="'+esc(place.id)+'" checked> '+esc(place.name)+'</label>').join("")+'</fieldset>'+
    '<label class="share-opt"><input id="fp-share-map" type="checkbox" checked> 附上地图与地名</label>'+
    '<canvas id="fp-share-preview" aria-label="足迹分享卡预览"></canvas><div class="fp-actions">'+
    button("download","下载 PNG","","share-button")+button("copy","复制足迹摘要","","outline")+
    (system?button("system-share","系统分享","","outline"):"")+'</div>'+
    '<p id="fp-share-status" aria-live="polite"></p>');
  previewShare();
}

function sharingSelection() {
  const mode=get("#fp-share-scope").value;
  const ids=mode==="custom" ? [...dialogContent.querySelectorAll('[name="share-city"]:checked')].map(box=>box.value) :
    stats.cities.filter(city=>marked(city.id)).map(city=>city.id);
  return mode==="current" ? stats : scopeFootprint(data,year,geography,country,new Set(ids));
}

function previewShare() {
  const showMap = get("#fp-share-map").checked;
  const range=sharingSelection();
  get("#fp-share-choices").hidden=get("#fp-share-scope").value!=="custom";
  for (const action of ["download","copy","system-share"]) {
    const control=dialogContent.querySelector('[data-action="'+action+'"]');
    if (control) control.disabled=!range.places.length;
  }
  get("#fp-share-status").textContent=range.places.length?"":"当前范围没有可分享的城市。";
  drawFootprintCard(get("#fp-share-preview"),range,world,regions,countries,{
    title:showMap?title():periodTitle(),countryName,demo:data.kind==="demo",showMap,
  });
}

function cardFile() {
  return new Promise(resolve=>get("#fp-share-preview").toBlob(blob=>resolve(blob && new File([blob],
    "photo-atlas-"+year+".png",{type:"image/png"})),"image/png"));
}

async function shareAction(action) {
  const feedback = get("#fp-share-status");
  if (action==="copy") {
    const showMap = get("#fp-share-map").checked;
    const text = shareSummary(sharingSelection(),showMap?title():periodTitle(),countryName,showMap);
    try {
      await navigator.clipboard.writeText(text);
      feedback.textContent = "已复制足迹摘要。";
    } catch {
      feedback.replaceChildren();
      const area = document.createElement("textarea");
      area.setAttribute("aria-label","可复制的足迹摘要");
      area.value = text;
      area.readOnly = true;
      feedback.append(area);
      area.select();
    }
    return;
  }
  const file = await cardFile();
  if (!file) { feedback.textContent="无法生成图片，请重试。"; return; }
  if (action==="system-share") {
    try {
      if (!navigator.canShare({files:[file]})) throw new Error("File unsupported");
      await navigator.share({title:"我的城市足迹",files:[file]});
    } catch (error) {
      if (error.name!=="AbortError") feedback.textContent="当前设备无法直接分享图片，可以下载 PNG。";
    }
    return;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href=url; link.download=file.name; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function reset() { camera={zoom:1}; marker=null; }
function resetScope() { reset(); haltPlayback(); playbackFrame=-1; reunionIndex=0; }
function chooseYear(value) { year=value; resetScope(); render(); }

function onAction(action,value) {
  if (action==="scope" && geography!==value) { geography=value;country="";resetScope();return render(); }
  if (action==="country") { country=value;resetScope();render();return get("#map").scrollIntoView({block:"start"}); }
  if (action==="year") { chooseYear(value);return get("#map").scrollIntoView({block:"start"}); }
  if (action==="mode" && mode!==value) { mode=value;reset();return render(); }
  if (action==="zoom") {
    if (value==="reset") reset();
    else camera={...camera,zoom:Math.max(.64,Math.min(6,camera.zoom*(value==="in"?1.3:1/1.3)))};
    return paintMap();
  }
  if (action==="find-cities") return get("#cities")?.scrollIntoView({block:"start"});
  if (action==="city") return cityDetails(value);
  if (action==="focus") {
    const place = selected(value);
    if (!place) return;
    haltPlayback(); playbackFrame=-1; syncPlayback();
    camera={zoom:mode==="globe"?1.22:Math.max(1,camera.zoom),center:{lat:place.lat,lon:place.lon}};
    marker=value;
    dialog.close();
    paintMap();
    return get("#map").scrollIntoView({block:"start"});
  }
  if (action==="checkin") return saveCheckin(value);
  if (action==="reunion-visit") return reunionDetails(value);
  if (action==="reunion-focus") return onAction("focus",value);
  if (action==="play-years") return toggleYears();
  if (action==="play-focus") {
    const place=selected(value);
    if (!place) return;
    haltPlayback();
    camera={...camera,center:{lat:place.lat,lon:place.lon}};
    marker=value;
    return syncPlayback();
  }
  if (action==="all-years") { haltPlayback(); playbackFrame=-1; return syncPlayback(); }
  if (action==="open-catalog") return openCatalog(value);
  if (action==="save-catalog") return saveCatalog(value);
  if (action==="add-target" || action==="remove-target") return updateTarget(action,value);
  if (action==="target-city") return cityDetails(unfilterCity(value));
  if (action==="target-checkin" || action==="edit-manual") {
    const entry=edits.manual.find(item=>item.place.id===value);
    const place=entry?.place || edits.targets.find(item=>item.id===value);
    return place && openManual(place,entry?.date||"");
  }
  if (action==="save-manual") return saveManual();
  if (action==="remove-manual") return removeManual(value);
  if (action==="edit-role") return editCityRole(value);
  if (action==="save-role") return saveCityRole(value);
  if (action==="download" || action==="copy" || action==="system-share") return shareAction(action);
}

root.addEventListener("change",event=>{
  if (event.target.id==="fp-reunion") { reunionIndex=Number(event.target.value); get("#fp-reunion-story").innerHTML=reunionMarkup(); }
  if (event.target.id==="fp-year") chooseYear(event.target.value);
  if (event.target.id==="fp-country") { country=event.target.value; resetScope(); render(); }
});
document.addEventListener("click",event=>{
  const control = event.target.closest("[data-action]");
  if (control) onAction(control.dataset.action,control.dataset.value);
  if(event.target.id==="fp-map" && projection && !moved) {
    const rect=event.target.getBoundingClientRect();
    const id=projection.hit(event.clientX-rect.left,event.clientY-rect.top);
    if (!id) return;
    if (id.startsWith("country-")) {
      country=id.slice(8); resetScope(); render();
      get("#cities").scrollIntoView({block:"start"});
    } else cityDetails(id);
  }

});
share.addEventListener("click",openShare);
dialogContent.addEventListener("change",event=>{
  if (event.target.id==="fp-share-map" || event.target.id==="fp-share-scope" || event.target.name==="share-city") previewShare();
});
dialogContent.addEventListener("input",async event=>{
  if (event.target.id!=="fp-catalog-query" || !catalog) return;
  try { updateCatalog(await catalog); } catch {}
});
root.addEventListener("input",event=>{
  if (event.target.id==="fp-play-year") { haltPlayback(); playbackFrame=Number(event.target.value); syncPlayback(); }
});
function pauseForCitySelection(event) {
  if (!playbackTimer || !event.target.closest("#fp-new-cities")) return;
  haltPlayback();
  syncPlayback();
}
root.addEventListener("pointerover",pauseForCitySelection);
root.addEventListener("focusin",pauseForCitySelection);
root.addEventListener("pointerdown",event=>{
  if (event.target.id!=="fp-map" || event.button!==0 || !projection || (mode!=="globe" && event.pointerType==="touch")) return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,start:projection.center};
  moved=false;
  event.target.setPointerCapture(event.pointerId);
});
root.addEventListener("pointermove",event=>{
  if (event.pointerId!==drag?.id || !projection) return;
  const dx=event.clientX-drag.x, dy=event.clientY-drag.y;
  if (!moved && Math.abs(dx)+Math.abs(dy)<3) return;
  moved=true;
  camera={...camera,center:projection.pan(drag.start,dx,dy)};
  scheduleMap();
});
root.addEventListener("lostpointercapture",()=>{drag=null;});

try {
  if (scan && !validId.test(scan)) throw new Error("本地报告地址无效。");
  let cityBoundaries;
  [baseData,world,countries,cityBoundaries]=await Promise.all([
    json(scan?"./api/libraries/"+scan+"/footprint.json":"./footprint-demo.json",{footprint:true}),
    json("./world.json"),json("./countries.json"),json("./city-boundaries.json"),
  ]);
  countries = countries.map(({polygons,...item})=>({
    ...item,polygons,bounds:polygons.flatMap(item=>item[0]).reduce(([w,s,e,n],[x,y])=>
      [Math.min(w,x),Math.min(s,y),Math.max(e,x),Math.max(n,y)],[180,90,-180,-90]),
  }));
  data=baseData;
  regions=[...new Map([...countries,...cityBoundaries,...data.regions].map(region=>[region.id,region])).values()].map(region=>({
    ...region,bounds:region.bounds || region.polygons.flatMap(polygon=>polygon[0]).reduce(([w,s,e,n],[x,y])=>
      [Math.min(w,x),Math.min(s,y),Math.max(e,x),Math.max(n,y)],[180,90,-180,-90]),
  }));
  names=new Map(countries.map(item=>[item.id.slice(8),item.name]));
  country=query.get("country")||"";
  checkinsKey="photo-atlas:checkins:"+(scan?data.libraryKey||scan:"demo");
  const profile=scan?data.libraryKey||scan:"demo";
  editsKey="photo-atlas:footprint-edits:"+profile;
  rolesKey="photo-atlas:city-roles:"+profile;
  edits=readEdits(editsKey,baseData);
  data=extendFootprint(baseData,edits.manual);
  roleTracks=readRoleTracks(rolesKey,baseData.sampleRoles);
  let saved;
  try { saved=JSON.parse(localStorage.getItem(checkinsKey)); } catch {}
  currentCheckins = new Set(Array.isArray(saved)?saved:[]);
  if (!footprintYears(data).includes(year)) year="all";
  render();
  document.getElementById(location.hash.slice(1))?.scrollIntoView({block:"start",behavior:"instant"});
} catch (error) {
  root.innerHTML='<div class="loading"><h1>无法打开足迹</h1><p>'+esc(error.message)+'</p><p><a href="./footprint.html">打开示例足迹</a></p></div>';
  root.setAttribute("aria-busy","false");
}
