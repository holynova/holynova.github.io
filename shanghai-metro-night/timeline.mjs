import {dateShift} from './schedule.mjs';
export function effectiveDate(date,minute){return dateShift(date,Math.floor(minute/1440));}
// Changing the viewport must not change the selected calendar instant across midnight.
export function changeRange(date,minute,night){
 const actual=effectiveDate(date,minute),clock=minute%1440;
 if(!night)return {date:actual,minute:clock};
 if(clock<=120)return {date:dateShift(actual,-1),minute:clock+1440};
 return {date:actual,minute:Math.max(1260,clock)};
}
