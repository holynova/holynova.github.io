const shapes = {
  bookmark: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  home: '<path d="m3 10 9-7 9 7v10h-6v-6H9v6H3z"/>',
  lock: '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  cross: '<path d="m6 6 12 12M18 6 6 18"/>',
  chat: '<path d="M20 11a8 8 0 1 0-6 7.75l5 1.25-1-4A8 8 0 0 0 20 11Z"/>',
  repeat: '<path d="M5 8h14m-4-4 4 4-4 4m4 4H5m4-4-4 4 4 4"/>',
  heart: '<path d="M20.8 8.6c0 3.5-4.2 6.2-8.8 10.8-4.6-4.6-8.8-7.3-8.8-10.8a4.5 4.5 0 0 1 8.8-1.3 4.5 4.5 0 0 1 8.8 1.3Z"/>',
  bars: '<path d="M6 19V9m6 10V4m6 15v-6"/>',
  open: '<path d="M13 5h6v6m0-6-9 9m8-1v6H5V6h6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M5 15v5h14v-5"/>',
  book: '<path d="M12 6c-3-2-7-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-2-1-6-1-9 1zm0 0v13"/>',
  queue: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1m-1 6h1m-1 6h1"/>',
  down: '<path d="m6 9 6 6 6-6"/>'
};
function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + shapes[name] + '</svg>';
}
const bookmarks = [
  ['type','Yuki Chen','yukiform','Y','#e2ede9','#34594f','4月8日','让文字先决定页面的布局','做长文页时，我习惯先把真实内容放进去，调到舒服的行宽和行距，再考虑侧栏和图片。','很多时候，版面里最难解决的是一整段文字如何安稳地占据屏幕。先看手机，再看桌面，把容易读断的段落找出来，版式自然会长成内容需要的样子。'],
  ['photo','Mina Luo','minapapers','M','#f3e1d9','#80452d','4月23日','如何用一组照片讲好一个地方','到陌生城市时，我会先拍一张建立方位的远景，再拍一个人和一件小物。','远景交代我在哪，小物说出这个地方被怎样使用。那张拍人的照片通常留到最后选，因为故事往往是在整理素材时才变清楚的。'],
  ['note','顾舟','gu_notes','顾','#e8e5f5','#4e4084','5月2日','把笔记写给三个月后的自己','在笔记末尾加一句「当时为什么在乎它」。第二次打开时，这句比标题更能帮我回到原来的问题。','如果你只有十秒，写下那天正在解决的事。把它和当天摘下的一段话放在一起，比给一篇笔记补十个标签更容易找回语境。'],
  ['motion','Ethan Wu','quietpixels','E','#e4e9f7','#36547e','5月10日','动效应该保留空间记忆','弹层从触发位置展开，关闭时回到同一个位置。用户往往只看那一小块屏幕。','当内容更新过快时，可以只替换变化的数字。前后位置稳定，长列表里也不会突然失去焦点。'],
  ['places','林南','linnan walks'.replace(' ',''),'林','#f6e9d3','#805e24','6月1日','周末的散步地图','如果想重新熟悉一条街，试试只记录可以停下来坐的地方。','长椅便利店和树下的台阶会把一条街的节奏分成几段。黄昏再走一次，你会发现还有一张不同的地图。'],
  ['draft','Ami Park','amipark','A','#f6e5ec','#803857','6月18日','给写作留一个能进去的开头','写到最好继续的那一句就停下来，把下一个问题留给明天。','我常在离开前写三个有用的动词。第二天只要从其中一个动词开头，就能继续想下去。'],
  ['quiet','Yao Wen','yaowen','Y','#e3eef5','#38657b','7月6日','让工具的默认状态安静一点','空状态的首要任务是让人知道接下来可以做什么。','如果一个默认面板需要大段解释，先拿真实数据摆进去，再决定该保留哪行文案。'],
  ['scan','周庭','tingstudio','周','#e4eee0','#38672d','7月29日','读长文时怎么留下记忆','读完一段先合上网页，写一句你还记得的话，再回去核对。','我保留的摘录越来越少了。能留住的是我读完之后想做的一个小实验。'],
  ['print','Sora Jin','paperloop','S','#f0e8d9','#7a5931','8月4日','一张纸上的小型策展','选六张打印在一起的照片，比在电脑里精修一张要难。','在纸面上，四周留白和观看的顺序会产生很大的影响。不要急着把每一格填满。'],
  ['commute','Jo Lee','jo_between','J','#e8e8fa','#4e4f85','8月19日','在通勤路上做观察练习','走同一条路线五天，每天只记下一种颜色出现在哪儿。','路线越来越熟悉之后，注意力就能腾出来。以前没看见的门牌、阳台和窗帘会慢慢浮出来。'],
  ['things','Ada He','adahe','A','#f5e7e2','#864b40','9月3日','衡量一个小工具是否值得做','先把最常重复的那一步去掉，看看一天结束时是否还能清楚地感觉到差别。','如果这一步本身带着值得保留的仪式感，就把工具放在前一步，先清空进入状态的杂事。'],
  ['light','田心','tianfound','田','#e6eef3','#42677d','9月8日','从光线分辨一个空间','逛建筑时试试观察光在哪一面墙先出现，再找它的来源。','同一个开口的视线和采光可以是两件事。侧着走几步，才能看清室内的光到底来自哪里。']
].map(([id, name, handle, initials, bg, fg, date, title, excerpt, body]) => ({ id, name, handle, initials, bg, fg, date, title, excerpt, body }));
const posts = [
  { name:'Ken Liu', handle:'kenmakes', date:'2小时前', initials:'K', bg:'#e1eee7', fg:'#306248', excerpt:'把今天的改动拆成三次小发布。每次上线就给自己留一条使用笔记，回头看比读提交记录真实多了。', counts:['8','12','96','4,020'] },
  { name:'Momo', handle:'momowrites', date:'3小时前', initials:'墨', bg:'#f5e7e1', fg:'#8c4f3e', excerpt:'逛旧书店时看到一本 1994 年的城市地图。每条支路旁都印着公交站，仿佛在翻另一个城市的公共记忆。', counts:['4','6','61','2,420'] },
  { name:'Alan Xu', handle:'alanframes', date:'5小时前', initials:'A', bg:'#e4eaf8', fg:'#3f5592', excerpt:'工具的快捷键用得少，通常只是因为发现得太晚。我现在试着在按钮旁显示按键，用几次就记住了。', counts:['11','19','142','8,115'] },
  { name:'李沐西', handle:'muxi', date:'6小时前', initials:'李', bg:'#f1e7f5', fg:'#713f83', excerpt:'今天的散步路线绕了点路。雨后那条开了很多年的窄巷，墙上的裂纹居然被画成了一棵树。', counts:['3','10','73','3,321'] },
  { name:'Jo Lee', handle:'jo_between', date:'8小时前', initials:'J', bg:'#e8e8fa', fg:'#4e4f85', excerpt:'翻出第一份作品集，最有意思的是被砍掉的草稿。过几年再看，会记起当时试图解决的问题。', counts:['4','14','118','5,402'] }
];
const byId = new Map(bookmarks.map(post => [post.id, post]));
const sourceIds = ['light','things','scan','quiet','commute','print','draft','type'];
const stage = document.getElementById('stage');
const state = {
  route: 'home', tab: 'for-you', popup: true, top: true, inline: true, gap: 3,
  cards: ['type', 'photo'], imported: new Set(bookmarks.slice(0, 8).map(post => post.id)),
  done: new Set(), skipped: [], expanded: new Set(),
  loaded: 4, importing: false, status: '', toast: null
};

