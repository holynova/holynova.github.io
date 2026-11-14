import {day, dayGap, dateLabel, esc, residenceOn} from "./model.js";

const display=(n)=>n.toLocaleString("zh-CN");
const span=(start,end)=>dateLabel(start)+(start===end ? "" : " – "+dateLabel(end));
const interval=(days)=>days>=365 ? "约 "+(days/365.2425).toFixed(1)+" 年（"+display(days)+" 天）" : display(days)+" 天";
const newYear=(year)=>({year,dates:new Set(),homeDays:new Map(),places:new Map(),visits:[],newPlaces:[]});

export function historyStats(photos,cities,residences,records) {
  const dated=photos.filter((photo)=>day(photo)&&photo.city&&cities[photo.city]).sort((a,b)=>a.stamp.localeCompare(b.stamp));
  const years=new Map(), firstVisits=new Map(), destinations=new Map();
  for (const photo of dated) {
    const date=day(photo), year=date.slice(0,4);
    if (!years.has(year)) years.set(year,newYear(year));
    const summary=years.get(year);
    summary.dates.add(date);
    if (!summary.places.has(photo.city)) summary.places.set(photo.city,new Set());
    summary.places.get(photo.city).add(date);
    if (!firstVisits.has(photo.city)) firstVisits.set(photo.city,photo);
    if (residenceOn(residences,date)===photo.city) {
      if (!summary.homeDays.has(photo.city)) summary.homeDays.set(photo.city,new Set());
      summary.homeDays.get(photo.city).add(date);
    }
  }
  for (const record of records) {
    if (!cities[record.city]) continue;
    const visit={...record,name:cities[record.city].name};
    years.get(record.start.slice(0,4))?.visits.push(visit);
    if (!record.home) continue;
    if (!destinations.has(record.city)) destinations.set(record.city,{id:record.city,name:visit.name,visits:[]});
    destinations.get(record.city).visits.push(visit);
  }
  for (const photo of firstVisits.values()) {
    years.get(day(photo).slice(0,4)).newPlaces.push(photo);
  }
  const returns=[...destinations.values()].sort((a,b)=>b.visits.length-a.visits.length||a.name.localeCompare(b.name,"zh-CN"));
  let longest=null;
  for (const destination of returns) {
    for (let i=0;i<destination.visits.length-1;i++) {
      const visit=destination.visits[i], prior=destination.visits[i+1];
      const days=dayGap(prior.end,visit.start);
      if (days>0 && (!longest || days>longest.days)) longest={destination,visit,prior,days};
    }
  }
  const homePhases=residences.filter((phase)=>cities[phase.city]);
  const moves=residences.flatMap((to,index)=>{
    const from=residences[index-1];
    return from && cities[from.city] && cities[to.city] && from.city!==to.city ? [{from,to}] : [];
  });
  return {years:[...years.values()].reverse(),cities,returns,longest,homePhases,moves};
}

function metric(label,value,description = "") {
  return '<article><span>'+label+'</span><strong>'+esc(value)+'</strong>'+(description ? '<small>'+esc(description)+'</small>' : '')+'</article>';
}
const tripCount=(year)=>year.visits.filter((visit)=>visit.home).length;
const mapButton=(action,value,label,classes="outline")=>'<button type="button" class="'+classes+
  '" data-action="'+action+'" data-value="'+esc(value)+'">'+esc(label)+'</button>';

function yearStory(year,cities) {
  const trips=year.visits.filter((visit)=>visit.home);
  const locations=new Set(trips.map((trip)=>trip.city));
  const homes=[...year.homeDays].sort(([,a],[,b])=>b.size-a.size);
  const homeSummary=homes.length ? homes.map(([id,dates])=>cities[id].name+" "+dates.size+" 个拍摄日").join("、") :
    "暂未推断出常住地";
  const monthly=new Map();
  for (const trip of trips) {
    const month=trip.start.slice(5,7);
    monthly.set(month,(monthly.get(month)||0)+1);
  }
  const busiest=[...monthly].sort(([a,n],[b,m])=>m-n||a.localeCompare(b))[0];
  return '<div class="history-metrics">'+
    metric("有地点的拍摄日",display(year.dates.size)+" 天")+
    metric("外地行程",display(trips.length)+" 段",trips.length ? locations.size+" 个目的地" : "")+
    metric("首次到访地区",year.newPlaces.length+" 个地区",year.newPlaces.length ? year.newPlaces.slice(0,4).map((p)=>cities[p.city].name).join("、")+(year.newPlaces.length>4?" 等":"") : "")+
    metric("常住记录",homeSummary)+
    (busiest ? metric("行程最多的月份",Number(busiest[0])+" 月",busiest[1]+" 段") : "")+
    '</div>'+(year.visits.length!==trips.length ? '<p class="report-muted">另有 '+(year.visits.length-trips.length)+' 段到访发生在无法确定常住地的时段。</p>' : "");
}

