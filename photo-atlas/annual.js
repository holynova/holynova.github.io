import {basename,day,dateLabel,esc,group} from "./model.js";
import {buildAtlas,isCity,placeLabel,summarize} from "./annual-model.js";
import {atlasContent,atlasModes,paintAtlas,roleTags} from "./annual-atlas.js";
import {extractRoleFields,readRoleTracks,roleEditFields,roleKeys,roleTimeline} from "./city-roles.js";
import {makeFootprint,scopeFootprint} from "./footprint-model.js";
import {bookendCards,footprintHighlights,recordCards,reunionCard} from "./footprint-stories.js";
import {discoveries} from "./annual-stories.js";
import {shareCanvas} from "./annual-share.js";

const $ = selector => document.querySelector(selector);
const report = $("#report");
const dialog = $("#details");
const content = $("#dialog-content");
const select = $("#year");
const share = $("#share");
const scan = new URLSearchParams(location.search).get("scan");
const validId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const base = scan && validId.test(scan) ? "./api/libraries/"+scan+"/" : null;
const number = value => Number(value).toLocaleString("zh-CN");
const chineseDate = stamp => {
  const [y,m,d] = stamp.split("-");
  return y+" 年 "+Number(m)+" 月 "+Number(d)+" 日";
};
let index,world,regions,state,metrics,projection,atlas,roles,rolesKey,stories;
let roleTracks,cityData,highlights,reunionIndex,mediaByCity;
let atlasMode = "cities";
let mapView = {zoom:1};
let isLocal = false;
let currentAlbum;
let galleryRevision = 0;
const covers = new Map();
const preferred = new URLSearchParams(location.search).get("year");
const isDemo = () => index.kind === "demo";
const titleYear = year => year === "unknown" ? "日期未知" : year === "all" ? "多年累计" : year;
const imageUrl = photo => photo?.thumb ? (isDemo() ? "./annual/" : base+"thumbs/")+encodeURIComponent(photo.thumb) : "";
const photoName = photo => photo.caption || basename(photo.path);
const image = (photo, className = "", eager = false) => photo?.thumb ?
  '<img class="'+className+'" src="'+esc(imageUrl(photo))+'" alt="'+esc(photoName(photo))+'" '+(eager?'fetchpriority="high"':'loading="lazy"')+'>' : '';
const action = (name,label,value="",className="") => '<button type="button" class="'+className+'" data-action="'+name+'" data-value="'+esc(value)+'">'+label+'</button>';
const album = (type,label,id,classes) => action(type,esc(label),id,classes);
const monthLabel = key => Number(key.slice(5,7))+" 月";
const layoutSection = (id,title,body,aside="",extra="") => '<section id="'+id+'" class="chapter '+extra+'">'+
  '<header class="chapter-head"><h2>'+esc(title)+'</h2>'+aside+'</header>'+body+'</section>';

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("无法读取报告数据。");
  return response.json();
}

async function loadIndex() {
  const response = await fetch(base ? base+"index.json" : "./annual-demo.json");
  if (!response.ok) throw new Error("无法读取报告数据。");
  isLocal = response.headers.get("X-Photo-Atlas-Local") === "1";
  return response.json();
}

function getCover() {
  const override = covers.get(state.year);
  return override === false ? null : override || state.cover;
}

function showHero() {
  const {year,first,last,photos} = state;
  const cover = getCover();
  const label = isDemo() ? "示例报告" : index.source;
  const multiYear = year === "all";
  const yearCaption = multiYear && first ? first.slice(0,4)+(first.slice(0,4)!==last.slice(0,4) ? "–"+last.slice(0,4) : "") : titleYear(year);
  return '<div class="report-hero'+(cover?' has-cover':'')+(multiYear?' multi-year':'')+'">'+image(cover,"cover-image",true)+
    '<div class="hero-content"><p class="eyebrow"><i aria-hidden="true"></i>'+esc(label)+'</p>'+
    '<h1><span>'+esc(yearCaption)+'</span><strong>'+ (year === "unknown" ? "未注明拍摄日期的照片" : multiYear ? "我的多年足迹" : "年度照片足迹")+'</strong></h1>'+
    '<p>'+(first?dateLabel(first)+' — '+dateLabel(last):number(photos.length)+' 张照片的拍摄日期未知')+'</p></div>'+
    '<div class="hero-foot">'+(cover?'<span>'+esc(cover.caption || (day(cover) ? dateLabel(day(cover)) : photoName(cover)))+'</span>':'<span></span>')+
    (state.spotlight.length?action("cover","更换封面","","cover-control"):'')+'</div></div>';
}

