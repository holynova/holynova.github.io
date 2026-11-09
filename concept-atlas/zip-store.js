// A small, dependency-free ZIP STORE writer. PNG files are already compressed.
const encoder = new TextEncoder();
const table = Uint32Array.from({length:256},(_,n)=>{
  let crc=n;for(let bit=0;bit<8;bit++)crc=(crc&1)?0xedb88320^(crc>>>1):crc>>>1;return crc>>>0;
});
const crc32=bytes=>{let crc=0xffffffff;for(const byte of bytes)crc=table[(crc^byte)&255]^(crc>>>8);return(crc^0xffffffff)>>>0;};
function header(length){const bytes=new Uint8Array(length);return {bytes,view:new DataView(bytes.buffer)};}
export function makeZip(files){
  const content=[], directory=[];let offset=0,directorySize=0;
  for(const file of files){
    const name=encoder.encode(file.name), bytes=file.bytes, checksum=crc32(bytes);
    const local=header(30);let v=local.view;
    v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);
    v.setUint32(14,checksum,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,name.length,true);
    const central=header(46);v=central.view;
    v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint16(14,33,true);
    v.setUint32(16,checksum,true);v.setUint32(20,bytes.length,true);v.setUint32(24,bytes.length,true);v.setUint16(28,name.length,true);v.setUint32(42,offset,true);
    content.push(local.bytes,name,bytes);directory.push(central.bytes,name);directorySize+=46+name.length;offset+=30+name.length+bytes.length;
  }
  const end=header(22);let v=end.view;v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,directorySize,true);v.setUint32(16,offset,true);
  return new Blob([...content,...directory,end.bytes],{type:'application/zip'});
}
