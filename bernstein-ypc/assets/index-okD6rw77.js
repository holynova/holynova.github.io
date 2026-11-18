(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const de="modulepreload",oe=function(e){return"/bernstein-ypc/"+e},j={},ce=function(i,t,s){let n=Promise.resolve();if(t&&t.length>0){let l=function(p){return Promise.all(p.map(h=>Promise.resolve(h).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),u=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));n=l(t.map(p=>{if(p=oe(p),p in j)return;j[p]=!0;const h=p.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${v}`))return;const b=document.createElement("link");if(b.rel=h?"stylesheet":de,h||(b.as="script"),b.crossOrigin="",b.href=p,u&&b.setAttribute("nonce",u),document.head.appendChild(b),h)return new Promise((B,$)=>{b.addEventListener("load",B),b.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${p}`)))})}))}function a(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return n.then(l=>{for(const r of l||[])r.status==="rejected"&&a(r.reason);return i().catch(a)})},ue="https://space.bilibili.com/353238687/lists/966776",pe=[{id:1,titleZh:"什么是音乐的含义？",titleEn:"What Does Music Mean?",date:"1958-01-18",dateZh:"1958 年 1 月 18 日",category:"基础乐理",hasBilibili:!0},{id:2,titleZh:"什么是美国音乐？",titleEn:"What Is American Music?",date:"1958-02-01",dateZh:"1958 年 2 月 1 日",category:"文化与跨界",hasBilibili:!0},{id:3,titleZh:"什么是配器？",titleEn:"What Is Orchestration?",date:"1958-03-08",dateZh:"1958 年 3 月 8 日",category:"基础乐理",hasBilibili:!0},{id:4,titleZh:"什么让音乐具有交响性？",titleEn:"What Makes Music Symphonic?",date:"1958-12-13",dateZh:"1958 年 12 月 13 日",category:"基础乐理",hasBilibili:!0},{id:5,titleZh:"什么是古典音乐？",titleEn:"What Is Classical Music?",date:"1959-01-24",dateZh:"1959 年 1 月 24 日",category:"基础乐理",hasBilibili:!0},{id:6,titleZh:"音乐中的幽默",titleEn:"Humor in Music",date:"1959-02-28",dateZh:"1959 年 2 月 28 日",category:"基础乐理",hasBilibili:!0},{id:7,titleZh:"什么是协奏曲？",titleEn:"What Is a Concerto?",date:"1959-03-28",dateZh:"1959 年 3 月 28 日",category:"基础乐理",hasBilibili:!0},{id:8,titleZh:"古斯塔夫·马勒是谁？",titleEn:"Who Is Gustav Mahler?",date:"1960-02-07",dateZh:"1960 年 2 月 7 日",category:"大师与杰作",hasBilibili:!0},{id:9,titleZh:"青年演奏家专场（一）：《彼得与狼》",titleEn:'Young Performers No. 1 ("Peter and the Wolf")',date:"1960-03-06",dateZh:"1960 年 3 月 6 日",category:"青年专场",hasBilibili:!0},{id:10,titleZh:"过去、现在与未来的奇特乐器",titleEn:"Unusual Instruments of the Past, Present, and Future",date:"1960-03-27",dateZh:"1960 年 3 月 27 日",category:"基础乐理",hasBilibili:!0},{id:11,titleZh:"第二次飓风",titleEn:"The Second Hurricane",date:"1960-04-24",dateZh:"1960 年 4 月 24 日",category:"文化与跨界",hasBilibili:!1},{id:12,titleZh:"序曲与前奏曲",titleEn:"Overtures and Preludes",date:"1961-01-08",dateZh:"1961 年 1 月 8 日",category:"基础乐理",hasBilibili:!0},{id:13,titleZh:"亚伦·科普兰生日派对",titleEn:"Aaron Copland Birthday Party",date:"1961-02-12",dateZh:"1961 年 2 月 12 日",category:"大师与杰作",hasBilibili:!0},{id:14,titleZh:"青年演奏家专场（二）",titleEn:"Young Performers No. 2",date:"1961-03-19",dateZh:"1961 年 3 月 19 日",category:"青年专场",hasBilibili:!1},{id:15,titleZh:"音乐厅里的民间音乐",titleEn:"Folk Music in the Concert Hall",date:"1961-04-09",dateZh:"1961 年 4 月 9 日",category:"文化与跨界",hasBilibili:!0},{id:16,titleZh:"什么是印象派？",titleEn:"What Is Impressionism?",date:"1961-11-23",dateZh:"1961 年 11 月 23 日",category:"基础乐理",hasBilibili:!0},{id:17,titleZh:"巴黎之路",titleEn:"The Road to Paris",date:"1962-01-18",dateZh:"1962 年 1 月 18 日",category:"文化与跨界",hasBilibili:!0},{id:18,titleZh:"伊戈尔·斯特拉文斯基生日快乐",titleEn:"Happy Birthday, Igor Stravinsky",date:"1962-03-26",dateZh:"1962 年 3 月 26 日",category:"大师与杰作",hasBilibili:!0},{id:19,titleZh:"青年演奏家专场（三）",titleEn:"Young Performers No. 3",date:"1962-04-14",dateZh:"1962 年 4 月 14 日",category:"青年专场",hasBilibili:!1},{id:20,titleZh:"音乐厅的声音",titleEn:"The Sound of a Hall",date:"1962-11-21",dateZh:"1962 年 11 月 21 日",category:"基础乐理",hasBilibili:!0},{id:21,titleZh:"什么是旋律？",titleEn:"What Is a Melody?",date:"1962-12-21",dateZh:"1962 年 12 月 21 日",category:"基础乐理",hasBilibili:!0},{id:22,titleZh:"青年演奏家专场（四）：安德烈·瓦茨首秀",titleEn:"Young Performers No. 4",date:"1963-01-15",dateZh:"1963 年 1 月 15 日",category:"青年专场",hasBilibili:!0},{id:23,titleZh:"拉丁美洲精神",titleEn:"The Latin American Spirit",date:"1963-03-08",dateZh:"1963 年 3 月 8 日",category:"文化与跨界",hasBilibili:!0},{id:24,titleZh:"向老师们致敬",titleEn:"A Tribute to Teachers",date:"1963-11-29",dateZh:"1963 年 11 月 29 日",category:"文化与跨界",hasBilibili:!0},{id:25,titleZh:"青年演奏家专场（五）",titleEn:"Young Performers No. 5",date:"1963-12-23",dateZh:"1963 年 12 月 23 日",category:"青年专场",hasBilibili:!0},{id:26,titleZh:"保罗·欣德米特的天才",titleEn:"The Genius of Paul Hindemith",date:"1964-02-23",dateZh:"1964 年 2 月 23 日",category:"大师与杰作",hasBilibili:!0},{id:27,titleZh:"音乐厅里的爵士乐",titleEn:"Jazz in the Concert Hall",date:"1964-03-11",dateZh:"1964 年 3 月 11 日",category:"文化与跨界",hasBilibili:!0},{id:28,titleZh:"什么是奏鸣曲式？",titleEn:"What Is Sonata Form?",date:"1964-11-06",dateZh:"1964 年 11 月 6 日",category:"基础乐理",hasBilibili:!0},{id:29,titleZh:"告别民族主义",titleEn:"A Farewell to Nationalism",date:"1964-11-30",dateZh:"1964 年 11 月 30 日",category:"文化与跨界",hasBilibili:!0},{id:30,titleZh:"青年演奏家专场（六）",titleEn:"Young Performers No. 6",date:"1965-01-28",dateZh:"1965 年 1 月 28 日",category:"青年专场",hasBilibili:!1},{id:31,titleZh:"向西贝柳斯致敬",titleEn:"A Tribute to Sibelius",date:"1965-02-19",dateZh:"1965 年 2 月 19 日",category:"大师与杰作",hasBilibili:!0},{id:32,titleZh:"音乐原子：音程研究",titleEn:"Musical Atoms: A Study of Interval",date:"1965-11-29",dateZh:"1965 年 11 月 29 日",category:"基础乐理",hasBilibili:!0},{id:33,titleZh:"管弦乐团的声音",titleEn:"The Sound of an Orchestra",date:"1965-12-14",dateZh:"1965 年 12 月 14 日",category:"基础乐理",hasBilibili:!0},{id:34,titleZh:"肖斯塔科维奇生日致敬",titleEn:"A Birthday Tribute to Shostakovich",date:"1966-01-05",dateZh:"1966 年 1 月 5 日",category:"大师与杰作",hasBilibili:!0},{id:35,titleZh:"青年演奏家专场（七）",titleEn:"Young Performers No. 7",date:"1966-02-22",dateZh:"1966 年 2 月 22 日",category:"青年专场",hasBilibili:!0},{id:36,titleZh:"什么是调式？",titleEn:"What Is a Mode?",date:"1966-11-23",dateZh:"1966 年 11 月 23 日",category:"基础乐理",hasBilibili:!0},{id:37,titleZh:"青年演奏家专场（八）",titleEn:"Young Performers No. 8",date:"1967-01-27",dateZh:"1967 年 1 月 27 日",category:"青年专场",hasBilibili:!0},{id:38,titleZh:"查尔斯·艾夫斯：美国先驱",titleEn:"Charles Ives: American Pioneer",date:"1967-02-23",dateZh:"1967 年 2 月 23 日",category:"大师与杰作",hasBilibili:!0},{id:39,titleZh:"校友重聚",titleEn:"Alumni Reunion",date:"1967-04-19",dateZh:"1967 年 4 月 19 日",category:"青年专场",hasBilibili:!0},{id:40,titleZh:"向维也纳举杯（3/4 拍）",titleEn:"A Toast to Vienna in 3/4 Time",date:"1967-12-25",dateZh:"1967 年 12 月 25 日",category:"文化与跨界",hasBilibili:!0},{id:41,titleZh:"永远的贝多芬",titleEn:"Forever Beethoven",date:"1968-01-28",dateZh:"1968 年 1 月 28 日",category:"大师与杰作",hasBilibili:!0},{id:42,titleZh:"青年演奏家专场（九）",titleEn:"Young Performers No. 9",date:"1968-03-31",dateZh:"1968 年 3 月 31 日",category:"青年专场",hasBilibili:!1},{id:43,titleZh:"音乐会小测验：你有多懂音乐？",titleEn:"Quiz-Concert: How Musical Are You?",date:"1968-05-26",dateZh:"1968 年 5 月 26 日",category:"基础乐理",hasBilibili:!0},{id:44,titleZh:"幻想变奏曲：《堂吉诃德》",titleEn:"Fantastic Variations",date:"1968-12-25",dateZh:"1968 年 12 月 25 日",category:"基础乐理",hasBilibili:!0},{id:45,titleZh:"大变身的巴赫",titleEn:"Bach Transmogrified",date:"1969-04-27",dateZh:"1969 年 4 月 27 日",category:"大师与杰作",hasBilibili:!0},{id:46,titleZh:"柏辽兹踏上迷幻之旅",titleEn:"Berlioz Takes a Trip",date:"1969-05-25",dateZh:"1969 年 5 月 25 日",category:"大师与杰作",hasBilibili:!0},{id:47,titleZh:"两只芭蕾舞神鸟",titleEn:"Two Ballet Birds",date:"1969-09-14",dateZh:"1969 年 9 月 14 日",category:"文化与跨界",hasBilibili:!0},{id:48,titleZh:"《费德里奥》：生命的赞歌",titleEn:"Fidelio: A Celebration of Life",date:"1970-03-29",dateZh:"1970 年 3 月 29 日",category:"基础乐理",hasBilibili:!0},{id:49,titleZh:"交响乐团的解剖课",titleEn:"The Anatomy of a Symphony Orchestra",date:"1970-05-24",dateZh:"1970 年 5 月 24 日",category:"基础乐理",hasBilibili:!0},{id:50,titleZh:"阿隆·科普兰庆典",titleEn:"A Copland Celebration",date:"1970-12-27",dateZh:"1970 年 12 月 27 日",category:"大师与杰作",hasBilibili:!0},{id:51,titleZh:"理查·施特劳斯如是说",titleEn:"Thus Spake Richard Strauss",date:"1971-04-04",dateZh:"1971 年 4 月 4 日",category:"大师与杰作",hasBilibili:!0},{id:52,titleZh:"李斯特与魔鬼",titleEn:"Liszt and the Devil",date:"1972-02-13",dateZh:"1972 年 2 月 13 日",category:"大师与杰作",hasBilibili:!0},{id:53,titleZh:"霍尔斯特：《行星组曲》",titleEn:"Holst: The Planets",date:"1972-03-26",dateZh:"1972 年 3 月 26 日",category:"大师与杰作",hasBilibili:!0}],z={bilibiliCollectionUrl:ue,episodes:pe},m={1:{prefix:"/bernstein-ypc/static/a567d22ac6304596/",pages:15},2:{prefix:"/bernstein-ypc/static/5e1bad47f65e6a37/",pages:15},3:{prefix:"/bernstein-ypc/static/3b97910c5ae165d1/",pages:15},4:{prefix:"/bernstein-ypc/static/e446668bd5abd059/",pages:15},5:{prefix:"/bernstein-ypc/static/f278a1ee5eedd5ec/",pages:15},6:{prefix:"/bernstein-ypc/static/3d333667f3f4bc9d/",pages:15},7:{prefix:"/bernstein-ypc/static/1da1f85cc56b6904/",pages:15},8:{prefix:"/bernstein-ypc/static/2d3c2f5471c2d37d/",pages:15},9:{prefix:"/bernstein-ypc/static/19f12a43a95915f6/",pages:15},10:{prefix:"/bernstein-ypc/static/5a9e4faf280fdad8/",pages:15},11:{prefix:"/bernstein-ypc/static/5d2b97bf6d9b8f48/",pages:15},12:{prefix:"/bernstein-ypc/static/56211e7960fcb4d8/",pages:15},13:{prefix:"/bernstein-ypc/static/29cb77ddd63056e8/",pages:15},14:{prefix:"/bernstein-ypc/static/d52ac5ca9f085b61/",pages:15},15:{prefix:"/bernstein-ypc/static/08b81e16193e5b71/",pages:15},16:{prefix:"/bernstein-ypc/static/a7ee9fed99b2b0c4/",pages:15},17:{prefix:"/bernstein-ypc/static/71de5aa617119ea4/",pages:15},18:{prefix:"/bernstein-ypc/static/9921bba9b09d08fc/",pages:15},19:{prefix:"/bernstein-ypc/static/487470d48a1b1f9b/",pages:15},20:{prefix:"/bernstein-ypc/static/b4f49129814311fc/",pages:15},21:{prefix:"/bernstein-ypc/static/ad4a3006d6f7fec2/",pages:15},22:{prefix:"/bernstein-ypc/static/8992d4ae8a6a3f0b/",pages:15},23:{prefix:"/bernstein-ypc/static/8fd61816d16c3fc2/",pages:15},24:{prefix:"/bernstein-ypc/static/7533abb15e2b65b8/",pages:15},25:{prefix:"/bernstein-ypc/static/b446082bcf545744/",pages:15},26:{prefix:"/bernstein-ypc/static/47486e6fce65e883/",pages:15},27:{prefix:"/bernstein-ypc/static/0bc26f63b20e8756/",pages:15},28:{prefix:"/bernstein-ypc/static/b754fa802197c520/",pages:15},29:{prefix:"/bernstein-ypc/static/c1eb57c1108d9954/",pages:15},30:{prefix:"/bernstein-ypc/static/79ce3f064738faed/",pages:15},31:{prefix:"/bernstein-ypc/static/1581ddc96c025db7/",pages:15},32:{prefix:"/bernstein-ypc/static/3eb8188cf0ab9a96/",pages:15},33:{prefix:"/bernstein-ypc/static/dea521ce2409974e/",pages:15},34:{prefix:"/bernstein-ypc/static/31fa94037f5ed703/",pages:15},35:{prefix:"/bernstein-ypc/static/3cbb0e0e0b2e5db7/",pages:15},36:{prefix:"/bernstein-ypc/static/68822bb26d308fe3/",pages:15},37:{prefix:"/bernstein-ypc/static/8662be91d09dc2a5/",pages:15},38:{prefix:"/bernstein-ypc/static/98d0befb98d28222/",pages:15},39:{prefix:"/bernstein-ypc/static/c8a1e8bf48864c98/",pages:15},40:{prefix:"/bernstein-ypc/static/886561f59c5ce832/",pages:15},41:{prefix:"/bernstein-ypc/static/7f895ba3b1284ada/",pages:15},42:{prefix:"/bernstein-ypc/static/788c4430a03d800a/",pages:15},43:{prefix:"/bernstein-ypc/static/3af7dbc0eab16a31/",pages:15},44:{prefix:"/bernstein-ypc/static/b6d1256d3789c933/",pages:15},45:{prefix:"/bernstein-ypc/static/061ffe3a41b6f5ac/",pages:15},46:{prefix:"/bernstein-ypc/static/fd36a144ee4ac82e/",pages:15},47:{prefix:"/bernstein-ypc/static/99df0bce991c6b1d/",pages:15},48:{prefix:"/bernstein-ypc/static/4cf5d8bfabca27df/",pages:15},49:{prefix:"/bernstein-ypc/static/b60cc1c00376a4ce/",pages:15},50:{prefix:"/bernstein-ypc/static/cec50be1dc98232c/",pages:15},51:{prefix:"/bernstein-ypc/static/a039c683a99cc522/",pages:15},52:{prefix:"/bernstein-ypc/static/f2008b082df03791/",pages:15},53:{prefix:"/bernstein-ypc/static/ee848a496f95ccea/",pages:15}},f={audio:null,currentUrl:null,title:"",artist:"",isPlaying:!1},W=new Set;function P(){for(const e of W)e({...f})}function fe(e){return W.add(e),e({...f}),()=>W.delete(e)}function K({previewUrl:e,title:i,artist:t}){if(e){if(f.audio||(f.audio=new Audio,f.audio.addEventListener("ended",()=>{f.isPlaying=!1,P()}),f.audio.addEventListener("pause",()=>{f.isPlaying=!1,P()}),f.audio.addEventListener("play",()=>{f.isPlaying=!0,P()})),f.currentUrl===e){f.audio.paused?f.audio.play().catch(()=>{}):f.audio.pause();return}f.audio.pause(),f.currentUrl=e,f.title=i,f.artist=t||"",f.audio.src=e,f.audio.play().catch(()=>{}),P()}}function he(){f.audio&&(f.audio.pause(),f.audio.currentTime=0),f.currentUrl=null,f.isPlaying=!1,P()}function ge(){return{...f}}const be=["全部","基础乐理","大师与杰作","文化与跨界","青年专场"];function o(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}const U={search:'<svg class="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14" stroke-linecap="round"/></svg>',chevron:'<svg class="rep-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',play:'<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2.2v7.6L9.8 6 3 2.2Z"/></svg>',pause:'<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2" width="2.4" height="8" rx="0.5"/><rect x="7.1" y="2" width="2.4" height="8" rx="0.5"/></svg>'};function J(e,i){return e===i?`${i} 课`:`${e} / ${i} 课`}function ye({collectionUrl:e,visibleCount:i,totalCount:t}){return`
    <header class="proto-bar">
      <div class="proto-bar-inner">
        <div class="brand-group">
          <h1 class="site-title">伯恩斯坦《青少年音乐会》</h1>
          <span class="site-years tabular-nums" id="site-count">${J(i,t)}</span>
        </div>
        <nav class="header-links" aria-label="外部链接">
          <a class="script-link" href="${o(e)}" target="_blank" rel="noopener">掘火中译合集 ↗</a>
          <a class="script-link" href="https://github.com/holynova/bernstein-ypc" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
      </div>
    </header>
  `}function me({category:e,query:i}){return`
    <div class="proto-c-side-controls">
      <div class="search-wrap">
        ${U.search}
        <input
          type="search"
          class="search-input"
          value="${o(i)}"
          placeholder="搜索课题、作曲家、曲目…"
          aria-label="搜索课程、作曲家、曲目或概念"
          autocomplete="off"
        />
        <button
          type="button"
          class="search-clear"
          data-clear-search
          aria-label="清空搜索"
          ${i?"":"hidden"}
        >×</button>
      </div>
      <p class="dir-legend"><span class="dir-dot is-bili"></span>有 B站视频<span class="dir-dot is-slide"></span>有图解 PPT</p>
      <div class="filter-pills" role="group" aria-label="课程分类">
        ${be.map(t=>`<button type="button" class="filter-pill" data-category="${o(t)}" aria-pressed="${e===t?"true":"false"}">${o(t)}</button>`).join("")}
      </div>
    </div>
  `}function Q(e,i){const t=i?`<button type="button" class="slide-trigger-btn" data-open-slides="${e.id}" data-slide-page="1">图解 PPT（${i.pages} 页）</button>`:"",s=e.bilibili?`<a class="bili-link" href="${o(e.bilibili.url)}" target="_blank" rel="noopener" title="${o(e.bilibili.title)}">掘火中译 ${o(e.bilibili.duration)} ↗</a>`:e.bilibiliSearchUrl?`<a class="bili-link is-search" href="${o(e.bilibiliSearchUrl)}" target="_blank" rel="noopener">B站检索 ↗</a>`:"",n=e.scriptUrl?`<a class="script-link" href="${o(e.scriptUrl)}" target="_blank" rel="noopener">英文讲稿 ↗</a>`:"";return`<div class="ep-links" data-stage-links>${t}${s}${n}</div>`}function ve(e,i){if(!i||!i.prefix||!i.pages)return"";const t=`${i.prefix}1.webp`;return`
    <section class="slide-strip" aria-label="课程图解幻灯片">
      <button
        type="button"
        class="slide-cover-btn"
        data-open-slides="${e.id}"
        data-slide-page="1"
        aria-label="全屏阅读第 ${e.id} 集图解幻灯片（共 ${i.pages} 页）"
      >
        <img
          class="slide-cover-img"
          src="${o(t)}"
          width="1376"
          height="768"
          alt="第 ${e.id} 集《${o(e.titleZh)}》图解幻灯片第 1 页"
          draggable="false"
          fetchpriority="high"
          decoding="async"
        />
        <span class="slide-cover-badge tabular-nums">1 / ${i.pages} 全屏</span>
      </button>
    </section>
  `}function Ee(e,i){const t=e.repertoire||[];return t.length?`
    <details class="rep-details">
      <summary class="rep-summary">
        ${U.chevron}
        <span>曲目 ${t.length} 首</span>
      </summary>
      <ul class="rep-list">
        ${t.map(s=>{const n=i.currentUrl&&i.currentUrl===s.previewUrl&&i.isPlaying,a=s.previewUrl?`<button
                  type="button"
                  class="play-btn"
                  data-preview-url="${o(s.previewUrl)}"
                  data-track-title="${o(s.titleZh||s.piece)}"
                  data-track-artist="${o(s.recordingArtist||s.composer)}"
                  aria-pressed="${n?"true":"false"}"
                >${n?U.pause:U.play}<span>${n?"暂停":"试听"}</span></button>`:"",l=s.appleMusicUrl?`<a class="track-ext-link" href="${o(s.appleMusicUrl)}" target="_blank" rel="noopener">Apple Music</a>`:`<a class="track-ext-link" href="${o(s.youtubeSearchUrl)}" target="_blank" rel="noopener">YouTube</a>`,r=`<a class="track-ext-link" href="${o(s.biliSearchUrl)}" target="_blank" rel="noopener">B站</a>`;return`
              <li class="rep-item">
                <div class="rep-info">
                  <span class="rep-composer">${o(s.composer)}</span>
                  <span class="rep-piece">${o(s.titleZh)}（${o(s.piece)}）</span>
                </div>
                <div class="rep-actions">
                  ${a}
                  ${l}
                  ${r}
                </div>
              </li>
            `}).join("")}
      </ul>
    </details>
  `:""}function $e(e){return!e.thesis&&!e.plain?'<p class="ep-thesis" aria-busy="true">正在载入讲稿与曲目…</p>':`
    <p class="ep-thesis">${o(e.thesis)}</p>
    <p class="ep-plain">${o(e.plain)}</p>
    ${e.scenes&&e.scenes.length?`<ul class="ep-scenes">${e.scenes.map(i=>`<li>${o(i)}</li>`).join("")}</ul>`:""}
    <div class="ep-concepts">${o(e.concepts)}</div>
  `}function ee(e,i){return`${$e(e)}${Ee(e,i)}`}function te(e,i,t={}){return e.length?e.map(s=>{const n=!!t[String(s.id)],a=!!(s.hasBilibili??s.bilibili);return`
      <li>
        <button
          type="button"
          class="dir-btn"
          data-select-ep="${s.id}"
          aria-current="${s.id===i?"true":"false"}"
        >
          <span class="dir-num">${String(s.id).padStart(2,"0")}</span>
          <span class="dir-title">${o(s.titleZh)}</span>
          <span class="dir-meta">
            ${a||n?`<span class="dir-indicators" aria-hidden="true">
                    ${a?'<span class="dir-dot is-bili" title="含 B站掘火中译视频"></span>':""}
                    ${n?'<span class="dir-dot is-slide" title="含图解 PPT"></span>':""}
                  </span>`:""}
            <span class="dir-year">${o(s.date.slice(0,4))}</span>
          </span>
        </button>
      </li>
    `}).join(""):'<li class="empty-state">没有匹配的课程</li>'}function ie(e,i,t,s,n={}){const a=e.find(h=>h.id===t)||e[0]||null;if(!a)return`<div class="empty-state">没有找到符合条件的课程${i.length?"，请尝试换个关键词或切换分类。":""}</div>`;const l=e.findIndex(h=>h.id===a.id),r=l>0?e[l-1]:null,u=l>=0&&l<e.length-1?e[l+1]:null,p=n[String(a.id)]||null;return`
    <div class="stage-top-row">
      <div class="stage-date-num">
        <span class="stage-big-num">第 ${a.id} 集</span>
        <time datetime="${o(a.date)}">${o(a.dateZh)}</time>
      </div>
      ${Q(a,p)}
    </div>
    <h2 class="stage-title-zh">${o(a.titleZh)}</h2>
    <p class="stage-title-en">${o(a.titleEn)}</p>
    ${ve(a,p)}
    <div class="stage-detail-body" data-stage-body>
      ${ee(a,s)}
    </div>
    <div class="stage-nav">
      <button type="button" class="stage-nav-btn" data-select-ep="${r?r.id:""}" ${r?"":"disabled"}>← ${r?`第 ${r.id} 集 ${o(r.titleZh)}`:"已至首课"}</button>
      <button type="button" class="stage-nav-btn" data-select-ep="${u?u.id:""}" ${u?"":"disabled"}>${u?`第 ${u.id} 集 ${o(u.titleZh)}`:"已至末课"} →</button>
    </div>
  `}function we({episodes:e,allEpisodes:i,category:t,query:s,activeId:n,audioState:a,slidesMap:l={}}){return`
    <div class="proto-c-shell">
      <aside class="proto-c-sidebar" aria-label="课程目录与搜索">
        ${me({category:t,query:s})}
        <ul class="proto-c-dir-list" id="proto-c-dir-list">
          ${te(e,n,l)}
        </ul>
      </aside>
      <main class="proto-c-stage" id="proto-c-stage">
        ${ie(e,i,n,a,l)}
      </main>
    </div>
  `}function xe(){return`
    <div class="slide-viewer" id="slide-viewer" hidden role="dialog" aria-modal="true" aria-labelledby="slide-viewer-title">
      <div class="slide-viewer-bar">
        <div class="slide-viewer-title-wrap">
          <strong class="slide-viewer-title" id="slide-viewer-title"></strong>
        </div>
        <div class="slide-viewer-controls">
          <span class="slide-page-badge tabular-nums" id="slide-page-badge"></span>
          <button type="button" class="slide-bar-btn" id="slide-fs-btn" data-slide-fs aria-label="切换全屏">全屏</button>
          <button type="button" class="slide-bar-btn is-close" data-slide-close aria-label="关闭图解阅读器">关闭</button>
        </div>
      </div>
      <div class="slide-canvas" id="slide-canvas">
        <button type="button" class="slide-zone is-prev" data-slide-dir="-1" aria-label="上一页">
          <span class="slide-arrow" aria-hidden="true">‹</span>
        </button>
        <img id="slide-img" class="slide-img" width="1376" height="768" alt="" draggable="false" decoding="async" />
        <span class="slide-loading-pill" id="slide-loading-pill" hidden>加载中…</span>
        <button type="button" class="slide-zone is-next" data-slide-dir="1" aria-label="下一页">
          <span class="slide-arrow" aria-hidden="true">›</span>
        </button>
        <div class="slide-end" id="slide-end" hidden>
          <p class="slide-end-title" id="slide-end-title"></p>
          <div class="slide-end-actions">
            <button type="button" class="slide-bar-btn" data-slide-restart>再看一遍</button>
            <button type="button" class="slide-bar-btn is-primary" id="slide-next-ep-btn" data-slide-next-ep hidden></button>
            <button type="button" class="slide-bar-btn" data-slide-close>返回课文</button>
          </div>
        </div>
      </div>
    </div>
  `}function ae(e){return`
    <div class="audio-dock" ${!e.currentUrl?"hidden":""} role="region" aria-label="曲目试听">
      <div class="audio-dock-meta">
        <div class="audio-dock-title">${o(e.title)}</div>
        <div class="audio-dock-sub">${o(e.artist)}</div>
      </div>
      <button type="button" class="audio-dock-btn" data-dock-toggle>
        ${e.isPlaying?"暂停":"继续"}
      </button>
      <button type="button" class="audio-dock-btn" data-dock-stop>关闭</button>
    </div>
  `}const g={bilibiliCollectionUrl:z.bilibiliCollectionUrl,episodes:z.episodes.map(e=>({...e}))},F=new Map(g.episodes.map(e=>[e.id,e])),D=new Map;let L=null,T=!1,X=!1;function Be(){var s;const e=new URLSearchParams(window.location.search),i=Number(e.get("ep"));if(i&&g.episodes.some(n=>n.id===i))return i;const t=window.location.hash.match(/^#ep-(\d+)$/i);if(t){const n=Number(t[1]);if(g.episodes.some(a=>a.id===n))return n}return((s=g.episodes[0])==null?void 0:s.id)??1}const d={category:"全部",query:"",isComposing:!1,activeId:Be(),audioState:ge()},y=document.getElementById("app");function se(e){const i=(e.repertoire||[]).map(t=>`${t.composer} ${t.piece} ${t.titleZh} ${t.recordingArtist||""}`).join(" ");return[e.id,`第${e.id}集`,e.date,e.titleZh,e.titleEn,e.category,e.concepts||"",e.thesis||"",e.plain||"",...e.scenes||[],i].join(" ").toLowerCase()}const ne=new Map(g.episodes.map(e=>[e.id,se(e)]));function Ze(e){if(!e||!e.id)return null;const i=F.get(e.id);return i?(Object.assign(i,e,{_loaded:!0}),ne.set(i.id,se(i)),i):null}function C(e){const i=F.get(e);if(!i)return Promise.resolve(null);if(i._loaded)return Promise.resolve(i);if(D.has(e))return D.get(e);const t=k().then(()=>F.get(e)||i);return D.set(e,t),t}function k(){return T?Promise.resolve():L||(L=ce(()=>import("./episodes-US6DB2TF.js"),[]).then(e=>{var t;const i=((t=e==null?void 0:e.default)==null?void 0:t.episodes)||[];for(const s of i)Ze(s);T=!0,d.query.trim()&&E()}).catch(()=>{L=null}),L)}function Y(){const e=d.query.trim().toLowerCase().split(/\s+/).filter(Boolean);return g.episodes.filter(i=>{if(d.category!=="全部"&&i.category!==d.category)return!1;if(!e.length)return!0;const t=ne.get(i.id)||"";return e.every(s=>t.includes(s))})}function Se(){const{currentUrl:e,isPlaying:i}=d.audioState;document.querySelectorAll(".play-btn").forEach(s=>{const n=s.dataset.previewUrl===e&&i;s.setAttribute("aria-pressed",n?"true":"false");const a=s.querySelector("span");a&&(a.textContent=n?"暂停":"试听");const l=s.querySelector("svg");l&&(l.innerHTML=n?'<rect x="2.5" y="2" width="2.4" height="8" rx="0.5"/><rect x="7.1" y="2" width="2.4" height="8" rx="0.5"/>':'<path d="M3 2.2v7.6L9.8 6 3 2.2Z"/>')});const t=document.querySelector(".audio-dock");t&&(t.outerHTML=ae(d.audioState))}function H(e){const i=document.getElementById("proto-c-stage");if(!i||i.dataset.renderedEpId!==String(e.id))return;const t=i.querySelector("[data-stage-links]");t&&(t.outerHTML=Q(e,m[String(e.id)]||null));const s=i.querySelector("[data-stage-body]");s&&(s.innerHTML=ee(e,d.audioState))}function _(){if(T||X)return;X=!0;const e=()=>{typeof requestIdleCallback=="function"?requestIdleCallback(()=>k(),{timeout:2e3}):setTimeout(()=>k(),250)};document.readyState==="complete"?setTimeout(e,250):window.addEventListener("load",()=>setTimeout(e,250),{once:!0})}function re(){const e=d.activeId,i=m[String(e)],t=document.getElementById("proto-c-stage"),s=t==null?void 0:t.querySelector(".slide-cover-img");if(!i||i.pages<2||!s){_();return}const n=()=>{d.activeId!==e||c.open||x(`${i.prefix}2.webp`,"low").then(()=>{_()})};s.complete&&s.naturalWidth>0?(A.add(`${i.prefix}1.webp`),n()):(s.addEventListener("load",()=>{A.add(`${i.prefix}1.webp`),n()},{once:!0}),s.addEventListener("error",()=>_(),{once:!0}))}function E({scrollStage:e=!1,scrollDir:i=!1}={}){const t=Y();t.length&&!t.some(r=>r.id===d.activeId)&&(d.activeId=t[0].id);const s=document.getElementById("site-count");s&&(s.textContent=J(t.length,g.episodes.length));const n=y.querySelector("[data-clear-search]");n&&(n.hidden=!d.query),y.querySelectorAll("[data-category]").forEach(r=>{r.setAttribute("aria-pressed",r.dataset.category===d.category?"true":"false")});const a=document.getElementById("proto-c-dir-list");if(a&&(a.innerHTML=te(t,d.activeId,m),i)){const r=a.querySelector('[aria-current="true"]');r&&r.scrollIntoView({block:"nearest"})}const l=document.getElementById("proto-c-stage");if(l){const r=t.find(p=>p.id===d.activeId)||t[0]||null;r&&l.dataset.renderedEpId===String(r.id)?H(r):(l.dataset.renderedEpId=r?String(r.id):"",l.innerHTML=ie(t,g.episodes,d.activeId,d.audioState,m),r&&re()),r&&!r._loaded&&C(r.id).then(p=>{p&&d.activeId===p.id&&H(p)}),e&&window.innerWidth<=920&&l.scrollIntoView({behavior:"smooth",block:"start"})}}const Ie=64,M=new Map,w=new Map,A=new Set,c={open:!1,epId:null,page:1,renderToken:0,touchStartX:0,touchStartY:0};function x(e,i="low"){if(!e)return Promise.resolve(null);if(w.has(e)){const n=w.get(e);return w.delete(e),w.set(e,n),Promise.resolve(n)}if(M.has(e))return M.get(e);const t=new Image;t.decoding="async","fetchPriority"in t&&(t.fetchPriority=i),t.src=e;const s=new Promise(n=>{const a=l=>{if(l&&t.naturalWidth>0){if(w.size>=Ie){const r=w.keys().next().value;w.delete(r),A.delete(r)}w.set(e,t),A.add(e),n(t)}else M.delete(e),n(null)};if(t.complete&&t.naturalWidth>0){typeof t.decode=="function"?t.decode().then(()=>a(!0),()=>a(t.naturalWidth>0)):a(!0);return}t.onload=()=>{typeof t.decode=="function"?t.decode().then(()=>a(!0),()=>a(t.naturalWidth>0)):a(!0)},t.onerror=()=>a(!1)});return M.set(e,s),s}function ke(e){const i=g.episodes.findIndex(t=>t.id===e);for(let t=i+1;t<g.episodes.length;t++){const s=g.episodes[t];if(m[String(s.id)])return s}return null}function S(){const e=document.getElementById("slide-viewer"),i=document.getElementById("slide-fs-btn");if(!e||!i)return;const t=!!(document.fullscreenElement===e||e.classList.contains("is-fullscreen"));i.textContent=t?"退出全屏":"全屏"}function O(){var i;const e=document.getElementById("slide-viewer");if(e){if(document.fullscreenElement===e){(i=document.exitFullscreen)==null||i.call(document).catch(()=>{}),e.classList.remove("is-fullscreen"),S();return}if(e.classList.contains("is-fullscreen")){e.classList.remove("is-fullscreen"),S();return}typeof e.requestFullscreen=="function"?e.requestFullscreen().then(()=>{e.classList.add("is-fullscreen"),S()}).catch(()=>{e.classList.add("is-fullscreen"),S()}):(e.classList.add("is-fullscreen"),S())}}function Z(e){var V;const i=g.episodes.find(I=>I.id===c.epId),t=m[String(c.epId)],s=document.getElementById("slide-viewer"),n=document.getElementById("slide-img"),a=document.getElementById("slide-page-badge"),l=document.getElementById("slide-end"),r=document.getElementById("slide-end-title"),u=document.getElementById("slide-next-ep-btn");if(!i||!t||!s||!n||!a||!l)return;const p=t.pages,h=Math.max(1,Math.min(e,p+1));if(c.page=h,h>p){++c.renderToken,(V=document.getElementById("slide-canvas"))==null||V.classList.remove("is-loading");const I=document.getElementById("slide-loading-pill");I&&(I.hidden=!0),n.hidden=!0,l.hidden=!1,a.textContent=`${p} / ${p}`,r&&(r.textContent=`第 ${i.id} 集 ${i.titleZh}（共 ${p} 页）`);const N=ke(i.id);u&&(N?(u.hidden=!1,u.dataset.slideNextEp=String(N.id),u.textContent=`下一课图解：第 ${N.id} 集 →`):u.hidden=!0);return}l.hidden=!0,n.hidden=!1,a.textContent=`${h} / ${p}`,n.alt=`第 ${i.id} 集《${i.titleZh}》图解幻灯片第 ${h} 页`;const v=`${t.prefix}${h}.webp`,b=++c.renderToken,B=document.getElementById("slide-canvas"),$=document.getElementById("slide-loading-pill"),R=async()=>{if(h+1<=p){if(!c.open||b!==c.renderToken)return;await x(`${t.prefix}${h+1}.webp`,"high")}if(h+2<=p){if(!c.open||b!==c.renderToken)return;await x(`${t.prefix}${h+2}.webp`,"low")}if(h-1>=1){if(!c.open||b!==c.renderToken)return;await x(`${t.prefix}${h-1}.webp`,"low")}};if(w.has(v)||A.has(v)){B&&B.classList.remove("is-loading"),$&&($.hidden=!0),n.src=v,R();return}let q=null;B&&B.classList.add("is-loading"),$&&($.hidden=!0,q=setTimeout(()=>{c.open&&b===c.renderToken&&($.hidden=!1)},120)),x(v,"high").then(I=>{q&&clearTimeout(q),!(!c.open||b!==c.renderToken)&&(B&&B.classList.remove("is-loading"),$&&($.hidden=!0),I&&(n.src=v),R())})}function G(e,i=1){const t=g.episodes.find(l=>l.id===e),s=m[String(e)],n=document.getElementById("slide-viewer");if(!t||!s||!n)return;c.open=!0,c.epId=e;const a=document.getElementById("slide-viewer-title");a&&(a.textContent=`第 ${t.id} 集 ${t.titleZh}`),n.hidden=!1,document.documentElement.classList.add("slide-viewer-open"),Z(i)}function le(){var s;const e=document.getElementById("slide-viewer");if(!e)return;++c.renderToken;const i=document.getElementById("slide-canvas"),t=document.getElementById("slide-loading-pill");i&&i.classList.remove("is-loading"),t&&(t.hidden=!0),document.fullscreenElement===e&&((s=document.exitFullscreen)==null||s.call(document).catch(()=>{})),e.classList.remove("is-fullscreen"),S(),e.hidden=!0,document.documentElement.classList.remove("slide-viewer-open"),c.open=!1}function Le(){document.body.setAttribute("data-proto","c");const e=Y(),i="v1.0.3";y.innerHTML=`
    ${ye({collectionUrl:g.bilibiliCollectionUrl,visibleCount:e.length,totalCount:g.episodes.length})}
    ${we({episodes:e,allEpisodes:g.episodes,category:d.category,query:d.query,activeId:d.activeId,audioState:d.audioState,slidesMap:m})}
    <footer class="site-footer">
      <span>讲稿依据 Leonard Bernstein 官方脚本，纽约爱乐档案核验</span>
      <span>${i} B站 <a class="script-link" href="${g.bilibiliCollectionUrl}" target="_blank" rel="noopener">掘火档案（掘火中译）</a></span>
    </footer>
    ${ae(d.audioState)}
    ${xe()}
  `;const t=document.getElementById("proto-c-stage"),s=e.find(a=>a.id===d.activeId)||e[0]||null;t&&(t.dataset.renderedEpId=s?String(s.id):""),re(),s&&!s._loaded&&C(s.id).then(a=>{a&&d.activeId===a.id&&H(a)});const n=document.getElementById("slide-canvas");n&&(n.addEventListener("touchstart",a=>{a.touches.length===1&&(c.touchStartX=a.touches[0].clientX,c.touchStartY=a.touches[0].clientY)},{passive:!0}),n.addEventListener("touchend",a=>{if(!c.open||a.changedTouches.length!==1)return;const l=a.changedTouches[0].clientX-c.touchStartX,r=a.changedTouches[0].clientY-c.touchStartY;Math.abs(l)>40&&Math.abs(l)>Math.abs(r)&&Z(c.page+(l<0?1:-1))},{passive:!0}))}y.addEventListener("click",e=>{const i=e.target.closest("[data-open-slides]");if(i){const r=Number(i.dataset.openSlides),u=Number(i.dataset.slidePage||1);r&&G(r,u);return}if(e.target.closest("[data-slide-close]")){le();return}if(e.target.closest("[data-slide-fs]")){O();return}const t=e.target.closest("[data-slide-dir]");if(t&&c.open){const r=Number(t.dataset.slideDir);r&&Z(c.page+r);return}if(e.target.closest("[data-slide-restart]")&&c.open){Z(1);return}const s=e.target.closest("[data-slide-next-ep]");if(s){const r=Number(s.dataset.slideNextEp);r&&(d.activeId=r,history.replaceState(null,"",`#ep-${r}`),E({scrollStage:!0,scrollDir:!0}),G(r,1));return}const n=e.target.closest("[data-category]");if(n){d.category=n.dataset.category,E();return}if(e.target.closest("[data-clear-search]")){d.query="";const r=y.querySelector(".search-input");r&&(r.value="",r.focus()),E();return}const a=e.target.closest("[data-select-ep]");if(a&&!a.disabled){const r=Number(a.dataset.selectEp);r&&(d.activeId=r,history.replaceState(null,"",`#ep-${r}`),E({scrollStage:!0,scrollDir:!0}));return}const l=e.target.closest(".play-btn");if(l){K({previewUrl:l.dataset.previewUrl,title:l.dataset.trackTitle,artist:l.dataset.trackArtist});return}if(e.target.closest("[data-dock-toggle]")){K({previewUrl:d.audioState.currentUrl,title:d.audioState.title,artist:d.audioState.artist});return}e.target.closest("[data-dock-stop]")&&he()});y.addEventListener("compositionstart",e=>{e.target.classList.contains("search-input")&&(d.isComposing=!0)});y.addEventListener("compositionend",e=>{e.target.classList.contains("search-input")&&(T||k(),d.isComposing=!1,d.query=e.target.value,E())});y.addEventListener("focusin",e=>{var t,s;if(e.target.classList.contains("search-input")){k();return}const i=(s=(t=e.target).closest)==null?void 0:s.call(t,"[data-select-ep]");if(i){const n=Number(i.dataset.selectEp);if(n){C(n);const a=m[String(n)];a!=null&&a.prefix&&x(`${a.prefix}1.webp`,"low")}}});y.addEventListener("pointerover",e=>{var s,n,a,l;const i=(n=(s=e.target).closest)==null?void 0:n.call(s,"[data-select-ep]");if(i){const r=Number(i.dataset.selectEp);if(r){C(r);const u=m[String(r)];u!=null&&u.prefix&&(x(`${u.prefix}1.webp`,"high"),x(`${u.prefix}2.webp`,"low"))}return}const t=(l=(a=e.target).closest)==null?void 0:l.call(a,"[data-open-slides]");if(t){const r=Number(t.dataset.openSlides),u=m[String(r)];u!=null&&u.prefix&&x(`${u.prefix}2.webp`,"high")}},{passive:!0});y.addEventListener("input",e=>{e.target.classList.contains("search-input")&&!d.isComposing&&(T||k(),d.query=e.target.value,E())});window.addEventListener("hashchange",()=>{const e=window.location.hash.match(/^#ep-(\d+)$/i);if(e){const i=Number(e[1]);g.episodes.some(t=>t.id===i)&&i!==d.activeId&&(d.activeId=i,E({scrollDir:!0}))}});document.addEventListener("fullscreenchange",S);y.addEventListener("contextmenu",e=>{e.target.closest(".slide-strip, .slide-viewer")&&e.preventDefault()});y.addEventListener("dragstart",e=>{(e.target.closest(".slide-strip, .slide-viewer")||e.target.tagName==="IMG")&&e.preventDefault()});window.addEventListener("keydown",e=>{if(c.open){if((e.metaKey||e.ctrlKey)&&(e.key.toLowerCase()==="s"||e.key.toLowerCase()==="p")){e.preventDefault();return}const a=document.getElementById("slide-viewer");if(e.key==="Escape"){e.preventDefault(),a&&(document.fullscreenElement===a||a.classList.contains("is-fullscreen"))?O():le();return}if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault(),Z(c.page-1);return}if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault(),Z(c.page+1);return}if(e.key==="Home"){e.preventDefault(),Z(1);return}if(e.key==="End"){e.preventDefault();const l=m[String(c.epId)];l&&Z(l.pages);return}e.key.toLowerCase()==="f"&&!e.metaKey&&!e.ctrlKey&&(e.preventDefault(),O());return}const i=e.target&&(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA");if(e.key==="/"&&!i&&!e.metaKey&&!e.ctrlKey){const a=y.querySelector(".search-input");a&&(e.preventDefault(),a.focus(),a.select());return}if(e.key==="Escape"&&d.query){d.query="";const a=y.querySelector(".search-input");a&&(a.value=""),E();return}if(i||e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;const t=Y(),s=t.findIndex(a=>a.id===d.activeId);if(s<0)return;const n=e.key==="ArrowDown"?s+1:s-1;n>=0&&n<t.length&&(e.preventDefault(),d.activeId=t[n].id,history.replaceState(null,"",`#ep-${d.activeId}`),E({scrollDir:!0}))});fe(e=>{d.audioState=e,Se()});async function Pe(){await Promise.race([C(d.activeId),new Promise(e=>setTimeout(e,120))]),Le()}Pe();