function stats() {
  const {photos,dates,places,longest,year} = state;
  const cityCount = number(places.filter(isCity).length);
  metrics = year === "unknown" ?
    [["照片",number(photos.length)],["有照片记录的城市",cityCount],["有预览",number(state.spotlight.length)]] :
    [["照片",number(photos.length)],["拍摄日",number(dates.size)],["有照片记录的城市",cityCount],["最长连续拍摄",number(longest)+" 天"]];
  return '<dl class="metrics">'+metrics.map(([label,value])=>'<div><dd>'+esc(value)+'</dd><dt>'+label+'</dt></div>').join("")+'</dl>';
}

function tempo() {
  if (!state.peak) return "";
  if (state.year === "all") return yearlyTempo();
  const {months,year,peak,peakMonth} = state;
  const data = Array.from({length:12},(_,i) => {
    const key = year+"-"+String(i+1).padStart(2,"0");
    return {key,count:months.get(key)?.length || 0,month:i+1};
  });
  const max = Math.max(...data.map(item=>item.count),1);
  const bars = data.map(({key,count,month})=>{
    const label = month+" 月 · "+number(count)+" 张";
    return '<button class="month-mark'+(key===peakMonth[0]?' peak':'')+'" type="button" data-action="month" data-value="'+key+'" aria-label="'+label+'">'+
      '<span class="bar-track"><i style="--height:'+(count/max*100)+'%"></i></span><span class="month-tick">'+month+'</span>'+
      '<span class="tooltip" aria-hidden="true">'+label+'</span></button>';
  }).join("");
  const table = '<details class="data-table"><summary>查看月度数据表</summary><table><thead><tr><th scope="col">月份</th><th scope="col">照片</th><th scope="col">拍摄日</th></tr></thead><tbody>'+
    data.map(({key,count,month})=>'<tr><th scope="row">'+month+' 月</th><td>'+number(count)+'</td><td>'+new Set((months.get(key)||[]).map(day)).size+'</td></tr>').join("")+
    '</tbody></table></details>';
  const date = chineseDate(peak[0]);
  return layoutSection("tempo","这一年的拍摄节奏",'<div class="tempo-grid"><section class="plot-panel"><header><h3>每月照片</h3><span>单位 · 张</span></header>'+
    '<div class="month-plot" aria-label="每月照片数">'+bars+'</div>'+table+'</section><section class="peak-panel"><p>拍得最多的一天</p>'+
    '<strong>'+number(peak[1].length)+' 张</strong><span>'+date+'</span>'+
    album("day","看看当天拍了什么 →",peak[0],"inline-action")+'</section></div>'+calendar());
}

function yearlyTempo() {
  const {years,peak} = state;
  const rows = [...years].sort(([a],[b])=>a.localeCompare(b));
  let cities = new Set();
  return layoutSection("tempo","足迹怎样长出来",'<div class="tempo-grid"><section class="plot-panel"><header><h3>历年拍摄与累计城市</h3></header>'+
    '<div class="year-table-scroll"><table class="year-table"><thead><tr><th scope="col">年份</th><th scope="col">照片</th><th scope="col">拍摄日</th>'+
    '<th scope="col">新增城市</th><th scope="col">累计城市</th></tr></thead><tbody>'+rows.map(([year,items])=>{
      const count = cities.size;
      for (const photo of items) if (isCity(index.cities[photo.city])) cities.add(photo.city);
      return '<tr><th scope="row">'+album("year",year+" 年",year,"inline-action")+'</th><td>'+number(items.length)+'</td><td>'+
        number(new Set(items.map(day)).size)+'</td><td>+'+number(cities.size-count)+'</td><td>'+number(cities.size)+'</td></tr>';
    }).join("")+'</tbody></table></div></section><section class="peak-panel"><p>这些年拍得最多的一天</p><strong>'+
    number(peak[1].length)+' 张</strong><span>'+chineseDate(peak[0])+'</span>'+album("day","看看当天拍了什么 →",peak[0],"inline-action")+
    '</section></div>');
}

