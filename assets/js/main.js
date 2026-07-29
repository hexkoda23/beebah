/* ══════════════════════════════════════════════════
   LAID BY BEEBAH — interactions
   Vanilla JS, no dependencies.
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var mobile  = window.matchMedia('(max-width: 760px)').matches;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ────────── PRELOADER ────────── */
  (function preloader() {
    var el    = $('#preloader');
    var count = $('#preCount');
    var ring  = $('#ringFill');
    var CIRC  = 339;
    var pct   = 0;
    var done  = false;

    function finish() {
      if (done) return;
      done = true;
      pct = 100;
      count.textContent = '100';
      ring.style.strokeDashoffset = '0';
      setTimeout(function () {
        el.classList.add('done');
        document.body.classList.add('is-ready');
        startIntro();
        setTimeout(function () { el.remove(); }, 1600);
      }, 380);
    }

    if (reduced) { el.remove(); document.body.classList.add('is-ready'); startIntro(); return; }

    var tick = setInterval(function () {
      pct += Math.random() * 11 + 3;
      if (pct >= 96) pct = 96;
      count.textContent = Math.floor(pct);
      ring.style.strokeDashoffset = String(CIRC - (CIRC * pct) / 100);
    }, 110);

    window.addEventListener('load', function () {
      clearInterval(tick);
      finish();
    });
    // safety net if load never fires
    setTimeout(function () { clearInterval(tick); finish(); }, 4500);
  })();

  /* ────────── HERO INTRO (split lines) ────────── */
  function startIntro() {
    $$('#hero [data-split]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-in'); }, 120 + i * 130);
    });
    $$('#hero .reveal').forEach(function (el) {
      var d = parseInt(el.dataset.delay || '0', 10);
      setTimeout(function () { el.classList.add('is-in'); }, 420 + d);
    });
    runCounters($('#hero'));
  }

  /* ────────── REVEAL ON SCROLL ────────── */
  (function reveals() {
    var items = $$('.reveal').filter(function (el) { return !el.closest('#hero'); });
    var lines = $$('[data-split]').filter(function (el) { return !el.closest('#hero'); });

    if (reduced || !('IntersectionObserver' in window)) {
      items.concat(lines).forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // The observed node may be a `.line` mask standing in for its inner span,
        // because an ancestor's overflow:hidden clips the translated child to zero
        // intersection area and the callback would otherwise never fire.
        var el = e.target.__revealTarget || e.target;
        var d = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, d);
        io.unobserve(e.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });

    lines.forEach(function (el) {
      var proxy = el.closest('.line') || el;
      proxy.__revealTarget = el;
      io.observe(proxy);
    });
  })();

  /* ────────── NUMBER COUNTERS ────────── */
  function runCounters(scope) {
    $$('[data-count]', scope).forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      if (reduced) { el.textContent = String(target); return; }
      var n = 0;
      var step = Math.max(1, Math.round(target / 22));
      var t = setInterval(function () {
        n += step;
        if (n >= target) { n = target; clearInterval(t); }
        el.textContent = String(n);
      }, 55);
    });
  }

  /* ────────── NAV: stick + hide on scroll down ────────── */
  (function nav() {
    var el = $('#nav');
    var last = 0;

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      el.classList.toggle('is-stuck', y > 40);
      if (!el.classList.contains('menu-open')) {
        el.classList.toggle('is-hidden', y > last && y > 320);
      }
      last = y;
    }, { passive: true });

    var burger = $('#burger');
    burger.addEventListener('click', function () {
      var open = el.classList.toggle('menu-open');
      document.documentElement.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () {
        el.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ────────── SCROLL PROGRESS BAR ────────── */
  (function progress() {
    var fill = $('#scrollbarFill');
    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive: true });
  })();

  /* ────────── HERO PARALLAX ────────── */
  (function parallax() {
    if (reduced) return;
    var els = $$('[data-parallax]');
    if (!els.length) return;
    var raf = null;

    function frame() {
      var y = window.scrollY;
      els.forEach(function (el) {
        el.style.transform = 'translate3d(0,' + (y * parseFloat(el.dataset.parallax)).toFixed(2) + 'px,0)';
      });
      raf = null;
    }
    window.addEventListener('scroll', function () {
      if (raf === null) raf = requestAnimationFrame(frame);
    }, { passive: true });
  })();

  /* ────────── MARQUEE (duplicate for seamless loop) ────────── */
  (function marquee() {
    var track = $('#marqueeTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  })();

  /* ────────── HORIZONTAL WORK GALLERY ────────── */
  (function horizontal() {
    var section = $('#work');
    var rail    = $('#workRail');
    var bar     = $('#workProgress');
    if (!section || !rail) return;
    if (reduced || mobile) return; // native swipe fallback via CSS

    var raf = null;

    function frame() {
      var rect     = section.getBoundingClientRect();
      var scrolled = -rect.top;
      var total    = section.offsetHeight - window.innerHeight;
      var p        = Math.min(1, Math.max(0, scrolled / total));
      var travel   = rail.scrollWidth - window.innerWidth;

      if (travel > 0) rail.style.transform = 'translate3d(' + (-p * travel).toFixed(2) + 'px,0,0)';
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      raf = null;
    }

    window.addEventListener('scroll', function () {
      if (raf === null) raf = requestAnimationFrame(frame);
    }, { passive: true });
    window.addEventListener('resize', frame);
    frame();
  })();

  /* ────────── CARD SPOTLIGHT ────────── */
  (function spotlight() {
    if (!fine) return;
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  })();

  /* ────────── 3D TILT ────────── */
  (function tilt() {
    if (!fine || reduced) return;
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r  = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width  - 0.5;
        var py = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' +
          (-py * 7).toFixed(2) + 'deg) translateZ(0)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* ────────── MAGNETIC BUTTONS ────────── */
  (function magnetic() {
    if (!fine || reduced) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * 0.26).toFixed(1) + 'px,' + (y * 0.32).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* ────────── CUSTOM CURSOR ────────── */
  (function cursor() {
    if (!fine || reduced) return;
    var el    = $('#cursor');
    var label = $('.cursor__label', el);
    document.body.classList.add('has-cursor');

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty;

    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; });

    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    $$('[data-cursor]').forEach(function (t) {
      t.addEventListener('pointerenter', function () {
        label.textContent = t.dataset.cursor;
        el.classList.add('is-active');
      });
      t.addEventListener('pointerleave', function () { el.classList.remove('is-active'); });
    });
  })();

  /* ────────── LIGHTBOX ────────── */
  (function lightbox() {
    var box   = $('#lightbox');
    var img   = $('#lbImg');
    var cap   = $('#lbCap');
    var items = $$('.shot, .cred');
    if (!items.length) return;

    var idx = 0;

    function show(i) {
      idx = (i + items.length) % items.length;
      var fig   = items[idx];
      var src   = $('img', fig);
      var title = $('figcaption b', fig);
      var sub   = $('figcaption span', fig);

      img.src = src.src;
      img.alt = src.alt;
      cap.textContent = (title ? title.textContent : '') + (sub ? ' — ' + sub.textContent : '');
    }

    function open(i) {
      show(i);
      box.hidden = false;
      document.documentElement.classList.add('lb-open');
      // Force a reflow so the browser registers the pre-transition state now that
      // the element has left display:none — otherwise the fade-in never plays.
      void box.offsetWidth;
      box.classList.add('is-open');
    }

    function close() {
      box.classList.remove('is-open');
      document.documentElement.classList.remove('lb-open');
      setTimeout(function () { box.hidden = true; }, 400);
    }

    items.forEach(function (fig, i) {
      fig.addEventListener('click', function () { open(i); });
    });

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
    $('#lbNext').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

})();
