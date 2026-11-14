const baseUrl = new URL('./', import.meta.url);
const assetUrl = (path) => new URL(path, baseUrl).href;
const $ = (selector) => document.querySelector(selector);
const gallery = $('#gallery');
const reader = $('#reader');
let concepts = [], filtered = [], category = '全部', current = null, imageRequest = 0, returnFocus = null, searchTimer;

function text(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}
const number = (item) => String(item.id).padStart(2, '0');
const thumbnail = (item) => assetUrl(`assets/thumbs/${number(item)}-${item.slug}.webp`);
const detail = (item) => assetUrl(`assets/detail/${number(item)}-${item.slug}.webp`);
const original = (item) => assetUrl(item.image);

function makeCard(item, index) {
  const card = text('article', 'concept-card', '');
  const posterButton = text('button', 'poster-button', '');
  posterButton.setAttribute('aria-label', `阅读${item.title}知识漫画`);
  const img = new Image();
  img.src = thumbnail(item); img.alt = `${item.title}：${item.hook}`;
  img.width = 600; img.height = 800; img.loading = index < 4 ? 'eager' : 'lazy'; img.decoding = 'async';
  if (index === 0) img.fetchPriority = 'high';
  img.addEventListener('error', () => {
    const failure = text('span', 'image-failure', `「${item.title}」海报加载失败，点击查看解释或重试原图。`);
    posterButton.append(failure);
  }, {once:true});
  posterButton.append(img);
  posterButton.addEventListener('click', () => navigate(item));
  const caption = text('div', 'card-caption', '');
  const title = text('h3', 'card-title', '');
  const titleButton = text('button', '', item.title);
  titleButton.addEventListener('click', () => navigate(item)); title.append(titleButton);
  caption.append(title);
  const bottom = text('div', 'card-bottom', '');
  const download = text('a', '', '下载'); download.href = original(item); download.download = `概念探险队-${number(item)}-${item.title}.png`;
  download.setAttribute('aria-label', `下载${item.title}PNG原图`);
  bottom.append(download); caption.append(bottom); card.append(posterButton, caption); return card;
}

function render() {
  const query = $('#search').value.trim().toLocaleLowerCase();
  filtered = concepts.filter(item => (category === '全部' || item.category === category) && [item.title,item.english,item.category,item.hook,item.summary,...(item.tags||[])].join(' ').toLocaleLowerCase().includes(query)).reverse();
  gallery.replaceChildren(...filtered.map(makeCard));
  $('#empty-state').hidden = filtered.length > 0;
  $('#results-count').textContent = query ? `找到 ${filtered.length} 个相关概念，全套 ${concepts.length} 张` : `${filtered.length} 个概念`;
  $('#random-button').disabled = !filtered.length;
}

function navigate(item) {
  const hash = `#concept=${number(item)}`;
  if (location.hash !== hash) history.pushState(null, '', hash);
  showReader(item);
}