export function historyMarkup(stats,scope,selected,selectedYear) {
  if (!stats.years.length) return '<h2 id="history-title">年度足迹</h2><p class="empty">当前范围没有同时带日期和地区的记录。</p>';
  const {cities,years,returns,homePhases,moves,longest}=stats;
  const year=years.find((item)=>item.year===selectedYear)||years[0];
  const favorite=returns.find((item)=>item.id===selected)||returns[0];
  const busiest=[...years].sort((a,b)=>tripCount(b)-tripCount(a)||b.year.localeCompare(a.year))[0];
  const phases=homePhases.length ? homePhases.map((phase)=>'<li><strong>'+esc(cities[phase.city].name)+
    '</strong><span>'+span(phase.start,phase.end)+'</span><small>'+phase.months+' 个支持月份，'+phase.days+' 个支持拍摄日</small></li>').join("") :
    '<li>暂未找到有足够月份支持的常住城市。</li>';
  const changes=moves.map(({from,to})=>'<li><strong>'+esc(cities[from.city].name+' → '+cities[to.city].name)+
    '</strong><span>'+span(from.end,to.start)+'</span></li>').join("");
  const annual=years.map((record)=>{
    const places=[...record.places].sort(([,a],[,b])=>b.size-a.size);
    return '<article class="annual-row"><div>'+mapButton("history-year",record.year,record.year+" 年")+
      '<span>'+places.length+' 个地区</span></div><div class="annual-places">'+places.map(([id,dates])=>
        mapButton("history-place",record.year+"/"+id,cities[id].name+" "+dates.size+" 天",record.homeDays.has(id)?"lead-place":"")).join("")+'</div></article>';
  }).join("");
  const options=years.map((item)=>'<option value="'+item.year+'"'+(item.year===year.year?" selected":"")+'>'+item.year+' 年</option>').join("");
  const destinationOptions=returns.map((item)=>'<option value="'+esc(item.id)+'"'+(item===favorite?" selected":"")+'>'+esc(item.name)+" "+item.visits.length+' 段</option>').join("");
  return '<div class="report-year"><h2 id="history-title">'+year.year+' 年度足迹</h2><select id="report-year" aria-label="回顾年份">'+options+'</select></div>'+
    yearStory(year,cities)+
    '<div class="history-columns"><section class="report-section"><h3>住在哪里</h3><ol class="home-timeline">'+phases+
    '</ol><h4>可能的搬家时间</h4>'+(changes?'<ol class="home-timeline moves">'+changes+'</ol>':'<p>暂无证据支持常住城市发生变化。</p>')+
    '</section><section class="report-section"><h3>多年发现</h3><ul class="report-facts">'+
    (returns[0] ? '<li><strong>'+esc(returns[0].name)+'</strong> 是到访次数最多的外地目的地，共 '+returns[0].visits.length+' 段。</li>' : "")+
    (longest ? '<li>时隔 <strong>'+interval(longest.days)+'</strong> 再见 '+esc(longest.destination.name)+'，两段记录分别结束和开始于 '+dateLabel(longest.prior.end)+'、'+dateLabel(longest.visit.start)+'。</li>' : "")+
    (tripCount(busiest) ? '<li><strong>'+busiest.year+' 年</strong>的外地行程最多，有 '+tripCount(busiest)+' 段在当年开始。</li>' : '<li>现有示例暂未支持按常住地统计外地行程。</li>')+
    '</ul>'+(favorite ? '<label class="history-picker">查看目的地<select id="history-city">'+destinationOptions+
      '</select></label><div id="visit-summary">'+visitMarkup(favorite)+'</div>' : "")+'</section></div>'+
    '<details class="history-years"><summary>历年地点</summary>'+annual+'</details>'+
    '<details class="history-note"><summary>统计口径</summary><p>覆盖'+(scope==="domestic"?"国内":"全球")+
    '地区。常住地根据每月拍照天数推断，至少需要 3 个月有记录。搬家时间取旧住处最后一次拍照到新住处第一次拍照之间。'+
    '同一天、同一城市的照片算一次；间隔超过 7 天，或中间去了别的城市，就另算一段。日期均为虚构演示数据。</p></details>';
}

export function visitMarkup(city) {
  return '<ol class="visit-list">'+city.visits.map((visit,index)=>{
    const earlier=city.visits[index+1];
    const gap=earlier ? "，距上次 "+interval(dayGap(earlier.end,visit.start)) : "";
    return '<li>'+mapButton("visit-range",visit.start+"/"+visit.end+"/"+city.id,span(visit.start,visit.end),"quiet")+
      '<small>'+new Set(visit.items.map(day)).size+' 个拍摄日'+gap+'</small></li>';
  }).join("")+'</ol>';
}

export function annualExport(stats,selectedYear) {
  const year=stats.years.find((item)=>item.year===selectedYear)||stats.years[0];
  if (!year) return "";
  return '<h2>'+year.year+' 足迹回顾</h2>'+yearStory(year,stats.cities)+
    '<h2>推断的常住阶段</h2><ul>'+stats.homePhases.map((phase)=>'<li>'+esc(stats.cities[phase.city].name)+
      '，'+span(phase.start,phase.end)+'，'+phase.months+' 个支持月份</li>').join("")+'</ul>'+
    (stats.moves.length ? '<h2>可能的搬家时间</h2><ul>'+stats.moves.map(({from,to})=>
      '<li>'+esc(stats.cities[from.city].name+' → '+stats.cities[to.city].name)+'，'+span(from.end,to.start)+'</li>').join("")+'</ul>' : "")+
    '<p>常住和搬家时间根据虚构记录的日期分布推断。</p>';
}
