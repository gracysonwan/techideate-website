/*
 * TECHIDEATE About page: intro + zigzag event timeline
 * ----------------------------------------------------
 * Everything shown here comes from public/screens/screens.json:
 *   "about"        -> intro text, the 3 info cards, contact email
 *   "majorEvents"  -> the timeline (sorted by date and time automatically)
 *                     poster = image shown next to the event (if empty, the video is shown)
 * The numbers (days, events, clubs) are counted automatically from screens.json.
 *
 * You normally do NOT need to edit this file. Edit screens.json instead.
 */
(function () {
  'use strict';
  var BASE = '/screens/';
  var cfg = null;
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  /* ---------------- styles ---------------- */
  var CSS = [
    "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap');",
    '#about.ta-on{position:fixed;inset:0;overflow-y:auto;overflow-x:hidden;z-index:50;pointer-events:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#00a8ff55 transparent}',
    '#about.ta-on{-webkit-mask-image:linear-gradient(transparent 0,transparent 70px,#000 130px);mask-image:linear-gradient(transparent 0,transparent 70px,#000 130px)}',
    '#about.ta-on::-webkit-scrollbar{width:6px}#about.ta-on::-webkit-scrollbar-thumb{background:#00a8ff55;border-radius:6px}',
    '#about.ta-on #about-text-container,#about.ta-on .credits{display:none!important}',
    '#techi-about{--ta-blue:#00a8ff;--ta-cyan:#5fe1ff;--ta-ink:#eaf7ff;--ta-soft:#9fc6e6;--ta-card:rgba(6,22,46,.78);--ta-line:rgba(0,168,255,.28);',
    '  position:relative;z-index:101;color:var(--ta-ink);font-family:forma-djr-display,"Segoe UI",Arial,sans-serif;padding:0 50px 60px;box-sizing:border-box}',
    '#techi-about *{box-sizing:border-box}',
    '#techi-about .ta-mono{font-family:"JetBrains Mono",ui-monospace,Consolas,monospace}',

    /* hero */
    '#techi-about .ta-hero{padding-top:calc(clamp(130px,17vh,170px) + clamp(150px,22vh,230px));min-height:100vh;display:flex;flex-direction:column;justify-content:flex-start;max-width:1180px}',
    '#techi-about .ta-lead{font-size:clamp(17px,1.45vw,23px);line-height:1.55;font-weight:500;max-width:780px;margin:0 0 34px;text-shadow:0 0 14px rgba(0,168,255,.45),0 2px 6px #000}',
    '#techi-about .ta-stats{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 30px}',
    '#techi-about .ta-stat{min-width:150px;padding:14px 20px 12px;border:1px solid var(--ta-line);border-radius:12px;background:rgba(6,22,46,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '#techi-about .ta-stat b{display:block;font-size:clamp(28px,2.6vw,40px);line-height:1;color:var(--ta-blue);text-shadow:0 0 18px rgba(0,168,255,.55)}',
    '#techi-about .ta-stat span{display:block;margin-top:8px;font-size:11px;letter-spacing:.28em;color:var(--ta-soft)}',
    '#techi-about .ta-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 28px}',
    '#techi-about .ta-info{padding:20px 22px;border-radius:14px;background:var(--ta-card);border:1px solid var(--ta-line);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);position:relative;overflow:hidden}',
    '#techi-about .ta-info:before{content:"";position:absolute;left:0;top:0;height:2px;width:46px;background:var(--ta-blue);box-shadow:0 0 12px var(--ta-blue)}',
    '#techi-about .ta-info h4{margin:0 0 10px;font-size:12px;letter-spacing:.26em;color:var(--ta-cyan);font-weight:700;text-transform:uppercase}',
    '#techi-about .ta-info p{margin:0;font-size:15px;line-height:1.6;color:#d6ebfa}',
    '#techi-about .ta-links{display:flex;flex-wrap:wrap;gap:10px 24px;align-items:center}',
    '#techi-about .ta-links a{color:var(--ta-blue);font-size:18px;text-decoration:none;font-weight:500}',
    '#techi-about .ta-links a:hover{text-decoration:underline}',
    '#techi-about .ta-hint{margin-top:auto;padding:40px 0 10px;font-size:11px;letter-spacing:.32em;color:var(--ta-soft);display:flex;align-items:center;gap:12px}',
    '#techi-about .ta-hint i{display:inline-block;width:1px;height:34px;background:linear-gradient(var(--ta-blue),transparent);animation:taDrop 1.8s ease-in-out infinite}',
    '@keyframes taDrop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}',

    /* timeline header */
    '#techi-about .ta-head{text-align:center;margin:40px auto 50px}',
    '#techi-about .ta-head h2{margin:0 0 12px;font-size:12px;letter-spacing:.34em;color:var(--ta-cyan);font-weight:700}',
    '#techi-about .ta-head h3{margin:0;font-size:clamp(34px,4.4vw,64px);line-height:1;letter-spacing:.04em;color:var(--ta-blue);font-weight:700;text-shadow:0 0 30px rgba(0,168,255,.45)}',
    '#techi-about .ta-head p{margin:14px 0 0;font-size:14px;color:var(--ta-soft)}',

    /* timeline */
    '#techi-about .ta-tl{position:relative;max-width:1080px;margin:0 auto;padding:10px 0 30px}',
    '#techi-about .ta-rail,#techi-about .ta-fill{position:absolute;left:50%;top:0;width:2px;margin-left:-1px;border-radius:2px}',
    '#techi-about .ta-rail{bottom:0;background:linear-gradient(transparent,var(--ta-line) 4%,var(--ta-line) 96%,transparent)}',
    '#techi-about .ta-fill{height:0;background:linear-gradient(var(--ta-cyan),var(--ta-blue));box-shadow:0 0 10px var(--ta-blue),0 0 22px rgba(0,168,255,.5);transition:height .15s linear}',
    '#techi-about .ta-day{position:relative;display:flex;justify-content:center;margin:26px 0 30px;z-index:2}',
    '#techi-about .ta-day span{padding:8px 16px;border-radius:999px;background:#03101f;border:1px solid var(--ta-blue);color:var(--ta-ink);font-size:12px;letter-spacing:.2em;box-shadow:0 0 16px rgba(0,168,255,.35)}',
    '#techi-about .ta-day span b{color:var(--ta-blue)}',
    '#techi-about .ta-item{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 64px minmax(0,1fr);align-items:center;margin:0 0 46px}',
    '#techi-about .ta-node{grid-column:2;grid-row:1;justify-self:center;width:14px;height:14px;border-radius:50%;background:#03101f;border:2px solid var(--ta-line);transition:all .4s;z-index:2}',
    '#techi-about .ta-item.ta-in .ta-node{border-color:var(--ta-cyan);background:var(--ta-blue);box-shadow:0 0 0 5px rgba(0,168,255,.15),0 0 16px var(--ta-blue)}',
    '#techi-about .ta-media{grid-row:1;position:relative;width:min(100%,320px);aspect-ratio:4/5;border-radius:14px;overflow:hidden;border:1px solid rgba(0,168,255,.45);background:#06122a;box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 24px rgba(0,168,255,.18)}',
    '#techi-about .ta-media .ta-bg{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(18px) brightness(.55)}',
    '#techi-about .ta-media img,#techi-about .ta-media video{position:relative;display:block;width:100%;height:100%;object-fit:contain}',
    '#techi-about .ta-card{grid-row:1;position:relative;width:min(100%,470px);padding:24px 26px 22px;border-radius:14px;background:var(--ta-card);border:1px solid var(--ta-line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.45)}',
    '#techi-about .ta-card:before{content:"";position:absolute;top:50%;width:16px;height:1px;background:var(--ta-line)}',
    '#techi-about .ta-club{margin:0 0 6px;font-size:13px;letter-spacing:.2em;color:var(--ta-cyan);text-transform:uppercase;font-weight:700}',
    '#techi-about .ta-name{margin:0 0 10px;font-size:clamp(22px,1.9vw,30px);line-height:1.15;font-weight:700;color:var(--ta-ink)}',
    '#techi-about .ta-when{font-size:clamp(26px,2.4vw,38px);line-height:1;font-weight:700;color:var(--ta-ink);letter-spacing:.02em}',
    '#techi-about .ta-when small{display:block;margin-top:8px;font-size:11px;letter-spacing:.24em;color:var(--ta-soft);font-weight:500}',
    '#techi-about .ta-hr{height:1px;margin:16px 0 14px;background:linear-gradient(90deg,var(--ta-line),transparent)}',
    '#techi-about .ta-desc{margin:0 0 8px;font-size:15px;font-weight:600;color:#cfe9ff}',
    '#techi-about .ta-details{margin:0;font-size:14px;line-height:1.6;color:#b9d6ee}',
    '#techi-about .ta-go{display:inline-block;margin-top:16px;padding:8px 16px;border-radius:999px;border:1px solid var(--ta-blue);color:var(--ta-ink);font-size:12px;letter-spacing:.2em;text-decoration:none;transition:all .25s}',
    '#techi-about .ta-go:hover{background:var(--ta-blue);color:#001a33;box-shadow:0 0 20px rgba(0,168,255,.6)}',
    /* left / right */
    '#techi-about .ta-item.ta-l .ta-media{grid-column:1;justify-self:end}#techi-about .ta-item.ta-l .ta-card{grid-column:3;justify-self:start}',
    '#techi-about .ta-item.ta-r .ta-card{grid-column:1;justify-self:end}#techi-about .ta-item.ta-r .ta-media{grid-column:3;justify-self:start}',
    '#techi-about .ta-item.ta-l .ta-card:before{left:-17px}#techi-about .ta-item.ta-r .ta-card:before{right:-17px}',
    /* reveal */
    '#techi-about .ta-item .ta-media,#techi-about .ta-item .ta-card{opacity:0;transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}',
    '#techi-about .ta-item.ta-l .ta-media,#techi-about .ta-item.ta-r .ta-card{transform:translateX(-40px)}',
    '#techi-about .ta-item.ta-l .ta-card,#techi-about .ta-item.ta-r .ta-media{transform:translateX(40px)}',
    '#techi-about .ta-item.ta-in .ta-media,#techi-about .ta-item.ta-in .ta-card{opacity:1;transform:none}',
    '#techi-about .ta-item.ta-in .ta-card{transition-delay:.12s}',
    /* footer */
    '#techi-about .ta-foot{max-width:1080px;margin:30px auto 0;padding-top:26px;border-top:1px solid var(--ta-line);display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;font-size:11px;letter-spacing:.2em;color:var(--ta-soft)}',
    '#techi-about .ta-foot a{color:var(--ta-soft);text-decoration:none;margin-left:14px;letter-spacing:.05em}#techi-about .ta-foot a:hover{color:var(--ta-blue)}',

    /* small screens: line on the left, cards stacked */
    '@media (max-width:900px){',
    '  #techi-about{padding:0 20px 50px}',
    '  #techi-about .ta-cards{grid-template-columns:1fr}',
    '  #techi-about .ta-rail,#techi-about .ta-fill{left:15px}',
    '  #techi-about .ta-day{justify-content:flex-start;padding-left:0}',
    '  #techi-about .ta-item{grid-template-columns:32px minmax(0,1fr);row-gap:14px;align-items:start}',
    '  #techi-about .ta-node{grid-column:1!important;grid-row:1;margin-top:26px}',
    '  #techi-about .ta-item .ta-card{grid-column:2!important;grid-row:1;justify-self:stretch!important;width:100%}',
    '  #techi-about .ta-item .ta-media{grid-column:2!important;grid-row:2;justify-self:start!important;width:min(70%,240px)}',
    '  #techi-about .ta-item .ta-card:before{display:none}',
    '  #techi-about .ta-item .ta-media,#techi-about .ta-item .ta-card{transform:translateY(24px)!important}',
    '  #techi-about .ta-item.ta-in .ta-media,#techi-about .ta-item.ta-in .ta-card{transform:none!important}',
    '}',
    '#techi-about .ta-mtitle{display:none}',
    '#about.mobile .title-container{display:none!important}',
    '#about.mobile .ta-mtitle{display:block;margin:0 0 22px}',
    '#about.mobile .ta-mtitle h2{margin:0 0 8px;font-size:11px;letter-spacing:.32em;color:#7fd4ff;font-weight:500}',
    '#about.mobile .ta-mtitle h1{margin:0;font-size:clamp(40px,12vw,64px);line-height:1;letter-spacing:.03em;color:#00a8ff;font-weight:700;text-shadow:0 0 30px rgba(0,168,255,.5)}',
    '#about.mobile .ta-mtitle h3{margin:10px 0 0;font-size:11px;letter-spacing:.3em;color:#eaf7ff;font-weight:500}',
    '#about.mobile #techi-about .ta-hero{padding-top:130px;min-height:0}',
    '#about.mobile #techi-about .ta-lead{font-size:17px}',
    '@media (max-width:900px){#techi-about .ta-stats{display:grid;grid-template-columns:1fr 1fr}#techi-about .ta-stat{min-width:0}}',
    '@media (prefers-reduced-motion:reduce){#techi-about *{transition:none!important;animation:none!important}#techi-about .ta-item .ta-media,#techi-about .ta-item .ta-card{opacity:1;transform:none!important}}'
  ].join('\n');

  function addStyle() {
    if (document.getElementById('techi-about-style')) return;
    var s = document.createElement('style');
    s.id = 'techi-about-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------- helpers ---------------- */
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parseDate(s) { var p = String(s || '').split('-'); return new Date(+p[0] || 2026, (+p[1] || 1) - 1, +p[2] || 1); }
  function stamp(e) { return (e.date || '9999-99-99') + 'T' + (e.time || '99:99'); }

  function stats() {
    var majors = cfg.majorEvents || [], clubs = cfg.clubEvents || [], all = majors.concat(clubs);
    var days = {}, clubNames = {};
    all.forEach(function (e) { if (e.date) days[e.date] = 1; if (e.club) clubNames[e.club.trim().toLowerCase()] = 1; });
    return [
      [Object.keys(days).length || 3, 'DAYS'],
      [all.length, 'EVENTS'],
      [Object.keys(clubNames).length, 'CLUBS'],
      [majors.length, 'MAJOR EVENTS']
    ];
  }

  /* ---------------- build ---------------- */
  function build(root) {
    var a = cfg.about || {};
    var majors = (cfg.majorEvents || []).slice().sort(function (x, y) { return stamp(x) < stamp(y) ? -1 : stamp(x) > stamp(y) ? 1 : 0; });
    var days = [];
    majors.forEach(function (m) { if (days.indexOf(m.date) < 0) days.push(m.date); });

    var h = '';
    h += '<section class="ta-hero">';
    h += '<div class="ta-mtitle"><h2>TECH FEST 2026</h2><h1>TECHIDEATE</h1><h3>MANIPAL UNIVERSITY JAIPUR</h3></div>';
    if (a.intro) h += '<p class="ta-lead">' + esc(a.intro) + '</p>';
    h += '<div class="ta-stats">' + stats().map(function (s) { return '<div class="ta-stat"><b class="ta-mono">' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div>';
    if (a.cards && a.cards.length) {
      h += '<div class="ta-cards">' + a.cards.map(function (c) { return '<div class="ta-info"><h4>' + esc(c.title) + '</h4><p>' + esc(c.text) + '</p></div>'; }).join('') + '</div>';
    }
    h += '<div class="ta-links"><a href="#techi-timeline" data-ta-jump>[TIMELINE]</a>';
    if (a.contactEmail) h += '<a href="mailto:' + esc(a.contactEmail) + '">[CONTACT]</a>';
    h += '</div>';
    h += '<div class="ta-hint"><i></i>SCROLL FOR THE EVENT TIMELINE</div>';
    h += '</section>';

    h += '<section id="techi-timeline">';
    h += '<div class="ta-head"><h2>MAJOR EVENTS</h2><h3>THE TIMELINE</h3><p>' + majors.length + ' flagship events across ' + days.length + ' days</p></div>';
    h += '<div class="ta-tl"><div class="ta-rail"></div><div class="ta-fill"></div>';
    var lastDay = null, side = 0;
    majors.forEach(function (m) {
      if (m.date !== lastDay) {
        lastDay = m.date;
        var d = parseDate(m.date);
        h += '<div class="ta-day"><span class="ta-mono"><b>DAY ' + (days.indexOf(m.date) + 1) + '</b> &nbsp;/&nbsp; ' + WEEK[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</span></div>';
      }
      var d2 = parseDate(m.date);
      var media = m.poster
        ? '<div class="ta-bg" style="background-image:url(\'' + esc(BASE + m.poster) + '\')"></div><img loading="lazy" alt="' + esc(m.name) + ' poster" src="' + esc(BASE + m.poster) + '">'
        : (m.video ? '<video muted loop playsinline preload="none" data-src="' + esc(BASE + m.video) + '"></video>' : '');
      h += '<div class="ta-item ' + (side++ % 2 ? 'ta-r' : 'ta-l') + '">';
      h += '<div class="ta-media">' + media + '</div>';
      h += '<span class="ta-node"></span>';
      h += '<div class="ta-card">';
      if (m.club) h += '<p class="ta-club">' + esc(m.club) + '</p>';
      h += '<h4 class="ta-name">' + esc(m.name) + '</h4>';
      h += '<div class="ta-when ta-mono">' + esc(m.time || '') + '<small>DAY ' + (days.indexOf(m.date) + 1) + ' &nbsp;/&nbsp; ' + d2.getDate() + ' ' + MONTHS[d2.getMonth()] + ' ' + d2.getFullYear() + '</small></div>';
      h += '<div class="ta-hr"></div>';
      if (m.description) h += '<p class="ta-desc">' + esc(m.description) + '</p>';
      if (m.details) h += '<p class="ta-details">' + esc(m.details) + '</p>';
      if (m.registerUrl) h += '<a class="ta-go" href="' + esc(m.registerUrl) + '" target="_blank" rel="noopener">REGISTER &rarr;</a>';
      h += '</div></div>';
    });
    h += '</div></section>';

    h += '<footer class="ta-foot"><span>TECHIDEATE ’26 &nbsp;/&nbsp; MANIPAL UNIVERSITY JAIPUR</span><span>CREDITS:' +
      '<a href="https://duss.booth.pm/items/6110446" target="_blank" rel="noopener">[Avatar model modified]</a>' +
      '<a href="https://x.com/acolad16" target="_blank" rel="noopener">[Interfaces help from Acolad]</a>' +
      '<a href="https://x.com/JulienSuard" target="_blank" rel="noopener">[Cybercity by Julien]</a></span></footer>';

    var box = document.createElement('div');
    box.id = 'techi-about';
    box.innerHTML = h;
    root.appendChild(box);
    root.classList.add('ta-on');
    root.scrollTop = 0;
    wire(root, box);
  }

  /* ---------------- behaviour ---------------- */
  function wire(root, box) {
    // keep scroll / touch inside the About page so the 3D city doesn't react to it
    ['wheel', 'mousewheel', 'touchstart', 'touchmove'].forEach(function (ev) {
      root.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
    });

    var jump = box.querySelector('[data-ta-jump]');
    jump && jump.addEventListener('click', function (e) {
      e.preventDefault();
      var t = box.querySelector('#techi-timeline');
      t && root.scrollTo({ top: t.offsetTop - 40, behavior: 'smooth' });
    });

    var items = [].slice.call(box.querySelectorAll('.ta-item'));
    var reveal = function (it, on) {
      it.classList.toggle('ta-in', on);
      var v = it.querySelector('video');
      if (!v) return;
      if (on) { if (!v.src) v.src = v.getAttribute('data-src'); var p = v.play(); p && p.catch(function () {}); }
      else v.pause();
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { reveal(en.target, en.isIntersecting); });
      }, { root: root, threshold: 0.2 });
      items.forEach(function (it) { io.observe(it); });
    } else items.forEach(function (it) { reveal(it, true); });

    // glowing line fills up as you scroll down the timeline
    var tl = box.querySelector('.ta-tl'), fill = box.querySelector('.ta-fill');
    var onScroll = function () {
      var r = tl.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      fill.style.height = Math.max(0, Math.min(r.height, mid - r.top)) + 'px';
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- start ---------------- */
  function tryBuild() {
    var root = document.getElementById('about');
    if (!root || !cfg) return;
    if (root.querySelector('#techi-about')) { if (!root.classList.contains('ta-on')) root.classList.add('ta-on'); return; }
    build(root);
  }

  addStyle();
  fetch(BASE + 'screens.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (j) { cfg = j; tryBuild(); })
    .catch(function (err) { console.warn('[TECHIDEATE about] could not read screens.json:', err); });

  // the About page is created and removed by the site each time it is opened
  new MutationObserver(tryBuild).observe(document.body, { childList: true, subtree: true });
})();