function calendar() {
  const {dates,year} = state;
  const rows = Array.from({length:12},(_,i)=>{
    const length = new Date(Date.UTC(Number(year),i+1,0)).getUTCDate();
    const key = year+"-"+String(i+1).padStart(2,"0")+"-";
    const cells = Array.from({length:length},(_,j)=>{
      const date = key+String(j+1).padStart(2,"0");
      const count = dates.get(date)?.length || 0;
      const rank = count > 12 ? 3 : count > 4 ? 2 : count > 0 ? 1 : 0;
      const label = dateLabel(date)+" · "+number(count)+" 张";
      return count ? '<button type="button" class="calendar-dot tone-'+rank+'" data-action="day" data-value="'+date+'" aria-label="'+label+
        '"><span class="tooltip" aria-hidden="true">'+label+'</span></button>' : '<span class="calendar-dot" title="'+label+'" aria-hidden="true"></span>';
    }).join("");
    return '<div class="calendar-row"><span>'+String(i+1).padStart(2,"0")+'</span>'+cells+'</div>';
  }).join("");
  return '<details class="data-table calendar"><summary>展开每日拍摄日历</summary><div class="calendar-scroll">'+rows+'</div>'+
    '<p>色阶 · 0 张 / 1–4 张 / 5–12 张 / 13 张以上</p></details>';
}

function mapping() {
  if (!state.places.length) return "";
  const url=new URL($("#footprint-link").href);
  url.searchParams.set("year","all");
  url.hash="map";
  return layoutSection("map","我的城市足迹",atlasContent(state,index,atlasMode,roles),
    '<a class="inline-action" href="'+esc(url.href)+'">逐年回放城市足迹 →</a>');
}

function cityPhotos(place,dates,preview=false) {
  const dateSet=new Set(dates);
  return (preview ? mediaByCity.get(place.id)||[] : index.photos).filter(photo=>photo.city===place.id&&dateSet.has(day(photo)));
}

function storyImage(place,dates) {
  return image(cityPhotos(place,dates,true)[0],"story-image");
}

function currentReunion() {
  return highlights.reunions[reunionIndex];
}

function annualReunion() {
  return reunionCard(currentReunion(),{imageFor:storyImage,cityAction:"atlas-focus",visitAction:"reunion-visit"});
}

function discoveryCards() {
  stories = discoveries(state,index,roles);
  highlights = footprintHighlights(cityData,scopeFootprint(cityData,state.year,"all"));
  const {bookends,records,reunions}=highlights;
  reunionIndex=Math.max(0,reunions.findIndex(({place,before,after})=>
    cityPhotos(place,before,true).length && cityPhotos(place,after,true).length));
  if (!stories.length && !bookends.length) return "";
  const choices=reunions.length>1?'<label class="story-picker">选择重逢记录<select id="annual-reunion">'+reunions.map((item,i)=>
    '<option value="'+i+'"'+(i===reunionIndex?' selected':'')+'>'+esc(item.place.name+" · "+number(item.gap)+" 天")+'</option>').join("")+'</select></label>':"";
  const reunion=reunions.length?'<div class="annual-story-head"><h3>重逢时刻</h3>'+choices+'</div><div id="annual-reunion-story">'+
    annualReunion()+'</div>':"";
  const comparison=bookends.length?'<div class="annual-story-head"><h3>第一次与最近一次</h3></div>'+bookendCards(bookends,
    {imageFor:storyImage,cityAction:"city"}):"";
  const extremes=records.length?'<div class="annual-story-head"><h3>'+(state.year==="all"?"多年之最":"年度之最")+
    '</h3></div>'+recordCards(records,"city"):"";
  const more=stories.length?'<details class="more-stories"><summary>再看 '+stories.length+' 个照片发现</summary><div class="discovery-grid">'+
    stories.map(({title,detail},i)=>'<article><h3>'+esc(title)+'</h3><p>'+esc(detail)+'</p>'+
      album("story","查看照片 →",String(i),"inline-action")+'</article>').join("")+'</div></details>':"";
  return layoutSection("discoveries",state.year==="all"?"这些年，照片记下的事":"这一年，照片记下的事",reunion+comparison+extremes+more);
}

