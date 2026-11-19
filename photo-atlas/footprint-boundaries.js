import {esc} from "./model.js";

export function boundaryFor(place,regions) {
  return regions.find(region=>region.id===place.id && region.polygons?.length) ||
    regions.find(region=>region.id==="country-"+place.country && region.polygons?.length);
}

export function boundaryPoints(state,regions) {
  const ids=new Set(state.places.map(place=>boundaryFor(place,regions)?.id).filter(Boolean));
  return regions.filter(region=>ids.has(region.id));
}

export function outline(place,regions,{decorative=false}={}) {
  const region=boundaryFor(place,regions);
  if (!region) return '<p class="boundary-missing">行政区边界待补充</p>';
  const d3=globalThis.d3;
  const geo={type:"MultiPolygon",coordinates:region.polygons.map(polygon=>polygon.map((ring,index)=>{
    const area=d3.geoArea({type:"Polygon",coordinates:[ring]});
    return (index===0 ? area>2*Math.PI : area<2*Math.PI) ? ring.slice().reverse() : ring;
  }))};
  const projection=d3.geoMercator().fitExtent([[18,18],[302,182]],geo);
  const label=place.name+(region.id===place.id?"行政区轮廓":" · 所属国家／地区轮廓");
  return '<svg class="city-outline" viewBox="0 0 320 200" '+(decorative?'aria-hidden="true"':'role="img" aria-label="'+esc(label)+'"')+
    '><path d="'+d3.geoPath(projection)(geo)+'"/></svg>'+
    (!decorative && region.id!==place.id?'<small class="boundary-note">所属国家／地区轮廓 · 市级边界待补充</small>':"");
}
