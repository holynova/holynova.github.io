import {edges} from './network.mjs';
import {buildShowPlan} from './show-plan.mjs';
self.onmessage=({data})=>{try{self.postMessage({plan:buildShowPlan(data.date,edges)});}catch(error){self.postMessage({error:String(error.message||error)});}};