function roleChapter() {
  const view=roleTimeline(roleTracks,state.places,state);
  return view ? layoutSection("roles","城市角色时间线",'<div class="story-panel">'+view+'</div>') : "";
}

function memories() {
  const {year,months} = state;
  if (year === "unknown") return "";
  const groups = [...months].map(([key,items])=>({key,items,photo:items.find(photo=>photo.thumb)}))
    .filter(group=>group.photo).sort((a,b)=>b.key.localeCompare(a.key));
  const cards = groups.slice(0,8).map(({key,items,photo})=>'<button class="memory-card" type="button" data-action="month" data-value="'+esc(key)+'">'+
    image(photo)+'<span><strong>'+esc(photo.caption || monthLabel(key))+'</strong><small>'+
    (year==="all" ? esc(key.slice(0,4))+" 年 " : "")+monthLabel(key)+' · '+number(items.length)+' 张</small></span></button>').join("");
  return cards ? layoutSection("memories","再翻几页相册",'<div class="memory-grid">'+cards+'</div>') : "";
}

function sourceNotes() {
  const {totals,issues} = index;
  const unknown = index.photos.length-totals.dated;
  return '<footer class="report-footer"><details><summary>数据从哪里来</summary><p>'+
    (isDemo()?"日期、数量和地区来自虚构的示例索引，五张配图由 ImageGen 生成。":
      "这份报告来自本地扫描，拍摄日期与地点取自照片元数据。原图与报告数据留在本机。")+
    '</p><p>有拍摄日期 '+number(totals.dated)+' 张 · 已归属地区 '+number(totals.located)+
    ' 张 · 读取失败 '+number(totals.failed)+' 张'+(totals.previewFailed?' · 预览不可用 '+number(totals.previewFailed)+' 张':'')+
    '</p>'+(issues?.length?album("issues","查看扫描问题","","inline-action"):'')+'</details>'+
    (unknown && state.year !== "unknown"?album("unknown","查看 "+number(unknown)+" 张日期未知照片","","inline-action"):'')+
    '<a href="#report" class="inline-action">返回顶部 ↑</a></footer>';
}

function redrawMap() {
  const canvas = $("#annual-map");
  projection = canvas ? paintAtlas(canvas,world,regions,state,index,atlasMode,roles,mapView) : null;
}
const resize = new ResizeObserver(redrawMap);

function observeMap() {
  resize.disconnect();
  const canvas = $("#annual-map");
  if (canvas) resize.observe(canvas);
}

function refreshMap() {
  const map = $("#map");
  if (!map) return;
  const frame = document.createElement("template");
  frame.innerHTML = mapping();
  map.replaceWith(frame.content);
  observeMap();
  redrawMap();
}

function render() {
  state = summarize(index,select.value,atlas);
  roles=roleKeys(roleTracks,state.year);
  const body = [mapping(),discoveryCards(),roleChapter(),tempo(),memories()];
  const links = [["map","城市足迹"],["discoveries","报告发现"],["roles","城市角色"],["tempo",state.year==="all"?"历年变化":"拍摄节奏"],["memories","相册"]];
  const nav = '<nav class="report-nav" aria-label="报告章节">'+links.map(([id,label],i)=>
    body[i]?'<a href="#'+id+'">'+label+'</a>':"").join("")+
    album("all","查看全部照片 →","","inline-action")+'</nav>';
  report.innerHTML = showHero()+'<div class="paper">'+stats()+nav+body.join("")+sourceNotes()+'</div>';
  observeMap();
  report.setAttribute("aria-busy","false");
}

function showDialog(title, markup) {
  $("#dialog-title").textContent = title;
  content.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  content.scrollTop = 0;
}

