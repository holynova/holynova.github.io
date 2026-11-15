import {day,dayGap,group,journeys} from "./model.js";

const countryCodes = {CN:"CHN",HK:"HKG",MO:"MAC",TW:"TWN",IS:"ISL",FI:"FIN",NZ:"NZL"};
export const commonCountryNames = {CHN:"中国",KOR:"韩国",HKG:"中国香港",MAC:"中国澳门",TWN:"中国台湾"};
export const numbers = value => Number(value).toLocaleString("zh-CN");
const mapStatus = place => place.level==="city" ? (place.precision==="manual" ? "手动打卡" : place.precision==="nearby" ? "附近城市" : "城市边界") : "地区级记录";
const countryOf = place => place.id?.startsWith("country-") ? place.id.slice(8) : countryCodes[place.country] || place.country;
const city = place => place.level==="city";
const chronological = keys => [...keys].sort();
const datedYear = value => value.slice(0,4);

export function makeFootprint(index) {
  const days = new Map();
  for (const photo of index.photos) {
    if (!photo.city || !Object.hasOwn(index.cities,photo.city)) continue;
    const stamp = day(photo);
    if (!days.has(photo.city)) days.set(photo.city,{dates:new Set(),undated:false});
    const record = days.get(photo.city);
    if (stamp) record.dates.add(stamp);
    else record.undated = true;
  }
  const places = [...days].map(([id,record])=>{
    const place = index.cities[id];
    const {name,level,domestic,precision,lat,lon,province} = place;
    return {id,name,level,domestic,precision,lat,lon,province,country:countryOf(place),
      dates:chronological(record.dates),undated:record.undated};
  }).filter(place=>Number.isFinite(place.lat) && Number.isFinite(place.lon));
  const placed = new Set(places.map(place=>place.id));
  const visits = journeys(index.photos,[]).filter(visit=>placed.has(visit.city)).map(visit=>({
    id:visit.city, dates:chronological(new Set(visit.items.map(day))),
  }));
  const regions = (index.regions || []).filter(region=>placed.has(region.id)).map(({id,polygons,bounds,domestic})=>
    ({id,polygons,bounds,domestic}));
  const sampleRoles=index.kind==="demo" ? index.sampleRoles : undefined;
  return {version:1,kind:index.kind,libraryKey:index.libraryKey || index.id,places,visits,regions,sampleRoles};
}

export function scopeFootprint(data, year, geography, countryFilter = "", only) {
  const available = data.places.filter(place=>geography==="all" ||
    (geography==="domestic" ? place.domestic : !place.domestic));
  const inYear = date => year==="all" || datedYear(date)===year;
  const options = available.filter(place=>place.dates.some(inYear) || year==="all" && place.undated);
  const places = options.filter(place=>(!countryFilter || place.country===countryFilter) && (!only || only.has(place.id))).map(place=>{
    const dates = place.dates.filter(inYear);
    return {...place,dates,first:dates[0],last:dates.at(-1),days:dates.length,status:mapStatus(place)};
  });
  const ids = new Set(places.map(place=>place.id));
  const countries = [...group(places,place=>place.country)].map(([code,items])=>{
    const days = new Set(items.flatMap(item=>item.dates));
    return {code,places:items,cities:items.filter(city).length,days:days.size};
  }).sort((a,b)=>b.days-a.days || b.cities-a.cities || a.code.localeCompare(b.code));
  const dates = chronological(new Set(places.flatMap(place=>place.dates)));
  const first = dates[0], last = dates.at(-1);
  const visits = data.visits.filter(visit=>ids.has(visit.id)).flatMap(record=>{
    const dates = record.dates.filter(inYear);
    return dates.length ? [{id:record.id,dates,origin:record.dates[0],first:dates[0],last:dates.at(-1),days:dates.length}] : [];
  });
  const cities = places.filter(city).sort((a,b)=>b.days-a.days || a.name.localeCompare(b.name,"zh-CN"));
  return {year,geography,options,places,cities,countries,dates,first,last,visits,activeDays:dates.length,
    span:first ? dayGap(first,last)+1 : null};
}

export function showSpan(span) {
  if (span===null) return "—";
  return span>=730 ? (span/365.2425).toFixed(1)+" 年" : numbers(span)+" 天";
}

export function cardMetrics(state) {
  return [["城市",numbers(state.cities.length)],["国家／地区",numbers(state.countries.length)],
    ["有地点记录的天数",numbers(state.activeDays)],["首尾记录跨度",showSpan(state.span)]];
}

export function footprintYears(data) {
  return chronological(new Set(data.places.flatMap(place=>place.dates.map(datedYear)))).reverse();
}

export function footprintDiscoveries(data, state) {
  if (!state.first) return [];
  const {cities,first,last,year,dates} = state;
  const byCity = new Map(data.places.map(place=>[place.id,place]));
  const results = [];
  const add = (title,note,place) => results.push({title,note,id:place?.id});
  const dormant = cities.filter(place=>place.days>=2 && dayGap(place.last,last)>=60).slice().sort((a,b)=>a.last.localeCompare(b.last))[0];
  if (dormant) add(numbers(dayGap(dormant.last,last))+" 天没有再拍到"+dormant.name,
    dormant.last+" → "+last+" · 以当前报告最后一个地点记录日为参照",dormant);

  const newCities = cities.filter(place=>place.first && (year==="all" || datedYear(byCity.get(place.id).dates[0])===year));
  if (newCities.length) add(numbers(newCities.length)+" 座城市出现在足迹里",
    year==="all"?"从每座城的首条记录算起":"这些城市的首条记录落在 "+year+" 年");

  const uniqueCityDays = new Map();
  for (const place of cities) for (const date of place.dates) uniqueCityDays.set(date,(uniqueCityDays.get(date) || 0)+1);
  const [date,count] = [...uniqueCityDays].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))[0] || [];
  if (count>1) add("同一天，记录了 "+numbers(count)+" 座城市",date+" · 城市数最多的一天");
  if (state.countries.length>1) {
    const sorted = state.countries.slice().sort((a,b)=>b.days-a.days);
    add(numbers(sorted[0].days)+" 个地点记录日落在同一个国家或地区",
      "各国家／地区按独立日期统计，跨境同一天可分别计入");
  }

  let current = [], streak = [];
  for (const date of dates) {
    if (current.length && dayGap(current.at(-1),date)!==1) current = [];
    current.push(date);
    if (current.length>streak.length) streak = current.slice();
  }
  if (streak.length>1) add("连续 "+numbers(streak.length)+" 天有地点记录",streak[0]+" → "+streak.at(-1));
  return results;
}
