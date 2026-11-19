import {boundaryPoints} from "./footprint-boundaries.js";
import {drawMap,dateLabel} from "./model.js";
import {cardMetrics,numbers} from "./footprint-model.js";

const width = 1080, height = 1350;
const paper = "#f4f4e8", ink = "#142f28", muted = "#4b6255";

export function cardRange(state) {
  return state.first ? dateLabel(state.first)+(state.first!==state.last?" — "+dateLabel(state.last):"") : "拍摄日期未知";
}

export function shareSummary(state,title,countryNames,showMap) {
  return [
    "我的城市足迹 · "+title,
    ...cardMetrics(state).map(([label,value])=>label+" "+value),
    showMap && state.countries.length ? state.countries.map(item=>countryNames(item.code)).join("、") : "",
    cardRange(state),
  ].filter(Boolean).join("\n");
}

export function worldBounds(state) {
  if (state.geography==="domestic") return [74,17,135,54];
  if (state.countries.length===1 && state.places.length) {
    const xs = state.places.map(p=>p.lon), ys = state.places.map(p=>p.lat);
    const left = Math.min(...xs), right = Math.max(...xs), bottom = Math.min(...ys), top = Math.max(...ys);
    if (right-left<=100) return [Math.max(-180,left-6),Math.max(-85,bottom-4),Math.min(180,right+6),Math.min(85,top+4)];
  }
  return [-180,-62,180,79];
}

export function highlightPlaces(state,countries) {
  const visited = new Set(state.countries.map(item=>"country-"+item.code));
  return [...state.places,...countries.filter(country=>visited.has(country.id))];
}

export function drawFootprintCard(canvas,state,world,regions,countries,{title,countryName,demo,showMap}) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = paper;
  ctx.fillRect(0,0,width,height);
  ctx.fillStyle = muted;
  ctx.font = "700 24px system-ui, sans-serif";
  ctx.fillText("PHOTO ATLAS",62,68);
  ctx.textAlign = "right";
  ctx.fillText(demo ? "示例足迹" : title,1017,68,500);
  ctx.textAlign = "left";
  ctx.fillStyle = ink;
  ctx.font = "750 100px system-ui, sans-serif";
  ctx.fillText("我的城市足迹",57,206,965);
  ctx.font = "32px system-ui, sans-serif";
  ctx.fillStyle = muted;
  ctx.fillText(cardRange(state),62,270);
  let start = 380;
  if (showMap && state.places.length) {
    const map = document.createElement("canvas");
    const mapRegions=boundaryPoints(state,regions);
    drawMap(map,world,mapRegions,{regions:mapRegions,design:"footprint",exported:true,
      camera:{bounds:worldBounds(state)},base:state.places,mode:"flat",labels:false});
    ctx.drawImage(map,61,317,958,428);
    start = 824;
  } else {
    ctx.fillStyle = ink;
    ctx.font = "740 38px system-ui, sans-serif";
    ctx.fillText(numbers(state.places.length)+" 个有地点记录的区域",62,344,958);
    start = 495;
  }
  cardMetrics(state).forEach(([label,value],index)=>{
    const x=62+(index%2)*490, y=start+Math.floor(index/2)*160;
    ctx.strokeStyle = "#bccbc0";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x,y-37); ctx.lineTo(x+452,y-37); ctx.stroke();
    ctx.fillStyle = ink;
    ctx.font = "740 64px system-ui, sans-serif";
    ctx.fillText(value,x,y+42,448);
    ctx.fillStyle = muted;
    ctx.font = "27px system-ui, sans-serif";
    ctx.fillText(label,x,y+86,448);
  });
  ctx.fillStyle = muted;
  if (showMap) {
    const list = state.countries.slice(0,8).map(item=>countryName(item.code)).join(" · ");
    const cities = state.cities.slice(0,8).map(place=>place.name).join(" · ");
    ctx.font = "25px system-ui, sans-serif";
    if (list) ctx.fillText(list+(state.countries.length>8?" 等":""),62,1187,956);
    if (cities) ctx.fillText(cities+(state.cities.length>8?" 等":""),62,1233,956);
  }
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText("按拍摄日期和手动打卡日期统计   ·   底图 Natural Earth",62,1291,956);
}