function showCity(place) {
  if (!place) return;
  const records = state.visits.map((visit,i)=>[visit,i]).filter(([visit])=>visit.city===place.id);
  const phase = state.residences.find(item=>item.city===place.id);
  const precision = place.precision==="nearby" ? "按城市中心附近匹配" :
    isCity(place) ? "市级行政区域" : "按省级或国家 / 地区归属";
  showDialog(placeLabel(place),'<div class="city-detail"><p class="coverage">'+esc([place.province,precision].filter(Boolean).join(" · "))+'</p>'+
    '<dl class="city-facts"><div><dt>拍摄日</dt><dd>'+number(place.days)+'</dd></div><div><dt>照片</dt><dd>'+number(place.items.length)+'</dd></div>'+
    '<div><dt>到访记录</dt><dd>'+number(records.length)+'</dd></div></dl>'+
    (place.first?bookendCards([
      {label:"第一次记录",date:place.first,places:[place]},
      ...(place.first===place.last?[]:[{label:"最近一次记录",date:place.last,places:[place]}]),
    ],{imageFor:storyImage}):"")+
    '<div class="city-roles">'+roleTags(roles[place.id])+(phase?'<span class="city-role inferred">可能的常住地</span>':"")+'</div>'+
    '<div class="city-actions">'+album("place","查看照片",place.id,"share-button")+
    (isCity(place)?album("roles","标注这个城市",place.id,"outline")+album("atlas-focus","地图上定位",place.id,"outline"):"")+'</div>'+
    roleTimeline(roleTracks,[place],{first:place.first,last:place.last})+
    (records.length?'<h3>历次到访记录</h3><ol class="atlas-rows">'+records.map(([visit,i])=>
      '<li><div>'+album("visit",dateLabel(visit.start)+(visit.start!==visit.end?" — "+dateLabel(visit.end):""),i,"place-name")+
      '</div><strong>'+new Set(visit.items.map(day)).size+' 个拍摄日</strong></li>').join("")+'</ol>':'')+'</div>');
}

function editRoles(place) {
  if (!isCity(place)) return;
  showDialog("标注"+placeLabel(place),roleEditFields(roleTracks[place.id])+
    '<p class="coverage">开始和结束日期可留空。标注保存在当前浏览器。</p><div class="city-actions">'+
    album("save-roles","保存角色时间线",place.id,"share-button")+album("city","返回城市详情",place.id,"outline")+
    '</div><p id="roles-error" role="alert"></p>');
}

function saveRoles(id) {
  try {
    const next={...readRoleTracks(rolesKey,index.sampleRoles),[id]:extractRoleFields(content)};
    localStorage.setItem(rolesKey,JSON.stringify(next));
    roleTracks=next;
    render();
    showCity(state.places.find(place=>place.id===id));
  } catch (error) {
    $("#roles-error").textContent=error.message || "当前浏览器无法保存标注。";
  }
}

function showAlbum(title, photos, page = 0, cover = false) {
  currentAlbum = {title,photos,page,cover};
  const size = 24;
  const pageCount = Math.max(1,Math.ceil(photos.length/size));
  const shown = photos.slice(page*size,(page+1)*size);
  const tiles = shown.map(photo=>'<button type="button" class="photo-tile" data-action="'+(cover?"set-cover":"photo")+'" data-value="'+
    esc(photo.id)+'">'+(image(photo)||'<span class="no-preview">无预览</span>')+
    '<span>'+esc(photoName(photo))+'</span><small>'+esc(dateLabel(day(photo)))+'</small></button>').join("");
  showDialog(title,'<div class="album-top"><p>'+number(photos.length)+' 张照片</p>'+
    (cover?action("remove-cover","隐藏封面","","inline-action"):"")+'</div>'+
    (tiles?'<div class="album-grid">'+tiles+'</div>':'<p class="empty">这个月份没有拍摄记录。</p>')+
    (pageCount>1?'<div class="album-pages">'+(page>0?action("page","← 上一页",page-1,"outline"):"")+
    '<span>'+(page+1)+' / '+pageCount+'</span>'+(page+1<pageCount?action("page","下一页 →",page+1,"outline"):"")+'</div>':""));
}

function openShare() {
  showDialog("生成分享卡",'<p class="share-hint">分享卡包含当前报告年份和汇总数据。</p>'+
    (getCover()?'<label class="share-opt"><input type="checkbox" id="with-photo"> 加入当前封面照片</label>':"")+
    '<canvas id="share-preview" aria-label="分享卡预览"></canvas><p id="share-error" role="status"></p>'+
    '<button type="button" class="share-button" data-action="download" disabled>下载 PNG</button>');
  renderShare();
}