function avatar(post) {
  return '<span class="avatar" aria-hidden="true" style="--avatar:' + post.bg + ';--avatar-fg:' + post.fg + '">' + post.initials + '</span>';
}
function byline(post) {
  return '<div class="byline"><strong>' + post.name + '</strong><span>@' + post.handle + '</span><span>· ' + post.date + '</span></div>';
}
function textButton(label, action, value, symbol, muted = false) {
  return '<button class="action' + (muted ? ' muted' : '') + '" data-action="' + action + '" data-value="' + value + '">' + (symbol ? icon(symbol) : '') + label + '</button>';
}
function normalPost(post, saved = false) {
  const footer = saved
    ? textButton('查看帖子', 'detail', post.id, 'open')
    : '<div class="signals" aria-label="帖子的互动次数">' + ['chat','repeat','heart','bars'].map((glyph, i) => '<span>' + icon(glyph) + post.counts[i] + '</span>').join('') + '</div>';
  return '<article class="post">' + avatar(post) + '<div>' + byline(post) +
    '<p>' + (saved ? '<strong>' + post.title + '</strong>　' : '') + post.excerpt + '</p>' + footer + '</div></article>';
}
function bookmarkCard(slot) {
  const post = byId.get(state.cards[slot]);
  if (!post) return '';
  const expanded = state.expanded.has(slot);
  const where = slot === 0 ? 'top' : 'inline';
  const itemText = post.excerpt + (expanded ? '<br><br>' + post.body : '');
  const actions = textButton(expanded ? '收起' : '展开', 'expand', slot, 'down', true)
    + textButton('原帖', 'detail', post.id, 'open')
    + textButton('换一条', 'next', slot, 'repeat', true)
    + textButton('标为已读', 'read', slot, 'check');
  return '<article class="native ' + where + '" data-slot="' + where + '"><div class="origin">' +
    icon('bookmark') + '来自你的书签</div><div class="body-grid">' + avatar(post) + '<div>' +
    byline(post) + '<p>' + itemText + '</p><div class="actions">' + actions + '</div></div></div></article>';
}
function timeline() {
  if (state.route === 'bookmarks') {
    const loaded = sourceIds.slice(0, state.loaded).map(id => normalPost(byId.get(id), true)).join('');
    const end = state.loaded < sourceIds.length
      ? '<button data-action="load-more">继续加载书签</button>'
      : '本次演示的书签已全部加载';
    return '<header class="page-title"><h2>书签</h2><p>已加载 ' + state.loaded + ' 条帖子 · 可以继续加载，再导入</p></header>' + loaded + '<div class="bookmark-end">' + end + '</div>';
  }
  const content = state.tab === 'for-you' ? posts : [posts[2],posts[4]];
  const tabs = '<div class="tabs" role="tablist" aria-label="时间线"><button data-action="tab" data-value="for-you" aria-selected="' + (state.tab === 'for-you') + '" role="tab">推荐</button><button data-action="tab" data-value="following" aria-selected="' + (state.tab === 'following') + '" role="tab">正在关注</button></div>';
  const top = state.tab === 'for-you' && state.top ? bookmarkCard(0) : '';
  const inline = state.tab === 'for-you' && state.inline ? bookmarkCard(1) : '';
  return tabs + top + content.map((post,i) => normalPost(post) + (i + 1 === state.gap ? inline : '')).join('');
}
function gapField(state) {
  return '<label class="setting">插入到<select class="select" data-setting="gap"' + (!state.inline ? ' disabled' : '') + '>' +
    [2,3,5].map(value => '<option value="' + value + '"' + (state.gap === value ? ' selected' : '') + '>第 ' + value + ' 条之后</option>').join('') + '</select></label>';
}
function switches(state) {
  return '<section class="switches"><h3>展示位置</h3>' + [['top','首页顶部'],['inline','时间线中']].map(([key,label]) =>
    '<label class="setting">' + label + '<input class="switch" type="checkbox" role="switch" data-setting="' + key + '"' + (state[key] ? ' checked' : '') + '></label>').join('') +
    gapField(state) + '</section>';
}
function importBox(state) {
  const onBookmarks = state.route === 'bookmarks';
  const fresh = sourceIds.slice(0,state.loaded).filter(id => !state.imported.has(id)).length;
  const action = onBookmarks ? 'import' : 'navigate';
  const buttonLabel = state.importing ? '正在导入…' : onBookmarks ? '导入已加载书签' : '打开 X 书签页';
  const copy = onBookmarks ? '页面已加载 ' + state.loaded + ' 条，本次可新增 ' + fresh + ' 条。' : '打开 X 书签页后，可导入页面已加载的帖子。';
  return '<section class="import-box"><h3>从 X 书签导入</h3><p>' + copy + '</p><button class="primary" data-action="' + action +
    '" data-value="bookmarks"' + (state.importing ? ' disabled' : '') + '>' + icon(onBookmarks ? 'download' : 'arrow') + buttonLabel + '</button></section>';
}
function popup() {
  const unread = state.imported.size - state.done.size;
  const status = state.status ? '<span class="line-status" aria-live="polite">' + state.status + '</span>' : '';
  return '<header class="popup-head"><span class="brand-icon">' + icon('bookmark') +
    '</span><div><h2>X 书签回看</h2><p>在推荐时间线重看旧书签</p></div><button class="close" data-action="popup" aria-label="关闭插件弹窗">' +
    icon('cross') + '</button></header><div class="popup-content"><p class="read-summary">已导入 ' +
    state.imported.size + ' 条 · ' + unread + ' 条待读</p>' + importBox(state) + status + switches(state) +
    '</div><footer class="popup-footer">' + icon('lock') + '书签保存在本机 · 已读只影响回看</footer>';
}

