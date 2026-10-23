// Theme toggle
(function () {
  var root = document.documentElement, btn = document.getElementById('themeBtn');
  var sun = document.getElementById('iconSun'), moon = document.getElementById('iconMoon');
  function current() {
    return root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function paint() { var d = current() === 'dark'; sun.style.display = d ? 'none' : ''; moon.style.display = d ? '' : 'none'; }
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  paint();
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });
})();

// Mobile menu
(function () {
  var b = document.getElementById('menuBtn'), m = document.getElementById('menu');
  b.addEventListener('click', function () { var o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); b.setAttribute('aria-expanded', false); }); });
})();

// Header border + active link
(function () {
  var h = document.querySelector('header');
  var links = Array.prototype.slice.call(document.querySelectorAll('#menu a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    h.classList.toggle('scrolled', scrollY > 8);
    var idx = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 140) idx = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

// Reveal on scroll, staggered between siblings; the class is dropped afterwards so hover transitions stay snappy
(function () {
  var els = document.querySelectorAll('.reveal');
  function done(e) { e.classList.remove('reveal', 'in'); e.style.transitionDelay = ''; }
  if (!('IntersectionObserver' in window)) { els.forEach(done); return; }
  els.forEach(function (e) {
    var sibs = Array.prototype.filter.call(e.parentNode.children, function (c) { return c.classList.contains('reveal'); });
    e.style.transitionDelay = Math.min(sibs.indexOf(e), 5) * 80 + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target;
      t.classList.add('in'); io.unobserve(t);
      t.addEventListener('transitionend', function () { done(t); }, { once: true });
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();

// Experience trail: the line fills as you scroll and each step gets ticked off
(function () {
  var tl = document.querySelector('.timeline');
  if (!tl) return;
  var jobs = tl.querySelectorAll('.job');
  function update() {
    var r = tl.getBoundingClientRect(), mark = innerHeight * 0.6;
    var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    tl.style.setProperty('--trail', p.toFixed(3));
    jobs.forEach(function (j) { j.classList.toggle('reached', j.getBoundingClientRect().top + 38 < mark); });
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
})();

// Gallery lightbox
(function () {
  var links = document.querySelectorAll('.gallery a, a.zoom');
  if (!links.length || !window.HTMLDialogElement) return;
  var dlg = document.createElement('dialog'), img = document.createElement('img');
  dlg.className = 'lightbox'; dlg.appendChild(img); document.body.appendChild(dlg);
  dlg.addEventListener('click', function () { dlg.close(); });
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      img.src = a.href; img.alt = a.querySelector('img').alt;
      dlg.showModal();
    });
  });
})();

var year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Arrows in link text get their own span so they can move on hover
(function () {
  document.querySelectorAll('a').forEach(function (a) {
    var last = a.lastChild;
    if (!last || last.nodeType !== 3) return;
    var m = last.nodeValue.match(/^(.*?)\s*([→↑])\s*$/);
    if (!m) return;
    last.nodeValue = m[1] + ' ';
    var s = document.createElement('span');
    s.className = 'arr' + (m[2] === '↑' ? ' up' : '');
    s.textContent = m[2];
    a.appendChild(s);
  });
})();

// Subtle 3D tilt that follows the mouse on project cards and the portrait
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.project, .portrait img').forEach(function (el) {
    var max = el.tagName === 'IMG' ? 6 : 3;
    el.classList.add('tilt');
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--ry', (x * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-y * max * 2).toFixed(2) + 'deg');
    });
    el.addEventListener('mouseleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
})();
