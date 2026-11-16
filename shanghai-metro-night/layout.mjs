import data from './map-data.mjs';
export const {mapSize,positions,riverPath}=data;
export const labelPlacement=name=>data.labels[name];
export const routePoints=edge=>data.paths[`${edge.line}|${edge.from}|${edge.to}`];
export const cityBounds={left:positions['中山公园'][0]-150,top:positions['虹口足球场'][1]-90,right:positions['世纪大道'][0]+170,bottom:positions['西藏南路'][1]+190};
// Parallel directions follow the official bends; they never take a straight shortcut.
export function offsetRoute(points,distance=3.5){return points.map((p,i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;return [p[0]-dy/len*distance,p[1]+dx/len*distance];});}
export function routeMidpoint(points){let total=0;const lengths=points.slice(1).map((p,i)=>{const d=Math.hypot(p[0]-points[i][0],p[1]-points[i][1]);total+=d;return d;});let remaining=total/2;for(let i=0;i<lengths.length;i++){if(remaining<=lengths[i]){const a=points[i],b=points[i+1],len=lengths[i]||1,t=remaining/len;return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,ux:(b[0]-a[0])/len,uy:(b[1]-a[1])/len};}remaining-=lengths[i];}return {x:points[0][0],y:points[0][1],ux:1,uy:0};}