async function renderShare() {
  const canvas = $("#share-preview");
  if (!canvas) return;
  const download = content.querySelector('[data-action="download"]');
  download.disabled = true;
  const revision = ++galleryRevision;
  const photo = $("#with-photo")?.checked ? imageUrl(getCover()) : "";
  try {
    const preview = document.createElement("canvas");
    await shareCanvas(preview,{year:state.year === "all" ? "多年足迹" : state.year,demo:isDemo(),photo,metrics});
    if (revision !== galleryRevision) return;
    canvas.width = preview.width;
    canvas.height = preview.height;
    canvas.getContext("2d").drawImage(preview,0,0);
    download.disabled = false;
    $("#share-error").textContent = "";
  } catch {
    if (revision === galleryRevision && $("#share-error")) $("#share-error").textContent = "封面无法读取，可以关闭「加入当前封面照片」后重试。";
  }
}

function downloadShare() {
  const canvas = $("#share-preview");
  canvas.toBlob(blob=>{
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "photo-atlas-"+state.year+".png";
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },"image/png");
}

function updateFootprintLink() {
  const link = new URL("./footprint.html",location.href);
  if (scan) link.searchParams.set("scan",scan);
  if (select.value!=="all" && select.value!=="unknown") link.searchParams.set("year",select.value);
  $("#footprint-link").href = link.href;
}

function changeYear(year) {
  select.value = year;
  updateFootprintLink();
  mapView = {zoom:1};
  const url = new URL(location);
  url.searchParams.set("year",year);
  history.replaceState(null,"",url);
  render();
}

function act(name,value) {
  const {photos,months,dates,places,visits} = state;
  if (name === "all") return showAlbum("全部照片",photos);
  if (name === "unknown") { changeYear("unknown"); return showAlbum("日期未知的照片",state.photos); }
  if (name === "month") return showAlbum(monthLabel(value)+"的照片",months.get(value)||[]);
  if (name === "day") return showAlbum(chineseDate(value),dates.get(value)||[]);
  if (name === "place") {
    const place = places.find(item=>item.id===value);
    if (place) showAlbum(place.name,place.items);
  }
  if (name === "places") return showDialog("全部地区",'<ol class="all-places">'+places.map(place=>
    '<li>'+album("place",place.name,place.id,"place-name")+'<span>'+number(place.items.length)+' 张</span></li>').join("")+'</ol>');
  if (name === "story") return showAlbum(stories[value].title,stories[value].photos);
  if (name === "reunion-visit") {
    const {place,before,after}=currentReunion();
    return showAlbum(place.name+" · "+(value==="previous"?"上一次":"这一次")+"到访",
      cityPhotos(place,value==="previous"?before:after));
  }
  if (name === "year") {
    changeYear(value);
    $("#map")?.scrollIntoView({block:"start"});
    return;
  }
  if (name === "city") return showCity(places.find(place=>place.id===value));
  if (name === "roles") return editRoles(places.find(place=>place.id===value));
  if (name === "save-roles") return saveRoles(value);
  if (name === "atlas-mode" && Object.hasOwn(atlasModes,value)) {
    atlasMode = value;
    refreshMap();
    document.querySelector('.atlas-tabs [aria-pressed="true"]')?.focus({preventScroll:true});
    return;
  }
  if (name === "atlas-zoom") {
    const zoom = value==="reset" ? 1 : mapView.zoom*(value==="in" ? 1.35 : 1/1.35);
    mapView = value==="reset" ? {zoom:1} : {...mapView,zoom:Math.max(.66,Math.min(8,zoom))};
    return redrawMap();
  }
  if (name === "atlas-focus") {
    const place = places.find(item=>item.id===value);
    if (!place) return;
    mapView = {zoom:2.2,center:{lat:place.lat,lon:place.lon}};
    dialog.close();
    redrawMap();
    $("#map")?.scrollIntoView({block:"start"});
    return;
  }
  if (name === "visit") return showAlbum(index.cities[visits[value].city].name+" · 到访记录",visits[value].items);
  if (name === "cover") return showAlbum("选择一张封面",state.spotlight,0,true);
  if (name === "page" || name === "back") {
    const {title,photos,page,cover} = currentAlbum;
    return showAlbum(title,photos,name==="page"?Number(value):page,cover);
  }
  if (name === "photo" || name === "set-cover") {
    const photo = (currentAlbum?.photos || photos).find(item=>String(item.id)===value);
    if (!photo) return;
    if (name === "set-cover") {
      covers.set(state.year,photo);
      dialog.close();
      return render();
    }
    showDialog(photoName(photo),'<p class="photo-meta">'+[day(photo)?dateLabel(day(photo)):"日期未知",index.cities[photo.city]?.name,photo.camera]
      .filter(Boolean).map(esc).join(" · ")+'</p>'+(image(photo,"large-photo")||'<p class="empty">这张照片没有可用预览。</p>')+
      album("back","← 返回相册","","inline-action"));
  }
  if (name === "remove-cover") {
    covers.set(state.year,false);
    dialog.close();
    return render();
  }
  if (name === "issues") return showDialog("扫描问题",'<ul class="issues">'+index.issues.map(issue=>
    '<li>'+esc(issue.file)+' · '+({folder:"目录无法读取",preview:"无法生成预览",photo:"照片读取失败"}[issue.kind]||"读取失败")+'</li>').join("")+'</ul>');
  if (name === "download") downloadShare();
}

