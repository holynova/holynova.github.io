(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const oe="modulepreload",ce=function(e){return"/bernstein-ypc/"+e},V={},pe=function(i,t,n){let r=Promise.resolve();if(t&&t.length>0){let l=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),p=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=l(t.map(u=>{if(u=ce(u),u in V)return;V[u]=!0;const h=u.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${v}`))return;const g=document.createElement("link");if(g.rel=h?"stylesheet":oe,h||(g.as="script"),g.crossOrigin="",g.href=u,p&&g.setAttribute("nonce",p),document.head.appendChild(g),h)return new Promise((Z,$)=>{g.addEventListener("load",Z),g.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return r.then(l=>{for(const a of l||[])a.status==="rejected"&&s(a.reason);return i().catch(s)})},ue="https://space.bilibili.com/353238687/lists/966776",fe="06aa07f7",he=[{id:1,titleZh:"什么是音乐的含义？",titleEn:"What Does Music Mean?",date:"1958-01-18",dateZh:"1958 年 1 月 18 日",category:"基础乐理",hasBilibili:!0},{id:2,titleZh:"什么是美国音乐？",titleEn:"What Is American Music?",date:"1958-02-01",dateZh:"1958 年 2 月 1 日",category:"文化与跨界",hasBilibili:!0},{id:3,titleZh:"什么是配器？",titleEn:"What Is Orchestration?",date:"1958-03-08",dateZh:"1958 年 3 月 8 日",category:"基础乐理",hasBilibili:!0},{id:4,titleZh:"什么让音乐具有交响性？",titleEn:"What Makes Music Symphonic?",date:"1958-12-13",dateZh:"1958 年 12 月 13 日",category:"基础乐理",hasBilibili:!0},{id:5,titleZh:"什么是古典音乐？",titleEn:"What Is Classical Music?",date:"1959-01-24",dateZh:"1959 年 1 月 24 日",category:"基础乐理",hasBilibili:!0},{id:6,titleZh:"音乐中的幽默",titleEn:"Humor in Music",date:"1959-02-28",dateZh:"1959 年 2 月 28 日",category:"基础乐理",hasBilibili:!0},{id:7,titleZh:"什么是协奏曲？",titleEn:"What Is a Concerto?",date:"1959-03-28",dateZh:"1959 年 3 月 28 日",category:"基础乐理",hasBilibili:!0},{id:8,titleZh:"古斯塔夫·马勒是谁？",titleEn:"Who Is Gustav Mahler?",date:"1960-02-07",dateZh:"1960 年 2 月 7 日",category:"大师与杰作",hasBilibili:!0},{id:9,titleZh:"青年演奏家专场（一）：《彼得与狼》",titleEn:'Young Performers No. 1 ("Peter and the Wolf")',date:"1960-03-06",dateZh:"1960 年 3 月 6 日",category:"青年专场",hasBilibili:!0},{id:10,titleZh:"过去、现在与未来的奇特乐器",titleEn:"Unusual Instruments of the Past, Present, and Future",date:"1960-03-27",dateZh:"1960 年 3 月 27 日",category:"基础乐理",hasBilibili:!0},{id:11,titleZh:"第二次飓风",titleEn:"The Second Hurricane",date:"1960-04-24",dateZh:"1960 年 4 月 24 日",category:"文化与跨界",hasBilibili:!1},{id:12,titleZh:"序曲与前奏曲",titleEn:"Overtures and Preludes",date:"1961-01-08",dateZh:"1961 年 1 月 8 日",category:"基础乐理",hasBilibili:!0},{id:13,titleZh:"亚伦·科普兰生日派对",titleEn:"Aaron Copland Birthday Party",date:"1961-02-12",dateZh:"1961 年 2 月 12 日",category:"大师与杰作",hasBilibili:!0},{id:14,titleZh:"青年演奏家专场（二）",titleEn:"Young Performers No. 2",date:"1961-03-19",dateZh:"1961 年 3 月 19 日",category:"青年专场",hasBilibili:!1},{id:15,titleZh:"音乐厅里的民间音乐",titleEn:"Folk Music in the Concert Hall",date:"1961-04-09",dateZh:"1961 年 4 月 9 日",category:"文化与跨界",hasBilibili:!0},{id:16,titleZh:"什么是印象派？",titleEn:"What Is Impressionism?",date:"1961-11-23",dateZh:"1961 年 11 月 23 日",category:"基础乐理",hasBilibili:!0},{id:17,titleZh:"巴黎之路",titleEn:"The Road to Paris",date:"1962-01-18",dateZh:"1962 年 1 月 18 日",category:"文化与跨界",hasBilibili:!0},{id:18,titleZh:"伊戈尔·斯特拉文斯基生日快乐",titleEn:"Happy Birthday, Igor Stravinsky",date:"1962-03-26",dateZh:"1962 年 3 月 26 日",category:"大师与杰作",hasBilibili:!0},{id:19,titleZh:"青年演奏家专场（三）",titleEn:"Young Performers No. 3",date:"1962-04-14",dateZh:"1962 年 4 月 14 日",category:"青年专场",hasBilibili:!1},{id:20,titleZh:"音乐厅的声音",titleEn:"The Sound of a Hall",date:"1962-11-21",dateZh:"1962 年 11 月 21 日",category:"基础乐理",hasBilibili:!0},{id:21,titleZh:"什么是旋律？",titleEn:"What Is a Melody?",date:"1962-12-21",dateZh:"1962 年 12 月 21 日",category:"基础乐理",hasBilibili:!0},{id:22,titleZh:"青年演奏家专场（四）：安德烈·瓦茨首秀",titleEn:"Young Performers No. 4",date:"1963-01-15",dateZh:"1963 年 1 月 15 日",category:"青年专场",hasBilibili:!0},{id:23,titleZh:"拉丁美洲精神",titleEn:"The Latin American Spirit",date:"1963-03-08",dateZh:"1963 年 3 月 8 日",category:"文化与跨界",hasBilibili:!0},{id:24,titleZh:"向老师们致敬",titleEn:"A Tribute to Teachers",date:"1963-11-29",dateZh:"1963 年 11 月 29 日",category:"文化与跨界",hasBilibili:!0},{id:25,titleZh:"青年演奏家专场（五）",titleEn:"Young Performers No. 5",date:"1963-12-23",dateZh:"1963 年 12 月 23 日",category:"青年专场",hasBilibili:!0},{id:26,titleZh:"保罗·欣德米特的天才",titleEn:"The Genius of Paul Hindemith",date:"1964-02-23",dateZh:"1964 年 2 月 23 日",category:"大师与杰作",hasBilibili:!0},{id:27,titleZh:"音乐厅里的爵士乐",titleEn:"Jazz in the Concert Hall",date:"1964-03-11",dateZh:"1964 年 3 月 11 日",category:"文化与跨界",hasBilibili:!0},{id:28,titleZh:"什么是奏鸣曲式？",titleEn:"What Is Sonata Form?",date:"1964-11-06",dateZh:"1964 年 11 月 6 日",category:"基础乐理",hasBilibili:!0},{id:29,titleZh:"告别民族主义",titleEn:"A Farewell to Nationalism",date:"1964-11-30",dateZh:"1964 年 11 月 30 日",category:"文化与跨界",hasBilibili:!0},{id:30,titleZh:"青年演奏家专场（六）",titleEn:"Young Performers No. 6",date:"1965-01-28",dateZh:"1965 年 1 月 28 日",category:"青年专场",hasBilibili:!1},{id:31,titleZh:"向西贝柳斯致敬",titleEn:"A Tribute to Sibelius",date:"1965-02-19",dateZh:"1965 年 2 月 19 日",category:"大师与杰作",hasBilibili:!0},{id:32,titleZh:"音乐原子：音程研究",titleEn:"Musical Atoms: A Study of Interval",date:"1965-11-29",dateZh:"1965 年 11 月 29 日",category:"基础乐理",hasBilibili:!0},{id:33,titleZh:"管弦乐团的声音",titleEn:"The Sound of an Orchestra",date:"1965-12-14",dateZh:"1965 年 12 月 14 日",category:"基础乐理",hasBilibili:!0},{id:34,titleZh:"肖斯塔科维奇生日致敬",titleEn:"A Birthday Tribute to Shostakovich",date:"1966-01-05",dateZh:"1966 年 1 月 5 日",category:"大师与杰作",hasBilibili:!0},{id:35,titleZh:"青年演奏家专场（七）",titleEn:"Young Performers No. 7",date:"1966-02-22",dateZh:"1966 年 2 月 22 日",category:"青年专场",hasBilibili:!0},{id:36,titleZh:"什么是调式？",titleEn:"What Is a Mode?",date:"1966-11-23",dateZh:"1966 年 11 月 23 日",category:"基础乐理",hasBilibili:!0},{id:37,titleZh:"青年演奏家专场（八）",titleEn:"Young Performers No. 8",date:"1967-01-27",dateZh:"1967 年 1 月 27 日",category:"青年专场",hasBilibili:!0},{id:38,titleZh:"查尔斯·艾夫斯：美国先驱",titleEn:"Charles Ives: American Pioneer",date:"1967-02-23",dateZh:"1967 年 2 月 23 日",category:"大师与杰作",hasBilibili:!0},{id:39,titleZh:"校友重聚",titleEn:"Alumni Reunion",date:"1967-04-19",dateZh:"1967 年 4 月 19 日",category:"青年专场",hasBilibili:!0},{id:40,titleZh:"向维也纳举杯（3/4 拍）",titleEn:"A Toast to Vienna in 3/4 Time",date:"1967-12-25",dateZh:"1967 年 12 月 25 日",category:"文化与跨界",hasBilibili:!0},{id:41,titleZh:"永远的贝多芬",titleEn:"Forever Beethoven",date:"1968-01-28",dateZh:"1968 年 1 月 28 日",category:"大师与杰作",hasBilibili:!0},{id:42,titleZh:"青年演奏家专场（九）",titleEn:"Young Performers No. 9",date:"1968-03-31",dateZh:"1968 年 3 月 31 日",category:"青年专场",hasBilibili:!1},{id:43,titleZh:"音乐会小测验：你有多懂音乐？",titleEn:"Quiz-Concert: How Musical Are You?",date:"1968-05-26",dateZh:"1968 年 5 月 26 日",category:"基础乐理",hasBilibili:!0},{id:44,titleZh:"幻想变奏曲：《堂吉诃德》",titleEn:"Fantastic Variations",date:"1968-12-25",dateZh:"1968 年 12 月 25 日",category:"基础乐理",hasBilibili:!0},{id:45,titleZh:"大变身的巴赫",titleEn:"Bach Transmogrified",date:"1969-04-27",dateZh:"1969 年 4 月 27 日",category:"大师与杰作",hasBilibili:!0},{id:46,titleZh:"柏辽兹踏上迷幻之旅",titleEn:"Berlioz Takes a Trip",date:"1969-05-25",dateZh:"1969 年 5 月 25 日",category:"大师与杰作",hasBilibili:!0},{id:47,titleZh:"两只芭蕾舞神鸟",titleEn:"Two Ballet Birds",date:"1969-09-14",dateZh:"1969 年 9 月 14 日",category:"文化与跨界",hasBilibili:!0},{id:48,titleZh:"《费德里奥》：生命的赞歌",titleEn:"Fidelio: A Celebration of Life",date:"1970-03-29",dateZh:"1970 年 3 月 29 日",category:"基础乐理",hasBilibili:!0},{id:49,titleZh:"交响乐团的解剖课",titleEn:"The Anatomy of a Symphony Orchestra",date:"1970-05-24",dateZh:"1970 年 5 月 24 日",category:"基础乐理",hasBilibili:!0},{id:50,titleZh:"阿隆·科普兰庆典",titleEn:"A Copland Celebration",date:"1970-12-27",dateZh:"1970 年 12 月 27 日",category:"大师与杰作",hasBilibili:!0},{id:51,titleZh:"理查·施特劳斯如是说",titleEn:"Thus Spake Richard Strauss",date:"1971-04-04",dateZh:"1971 年 4 月 4 日",category:"大师与杰作",hasBilibili:!0},{id:52,titleZh:"李斯特与魔鬼",titleEn:"Liszt and the Devil",date:"1972-02-13",dateZh:"1972 年 2 月 13 日",category:"大师与杰作",hasBilibili:!0},{id:53,titleZh:"霍尔斯特：《行星组曲》",titleEn:"Holst: The Planets",date:"1972-03-26",dateZh:"1972 年 3 月 26 日",category:"大师与杰作",hasBilibili:!0}],W={bilibiliCollectionUrl:ue,epHash:fe,episodes:he},y={3:{prefix:"/bernstein-ypc/static/3b97910c5ae165d1/",pdfUrl:"/bernstein-ypc/slides/ep-03.pdf",pages:15},4:{prefix:"/bernstein-ypc/static/e446668bd5abd059/",pdfUrl:"/bernstein-ypc/slides/ep-04.pdf",pages:15},5:{prefix:"/bernstein-ypc/static/f278a1ee5eedd5ec/",pdfUrl:"/bernstein-ypc/slides/ep-05.pdf",pages:15},7:{prefix:"/bernstein-ypc/static/1da1f85cc56b6904/",pdfUrl:"/bernstein-ypc/slides/ep-07.pdf",pages:15},8:{prefix:"/bernstein-ypc/static/2d3c2f5471c2d37d/",pdfUrl:"/bernstein-ypc/slides/ep-08.pdf",pages:15},10:{prefix:"/bernstein-ypc/static/5a9e4faf280fdad8/",pdfUrl:"/bernstein-ypc/slides/ep-10.pdf",pages:15},14:{prefix:"/bernstein-ypc/static/d52ac5ca9f085b61/",pdfUrl:"/bernstein-ypc/slides/ep-14.pdf",pages:15},15:{prefix:"/bernstein-ypc/static/08b81e16193e5b71/",pdfUrl:"/bernstein-ypc/slides/ep-15.pdf",pages:15},16:{prefix:"/bernstein-ypc/static/a7ee9fed99b2b0c4/",pdfUrl:"/bernstein-ypc/slides/ep-16.pdf",pages:15},17:{prefix:"/bernstein-ypc/static/71de5aa617119ea4/",pdfUrl:"/bernstein-ypc/slides/ep-17.pdf",pages:15},18:{prefix:"/bernstein-ypc/static/9921bba9b09d08fc/",pdfUrl:"/bernstein-ypc/slides/ep-18.pdf",pages:15},20:{prefix:"/bernstein-ypc/static/b4f49129814311fc/",pdfUrl:"/bernstein-ypc/slides/ep-20.pdf",pages:15},21:{prefix:"/bernstein-ypc/static/ad4a3006d6f7fec2/",pdfUrl:"/bernstein-ypc/slides/ep-21.pdf",pages:15},23:{prefix:"/bernstein-ypc/static/8fd61816d16c3fc2/",pdfUrl:"/bernstein-ypc/slides/ep-23.pdf",pages:15},26:{prefix:"/bernstein-ypc/static/47486e6fce65e883/",pdfUrl:"/bernstein-ypc/slides/ep-26.pdf",pages:15},27:{prefix:"/bernstein-ypc/static/0bc26f63b20e8756/",pdfUrl:"/bernstein-ypc/slides/ep-27.pdf",pages:15},28:{prefix:"/bernstein-ypc/static/b754fa802197c520/",pdfUrl:"/bernstein-ypc/slides/ep-28.pdf",pages:15},29:{prefix:"/bernstein-ypc/static/c1eb57c1108d9954/",pdfUrl:"/bernstein-ypc/slides/ep-29.pdf",pages:15},31:{prefix:"/bernstein-ypc/static/1581ddc96c025db7/",pdfUrl:"/bernstein-ypc/slides/ep-31.pdf",pages:15},32:{prefix:"/bernstein-ypc/static/3eb8188cf0ab9a96/",pdfUrl:"/bernstein-ypc/slides/ep-32.pdf",pages:15},33:{prefix:"/bernstein-ypc/static/dea521ce2409974e/",pdfUrl:"/bernstein-ypc/slides/ep-33.pdf",pages:15},35:{prefix:"/bernstein-ypc/static/3cbb0e0e0b2e5db7/",pdfUrl:"/bernstein-ypc/slides/ep-35.pdf",pages:15},38:{prefix:"/bernstein-ypc/static/98d0befb98d28222/",pdfUrl:"/bernstein-ypc/slides/ep-38.pdf",pages:15},39:{prefix:"/bernstein-ypc/static/c8a1e8bf48864c98/",pdfUrl:"/bernstein-ypc/slides/ep-39.pdf",pages:15},40:{prefix:"/bernstein-ypc/static/886561f59c5ce832/",pdfUrl:"/bernstein-ypc/slides/ep-40.pdf",pages:15},41:{prefix:"/bernstein-ypc/static/7f895ba3b1284ada/",pdfUrl:"/bernstein-ypc/slides/ep-41.pdf",pages:15},42:{prefix:"/bernstein-ypc/static/788c4430a03d800a/",pdfUrl:"/bernstein-ypc/slides/ep-42.pdf",pages:15},43:{prefix:"/bernstein-ypc/static/3af7dbc0eab16a31/",pdfUrl:"/bernstein-ypc/slides/ep-43.pdf",pages:15},44:{prefix:"/bernstein-ypc/static/b6d1256d3789c933/",pdfUrl:"/bernstein-ypc/slides/ep-44.pdf",pages:15},45:{prefix:"/bernstein-ypc/static/061ffe3a41b6f5ac/",pdfUrl:"/bernstein-ypc/slides/ep-45.pdf",pages:15},46:{prefix:"/bernstein-ypc/static/fd36a144ee4ac82e/",pdfUrl:"/bernstein-ypc/slides/ep-46.pdf",pages:15},47:{prefix:"/bernstein-ypc/static/99df0bce991c6b1d/",pdfUrl:"/bernstein-ypc/slides/ep-47.pdf",pages:15},48:{prefix:"/bernstein-ypc/static/4cf5d8bfabca27df/",pdfUrl:"/bernstein-ypc/slides/ep-48.pdf",pages:15},49:{prefix:"/bernstein-ypc/static/b60cc1c00376a4ce/",pdfUrl:"/bernstein-ypc/slides/ep-49.pdf",pages:15},50:{prefix:"/bernstein-ypc/static/cec50be1dc98232c/",pdfUrl:"/bernstein-ypc/slides/ep-50.pdf",pages:15},51:{prefix:"/bernstein-ypc/static/a039c683a99cc522/",pdfUrl:"/bernstein-ypc/slides/ep-51.pdf",pages:15},52:{prefix:"/bernstein-ypc/static/f2008b082df03791/",pdfUrl:"/bernstein-ypc/slides/ep-52.pdf",pages:15},53:{prefix:"/bernstein-ypc/static/ee848a496f95ccea/",pdfUrl:"/bernstein-ypc/slides/ep-53.pdf",pages:15}},f={audio:null,currentUrl:null,title:"",artist:"",isPlaying:!1},H=new Set;function L(){for(const e of H)e({...f})}function be(e){return H.add(e),e({...f}),()=>H.delete(e)}function z({previewUrl:e,title:i,artist:t}){if(e){if(f.audio||(f.audio=new Audio,f.audio.addEventListener("ended",()=>{f.isPlaying=!1,L()}),f.audio.addEventListener("pause",()=>{f.isPlaying=!1,L()}),f.audio.addEventListener("play",()=>{f.isPlaying=!0,L()})),f.currentUrl===e){f.audio.paused?f.audio.play().catch(()=>{}):f.audio.pause();return}f.audio.pause(),f.currentUrl=e,f.title=i,f.artist=t||"",f.audio.src=e,f.audio.play().catch(()=>{}),L()}}function ge(){f.audio&&(f.audio.pause(),f.audio.currentTime=0),f.currentUrl=null,f.isPlaying=!1,L()}function ye(){return{...f}}const me=["全部","基础乐理","大师与杰作","文化与跨界","青年专场"];function o(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}const M={search:'<svg class="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14" stroke-linecap="round"/></svg>',chevron:'<svg class="rep-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',play:'<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2.2v7.6L9.8 6 3 2.2Z"/></svg>',pause:'<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2" width="2.4" height="8" rx="0.5"/><rect x="7.1" y="2" width="2.4" height="8" rx="0.5"/></svg>'};function G(e,i){return e===i?`${i} 课`:`${e} / ${i} 课`}function ve({collectionUrl:e,visibleCount:i,totalCount:t}){return`
    <header class="proto-bar">
      <div class="proto-bar-inner">
        <div class="brand-group">
          <h1 class="site-title">伯恩斯坦《青少年音乐会》</h1>
          <span class="site-years tabular-nums" id="site-count">${G(i,t)}</span>
        </div>
        <nav class="header-links" aria-label="外部链接">
          <a class="script-link" href="${o(e)}" target="_blank" rel="noopener">掘火中译合集 ↗</a>
          <a class="script-link" href="https://github.com/holynova/bernstein-ypc" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
      </div>
    </header>
  `}function Ee({category:e,query:i}){return`
    <div class="proto-c-side-controls">
      <div class="search-wrap">
        ${M.search}
        <input
          type="search"
          class="search-input"
          value="${o(i)}"
          placeholder="搜索课题、作曲家、曲目… ( / )"
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
      <div class="filter-pills" role="group" aria-label="课程分类">
        ${me.map(t=>`<button type="button" class="filter-pill" data-category="${o(t)}" aria-pressed="${e===t?"true":"false"}">${o(t)}</button>`).join("")}
      </div>
    </div>
  `}function J(e,i){const t=i?`<button type="button" class="slide-trigger-btn" data-open-slides="${e.id}" data-slide-page="1">图解 PPT · ${i.pages} 页</button>`:"",n=e.bilibili?`<a class="bili-link" href="${o(e.bilibili.url)}" target="_blank" rel="noopener" title="${o(e.bilibili.title)}">掘火中译 · ${o(e.bilibili.duration)} ↗</a>`:e.bilibiliSearchUrl?`<a class="bili-link is-search" href="${o(e.bilibiliSearchUrl)}" target="_blank" rel="noopener">B站检索 ↗</a>`:"",r=e.scriptUrl?`<a class="script-link" href="${o(e.scriptUrl)}" target="_blank" rel="noopener">英文讲稿 ↗</a>`:"";return`<div class="ep-links" data-stage-links>${t}${n}${r}</div>`}function $e(e,i){if(!i||!i.prefix||!i.pages)return"";const t=`${i.prefix}1.webp`;return`
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
          fetchpriority="high"
          decoding="async"
        />
        <span class="slide-cover-badge tabular-nums">1 / ${i.pages} · 全屏</span>
      </button>
    </section>
  `}function we(e,i){const t=e.repertoire||[];return t.length?`
    <details class="rep-details">
      <summary class="rep-summary">
        ${M.chevron}
        <span>曲目 · ${t.length} 首</span>
      </summary>
      <ul class="rep-list">
        ${t.map(n=>{const r=i.currentUrl&&i.currentUrl===n.previewUrl&&i.isPlaying,s=n.previewUrl?`<button
                  type="button"
                  class="play-btn"
                  data-preview-url="${o(n.previewUrl)}"
                  data-track-title="${o(n.titleZh||n.piece)}"
                  data-track-artist="${o(n.recordingArtist||n.composer)}"
                  aria-pressed="${r?"true":"false"}"
                >${r?M.pause:M.play}<span>${r?"暂停":"试听"}</span></button>`:"",l=n.appleMusicUrl?`<a class="track-ext-link" href="${o(n.appleMusicUrl)}" target="_blank" rel="noopener">Apple Music</a>`:`<a class="track-ext-link" href="${o(n.youtubeSearchUrl)}" target="_blank" rel="noopener">YouTube</a>`,a=`<a class="track-ext-link" href="${o(n.biliSearchUrl)}" target="_blank" rel="noopener">B站</a>`;return`
              <li class="rep-item">
                <div class="rep-info">
                  <span class="rep-composer">${o(n.composer)}</span>
                  <span class="rep-piece">${o(n.titleZh)} · ${o(n.piece)}</span>
                </div>
                <div class="rep-actions">
                  ${s}
                  ${l}
                  ${a}
                </div>
              </li>
            `}).join("")}
      </ul>
    </details>
  `:""}function Be(e){return!e.thesis&&!e.plain?'<p class="ep-thesis" aria-busy="true">正在载入讲稿与曲目…</p>':`
    <p class="ep-thesis">${o(e.thesis)}</p>
    <p class="ep-plain">${o(e.plain)}</p>
    ${e.scenes&&e.scenes.length?`<ul class="ep-scenes">${e.scenes.map(i=>`<li>${o(i)}</li>`).join("")}</ul>`:""}
    <div class="ep-concepts">${o(e.concepts)}</div>
  `}function Q(e,i){return`${Be(e)}${we(e,i)}`}function ee(e,i,t={}){return e.length?e.map(n=>{const r=!!t[String(n.id)],s=!!(n.hasBilibili??n.bilibili);return`
      <li>
        <button
          type="button"
          class="dir-btn"
          data-select-ep="${n.id}"
          aria-current="${n.id===i?"true":"false"}"
        >
          <span class="dir-num">${String(n.id).padStart(2,"0")}</span>
          <span class="dir-title">${o(n.titleZh)}</span>
          <span class="dir-meta">
            ${s||r?`<span class="dir-indicators" aria-hidden="true">
                    ${s?'<span class="dir-dot is-bili" title="含 B站掘火中译视频"></span>':""}
                    ${r?'<span class="dir-dot is-slide" title="含图解 PPT"></span>':""}
                  </span>`:""}
            <span class="dir-year">${o(n.date.slice(0,4))}</span>
          </span>
        </button>
      </li>
    `}).join(""):'<li class="empty-state">没有匹配的课程</li>'}function te(e,i,t,n,r={}){const s=e.find(h=>h.id===t)||e[0]||null;if(!s)return`<div class="empty-state">没有找到符合条件的课程${i.length?"，请尝试换个关键词或切换分类。":""}</div>`;const l=e.findIndex(h=>h.id===s.id),a=l>0?e[l-1]:null,p=l>=0&&l<e.length-1?e[l+1]:null,u=r[String(s.id)]||null;return`
    <div class="stage-top-row">
      <div class="stage-date-num">
        <span class="stage-big-num">第 ${s.id} 集</span>
        <time datetime="${o(s.date)}">${o(s.dateZh)}</time>
      </div>
      ${J(s,u)}
    </div>
    <h2 class="stage-title-zh">${o(s.titleZh)}</h2>
    <p class="stage-title-en">${o(s.titleEn)}</p>
    ${$e(s,u)}
    <div class="stage-detail-body" data-stage-body>
      ${Q(s,n)}
    </div>
    <div class="stage-nav">
      <button type="button" class="stage-nav-btn" data-select-ep="${a?a.id:""}" ${a?"":"disabled"}>← ${a?`第 ${a.id} 集 · ${o(a.titleZh)}`:"已至首课"}</button>
      <button type="button" class="stage-nav-btn" data-select-ep="${p?p.id:""}" ${p?"":"disabled"}>${p?`第 ${p.id} 集 · ${o(p.titleZh)}`:"已至末课"} →</button>
    </div>
  `}function Ze({episodes:e,allEpisodes:i,category:t,query:n,activeId:r,audioState:s,slidesMap:l={}}){return`
    <div class="proto-c-shell">
      <aside class="proto-c-sidebar" aria-label="课程目录与搜索">
        ${Ee({category:t,query:n})}
        <ul class="proto-c-dir-list" id="proto-c-dir-list">
          ${ee(e,r,l)}
        </ul>
      </aside>
      <main class="proto-c-stage" id="proto-c-stage">
        ${te(e,i,r,s,l)}
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
        <img id="slide-img" class="slide-img" width="1376" height="768" alt="" decoding="async" />
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
  `}function ie(e){return`
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
  `}const b={bilibiliCollectionUrl:W.bilibiliCollectionUrl,episodes:W.episodes.map(e=>({...e}))},se=new Map(b.episodes.map(e=>[e.id,e])),C=new Map;let k=null,P=!1,X=!1;function Se(){var n;const e=new URLSearchParams(window.location.search),i=Number(e.get("ep"));if(i&&b.episodes.some(r=>r.id===i))return i;const t=window.location.hash.match(/^#ep-(\d+)$/i);if(t){const r=Number(t[1]);if(b.episodes.some(s=>s.id===r))return r}return((n=b.episodes[0])==null?void 0:n.id)??1}const d={category:"全部",query:"",isComposing:!1,activeId:Se(),audioState:ye()},m=document.getElementById("app");function ne(e){const i=(e.repertoire||[]).map(t=>`${t.composer} ${t.piece} ${t.titleZh} ${t.recordingArtist||""}`).join(" ");return[e.id,`第${e.id}集`,e.date,e.titleZh,e.titleEn,e.category,e.concepts||"",e.thesis||"",e.plain||"",...e.scenes||[],i].join(" ").toLowerCase()}const re=new Map(b.episodes.map(e=>[e.id,ne(e)]));function ae(e){if(!e||!e.id)return null;const i=se.get(e.id);return i?(Object.assign(i,e,{_loaded:!0}),re.set(i.id,ne(i)),i):null}function A(e,{priority:i="high"}={}){const t=se.get(e);if(!t)return Promise.resolve(null);if(t._loaded)return Promise.resolve(t);if(C.has(e))return C.get(e);let n;typeof window<"u"&&window.__EP_PRELOAD__&&String(window.__EP_ID__)===String(e)?(n=window.__EP_PRELOAD__,window.__EP_PRELOAD__=null):n=fetch(`/bernstein-ypc/ep/${W.epHash}/${e}.json`,{priority:i}).then(l=>l.ok?l.json():null).catch(()=>null);const r=n.then(s=>s?ae(s):(C.delete(e),t));return C.set(e,r),r}function U(){return P?Promise.resolve():k||(k=pe(()=>import("./episodes-US6DB2TF.js"),[]).then(e=>{var t;const i=((t=e==null?void 0:e.default)==null?void 0:t.episodes)||[];for(const n of i)ae(n);P=!0,d.query.trim()&&E()}).catch(()=>{k=null}),k)}function R(){const e=d.query.trim().toLowerCase().split(/\s+/).filter(Boolean);return b.episodes.filter(i=>{if(d.category!=="全部"&&i.category!==d.category)return!1;if(!e.length)return!0;const t=re.get(i.id)||"";return e.every(n=>t.includes(n))})}function Ie(){const{currentUrl:e,isPlaying:i}=d.audioState;document.querySelectorAll(".play-btn").forEach(n=>{const r=n.dataset.previewUrl===e&&i;n.setAttribute("aria-pressed",r?"true":"false");const s=n.querySelector("span");s&&(s.textContent=r?"暂停":"试听");const l=n.querySelector("svg");l&&(l.innerHTML=r?'<rect x="2.5" y="2" width="2.4" height="8" rx="0.5"/><rect x="7.1" y="2" width="2.4" height="8" rx="0.5"/>':'<path d="M3 2.2v7.6L9.8 6 3 2.2Z"/>')});const t=document.querySelector(".audio-dock");t&&(t.outerHTML=ie(d.audioState))}function O(e){const i=document.getElementById("proto-c-stage");if(!i||i.dataset.renderedEpId!==String(e.id))return;const t=i.querySelector("[data-stage-links]");t&&(t.outerHTML=J(e,y[String(e.id)]||null));const n=i.querySelector("[data-stage-body]");n&&(n.innerHTML=Q(e,d.audioState))}function D(){if(P||X)return;X=!0;const e=()=>{typeof requestIdleCallback=="function"?requestIdleCallback(()=>U(),{timeout:2e3}):setTimeout(()=>U(),250)};document.readyState==="complete"?setTimeout(e,250):window.addEventListener("load",()=>setTimeout(e,250),{once:!0})}function le(){const e=d.activeId,i=y[String(e)],t=document.getElementById("proto-c-stage"),n=t==null?void 0:t.querySelector(".slide-cover-img");if(!i||i.pages<2||!n){D();return}const r=()=>{d.activeId!==e||c.open||B(`${i.prefix}2.webp`,"low").then(()=>{D()})};n.complete&&n.naturalWidth>0?(T.add(`${i.prefix}1.webp`),r()):(n.addEventListener("load",()=>{T.add(`${i.prefix}1.webp`),r()},{once:!0}),n.addEventListener("error",()=>D(),{once:!0}))}function E({scrollStage:e=!1,scrollDir:i=!1}={}){const t=R();t.length&&!t.some(a=>a.id===d.activeId)&&(d.activeId=t[0].id);const n=document.getElementById("site-count");n&&(n.textContent=G(t.length,b.episodes.length));const r=m.querySelector("[data-clear-search]");r&&(r.hidden=!d.query),m.querySelectorAll("[data-category]").forEach(a=>{a.setAttribute("aria-pressed",a.dataset.category===d.category?"true":"false")});const s=document.getElementById("proto-c-dir-list");if(s&&(s.innerHTML=ee(t,d.activeId,y),i)){const a=s.querySelector('[aria-current="true"]');a&&a.scrollIntoView({block:"nearest"})}const l=document.getElementById("proto-c-stage");if(l){const a=t.find(u=>u.id===d.activeId)||t[0]||null;a&&l.dataset.renderedEpId===String(a.id)?O(a):(l.dataset.renderedEpId=a?String(a.id):"",l.innerHTML=te(t,b.episodes,d.activeId,d.audioState,y),a&&le()),a&&!a._loaded&&A(a.id,{priority:"high"}).then(u=>{u&&d.activeId===u.id&&O(u)}),e&&window.innerWidth<=920&&l.scrollIntoView({behavior:"smooth",block:"start"})}}const ke=64,_=new Map,w=new Map,T=new Set,c={open:!1,epId:null,page:1,renderToken:0,touchStartX:0,touchStartY:0};function B(e,i="low"){if(!e)return Promise.resolve(null);if(w.has(e)){const r=w.get(e);return w.delete(e),w.set(e,r),Promise.resolve(r)}if(_.has(e))return _.get(e);const t=new Image;t.decoding="async","fetchPriority"in t&&(t.fetchPriority=i),t.src=e;const n=new Promise(r=>{const s=l=>{if(l&&t.naturalWidth>0){if(w.size>=ke){const a=w.keys().next().value;w.delete(a),T.delete(a)}w.set(e,t),T.add(e),r(t)}else _.delete(e),r(null)};if(t.complete&&t.naturalWidth>0){typeof t.decode=="function"?t.decode().then(()=>s(!0),()=>s(t.naturalWidth>0)):s(!0);return}t.onload=()=>{typeof t.decode=="function"?t.decode().then(()=>s(!0),()=>s(t.naturalWidth>0)):s(!0)},t.onerror=()=>s(!1)});return _.set(e,n),n}function Le(e){const i=b.episodes.findIndex(t=>t.id===e);for(let t=i+1;t<b.episodes.length;t++){const n=b.episodes[t];if(y[String(n.id)])return n}return null}function S(){const e=document.getElementById("slide-viewer"),i=document.getElementById("slide-fs-btn");if(!e||!i)return;const t=!!(document.fullscreenElement===e||e.classList.contains("is-fullscreen"));i.textContent=t?"退出全屏":"全屏"}function F(){var i;const e=document.getElementById("slide-viewer");if(e){if(document.fullscreenElement===e){(i=document.exitFullscreen)==null||i.call(document).catch(()=>{}),e.classList.remove("is-fullscreen"),S();return}if(e.classList.contains("is-fullscreen")){e.classList.remove("is-fullscreen"),S();return}typeof e.requestFullscreen=="function"?e.requestFullscreen().then(()=>{e.classList.add("is-fullscreen"),S()}).catch(()=>{e.classList.add("is-fullscreen"),S()}):(e.classList.add("is-fullscreen"),S())}}function x(e){var j;const i=b.episodes.find(I=>I.id===c.epId),t=y[String(c.epId)],n=document.getElementById("slide-viewer"),r=document.getElementById("slide-img"),s=document.getElementById("slide-page-badge"),l=document.getElementById("slide-end"),a=document.getElementById("slide-end-title"),p=document.getElementById("slide-next-ep-btn");if(!i||!t||!n||!r||!s||!l)return;const u=t.pages,h=Math.max(1,Math.min(e,u+1));if(c.page=h,h>u){++c.renderToken,(j=document.getElementById("slide-canvas"))==null||j.classList.remove("is-loading");const I=document.getElementById("slide-loading-pill");I&&(I.hidden=!0),r.hidden=!0,l.hidden=!1,s.textContent=`${u} / ${u}`,a&&(a.textContent=`第 ${i.id} 集 · ${i.titleZh}（共 ${u} 页）`);const N=Le(i.id);p&&(N?(p.hidden=!1,p.dataset.slideNextEp=String(N.id),p.textContent=`下一课图解：第 ${N.id} 集 →`):p.hidden=!0);return}l.hidden=!0,r.hidden=!1,s.textContent=`${h} / ${u}`,r.alt=`第 ${i.id} 集《${i.titleZh}》图解幻灯片第 ${h} 页`;const v=`${t.prefix}${h}.webp`,g=++c.renderToken,Z=document.getElementById("slide-canvas"),$=document.getElementById("slide-loading-pill"),Y=async()=>{if(h+1<=u){if(!c.open||g!==c.renderToken)return;await B(`${t.prefix}${h+1}.webp`,"high")}if(h+2<=u){if(!c.open||g!==c.renderToken)return;await B(`${t.prefix}${h+2}.webp`,"low")}if(h-1>=1){if(!c.open||g!==c.renderToken)return;await B(`${t.prefix}${h-1}.webp`,"low")}};if(w.has(v)||T.has(v)){Z&&Z.classList.remove("is-loading"),$&&($.hidden=!0),r.src=v,Y();return}let q=null;Z&&Z.classList.add("is-loading"),$&&($.hidden=!0,q=setTimeout(()=>{c.open&&g===c.renderToken&&($.hidden=!1)},120)),B(v,"high").then(I=>{q&&clearTimeout(q),!(!c.open||g!==c.renderToken)&&(Z&&Z.classList.remove("is-loading"),$&&($.hidden=!0),I&&(r.src=v),Y())})}function K(e,i=1){const t=b.episodes.find(l=>l.id===e),n=y[String(e)],r=document.getElementById("slide-viewer");if(!t||!n||!r)return;c.open=!0,c.epId=e;const s=document.getElementById("slide-viewer-title");s&&(s.textContent=`第 ${t.id} 集 · ${t.titleZh}`),r.hidden=!1,document.documentElement.classList.add("slide-viewer-open"),x(i)}function de(){var n;const e=document.getElementById("slide-viewer");if(!e)return;++c.renderToken;const i=document.getElementById("slide-canvas"),t=document.getElementById("slide-loading-pill");i&&i.classList.remove("is-loading"),t&&(t.hidden=!0),document.fullscreenElement===e&&((n=document.exitFullscreen)==null||n.call(document).catch(()=>{})),e.classList.remove("is-fullscreen"),S(),e.hidden=!0,document.documentElement.classList.remove("slide-viewer-open"),c.open=!1}function Pe(){document.body.setAttribute("data-proto","c");const e=R(),i="v1.0.2";m.innerHTML=`
    ${ve({collectionUrl:b.bilibiliCollectionUrl,visibleCount:e.length,totalCount:b.episodes.length})}
    ${Ze({episodes:e,allEpisodes:b.episodes,category:d.category,query:d.query,activeId:d.activeId,audioState:d.audioState,slidesMap:y})}
    <footer class="site-footer">
      <span>讲稿依据 Leonard Bernstein 官方脚本 · 纽约爱乐档案核验</span>
      <span>${i} · B站 <a class="script-link" href="${b.bilibiliCollectionUrl}" target="_blank" rel="noopener">掘火档案（掘火中译）</a></span>
    </footer>
    ${ie(d.audioState)}
    ${xe()}
  `;const t=document.getElementById("proto-c-stage"),n=e.find(s=>s.id===d.activeId)||e[0]||null;t&&(t.dataset.renderedEpId=n?String(n.id):""),le(),n&&!n._loaded&&A(n.id,{priority:"high"}).then(s=>{s&&d.activeId===s.id&&O(s)});const r=document.getElementById("slide-canvas");r&&(r.addEventListener("touchstart",s=>{s.touches.length===1&&(c.touchStartX=s.touches[0].clientX,c.touchStartY=s.touches[0].clientY)},{passive:!0}),r.addEventListener("touchend",s=>{if(!c.open||s.changedTouches.length!==1)return;const l=s.changedTouches[0].clientX-c.touchStartX,a=s.changedTouches[0].clientY-c.touchStartY;Math.abs(l)>40&&Math.abs(l)>Math.abs(a)&&x(c.page+(l<0?1:-1))},{passive:!0}))}m.addEventListener("click",e=>{const i=e.target.closest("[data-open-slides]");if(i){const a=Number(i.dataset.openSlides),p=Number(i.dataset.slidePage||1);a&&K(a,p);return}if(e.target.closest("[data-slide-close]")){de();return}if(e.target.closest("[data-slide-fs]")){F();return}const t=e.target.closest("[data-slide-dir]");if(t&&c.open){const a=Number(t.dataset.slideDir);a&&x(c.page+a);return}if(e.target.closest("[data-slide-restart]")&&c.open){x(1);return}const n=e.target.closest("[data-slide-next-ep]");if(n){const a=Number(n.dataset.slideNextEp);a&&(d.activeId=a,history.replaceState(null,"",`#ep-${a}`),E({scrollStage:!0,scrollDir:!0}),K(a,1));return}const r=e.target.closest("[data-category]");if(r){d.category=r.dataset.category,E();return}if(e.target.closest("[data-clear-search]")){d.query="";const a=m.querySelector(".search-input");a&&(a.value="",a.focus()),E();return}const s=e.target.closest("[data-select-ep]");if(s&&!s.disabled){const a=Number(s.dataset.selectEp);a&&(d.activeId=a,history.replaceState(null,"",`#ep-${a}`),E({scrollStage:!0,scrollDir:!0}));return}const l=e.target.closest(".play-btn");if(l){z({previewUrl:l.dataset.previewUrl,title:l.dataset.trackTitle,artist:l.dataset.trackArtist});return}if(e.target.closest("[data-dock-toggle]")){z({previewUrl:d.audioState.currentUrl,title:d.audioState.title,artist:d.audioState.artist});return}e.target.closest("[data-dock-stop]")&&ge()});m.addEventListener("compositionstart",e=>{e.target.classList.contains("search-input")&&(d.isComposing=!0)});m.addEventListener("compositionend",e=>{e.target.classList.contains("search-input")&&(P||U(),d.isComposing=!1,d.query=e.target.value,E())});m.addEventListener("focusin",e=>{var t,n;if(e.target.classList.contains("search-input")){U();return}const i=(n=(t=e.target).closest)==null?void 0:n.call(t,"[data-select-ep]");if(i){const r=Number(i.dataset.selectEp);if(r){A(r,{priority:"low"});const s=y[String(r)];s!=null&&s.prefix&&B(`${s.prefix}1.webp`,"low")}}});m.addEventListener("pointerover",e=>{var n,r,s,l;const i=(r=(n=e.target).closest)==null?void 0:r.call(n,"[data-select-ep]");if(i){const a=Number(i.dataset.selectEp);if(a){A(a,{priority:"low"});const p=y[String(a)];p!=null&&p.prefix&&(B(`${p.prefix}1.webp`,"high"),B(`${p.prefix}2.webp`,"low"))}return}const t=(l=(s=e.target).closest)==null?void 0:l.call(s,"[data-open-slides]");if(t){const a=Number(t.dataset.openSlides),p=y[String(a)];p!=null&&p.prefix&&B(`${p.prefix}2.webp`,"high")}},{passive:!0});m.addEventListener("input",e=>{e.target.classList.contains("search-input")&&!d.isComposing&&(P||U(),d.query=e.target.value,E())});window.addEventListener("hashchange",()=>{const e=window.location.hash.match(/^#ep-(\d+)$/i);if(e){const i=Number(e[1]);b.episodes.some(t=>t.id===i)&&i!==d.activeId&&(d.activeId=i,E({scrollDir:!0}))}});document.addEventListener("fullscreenchange",S);window.addEventListener("keydown",e=>{if(c.open){const s=document.getElementById("slide-viewer");if(e.key==="Escape"){e.preventDefault(),s&&(document.fullscreenElement===s||s.classList.contains("is-fullscreen"))?F():de();return}if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault(),x(c.page-1);return}if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault(),x(c.page+1);return}if(e.key==="Home"){e.preventDefault(),x(1);return}if(e.key==="End"){e.preventDefault();const l=y[String(c.epId)];l&&x(l.pages);return}e.key.toLowerCase()==="f"&&!e.metaKey&&!e.ctrlKey&&(e.preventDefault(),F());return}const i=e.target&&(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA");if(e.key==="/"&&!i&&!e.metaKey&&!e.ctrlKey){const s=m.querySelector(".search-input");s&&(e.preventDefault(),s.focus(),s.select());return}if(e.key==="Escape"&&d.query){d.query="";const s=m.querySelector(".search-input");s&&(s.value=""),E();return}if(i||e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;const t=R(),n=t.findIndex(s=>s.id===d.activeId);if(n<0)return;const r=e.key==="ArrowDown"?n+1:n-1;r>=0&&r<t.length&&(e.preventDefault(),d.activeId=t[r].id,history.replaceState(null,"",`#ep-${d.activeId}`),E({scrollDir:!0}))});be(e=>{d.audioState=e,Ie()});async function Ue(){await Promise.race([A(d.activeId,{priority:"high"}),new Promise(e=>setTimeout(e,120))]),Pe()}Ue();
