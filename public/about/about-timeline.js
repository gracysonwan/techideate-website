/*
 * TECHIDEATE About page: intro + zigzag event timeline
 * ----------------------------------------------------
 * Everything shown here comes from public/screens/screens.json:
 *   "about"        -> intro text, the 3 info cards, contact email
 *   "clubEvents"   -> the timeline (sorted by date and time automatically)
 *                     posterWide (or posterTall) = image shown next to the event
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
    '#techi-about .ta-hero{padding-top:calc(clamp(130px,17vh,170px) + clamp(140px,19vh,190px));min-height:0;display:flex;flex-direction:column;justify-content:flex-start;max-width:1180px}',
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
    '#techi-about .ta-hint{margin-top:0;padding:56px 0 10px;font-size:11px;letter-spacing:.32em;color:var(--ta-soft);display:flex;align-items:center;gap:12px}',
    '#techi-about .ta-hint i{display:inline-block;width:1px;height:34px;background:linear-gradient(var(--ta-blue),transparent);animation:taDrop 1.8s ease-in-out infinite}',
    '@keyframes taDrop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}',

    /* timeline header */
    '#techi-about .ta-head{text-align:center;margin:40px auto 50px}',
    '#techi-about .ta-head h2{margin:0 0 12px;font-size:12px;letter-spacing:.34em;color:var(--ta-cyan);font-weight:700}',
    '#techi-about .ta-head h3{margin:0;font-size:clamp(28px,3.2vw,50px);line-height:1;letter-spacing:.04em;color:var(--ta-blue);font-weight:700;text-shadow:0 0 30px rgba(0,168,255,.45)}',
    '#techi-about .ta-head p{margin:14px 0 0;font-size:14px;color:var(--ta-soft)}',

    /* day tabs */
    '#techi-about .ta-tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:0 auto 34px;max-width:900px}',
    '#techi-about .ta-tabs button{cursor:pointer;min-width:118px;padding:10px 18px;border-radius:12px;border:1px solid var(--ta-line);background:rgba(6,22,46,.6);color:var(--ta-ink);font:inherit;text-align:center;transition:all .25s}',
    '#techi-about .ta-tabs button b{display:block;font-size:14px;letter-spacing:.16em}',
    '#techi-about .ta-tabs button span{display:block;margin-top:4px;font-size:10px;letter-spacing:.2em;color:var(--ta-soft)}',
    '#techi-about .ta-tabs button:hover{border-color:var(--ta-blue)}',
    '#techi-about .ta-tabs button.on{background:var(--ta-blue);border-color:var(--ta-blue);color:#001a33;box-shadow:0 0 22px rgba(0,168,255,.55)}',
    '#techi-about .ta-tabs button.on span{color:#00335c}',
    '#techi-about .ta-empty{text-align:center;color:var(--ta-soft);padding:40px 0}',
    '#techi-about .ta-badge{position:absolute;top:18px;right:18px;padding:4px 10px;border-radius:999px;font-size:10px;letter-spacing:.18em;border:1px solid var(--ta-line);color:var(--ta-soft)}',
    '#techi-about .ta-badge.ta-up{border-color:rgba(0,168,255,.6);color:#7fd4ff}',
    '#techi-about .ta-badge.ta-live{background:#00a8ff;border-color:#00a8ff;color:#001a33;box-shadow:0 0 14px rgba(0,168,255,.7)}',
    '#techi-about .ta-item.ta-done .ta-card{opacity:.75}',
    /* timeline */
    '#techi-about .ta-tl{position:relative;max-width:1080px;margin:0 auto;padding:10px 0 30px}',
    '#techi-about .ta-rail,#techi-about .ta-fill{position:absolute;left:50%;top:0;width:2px;margin-left:-1px;border-radius:2px}',
    '#techi-about .ta-rail{bottom:0;background:linear-gradient(transparent,var(--ta-line) 4%,var(--ta-line) 96%,transparent)}',
    '#techi-about .ta-fill{height:0;background:linear-gradient(var(--ta-cyan),var(--ta-blue));box-shadow:0 0 10px var(--ta-blue),0 0 22px rgba(0,168,255,.5);transition:height .15s linear}',
    '#techi-about .ta-day{position:relative;display:flex;justify-content:center;margin:26px 0 30px;z-index:2}',
    '#techi-about .ta-day span{padding:8px 16px;border-radius:999px;background:#03101f;border:1px solid var(--ta-blue);color:var(--ta-ink);font-size:12px;letter-spacing:.2em;box-shadow:0 0 16px rgba(0,168,255,.35)}',
    '#techi-about .ta-day span b{color:var(--ta-blue)}',
    '#techi-about .ta-item{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 64px minmax(0,1fr);align-items:center;margin:0 0 30px}',
    '#techi-about .ta-noimg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#00a8ff;font-size:14px;letter-spacing:.2em;text-align:center;padding:10px}',
    '#techi-about .ta-filter{position:sticky;top:96px;z-index:5;display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:0 auto 26px;padding:8px}',
    '#techi-about .ta-chip{cursor:pointer;padding:8px 16px;border-radius:999px;border:1px solid var(--ta-line);background:rgba(3,16,31,.85);color:var(--ta-soft);font:600 12px/1 forma-djr-display,"Segoe UI",Arial,sans-serif;letter-spacing:.2em;transition:all .2s;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '#techi-about .ta-chip:hover{border-color:var(--ta-blue);color:var(--ta-ink)}',
    '#techi-about .ta-chip.ta-on{background:var(--ta-blue);border-color:var(--ta-blue);color:#001a33;box-shadow:0 0 18px rgba(0,168,255,.5)}',
    '#techi-about .ta-node{grid-column:2;grid-row:1;justify-self:center;width:14px;height:14px;border-radius:50%;background:#03101f;border:2px solid var(--ta-line);transition:all .4s;z-index:2}',
    '#techi-about .ta-item.ta-in .ta-node{border-color:var(--ta-cyan);background:var(--ta-blue);box-shadow:0 0 0 5px rgba(0,168,255,.15),0 0 16px var(--ta-blue)}',
    '#techi-about .ta-media{grid-row:1;position:relative;width:min(100%,360px);aspect-ratio:2/1;border-radius:14px;overflow:hidden;border:1px solid rgba(0,168,255,.45);background:#06122a;box-shadow:0 10px 40px rgba(0,0,0,.55),0 0 24px rgba(0,168,255,.18)}',
    '#techi-about .ta-media .ta-bg{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(18px) brightness(.55)}',
    '#techi-about .ta-media img,#techi-about .ta-media video{position:relative;display:block;width:100%;height:100%;object-fit:contain}',
    '#techi-about .ta-card{grid-row:1;position:relative;width:min(100%,420px);padding:18px 22px 18px;border-radius:14px;background:var(--ta-card);border:1px solid var(--ta-line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.45)}',
    '#techi-about .ta-card:before{content:"";position:absolute;top:50%;width:16px;height:1px;background:var(--ta-line)}',
    '#techi-about .ta-club{margin:0 0 6px;font-size:13px;letter-spacing:.2em;color:var(--ta-cyan);text-transform:uppercase;font-weight:700}',
    '#techi-about .ta-name{margin:0 0 8px;font-size:clamp(19px,1.6vw,25px);line-height:1.15;font-weight:700;color:var(--ta-ink)}',
    '#techi-about .ta-when{font-size:clamp(22px,2vw,30px);line-height:1;font-weight:700;color:var(--ta-ink);letter-spacing:.02em}',
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
    '  #techi-about .ta-item .ta-media{grid-column:2!important;grid-row:2;justify-self:start!important;width:min(100%,340px)}',
    '  #techi-about .ta-item .ta-card:before{display:none}',
    '  #techi-about .ta-item .ta-media,#techi-about .ta-item .ta-card{transform:translateY(24px)!important}',
    '  #techi-about .ta-item.ta-in .ta-media,#techi-about .ta-item.ta-in .ta-card{transform:none!important}',
    '}',
    '#techi-about .ta-mtitle{display:none}',
    '#about.mobile .title-container{display:none!important}',
    '#about.mobile .ta-mtitle{display:block;margin:0 0 22px}',
    '#about.mobile .ta-mtitle h2{margin:0 0 8px;font-size:11px;letter-spacing:.32em;color:#7fd4ff;font-weight:500}',
    '#about.mobile .ta-mtitle h1{margin:0;font-size:clamp(32px,9vw,46px);line-height:1;letter-spacing:.03em;color:#00a8ff;font-weight:700;text-shadow:0 0 30px rgba(0,168,255,.5)}',
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

  function sortedClubs() {
    return (cfg.clubEvents || []).slice().sort(function (x, y) { return stamp(x) < stamp(y) ? -1 : stamp(x) > stamp(y) ? 1 : 0; });
  }
  function dayList(list) {
    var d = [];
    list.forEach(function (e) { if (e.date && d.indexOf(e.date) < 0) d.push(e.date); });
    return d;
  }
  function startMs(e) { var t = Date.parse((e.date || '2000-01-01') + 'T' + (e.time || '00:00') + ':00+05:30'); return isNaN(t) ? 0 : t; }
  function nowMs() { if (cfg.testNow) { var t = Date.parse(cfg.testNow); if (!isNaN(t)) return t; } return Date.now(); }
  function status(e) {
    var t = nowMs(), s = startMs(e), len = (cfg.eventLengthHours || 3) * 3600e3;
    if (t < s) return ['UPCOMING', 'up'];
    if (t < s + len) return ['LIVE NOW', 'live'];
    return ['FINISHED', 'done'];
  }
  // open the day that has the next event (or day 1 before the fest)
  function defaultDay(list, days) {
    var t = nowMs(), len = (cfg.eventLengthHours || 3) * 3600e3;
    for (var i = 0; i < list.length; i++) if (startMs(list[i]) + len >= t) return list[i].date;
    return days[0] || 'all';
  }

  function itemHtml(e, n, days) {
    var d = parseDate(e.date), st = status(e);
    var src = e.posterWide || e.posterTall || e.poster;
    var h = '<div class="ta-item ' + (n % 2 ? 'ta-r' : 'ta-l') + (st[1] === 'done' ? ' ta-done' : '') + '">';
    h += '<div class="ta-media">' + (src ? '<div class="ta-bg" style="background-image:url(\'' + esc(BASE + src) + '\')"></div><img loading="lazy" alt="' + esc(e.event) + ' poster" src="' + esc(BASE + src) + '">' : '') + '</div>';
    h += '<span class="ta-node"></span>';
    h += '<div class="ta-card">';
    h += '<span class="ta-badge ta-' + st[1] + '">' + st[0] + '</span>';
    if (e.club) h += '<p class="ta-club">' + esc(e.club) + '</p>';
    h += '<h4 class="ta-name">' + esc(e.event || '') + '</h4>';
    h += '<div class="ta-when ta-mono">' + esc(e.time || '') + '<small>DAY ' + (days.indexOf(e.date) + 1) + ' &nbsp;/&nbsp; ' + WEEK[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</small></div>';
    if (e.venue || e.description) h += '<div class="ta-hr"></div>';
    if (e.venue) h += '<p class="ta-desc">' + esc(e.venue) + '</p>';
    if (e.description) h += '<p class="ta-details">' + esc(e.description) + '</p>';
    if (e.registerUrl) h += '<a class="ta-go" href="' + esc(e.registerUrl) + '" target="_blank" rel="noopener">REGISTER &rarr;</a>';
    return h + '</div></div>';
  }

  /* ---------------- build ---------------- */
  function build(root) {
    var a = cfg.about || {};
    // the timeline shows the CLUB (minor) events; the major events have their own slider in MAJOR EVENTS
    var clubs = sortedClubs();
    var days = dayList(clubs).sort();

    var h = '';
    h += '<section class="ta-hero">';
    h += '<div class="ta-mtitle"><h2>TECH FEST 2026</h2><h1>TECHIDEATE</h1><h3>MANIPAL UNIVERSITY JAIPUR</h3></div>';
    if (a.intro) h += '<p class="ta-lead">' + esc(a.intro) + '</p>';
    h += '<div class="ta-stats">' + stats().map(function (s) { return '<div class="ta-stat"><b class="ta-mono">' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div>';
    h += '<div class="ta-links"><a href="#techi-timeline" data-ta-jump>[MINOR EVENTS TIMELINE]</a>';
    if (a.contactEmail) h += '<a href="mailto:' + esc(a.contactEmail) + '">[CONTACT]</a>';
    h += '</div>';
    h += '<div class="ta-hint"><i></i>SCROLL FOR THE MINOR EVENTS TIMELINE</div>';
    h += '</section>';

    h += '<section id="techi-timeline">';
    h += '<div class="ta-head"><h2>CLUB EVENTS</h2><h3>MINOR EVENTS</h3><p>' + clubs.length + ' events by our clubs across ' + days.length + ' days</p></div>';
    h += '<div class="ta-tabs">' + days.map(function (d, i) {
      var dd = parseDate(d);
      return '<button type="button" data-day="' + esc(d) + '"><b>DAY ' + (i + 1) + '</b><span>' + dd.getDate() + ' ' + MONTHS[dd.getMonth()] + '</span></button>';
    }).join('') + '<button type="button" data-day="all"><b>ALL</b><span>' + clubs.length + ' EVENTS</span></button></div>';
    h += '<div class="ta-tl"><div class="ta-rail"></div><div class="ta-fill"></div><div class="ta-list"></div></div>';
    h += '</section>';

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
    wire(root, box, clubs, days);
  }

  /* ---------------- behaviour ---------------- */
  function wire(root, box, clubs, days) {
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

    var list = box.querySelector('.ta-list'), io = null;
    var reveal = function (it, on) { it.classList.toggle('ta-in', on); };
    function render(day) {
      [].forEach.call(box.querySelectorAll('.ta-tabs button'), function (b) { b.classList.toggle('on', b.getAttribute('data-day') === day); });
      var show = day === 'all' ? clubs : clubs.filter(function (e) { return e.date === day; });
      var h = '', last = null;
      show.forEach(function (e, n) {
        if (day === 'all' && e.date !== last) {
          last = e.date; var d = parseDate(e.date);
          h += '<div class="ta-day"><span class="ta-mono"><b>DAY ' + (days.indexOf(e.date) + 1) + '</b> &nbsp;/&nbsp; ' + WEEK[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</span></div>';
        }
        h += itemHtml(e, n, days);
      });
      if (!show.length) h = '<p class="ta-empty">No events on this day yet.</p>';
      list.innerHTML = h;
      var items = [].slice.call(list.querySelectorAll('.ta-item'));
      if (io) io.disconnect();
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { reveal(en.target, en.isIntersecting); }); }, { root: root, threshold: 0.15 });
        items.forEach(function (it) { io.observe(it); });
      } else items.forEach(function (it) { reveal(it, true); });
      onScroll && onScroll();
    }
    var onScroll = null;
    [].forEach.call(box.querySelectorAll('.ta-tabs button'), function (b) {
      b.addEventListener('click', function () {
        render(b.getAttribute('data-day'));
        var t = box.querySelector('.ta-tabs');
        if (t.getBoundingClientRect().top < 0) root.scrollTo({ top: t.offsetTop + box.querySelector('#techi-timeline').offsetTop - 90, behavior: 'smooth' });
      });
    });

    // glowing line fills up as you scroll down the timeline
    var tl = box.querySelector('.ta-tl'), fill = box.querySelector('.ta-fill');
    function onScroll() {
      var r = tl.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      fill.style.height = Math.max(0, Math.min(r.height, mid - r.top)) + 'px';
    }
    root.addEventListener('scroll', onScroll, { passive: true });
    render(defaultDay(clubs, days));
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
