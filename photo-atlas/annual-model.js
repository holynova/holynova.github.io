import {day,dayGap,group,inferResidences,journeys,month} from "./model.js";

const bySize = (a,b) => b[1].length-a[1].length || a[0].localeCompare(b[0]);
export const isCity = place => place?.level === "city";
export const calendarYear = photo => day(photo).slice(0,4);
export const placeLabel = place => place.name + (place.precision==="nearby" ? "附近" : "");
const byDate = (a,b) => (a.stamp || "").localeCompare(b.stamp || "");
const daysOf = items => [...new Set(items.map(day).filter(Boolean))].sort();

export function buildAtlas(index) {
  const cities = index.photos.filter(photo=>isCity(index.cities[photo.city]));
  const residences = [];
  for (const phase of inferResidences(cities)) {
    const previous = residences.at(-1);
    const gap = previous && dayGap(previous.end,phase.start);
    if (previous?.city===phase.city && gap>0 && gap<=62) {
      previous.end = phase.end;
      previous.months += phase.months;
      previous.days += phase.days;
    } else {
      residences.push({...phase});
    }
  }
  const moves = residences.flatMap((to,i)=>{
    const from = residences[i-1];
    return from && from.city!==to.city && from.end<to.start ? [{from,to}] : [];
  });
  const visits = journeys([...index.photos],[]);
  const cityVisits = journeys(cities,residences);
  const firstSeen = new Map();
  for (const photo of index.photos) {
    const date = day(photo);
    if (photo.city && date && (!firstSeen.has(photo.city) || date < firstSeen.get(photo.city))) firstSeen.set(photo.city,date);
  }
  return {residences,moves,visits,cityVisits,firstSeen,lastDate:daysOf(index.photos).at(-1)};
}

export function summarize(index, year, atlas = buildAtlas(index)) {
  const photos = year === "all" ? index.photos : index.photos.filter(photo => (calendarYear(photo) || "unknown") === year);
  const dates = group(photos,day);
  const orderedDays = [...dates.keys()].sort();
  const months = group(photos,month);
  const years = group(photos,calendarYear);
  const peak = [...dates].sort(bySize)[0];
  const peakMonth = [...months].sort(bySize)[0];
  const places = [...group(photos,photo=>photo.city)].filter(([id])=>index.cities[id]).sort(bySize)
    .map(([id,items])=>{
      const dates = daysOf(items);
      return {...index.cities[id],id,items,days:dates.length,first:dates[0],last:dates.at(-1)};
    });
  const newPlaces = places.filter(place=>atlas.firstSeen.get(place.id)?.startsWith(year));
  let current = [];
  let longest = [];
  for (const date of orderedDays) {
    if (current.length && dayGap(current.at(-1),date) !== 1) current = [];
    current.push(date);
    if (current.length>longest.length) longest = current.slice();
  }
  const inPeriod = record=>year==="all" || (record.start<=year+"-12-31" && record.end>=year+"-01-01");
  const residences = atlas.residences.filter(inPeriod);
  const moves = atlas.moves.filter(move=>inPeriod(move.to));
  const visits = atlas.visits.flatMap(visit=>{
    if (!inPeriod(visit)) return [];
    if (year==="all" || visit.start.startsWith(year) && visit.end.startsWith(year)) return [visit];
    const items = visit.items.filter(photo=>calendarYear(photo)===year).sort(byDate);
    return items.length ? [{...visit,start:day(items[0]),end:day(items.at(-1)),items}] : [];
  });
  const seen = new Map();
  const returns = [];
  for (const visit of atlas.cityVisits.slice().reverse()) {
    const before = seen.get(visit.city);
    if (inPeriod(visit) && before) {
      const days = dayGap(before.end,visit.start);
      if (days>0) returns.push({days,place:index.cities[visit.city],earlier:before,later:visit});
    }
    seen.set(visit.city,visit);
  }
  returns.sort((a,b)=>b.days-a.days);
  const spotlight = photos.filter(photo=>photo.thumb);
  const cover = spotlight.find(photo=>day(photo)===peak?.[0]) ||
    (year==="all" ? spotlight.find(photo=>photo.thumb==="yangshuo.webp") || spotlight.at(-1) : spotlight[0]);
  return {year,photos,dates,months,years,peak,peakMonth,places,newPlaces,visits,longest:longest.length,streak:longest,
    returns,residences,moves,spotlight,atlas,first:orderedDays[0],last:orderedDays.at(-1),cover};
}