let drag, moved;
report.addEventListener("pointerdown",event=>{
  if (event.target.id!=="annual-map" || event.pointerType==="touch" || event.button!==0 || !projection) return;
  moved = false;
  drag = {id:event.pointerId,x:event.clientX,y:event.clientY,center:projection.center};
  event.target.setPointerCapture(event.pointerId);
});
report.addEventListener("pointermove",event=>{
  if (event.pointerId!==drag?.id || !projection) return;
  const dx = event.clientX-drag.x, dy = event.clientY-drag.y;
  if (Math.abs(dx)+Math.abs(dy)<4 && !moved) return;
  moved = true;
  mapView = {...mapView,center:projection.pan(drag.center,dx,dy)};
  redrawMap();
});
report.addEventListener("lostpointercapture",()=>{drag=null;});
document.addEventListener("click",event=>{
  const button = event.target.closest("[data-action]");
  if (button) act(button.dataset.action,button.dataset.value);
  if (event.target.id === "annual-map" && projection?.hit) {
    if (moved) { moved=false; return; }
    const rect = event.target.getBoundingClientRect();
    const region = projection.hit(event.clientX-rect.left,event.clientY-rect.top);
    if (region) act("city",region);
  }
});
select.addEventListener("change",()=>changeYear(select.value));
report.addEventListener("change",event=>{
  if (event.target.id!=="annual-reunion") return;
  reunionIndex=Number(event.target.value);
  $("#annual-reunion-story").innerHTML=annualReunion();
});
share.addEventListener("click",openShare);
content.addEventListener("change",event=>{ if (event.target.id === "with-photo") renderShare(); });

try {
  if (scan && !base) throw new Error("这个本地报告地址无效。");
  let domestic;
  [index,world,domestic] = await Promise.all([
    loadIndex(),json("./world.json"),json("./regions.json"),
  ]);
  regions = [...domestic,...index.regions];
  atlas = buildAtlas(index);
  rolesKey = "photo-atlas:city-roles:"+ (isDemo() ? "demo" : index.libraryKey || scan);
  roleTracks=readRoleTracks(rolesKey,index.sampleRoles);
  cityData=makeFootprint(index);
  mediaByCity=group(index.photos.filter(photo=>photo.thumb),photo=>photo.city);
  if (isLocal) {
    $("#start-link").textContent = "扫描本地照片";
    $("#start-link").href = "./scan";
  }
  const years = [...new Set(index.photos.map(photo=>day(photo).slice(0,4) || "unknown"))].sort((a,b)=>
    a==="unknown"?1:b==="unknown"?-1:b.localeCompare(a));
  if (!years.length) throw new Error("这个报告中没有可用照片。");
  select.replaceChildren(new Option("全部年份","all"),...years.map(year=>new Option(year === "unknown" ? "日期未知" : year+" 年",year)));
  select.value = years.includes(preferred) ? preferred : "all";
  select.closest("label").hidden = false;
  share.hidden = false;
  updateFootprintLink();
  render();
  const section = document.getElementById(location.hash.slice(1));
  section?.scrollIntoView({block:"start",behavior:"instant"});
} catch (error) {
  report.innerHTML = '<section class="loading"><h1>无法打开报告</h1><p>'+esc(error.message)+'</p><p>'+
    (base?'<a href="./scan">返回本地扫描</a> · ':"")+'<a href="./annual.html">查看年度报告示例</a></p></section>';
  report.setAttribute("aria-busy","false");
}
