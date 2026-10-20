(function () {
  'use strict';

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Header border once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Highlight current section in nav
  var links = document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[entry.target.id].setAttribute('aria-current', 'page');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Contact form: validation and status messages
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    var say = function (msg, type) {
      status.textContent = msg;
      status.className = 'form-status ' + type;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // honeypot caught a bot

      var bad = [];
      form.querySelectorAll('[required]').forEach(function (f) {
        var ok = f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) bad.push(f);
      });
      if (bad.length) {
        say('Check the highlighted fields and try again.', 'err');
        bad[0].focus();
        return;
      }

      say('Sending…', '');
      // TODO: replace with the real endpoint. Example:
      // fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      //   .then(function (r) { if (!r.ok) throw new Error(); say('Message sent. I will reply by email.', 'ok'); form.reset(); })
      //   .catch(function () { say('Message not sent. Email contact@example.com instead.', 'err'); });
      say('Form handler not connected yet. See the TODO in main.js.', 'err');
    });
  }
})();