function render() {
  stage.querySelector('#address span').textContent = state.route === 'home' ? 'x.com/home' : 'x.com/i/bookmarks';
  stage.querySelectorAll('.side a').forEach(link => {
    if (link.dataset.value === state.route) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  stage.querySelector('#timeline').innerHTML = timeline();
  const panel = stage.querySelector('#popup');
  panel.hidden = !state.popup;
  panel.innerHTML = popup();
  stage.querySelector('.toolbutton').setAttribute('aria-expanded', state.popup);
  const toast = stage.querySelector('#toast');
  toast.hidden = !state.toast;
  toast.innerHTML = state.toast
    ? '<span>' + state.toast.text + '</span>' + (state.toast.undo ? '<button data-action="undo">撤销</button>' : '')
    : '';
}
function pick(state,slot,previous) {
  const other = state.cards[1-slot];
  const eligible = [...state.imported].filter(id => !state.done.has(id) && id !== other && id !== previous);
  return eligible.find(id => !state.skipped.includes(id)) || eligible[0] ||
    (previous && !state.done.has(previous) ? previous : null);
}
function toast(state,text,undo) {
  const notice = { text, undo };
  state.toast = notice;
  setTimeout(() => {
    if (state.toast !== notice) return;
    state.toast = null;
    const element = stage.querySelector('#toast');
    if (element) element.hidden = true;
  },6000);
}
function showDetail(id) {
  const post = byId.get(id);
  if (!post) return;
  const dialog = stage.querySelector('#detail');
  dialog.innerHTML = '<header class="detail-head"><span id="detail-label">原帖预览 · 演示数据</span><form method="dialog"><button class="close" aria-label="关闭原帖预览">' +
    icon('cross') + '</button></form></header><div class="detail-body">' + byline(post) +
    '<h2>' + post.title + '</h2><p>' + post.excerpt + '<br><br>' + post.body + '</p></div>';
  dialog.showModal();
}
function importLoaded() {
  if (state.importing || state.route !== 'bookmarks') return;
  const batch = sourceIds.slice(0,state.loaded);
  state.importing = true;
  state.status = '';
  render();
  setTimeout(() => {
    const added = batch.filter(id => !state.imported.has(id));
    added.forEach(id => state.imported.add(id));
    state.cards.forEach((id,slot) => { if (!id) state.cards[slot] = pick(state,slot,null); });
    state.importing = false;
    state.status = '新增 ' + added.length + ' 条 · 跳过 ' + (batch.length - added.length) + ' 条重复';
    toast(state,'导入完成，' + state.status);
    render();
  },380);
}
document.addEventListener('click',event => {
  const control = event.target.closest('#stage [data-action]');
  if (!control) return;
  event.preventDefault();
  const { action, value } = control.dataset;
  const slot = Number(value);
  switch (action) {
    case 'detail':
      showDetail(value);
      return;
    case 'navigate':
      state.route = value;
      if (control.matches('.primary')) state.popup = true;
      stage.querySelector('.window').scrollIntoView({block:'nearest'});
      break;
    case 'popup':
      state.popup = !state.popup;
      break;
    case 'tab':
      state.tab = value;
      break;
    case 'expand':
      if (state.expanded.has(slot)) state.expanded.delete(slot);
      else state.expanded.add(slot);
      break;
    case 'next': {
      const id = state.cards[slot];
      state.skipped.push(id);
      state.cards[slot] = pick(state,slot,id);
      state.expanded.delete(slot);
      break;
    }
    case 'read': {
      const id = state.cards[slot];
      state.done.add(id);
      state.cards[slot] = pick(state,slot,id);
      state.expanded.delete(slot);
      toast(state,'已标为已读',{ id, slot });
      break;
    }
    case 'undo': {
      const { id, slot: restoredSlot } = state.toast.undo;
      state.done.delete(id);
      state.cards[restoredSlot] = id;
      state.expanded.delete(restoredSlot);
      toast(state,'已撤销');
      break;
    }
    case 'load-more':
      state.loaded = sourceIds.length;
      break;
    case 'import':
      importLoaded();
      return;
  }
  render();
  if (action === 'popup') {
    const target = state.popup ? stage.querySelector('.popup .close') : stage.querySelector('.toolbutton');
    target.focus({preventScroll:true});
  } else if (action === 'read' && !state.cards[slot]) {
    stage.querySelector('#toast button')?.focus({preventScroll:true});
  } else if (action === 'navigate') {
    stage.querySelector('.side a[aria-current="page"]')?.focus({preventScroll:true});
  } else if (['tab','expand','next','read'].includes(action)) {
    stage.querySelector('[data-action="' + action + '"][data-value="' + value + '"]')?.focus({preventScroll:true});
  }
});
document.addEventListener('change',event => {
  const control = event.target.closest('#stage [data-setting]');
  if (!control) return;
  const key = control.dataset.setting;
  state[key] = key === 'gap' ? Number(control.value) : control.checked;
  render();
  stage.querySelector('[data-setting="' + key + '"]')?.focus({preventScroll:true});
});
render();
