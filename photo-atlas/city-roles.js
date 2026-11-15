import {dateLabel,dayGap,esc} from "./model.js";

export const roleNames = {hometown:"老家",work:"工作地",home:"安家 / 常住",travel:"旅行地",study:"求学地"};
const isDate = value => typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const date = value => isDate(value) ? value : "";
const knownRole = role => Object.hasOwn(roleNames,role);

export function readRoleTracks(key,fallback={}) {
  let stored;
  try { stored=JSON.parse(localStorage.getItem(key)); } catch {}
  const value = stored && typeof stored==="object" && !Array.isArray(stored) ? stored : fallback;
  return Object.fromEntries(Object.entries(value).filter(([,records])=>Array.isArray(records)).map(([id,records])=>[
    id,records.map(record=>typeof record==="string" ? {role:record,start:"",end:""} : record)
      .filter(record=>record && knownRole(record.role)).map(record=>({role:record.role,start:date(record.start),end:date(record.end)})),
  ]));
}

export function roleKeys(tracks,year="all") {
  return Object.fromEntries(Object.entries(tracks).map(([id,entries])=>[id,entries.filter(entry=>
    year==="all" || ((!entry.start || entry.start<=year+"-12-31") && (!entry.end || entry.end>=year+"-01-01"))
  ).map(entry=>entry.role)]));
}

export function roleEditFields(entries) {
  return '<div class="role-editor">'+Object.entries(roleNames).map(([id,label])=>{
    const entry=entries?.find(item=>item.role===id);
    return '<fieldset><legend><label><input type="checkbox" name="city-role" value="'+id+'"'+(entry?' checked':'')+'> '+label+'</label></legend>'+
      '<div class="role-dates"><label>开始日期<input name="'+id+'-start" type="date" value="'+esc(entry?.start||"")+'"></label>'+
      '<label>结束日期<input name="'+id+'-end" type="date" value="'+esc(entry?.end||"")+'"></label></div></fieldset>';
  }).join("")+'</div>';
}

export function extractRoleFields(root) {
  return [...root.querySelectorAll('input[name="city-role"]:checked')].map(({value:role})=>{
    const start = root.querySelector('[name="'+role+'-start"]').value;
    const end = root.querySelector('[name="'+role+'-end"]').value;
    if (start && end && start>end) throw new Error(roleNames[role]+"的结束日期早于开始日期。");
    return {role,start,end};
  });
}

export function roleTimeline(tracks,places,range) {
  const available=new Map(places.map(place=>[place.id,place]));
  const items=Object.entries(tracks).flatMap(([id,records])=>{
    const place=available.get(id);
    return place ? records.map(record=>({...record,id,name:place.name})) : [];
  }).filter(item=>(!item.end||!range.first||item.end>=range.first)&&(!item.start||!range.last||item.start<=range.last))
    .sort((a,b)=>(a.start||"9999").localeCompare(b.start||"9999")||a.name.localeCompare(b.name,"zh-CN"));
  if (!items.length) return "";
  const dates=[range.first,range.last,...items.flatMap(({start,end})=>[start,end])].filter(Boolean).sort();
  const first=dates[0],last=dates.at(-1);
  const span=Math.max(1,dayGap(first,last)||0);
  const position=value=>Math.max(0,Math.min(100,100*dayGap(first,value)/span));
  const axis=first ? '<div class="role-axis"><span>'+esc(dateLabel(first))+'</span><span>'+esc(dateLabel(last))+'</span></div>' : "";
  return axis+'<ol class="role-timeline">'+items.map(item=>{
    const start=item.start && position(item.start), end=item.end && position(item.end);
    const dated=item.start || item.end;
    const left=item.start ? Math.min(98,start) : 0;
    const width=Math.max(2,(item.end ? end : 100)-left);
    const label=item.start && item.end ? dateLabel(item.start)+" — "+dateLabel(item.end) :
      item.start ? "从 "+dateLabel(item.start)+" 起" : item.end ? "截至 "+dateLabel(item.end) : "日期未标注";
    return '<li><div class="role-caption"><strong>'+esc(item.name)+'</strong><span>'+roleNames[item.role]+'</span><small>'+esc(label)+'</small></div>'+
      '<div class="role-rail" aria-hidden="true">'+(dated?'<i class="'+(!item.start||!item.end?"open":"")+
      '" style="--role-left:'+left+'%;--role-width:'+width+'%"></i>':"")+'</div></li>';
  }).join("")+'</ol>';
}
