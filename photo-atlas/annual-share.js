export async function shareCanvas(canvas, {year,demo,photo,metrics}) {
  const ctx = canvas.getContext("2d");
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "#18372b";
  ctx.fillRect(0,0,width,height);
  if (photo) {
    const image = new Image();
    image.src = photo;
    await image.decode();
    const scale = Math.max(width/image.naturalWidth,700/image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0,0,width,700);
    ctx.clip();
    ctx.drawImage(image,(width-w)/2,(700-h)/2,w,h);
    ctx.restore();
    const overlay = ctx.createLinearGradient(0,240,0,710);
    overlay.addColorStop(0,"transparent");
    overlay.addColorStop(1,"#18372b");
    ctx.fillStyle = overlay;
    ctx.fillRect(0,240,width,470);
  }
  ctx.fillStyle = "#e4fa9f";
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.fillText("照片足迹  /  PHOTO ATLAS",72,756);
  ctx.fillStyle = "#f9f6e6";
  ctx.font = "700 103px system-ui, sans-serif";
  ctx.fillText(year === "unknown" ? "日期未知" : year,66,884);
  ctx.font = "700 52px system-ui, sans-serif";
  ctx.fillText("年度照片足迹",72,966);
  ctx.strokeStyle = "#6c8c76";
  ctx.beginPath();
  ctx.moveTo(72,1027);
  ctx.lineTo(1008,1027);
  ctx.stroke();
  metrics.slice(0,3).forEach(([label,value],index) => {
    const position = 72 + index*325;
    ctx.fillStyle = "#f9f6e6";
    ctx.font = "700 54px system-ui, sans-serif";
    ctx.fillText(String(value),position,1122,290);
    ctx.fillStyle = "#d0dfcc";
    ctx.font = "29px system-ui, sans-serif";
    ctx.fillText(label,position,1173,290);
  });
  if (demo) {
    ctx.fillStyle = "#d0dfcc";
    ctx.font = "25px system-ui, sans-serif";
    ctx.fillText("示例报告 · 虚构数据",72,1269);
  }
}
