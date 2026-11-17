const English = new URLSearchParams(location.search).get('lang') === 'en';
const t = (zh, en) => English ? en : zh;
const repo = 'https://github.com/holynova/x-bookmark-recall';
const version = 'v0.3.0';
const title = t('X 书签回看', 'X Bookmark Recall');
const days = 86_400_000;
const icons = {
  bookmark: 'M6 4h12v16l-6-4-6 4z',
  home: 'm3 10 9-7 9 7v10h-6v-6H9v6H3z',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  next: 'M5 8h14m-4-4 4 4-4 4m4 4H5m4-4-4 4 4 4',
  open: 'M13 5h6v6m0-6-9 9m8-1v6H5V6h6',
  check: 'm5 12 4 4L19 6',
  close: 'M6 6l12 12m0-12L6 18'
};
const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + icons[name] + '"/></svg>';
const dateFormat = new Intl.DateTimeFormat(English ? 'en-US' : 'zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });

const catalog = [
  ['Mina Luo', 'minapapers', 'M', '在旧书店买到一本 1994 年的城市地图。每条支路旁都印了公交站，像是另一座城市的公共记忆。', 'I found a 1994 city map in a used bookstore. Every side street had a bus stop printed on it, like a record of another city’s public memory.'],
  ['Ken Liu', 'kenmakes', 'K', '把今天的改动拆成三次小发布。每次上线后留一句使用笔记，回头看很容易找回当时的问题。', 'I split today’s changes into three small releases. One note after each one made it easier to remember what I was solving.'],
  ['Yuki Chen', 'yukiform', 'Y', '做长文页时，我会先把真实内容放进去，调到舒服的行宽和行距，再考虑侧栏和图片。', 'When designing a long read, I start with the real text. Once the line length and spacing feel right, I think about the sidebar and images.'],
  ['June Park', 'betweenpages', 'J', '一条街道可以有很多种走法。今天只选有长椅的路，发现了一间以前从来没注意到的小店。', 'There are many ways to walk one street. Taking only routes with benches led me to a little shop I’d never noticed.'],
  ['Alan Xu', 'alanframes', 'A', '快捷键用得少，有时只是因为发现得太晚。我把键位直接放在操作按钮旁，用几次就记住了。', 'Shortcuts often go unused because people discover them too late. Putting the key next to the action made mine much easier to remember.'],
  ['Ada He', 'adahe', 'A', '对一个需要经常用的小工具，我只看一件事。它能不能让我少做那个最重复的步骤？', 'For a tool I use every day, I ask one question. Does it save me from the step I repeat the most?'],
  ['Jo Lee', 'jo_between', 'J', '翻出第一份作品集，我最喜欢的是没有入选的草稿。几年后才看懂那个时候自己在试什么。', 'The drafts that didn’t make my first portfolio turned out to be the most interesting. Years later I can see what I was trying.'],
  ['Sora Jin', 'paperloop', 'S', '在纸上排六张照片，比在电脑里精修一张更难。留白和顺序会改变整个故事。', 'Arranging six photos on paper is harder than editing one on a screen. White space and sequence can change the whole story.'],
  ['Nia Wen', 'niastudio', 'N', '每天在同一条通勤路上记录一种颜色。五天后，一些经过几十次的窗台和招牌终于变得具体。', 'I recorded one color on the same commute every day. Five days later, the familiar windowsills and signs were finally distinct.'],
  ['Ethan Wu', 'quietpixels', 'E', '把笔记写给三个月后的自己。在末尾留一句「我为什么在乎这件事」，再打开时会更容易找回语境。', 'Write notes for yourself three months from now. A sentence about why you cared makes the context much easier to recover later.']
];
const savedStories = [
  ['做长文页时，我会先把真实内容放进去，等行宽和行距舒服了，再考虑侧栏和图片。', 'When I lay out a long read, I start with the real text. The sidebar and images can wait until the line length feels right.',
    '我会把桌面和手机并排放着读一遍。读到费力的段落，就先调整正文的节奏。', 'I read it once on desktop and once on a phone. When a paragraph is hard to follow, I adjust the rhythm of the text first.'],
  ['同一条街我拍了三次。每次都站在原来的位置，换一个时间。', 'I photographed the same street three times, from the same spot at different times of day.',
    '后来排照片时，我留下了三张光线差别最大的。它们放在一起，比单张更能讲清那条街的一天。', 'I kept the three frames with the biggest changes in light. Together they said more about a day on that street than any one shot.'],
  ['每条笔记末尾留一句「我当时在找什么」。三个月后打开时，它往往比标题更有用。', 'I end each note with a sentence about what I was looking for. Three months later, that line is often more useful than the title.',
    '这也让我更容易扔掉用不到的摘录，留下能帮我接着做的事。', 'It also makes it easier to let go of clippings and keep the ones that help me pick up the work.'],
  ['重新翻第一份草稿时，我只想找一处值得继续的线索。', 'When I go back to a first draft, I look for one idea worth picking up again.',
    '有时是一句删掉的话，有时是一个还没解决的问题。把它单独写下来，下次就知道从哪开始。', 'Sometimes it is a line I cut. Other times it is a question I left open. Writing it down gives me somewhere to start next time.']
];
const colors = ['#dae9f7', '#e0ece3', '#eadff3', '#f8e3d7', '#e9e4d5'];
const makePost = (index, id) => {
  const [name, handle, mark, zh, en] = catalog[index % catalog.length];
  return { id, name, handle, mark, color: colors[index % colors.length], text: t(zh, en) };
};
const bookmarks = Array.from({ length: 18 }, (_, index) => {
  const [zh, en, moreZh, moreEn] = savedStories[index % savedStories.length];
  return {
    ...makePost(index + 2, 'b' + index),
    date: Date.now() - (40 + index * 62) * days,
    text: t(zh, en),
    extra: t(moreZh, moreEn)
  };
});
const byId = new Map(bookmarks.map(post => [post.id, post]));
const forYou = Array.from({ length: 46 }, (_, index) => makePost(index, 'f' + index));
const following = Array.from({ length: 46 }, (_, index) => makePost(index + 4, 'g' + index));
const state = {
  route: 'home', channel: 'for-you', placement: 'both', top: true, inline: true, interval: 3,
  popup: true, loaded: 4, limit: '', years: '', imported: new Set(bookmarks.slice(0, 10).map(post => post.id)),
  read: new Set(), skipped: new Set(), cards: ['b0', 'b1'],
  extra: { 'for-you': [], following: [] }, seen: new Set(), status: '', auto: null, manual: false, undo: null
};
const root = document.getElementById('app');
const notice = document.getElementById('notice');
let noticeTimer;

document.documentElement.lang = English ? 'en' : 'zh-CN';
document.title = title;
root.innerHTML = `
<header class="masthead">
  <div class="masthead-brand"><img src="./icon.png" width="42" height="42" alt=""><span>${title}</span></div>
  <nav aria-label="${t('项目链接', 'Project links')}">
    <a href="${repo}">GitHub</a>
    <a href="${repo}/releases/tag/${version}" class="download">${t('下载扩展', 'Get the extension')} ${icon('open')}</a>
    <a href="${English ? './' : '?lang=en'}" lang="${English ? 'zh-CN' : 'en'}">${English ? '简体中文' : 'English'}</a>
  </nav>
</header>
<div class="intro">
  <h1>${t('刷 X 时，重读旧收藏。', 'Revisit bookmarks as you scroll.')}</h1>
  <p>${t('试试自动导入、选择时间线，或往下刷几屏。这里使用演示书签。', 'Try auto-import, choose a feed, or scroll a few screens. This demo uses sample bookmarks.')}</p>
</div>
<section class="window" aria-label="${t('交互演示', 'Interactive demo')}">
  <div class="toolbar">
    <div class="traffic" aria-hidden="true"><i></i><i></i><i></i></div>
    <span id="address" class="address"></span>
    <button type="button" class="toolbutton" data-action="popup" aria-controls="popup">${icon('bookmark')}${t('扩展弹窗', 'Extension')}</button>
  </div>
  <div class="browser">
    <nav class="side" aria-label="${t('演示导航', 'Demo navigation')}">
      <span class="xlogo" aria-hidden="true">𝕏</span>
      <button data-action="navigate" data-value="home">${icon('home')}<span>${t('首页', 'Home')}</span></button>
      <button data-action="navigate" data-value="bookmarks">${icon('bookmark')}<span>${t('书签', 'Bookmarks')}</span></button>
    </nav>
    <section class="timeline" aria-label="${t('时间线', 'Timeline')}">
      <div id="feed-head"></div>
      <div id="posts" class="posts" tabindex="0" aria-label="${t('滚动浏览帖子', 'Scroll through posts')}"></div>
    </section>
    <aside id="popup" class="popup" aria-label="${t('扩展弹窗', 'Extension popup')}"></aside>
  </div>
</section>
<footer class="site-footer"><span>${version}</span> <a href="${repo}">${t('源码与安装说明', 'Source and installation')}</a></footer>`;
const scroller = document.getElementById('posts');
const popup = document.getElementById('popup');
const head = document.getElementById('feed-head');

function action(text, name, value, glyph) {
  return `<button type="button" class="action" data-action="${name}" data-value="${value}">${icon(glyph)}${text}</button>`;
}

function renderPost(post, mode, slot, index = 0) {
  const isRecall = mode === 'recall';
  const timestamp = post.date ? dateFormat.format(post.date) : t('刚刚', 'Now');
  const tail = isRecall ? `
    <div class="actions">
      ${action(t('原帖', 'Original'), 'detail', post.id, 'open')}
      ${action(t('换一条', 'Show another'), 'next', slot, 'next')}
      ${action(t('标为已读', 'Mark as read'), 'read', slot, 'check')}
    </div>` : '';
  return `<article class="post${isRecall ? ' recall' : ''}" ${isRecall ? 'data-slot="' + slot + '"' : 'data-native="' + index + '"'}>
    ${isRecall ? `<div class="origin">${icon('bookmark')}${t('来自你的书签', 'From your bookmarks')}</div>` : ''}
    <div class="post-body"><span class="avatar" style="--avatar:${post.color}" aria-hidden="true">${post.mark}</span>
      <div><div class="byline"><strong>${post.name}</strong><span>@${post.handle}</span><time>${timestamp}</time></div>
      <p>${post.text}</p>${isRecall ? '<p class="continuation">' + post.extra + '</p>' : ''}${tail}</div>
    </div></article>`;
}

function permitted() {
  return state.placement === 'both' || state.channel === state.placement;
}

function renderPosts() {
  const scroll = scroller.scrollTop;
  if (state.route === 'bookmarks') {
    head.innerHTML = `<h2 class="page-title">${t('书签', 'Bookmarks')}</h2>`;
    const shown = bookmarks.slice(0, state.loaded).map((post, i) => renderPost(post, 'saved', null, i));
    const end = state.loaded === bookmarks.length ? t('已到演示书签底部', 'End of the sample bookmarks')
      : t('向下滚动以加载更多', 'Scroll down to load more');
    scroller.innerHTML = shown.join('') + `<p class="end">${end}</p>`;
  } else {
    const tabs = [['for-you', t('为你推荐', 'For You')], ['following', t('正在关注', 'Following')]];
    head.innerHTML = '<div class="tabs" role="tablist" aria-label="' + t('频道', 'Feeds') + '">' +
      tabs.map(([key, label]) => `<button role="tab" data-action="tab" data-value="${key}" aria-selected="${key === state.channel}">${label}</button>`).join('') + '</div>';
    const source = state.channel === 'for-you' ? forYou : following;
    const base = (position, slot) => permitted() && state[position] && byId.has(state.cards[slot]) ?
      renderPost(byId.get(state.cards[slot]), 'recall', slot) : '';
    scroller.innerHTML = base('top', 0) + source.map((post, index) => {
      const extra = permitted() && state.inline && state.extra[state.channel].find(entry => entry.index === index + 1 && byId.has(state.cards[entry.slot]));
      return renderPost(post, 'feed', null, index + 1)
        + (index + 1 === state.interval ? base('inline', 1) : '')
        + (extra ? renderPost(byId.get(state.cards[extra.slot]), 'recall', extra.slot) : '');
    }).join('');
  }
  scroller.scrollTop = scroll;
}

function checkbox(key, label) {
  return `<label class="setting">${label}<input type="checkbox" class="switch" role="switch" data-setting="${key}" ${state[key] ? 'checked' : ''}></label>`;
}

function renderPopup() {
  const inBookmarks = state.route === 'bookmarks';
  const active = !!state.auto;
  const count = t(`已导入 ${state.imported.size} 条 · ${state.imported.size - state.read.size} 条待读`, `${state.imported.size} imported · ${state.imported.size - state.read.size} unread`);
  const selected = (value, expected) => value === expected ? 'selected' : '';
  popup.hidden = !state.popup;
  document.querySelector('.toolbutton').setAttribute('aria-expanded', state.popup);
  const selectedField = [['both', t('两个频道', 'Both feeds')], ['for-you', t('仅为你推荐', 'For You only')], ['following', t('仅正在关注', 'Following only')]];
  popup.innerHTML = `<div class="panel">
    <header class="popup-head"><img src="./icon.png" width="32" height="32" alt=""><div><h2>${title}</h2><p>${count}</p></div>
      <button class="icon-button" data-action="popup" aria-label="${t('关闭弹窗', 'Close popup')}">${icon('close')}</button></header>
    <section class="import-box"><h3>${t('从 X 书签导入', 'Import X bookmarks')}</h3>
      ${inBookmarks ? `<p>${t('从书签页顶部滚动。两个限制都可留空。', 'Scroll from the top of Bookmarks. Both limits are optional.')}</p>
      <form id="auto-form">
        <div class="limits"><label>${t('最多导入（条）', 'Maximum posts')}<input name="limit" type="number" min="1" step="1" placeholder="${t('不限', 'No limit')}" value="${state.limit}" ${active ? 'disabled' : ''}></label>
        <label>${t('发帖时间（近几年）', 'Published within (years)')}<input name="years" type="number" min="1" max="100" step="1" placeholder="${t('不限', 'No limit')}" value="${state.years}" ${active ? 'disabled' : ''}></label></div>
        <button class="primary" type="submit">${active ? t('停止自动导入', 'Stop auto-import') : t('自动滚动导入', 'Scroll and import')}</button>
      </form>
      <button class="secondary" data-action="import" ${active ? 'disabled' : ''}>${t('导入已加载书签', 'Import loaded bookmarks')}</button>
      <button class="secondary" data-action="manual" ${active ? 'disabled' : ''}>${state.manual ? t('停止连续导入', 'Stop collecting') : t('滚动时继续收集', 'Collect as I scroll')}</button>`
      : `<p>${t('去书签页自动滚动导入，也可以设置条数和发帖年限。', 'Open Bookmarks to import by scrolling, with optional post count and age limits.')}</p>
      <button class="primary" data-action="navigate" data-value="bookmarks">${t('打开 X 书签页', 'Open X Bookmarks')}${icon('arrow')}</button>`}
      <p id="import-status" class="import-status" role="status" ${state.status ? '' : 'hidden'}>${state.status}</p>
    </section>
    <section class="positions"><h3>${t('展示位置', 'Placement')}</h3>
      <label class="setting">${t('展示频道', 'Show in')}<select data-setting="placement">${selectedField.map(([key,label]) => `<option value="${key}" ${selected(state.placement,key)}>${label}</option>`).join('')}</select></label>
      ${checkbox('top', t('首页顶部', 'Top of feed'))}
      ${checkbox('inline', t('时间线中', 'In the timeline'))}
      <label class="setting">${t('首次插入', 'First inline card')}<select data-setting="interval" ${state.inline ? '' : 'disabled'}>
        ${[2,3,5].map(n => `<option value="${n}" ${selected(state.interval,n)}>${t(`第 ${n} 条之后`, `After ${n} posts`)}</option>`).join('')}
      </select></label>
    </section>
    <p class="panel-footer">${t('书签和已读状态保存在本机', 'Bookmarks and read status stay in your browser')}</p></div>`;
}

function render() {
  document.getElementById('address').textContent = state.route === 'home' ? 'x.com/home' : 'x.com/i/bookmarks';
  document.querySelectorAll('.side button').forEach(button => {
    if (button.dataset.value === state.route) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  renderPosts();
  renderPopup();
}

function choose() {
  return [...state.imported].find(id => !state.cards.includes(id) && !state.read.has(id) && !state.skipped.has(id));
}

function updateNotice(text, undo) {
  clearTimeout(noticeTimer);
  state.undo = undo;
  notice.replaceChildren(document.createTextNode(text));
  if (undo) {
    const button = document.createElement('button');
    button.textContent = t('撤销', 'Undo');
    button.dataset.action = 'undo';
    notice.append(button);
  }
  notice.hidden = false;
  noticeTimer = setTimeout(() => { notice.hidden = true; state.undo = null; }, 6000);
}

function showDetail(id) {
  const post = byId.get(id);
  if (!post) return;
  const dialog = document.getElementById('post-detail');
  dialog.innerHTML = `<div><header><strong id="detail-title">${t('原帖预览 · 演示', 'Original post · Demo')}</strong>
    <form method="dialog"><button class="icon-button" aria-label="${t('关闭', 'Close')}">${icon('close')}</button></form></header>
    <p>${post.text}</p><p>${post.extra}</p></div>`;
  dialog.showModal();
}

function report(prefix, added, duplicates) {
  state.status = prefix + t(` · 新增 ${added} 条 · 重复 ${duplicates} 条`, ` · ${added} new · ${duplicates} duplicates`);
}

function manualImport() {
  const loaded = bookmarks.slice(0, state.loaded);
  const added = loaded.filter(post => !state.imported.has(post.id));
  added.forEach(post => state.imported.add(post.id));
  report(t('已导入', 'Imported'), added.length, loaded.length - added.length);
  renderPopup();
}

function stopImport(reason) {
  const job = state.auto;
  if (!job) return;
  clearTimeout(job.timer);
  state.auto = null;
  report(reason, job.added, job.duplicates);
  renderPopup();
}

function stepImport(job) {
  if (state.auto !== job) return;
  for (const post of bookmarks.slice(job.cursor, job.cursor + 3)) {
    job.cursor += 1;
    if (post.date < job.cutoff) continue;
    if (state.imported.has(post.id)) job.duplicates += 1;
    else {
      state.imported.add(post.id);
      job.added += 1;
    }
    if (job.added + job.duplicates >= job.limit) break;
  }
  state.loaded = Math.max(state.loaded, job.cursor);
  renderPosts();
  scroller.scrollTop = scroller.scrollHeight;
  if (job.added + job.duplicates >= job.limit) stopImport(t('已达条数上限', 'Item limit reached'));
  else if (job.cursor >= bookmarks.length) stopImport(t('已到书签页底部', 'End of bookmarks'));
  else {
    report(t('正在自动导入', 'Importing'), job.added, job.duplicates);
    renderPopup();
    job.timer = setTimeout(() => stepImport(job), 420);
  }
}

function followupOnScroll() {
  if (!state.inline || !permitted()) return;
  const extra = state.extra[state.channel];
  const available = [...state.imported].filter(id => !state.read.has(id)).length;
  const limit = available > 22 ? 3 : available > 7 ? 2 : 1;
  // Use fixed sample spacing so the published screenshots can be reproduced.
  for (const card of scroller.querySelectorAll('[data-slot]')) {
    const bounds = card.getBoundingClientRect();
    const viewport = scroller.getBoundingClientRect();
    if (Number(card.dataset.slot) >= 2 && bounds.bottom > viewport.top && bounds.top < viewport.bottom) {
      state.seen.add(Number(card.dataset.slot));
    }
  }
  if (state.seen.size >= limit || extra.length >= limit || !choose()) return;
  const baseCard = extra.length ? scroller.querySelector('[data-slot="' + extra.at(-1).slot + '"]')
    : (scroller.querySelector('[data-slot="1"]') || scroller.querySelector('[data-native="' + state.interval + '"]'));
  if (!baseCard || scroller.scrollTop < baseCard.offsetTop + baseCard.offsetHeight + scroller.clientHeight * 3) return;
  const previousIndex = extra.at(-1)?.index ?? state.interval;
  const candidate = [...scroller.querySelectorAll('[data-native]')].find(row =>
    Number(row.dataset.native) >= previousIndex + 12 &&
    row.offsetTop + row.offsetHeight >= scroller.scrollTop + scroller.clientHeight * 0.55);
  if (!candidate) return;
  const slot = state.cards.length;
  state.cards.push(choose());
  extra.push({ slot, index: Number(candidate.dataset.native) });
  renderPosts();
}

scroller.addEventListener('scroll', () => {
  if (state.route === 'home') followupOnScroll();
  else if (!state.auto && state.loaded < bookmarks.length && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 35) {
    state.loaded = Math.min(bookmarks.length, state.loaded + 4);
    renderPosts();
    if (state.manual) manualImport();
  }
}, { passive: true });

document.addEventListener('submit', event => {
  if (event.target.id !== 'auto-form') return;
  event.preventDefault();
  if (state.auto) {
    stopImport(t('已停止自动导入', 'Auto-import stopped'));
    return;
  }
  const form = new FormData(event.target);
  state.limit = form.get('limit');
  state.years = form.get('years');
  state.manual = false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - Number(state.years));
  state.auto = { cursor: 0, added: 0, duplicates: 0, limit: Number(state.limit) || Infinity, cutoff: state.years ? +cutoff : 0 };
  scroller.scrollTop = 0;
  stepImport(state.auto);
});

document.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const { action: type, value } = control.dataset;
  if (type === 'detail') return showDetail(value);
  if (type === 'navigate') {
    stopImport(t('已停止自动导入', 'Auto-import stopped'));
    state.manual = false;
    state.route = value;
    state.status = '';
    state.popup = true;
    scroller.scrollTop = 0;
    render();
  } else if (type === 'tab') {
    state.channel = value;
    scroller.scrollTop = 0;
    renderPosts();
    head.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true });
  } else if (type === 'popup') {
    state.popup = !state.popup;
    renderPopup();
  } else if (type === 'import') manualImport();
  else if (type === 'manual') {
    state.manual = !state.manual;
    if (state.manual) manualImport();
    else renderPopup();
  } else if (type === 'undo' && state.undo) {
    const { slot, id } = state.undo;
    state.read.delete(id);
    state.cards[slot] = id;
    updateNotice(t('已撤销', 'Undone'));
    render();
  } else if (type === 'next' || type === 'read') {
    const slot = Number(value);
    const id = state.cards[slot];
    if (!id) return;
    const next = choose();
    if (type === 'read') {
      state.read.add(id);
      updateNotice(t('已标为已读', 'Marked as read'), { id, slot });
    } else if (!next) return updateNotice(t('暂时没有其他书签', 'No other bookmarks available'));
    else state.skipped.add(id);
    state.cards[slot] = next;
    render();
  }
});

document.addEventListener('change', event => {
  const input = event.target;
  const key = input.dataset.setting;
  if (!key) return;
  state[key] = input.type === 'checkbox' ? input.checked : key === 'interval' ? Number(input.value) : input.value;
  if (key === 'inline') popup.querySelector('[data-setting="interval"]').disabled = !state.inline;
  renderPosts();
});

render();