async function showReader(item) {
  if (!reader.open) returnFocus = document.activeElement;
  current = item; const request = ++imageRequest;
  $('.reader-image-wrap').classList.remove('zoomed');
  $('#reader-index').textContent = `第 ${number(item)} 张 / 共 ${concepts.length} 张`;
  $('#reader-category').textContent = `${item.category}`;
  $('#reader-title').textContent = item.title; $('#reader-english').textContent = item.english;
  $('#reader-hook').textContent = item.hook; $('#reader-explanation').textContent = item.explanation;
  $('#reader-summary').textContent = item.summary; $('#reader-pitfall').textContent = item.pitfall;
  $('#reader-source').textContent = `参考来源：${item.sourceTitle} ↗`; $('#reader-source').href = item.sourceUrl;
  $('#download-poster').href = original(item); $('#download-poster').download = `概念探险队-${number(item)}-${item.title}.png`;
  $('#copy-status').textContent = ''; $('#copy-caption').textContent = '复制图文文案';
  $('#previous-concept').disabled = concepts.indexOf(item) === 0;
  $('#next-concept').disabled = concepts.indexOf(item) === concepts.length-1;
  const visible = $('#reader-image'); visible.src = thumbnail(item); visible.alt = `${item.title}完整知识漫画`;
  visible.onerror = () => { if (current === item) $('#image-status').textContent = '图片暂时未加载，可使用下载按钮查看原图。'; };
  $('#image-status').textContent = '正在加载高清图…';
  if (!reader.open) { reader.showModal(); document.body.classList.add('reader-open'); }
  reader.scrollTop = 0;
  const high = new Image();
  const loaded = new Promise((resolve,reject) => {high.onload=resolve; high.onerror=reject;});
  loaded.catch(()=>{});
  high.src = detail(item);
  try {
    if (typeof high.decode === 'function') await high.decode(); else await loaded;
    if (request !== imageRequest || current !== item || !reader.open) return;
    visible.src = high.src; $('#image-status').textContent = '高清图已就绪，点击图片可放大';
  } catch {
    if (request === imageRequest && reader.open) $('#image-status').textContent = '高清图暂未加载，仍可阅读预览或下载原图。';
  }
}

function closeReader() {
  ++imageRequest; current = null;
  reader.close(); document.body.classList.remove('reader-open');
  if (location.hash.startsWith('#concept=')) history.replaceState(null,'',`${location.pathname}${location.search}#collection`);
  if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
}

