import {day,dayGap,dateLabel,group} from "./model.js";
import {isCity,placeLabel} from "./annual-model.js";

const number = value => value.toLocaleString("zh-CN");
const countDays = photos => new Set(photos.map(day).filter(Boolean)).size;
const range = (a,b) => dateLabel(a)+(a!==b?" — "+dateLabel(b):"");
const max = (items,score) => items.reduce((best,item)=>!best || score(item)>score(best) ? item : best,null);
const min = (items,score) => items.reduce((best,item)=>!best || score(item)<score(best) ? item : best,null);

export function discoveries(state,index,roles) {
  if (!state.first) return [];
  const {photos,places,returns,atlas,year,dates,visits,longest,streak,months,years,peak,residences} = state;
  const cities = places.filter(isCity);
  const region = id => placeLabel(index.cities[id]);
  const stories = [];
  const add = (title,detail,photos) => { if (photos.length) stories.push({title,detail,photos}); };
  const isTravel = item => !roles[item.place.id]?.some(role=>role==="home" || role==="work") &&
    !residences.some(phase=>phase.city===item.place.id);
  const away = returns.filter(isTravel);
  const reunion = away[0] || returns[0];
  function addReunion({place,days,earlier,later}) {
    add("时隔 "+number(days)+" 天，又见"+placeLabel(place),range(earlier.end,later.start)+" · 两次拍摄记录",
      [...earlier.items,...later.items]);
  }
  if (reunion) addReunion(reunion);

  const home = max(residences,phase=>dayGap(phase.start,phase.end));
  if (home) add(region(home.city)+"，照片里最久的常住线索",
    range(home.start,home.end)+" · "+home.days+" 个支持拍摄日 · 推断",atlas.visits
      .filter(visit=>visit.city===home.city).flatMap(visit=>visit.items.filter(photo=>day(photo)>=home.start && day(photo)<=home.end)));

  const dormant = min(cities.filter(city=>city.days>=2 && city.last && dayGap(city.last,state.last)>=60),city=>dayGap(state.first,city.last));
  if (dormant) add("已经 "+number(dayGap(dormant.last,state.last))+" 天没有拍到"+placeLabel(dormant),
    "从该城最后一张照片算到报告最后一个拍摄日 · "+range(dormant.last,state.last),dormant.items.filter(photo=>day(photo)===dormant.last));

  const homeTown = cities.find(city=>roles[city.id]?.includes("hometown"));
  const homeVisits = homeTown ? visits.filter(visit=>visit.city===homeTown.id) : [];
  if (homeVisits.length>1) add("老家"+placeLabel(homeTown)+"，照片里出现了 "+number(homeVisits.length)+" 次",
    "按有记录的到访段统计 · "+range(homeTown.first,homeTown.last),homeTown.items);
  if (homeTown) {
    const sameYear = away.find(visit=>visit!==reunion && visit.place.id===homeTown.id && visit.days>=21 &&
      visit.earlier.end.slice(0,4)===visit.later.start.slice(0,4));
    if (sameYear) addReunion(sameYear);
  }

  const most = max(cities,city=>city.days);
  if (most) add("有 "+number(most.days)+" 天，快门按在"+placeLabel(most),
    "拍摄日最多的城市 · "+number(most.items.length)+" 张",most.items);

  const nonHome = visits.filter(visit=>isCity(index.cities[visit.city]) &&
    !roles[visit.city]?.includes("home") &&
    !atlas.residences.some(phase=>phase.city===visit.city && phase.start<=visit.end && phase.end>=visit.start));
  const longestVisit = max(nonHome,visit=>countDays(visit.items));
  if (longestVisit && countDays(longestVisit.items)>1) {
    add("在"+region(longestVisit.city)+"的这次到访，留下 "+countDays(longestVisit.items)+" 个拍摄日",
      range(longestVisit.start,longestVisit.end)+" · 单段到访里拍摄日最多",longestVisit.items);
  }

  const repeat = [...group(nonHome,visit=>visit.city)].sort((a,b)=>b[1].length-a[1].length)[0];
  if (repeat?.[1].length>1 && repeat[0]!==homeTown?.id) add("回去最多次的地方，是"+region(repeat[0]),
    number(repeat[1].length)+" 段到访记录",repeat[1].flatMap(visit=>visit.items));
  const span = max(cities.filter(city=>city.first && city.last && dayGap(city.first,city.last)>30),city=>dayGap(city.first,city.last));
  if (span) add("在"+placeLabel(span)+"，第一张和最后一张隔了 "+number(dayGap(span.first,span.last))+" 天",
    range(span.first,span.last)+" · 照片覆盖跨度最长",span.items.filter(photo=>day(photo)===span.first || day(photo)===span.last));

  const firsts = year==="all" ? cities : state.newPlaces.filter(isCity);
  if (firsts.length) {
    const rows = firsts.flatMap(city=>city.items.filter(photo=>day(photo)===atlas.firstSeen.get(city.id)));
    add(year==="all" ? "这些城市第一次出现在相册里" : number(firsts.length)+" 座城市，今年第一次入镜",
      firsts.slice(0,4).map(placeLabel).join("、")+(firsts.length>4?"等":""),rows);
  }

  const earliest = dates.get(state.first);
  add(year==="all"?"照片库里最早的一天":"这一年的第一声快门",dateLabel(state.first)+" · "+number(earliest.length)+" 张",earliest);
  if (state.first!==state.last) add("最后一次按下快门",dateLabel(state.last)+" · "+number(dates.get(state.last).length)+" 张",dates.get(state.last));

  if (peak[1].length>1) add("最热闹的一天，拍了 "+number(peak[1].length)+" 张",dateLabel(peak[0])+" · 单日照片最多",peak[1]);
  if (longest>1) {
    const days = new Set(streak);
    add("连续 "+number(longest)+" 天，每天都有一张照片",range(streak[0],streak.at(-1)),photos.filter(photo=>days.has(day(photo))));
  }
  if (year==="all" && years.size>1) {
    const [key,items] = max([...years],([,items])=>items.length);
    add(key+" 年，留下最多照片",number(items.length)+" 张 · "+countDays(items)+" 个拍摄日",items);
  }
  if (months.size>1) {
    const [key,items] = max([...months],([,items])=>countDays(items));
    add(key.replace("-"," 年 ")+" 月，拍照最勤",number(countDays(items))+" 个拍摄日",items);
  }
  const multi = max([...dates],([,items])=>new Set(items.filter(p=>isCity(index.cities[p.city])).map(p=>p.city)).size);
  if (multi) {
    const destinations = [...new Set(multi[1].filter(p=>isCity(index.cities[p.city])).map(p=>p.city))];
    if (destinations.length>1) add("同一天，拍到了 "+destinations.length+" 座城市",
      dateLabel(multi[0])+" · "+destinations.slice(0,4).map(region).join("、"),multi[1]);
  }
  return stories;
}
