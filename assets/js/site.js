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

// Reveal on scroll
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
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