function followHash() {
  const match = location.hash.match(/^#concept=(\d{1,2})$/);
  if (match) { const item = concepts.find(item => Number(item.id) === Number(match[1])); if (item) showReader(item); }
  else if (reader.open) closeReader();
}

function buildFilters() {
  const categories = ['全部', ...new Set(concepts.map(item => item.category))];
  $('#filters').replaceChildren(...categories.map(value => {
    const button = text('button', 'filter', value);
    button.dataset.category = value;
    button.setAttribute('aria-pressed', String(value === category));
    if (value === category) button.classList.add('active');
    button.addEventListener('click', () => {
      category = value;
      $('#filters').querySelectorAll('.filter').forEach(other => {
        const active = other === button;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      render();
    });
    return button;
  }));
}
$('#search').addEventListener('input', () => {clearTimeout(searchTimer);searchTimer=setTimeout(render,130);});
$('#reset-search').addEventListener('click',()=>{$('#search').value='';document.querySelector('.filter[data-category="全部"]').click();});
$('#random-button').addEventListener('click',()=>{const list=filtered.length?filtered:concepts;if(list.length)navigate(list[Math.floor(Math.random()*list.length)]);});
$('#close-reader').addEventListener('click',closeReader);
reader.addEventListener('cancel',event=>{event.preventDefault();closeReader();});
reader.addEventListener('click',event=>{if(event.target===reader){const r=reader.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeReader();}});
function step(delta){if(!current)return;const next=concepts[concepts.indexOf(current)+delta];if(next)navigate(next);}
$('#previous-concept').addEventListener('click',()=>step(-1));$('#next-concept').addEventListener('click',()=>step(1));
reader.addEventListener('keydown',event=>{if(event.target.tagName==='INPUT'||event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}if(event.key==='ArrowRight'){event.preventDefault();step(1);}});
$('#reader-image').addEventListener('click',()=>$('.reader-image-wrap').classList.toggle('zoomed'));
$('#copy-caption').addEventListener('click',async()=>{
  if(!current)return;
  const item=current, caption=`一图搞懂｜${item.title}\n\n${item.hook}\n\n${item.explanation}\n\n记住这句：${item.summary}\n\n再多懂一点：${item.pitfall}\n\n#概念探险队 #一图搞懂 #知识漫画 #${item.category} #${item.title}`;
  try{await navigator.clipboard.writeText(caption);$('#copy-status').textContent='文案已复制，可以去发布图文了。';$('#copy-caption').textContent='已复制 ✓';}
  catch{const area=document.createElement('textarea');area.value=caption;area.style.cssText='width:100%;height:160px;font-size:13px';area.setAttribute('aria-label','可手动复制的图文文案');$('#copy-status').replaceChildren(area);area.focus();area.select();}
});
window.addEventListener('hashchange',followHash);
window.addEventListener('popstate',followHash);

let downloadController = null;
let closeProgressTimer;
document.querySelectorAll('[data-download-all]').forEach(button=>button.addEventListener('click',async()=>{
  if(downloadController || !concepts.length)return;
  clearTimeout(closeProgressTimer);
  const controller=new AbortController();downloadController=controller;
  const panel=$('#download-progress');panel.hidden=false;
  $('#download-heading').textContent='正在打包原图';
  // 原图总量 215 MB（2026-11-14 按仓库 dist/assets/posters/ 121 个文件实测合计），先让用户知道再开始下载。
  $('#download-status').textContent='整套 121 张原图约 215 MB，下载需要一些时间，请保持页面打开。';
  $('#download-meter').value=0;$('#download-meter').max=concepts.length;$('#cancel-download').textContent='取消';
  document.querySelectorAll('[data-download-all]').forEach(control=>control.disabled=true);
  try{
    const {makeZip}=await import('./zip-store.js');
    const files=new Array(concepts.length);let cursor=0,completed=0;
    async function worker(){
      while(cursor<concepts.length){
        if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
        const position=cursor++,item=concepts[position];
        const response=await fetch(original(item),{signal:controller.signal});
        if(!response.ok)throw new Error(`「${item.title}」下载失败，请重试。`);
        const bytes=new Uint8Array(await response.arrayBuffer());
        files[position]={name:`${number(item)}-${item.title}.png`,bytes};
        completed++;$('#download-meter').value=completed;$('#download-status').textContent=`原图已就绪 ${completed} / ${concepts.length}`;
      }
    }
    await Promise.all([worker(),worker()]);
    const captions=concepts.map(item=>`## ${number(item)} ${item.title}\n\n${item.hook}\n\n${item.explanation}\n\n记住这句：${item.summary}\n\n再多懂一点：${item.pitfall}\n\n来源：${item.sourceTitle}\n${item.sourceUrl}\n\n#概念探险队 #一图搞懂 #${item.category} #${item.title}`).join('\n\n---\n\n');
    files.push({name:'图文文案.md',bytes:new TextEncoder().encode(captions)});
    const blob=makeZip(files), url=URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;link.download=`概念探险队-${concepts.length}张知识漫画.zip`;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
    $('#download-heading').textContent='整套图鉴已打包';$('#download-status').textContent='ZIP 包含全部 PNG 和配套图文文案。';$('#cancel-download').textContent='关闭';
    closeProgressTimer=setTimeout(()=>{if(!downloadController)panel.hidden=true;},12000);
  }catch(error){
    controller.abort();$('#download-heading').textContent=error.name==='AbortError'?'下载已取消':'这次下载没有完成';
    $('#download-status').textContent=error.name==='AbortError'?'随时可以重新下载，也可逐张保存。':(error.message||'请检查网络后重试。');$('#cancel-download').textContent='关闭';
  }finally{
    downloadController=null;document.querySelectorAll('[data-download-all]').forEach(control=>control.disabled=false);
  }
}));
$('#cancel-download').addEventListener('click',()=>{if(downloadController)downloadController.abort();else $('#download-progress').hidden=true;});

try {
  const response = await fetch(assetUrl('concepts.json')); if(!response.ok)throw new Error(`HTTP ${response.status}`);
  concepts = (await response.json()).sort((a,b)=>Number(a.id)-Number(b.id)); buildFilters(); render(); followHash();
} catch(error) {
  $('#results-count').textContent='图鉴暂时没有打开，请刷新重试。';
  const retry=text('button','text-button','重新打开图鉴 ↻');retry.addEventListener('click',()=>location.reload());gallery.append(retry);
}
