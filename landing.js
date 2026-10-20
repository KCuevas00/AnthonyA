(function () {
  'use strict';

  var isMobile = function () {
    return window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches;
  };

  /* ==========================================================================
     OPTION 1: Expanding Panels (index-1.html)
     ========================================================================== */
  function initOption1() {
    var container = document.querySelector('.stage .panels') || document.querySelector('.panels');
    if (!container) return;
    var panels = container.querySelectorAll('.panel');
    if (!panels.length) return;

    // Add hint label to panels if not present
    panels.forEach(function (p) {
      if (!p.querySelector('.panel-hint')) {
        var lbl = p.querySelector('.panel-label');
        if (lbl) {
          var hint = document.createElement('span');
          hint.className = 'panel-hint';
          hint.textContent = 'Explore sheet \u2192';
          lbl.appendChild(hint);
        }
      }
    });

    var cur = 0;
    var timer = null;
    var userInteracted = false;

    function setActive(idx) {
      cur = (idx + panels.length) % panels.length;
      panels.forEach(function (p, i) {
        p.classList.toggle('is-active', i === cur);
      });
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        if (!isMobile()) return;
        setActive(cur + 1);
      }, 2800);
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function pauseTemporarily(ms) {
      stopTimer();
      setTimeout(function () {
        if (!userInteracted) startTimer();
      }, ms || 4000);
    }

    // Scroll-driven activation on mobile
    var onScroll = function () {
      if (!isMobile()) return;
      var mid = window.innerHeight * 0.5;
      var bestIdx = cur;
      var bestDist = Infinity;
      panels.forEach(function (p, i) {
        var r = p.getBoundingClientRect();
        var pMid = r.top + r.height / 2;
        var dist = Math.abs(mid - pMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      if (bestDist < 200 && bestIdx !== cur) {
        setActive(bestIdx);
      }
      pauseTemporarily(3500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Touch tap on mobile: first tap expands, second tap navigates
    panels.forEach(function (p, i) {
      p.addEventListener('click', function (e) {
        if (isMobile()) {
          if (!p.classList.contains('is-active')) {
            e.preventDefault();
            setActive(i);
            pauseTemporarily(5000);
          }
        }
      });
    });

    // Start mobile simulation loop
    if (isMobile()) {
      setActive(0);
      startTimer();
    }

    window.addEventListener('resize', function () {
      if (isMobile()) {
        if (!timer) startTimer();
      } else {
        stopTimer();
        panels.forEach(function (p) { p.classList.remove('is-active'); });
      }
    });
  }

  /* ==========================================================================
     OPTION 2: Callouts on Portrait (index-2.html)
     ========================================================================== */
  function initOption2() {
    var callout = document.querySelector('.callout');
    if (!callout) return;
    var balls = callout.querySelectorAll('.ball');
    var svg = callout.querySelector('svg');
    if (!balls.length || !svg) return;

    var lines = svg.querySelectorAll('line');
    var circles = svg.querySelectorAll('circle');

    var stationData = [
      { num: '01', name: 'About', href: 'about.html', desc: 'Background, approach and practical execution' },
      { num: '02', name: 'Projects', href: 'projects.html', desc: 'CNC, CAD, layouts and shop-floor work' },
      { num: '03', name: 'Services', href: 'services.html', desc: 'Process support, estimating and analysis' },
      { num: '04', name: 'Experience', href: 'experience.html', desc: 'Roles, education and r\u00e9sum\u00e9' },
      { num: '05', name: 'Contact', href: 'contact.html', desc: 'Start a conversation about your project' }
    ];

    // Readout banner for mobile HUD
    var readout = document.getElementById('callout-readout') || callout.parentNode.querySelector('.callout-readout');
    if (!readout) {
      readout = document.createElement('div');
      readout.id = 'callout-readout';
      readout.className = 'callout-readout';
      callout.parentNode.insertBefore(readout, callout.nextSibling);
    }

    var cur = 0;
    var timer = null;

    function setActive(idx) {
      cur = (idx + balls.length) % balls.length;
      var d = stationData[cur] || stationData[0];

      balls.forEach(function (b, i) {
        b.classList.toggle('is-active', i === cur);
      });
      lines.forEach(function (l, i) {
        l.classList.toggle('is-active', i === cur);
      });
      circles.forEach(function (c, i) {
        c.classList.toggle('is-active', i === cur);
      });

      if (readout) {
        readout.innerHTML =
          '<span class="tag">STATION ' + d.num + '</span>' +
          '<a href="' + d.href + '"><span>' + d.name + ' \u2014 ' + d.desc + '</span><span class="arrow">\u2192</span></a>';
      }
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        setActive(cur + 1);
      }, 2600);
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function pauseTemporarily(ms) {
      stopTimer();
      setTimeout(startTimer, ms || 4500);
    }

    balls.forEach(function (b, i) {
      b.addEventListener('click', function (e) {
        if (isMobile() && !b.classList.contains('is-active')) {
          e.preventDefault();
          setActive(i);
          pauseTemporarily(5000);
        }
      });
      b.addEventListener('mouseenter', function () {
        if (!isMobile()) setActive(i);
      });
    });

    setActive(0);
    startTimer();
  }

  /* ==========================================================================
     OPTION 3: Split Index + Photo Panel (index-3.html)
     ========================================================================== */
  function initOption3() {
    var splitLand = document.querySelector('.split-land');
    if (!splitLand) return;
    var rowsContainer = splitLand.querySelector('.rows');
    var rows = splitLand.querySelectorAll('.rows a');
    var layers = splitLand.querySelectorAll('.layer');
    var cap = document.getElementById('cap');
    if (!rows.length || !layers.length) return;

    var names = ['About', 'Projects', 'Services', 'Experience', 'Contact'];
    var home = cap ? cap.textContent : 'Fig. 00 \u2014 Anthony Aughenbaugh';
    var cur = -1;
    var timer = null;

    function show(i, isSim) {
      cur = i;
      if (i >= 0 && i < names.length) {
        if (rowsContainer) rowsContainer.classList.add('has-active');
        rows.forEach(function (r, n) { r.classList.toggle('is-active', n === i); });
        layers.forEach(function (l, n) { l.classList.toggle('on', n === i); });
        if (cap) cap.textContent = 'Fig. 0' + (i + 1) + ' \u2014 ' + names[i];
      } else {
        if (rowsContainer) rowsContainer.classList.remove('has-active');
        rows.forEach(function (r) { r.classList.remove('is-active'); });
        layers.forEach(function (l) { l.classList.remove('on'); });
        if (cap) cap.textContent = home;
      }
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        if (!isMobile()) return;
        var next = (cur + 1) % names.length;
        show(next, true);
      }, 2800);
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function pauseTemporarily(ms) {
      stopTimer();
      setTimeout(function () {
        if (isMobile()) startTimer();
      }, ms || 4000);
    }

    // Desktop hover & focus
    rows.forEach(function (a) {
      var i = +a.dataset.layer;
      ['mouseenter', 'focus'].forEach(function (ev) {
        a.addEventListener(ev, function () {
          if (!isMobile()) show(i, false);
        });
      });
      ['mouseleave', 'blur'].forEach(function (ev) {
        a.addEventListener(ev, function () {
          if (!isMobile()) show(-1, false);
        });
      });

      // Mobile tap interaction: preview first, navigate on second tap
      a.addEventListener('click', function (e) {
        if (isMobile()) {
          if (!a.classList.contains('is-active')) {
            e.preventDefault();
            show(i, false);
            pauseTemporarily(5000);
          }
        }
      });
    });

    // Mobile scroll-driven selection
    window.addEventListener('scroll', function () {
      if (!isMobile()) return;
      var mid = window.innerHeight * 0.45;
      var bestIdx = cur;
      var bestDist = Infinity;
      rows.forEach(function (r, i) {
        var rect = r.getBoundingClientRect();
        var rMid = rect.top + rect.height / 2;
        var dist = Math.abs(mid - rMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      if (bestDist < 160 && bestIdx !== cur) {
        show(bestIdx, true);
      }
      pauseTemporarily(3500);
    }, { passive: true });

    if (isMobile()) {
      show(0, true);
      startTimer();
    }

    window.addEventListener('resize', function () {
      if (isMobile()) {
        if (!timer) startTimer();
      } else {
        stopTimer();
        show(-1, false);
      }
    });
  }

  /* ==========================================================================
     OPTION 4: Title Block Sheet Inspector (index-4.html)
     ========================================================================== */
  function initOption4() {
    var sheet = document.querySelector('.sheet');
    var tblock = document.querySelector('.tblock');
    if (!sheet || !tblock) return;
    var links = tblock.querySelectorAll('a');
    if (!links.length) return;

    var sheetsData = [
      { num: '01', name: 'About', href: 'about.html', desc: 'Background, approach and how I work on the shop floor.' },
      { num: '02', name: 'Projects', href: 'projects.html', desc: 'CNC machining, CAD design, plant layouts and workflows.' },
      { num: '03', name: 'Services', href: 'services.html', desc: 'Manufacturing process support, estimating and facility analysis.' },
      { num: '04', name: 'Experience', href: 'experience.html', desc: 'Roles, degrees, coursework and downloadable r\u00e9sum\u00e9.' },
      { num: '05', name: 'Contact', href: 'contact.html', desc: 'Discuss a project, shop challenge or consulting inquiry.' }
    ];

    var sheetDraw = sheet.querySelector('.sheet-draw');
    var inspector = document.getElementById('sheet-inspector');
    if (!inspector && sheetDraw) {
      inspector = document.createElement('div');
      inspector.id = 'sheet-inspector';
      inspector.className = 'sheet-inspector';
      sheetDraw.appendChild(inspector);
    }

    var cur = 0;
    var timer = null;

    function setActive(idx) {
      cur = (idx + sheetsData.length) % sheetsData.length;
      var d = sheetsData[cur];

      links.forEach(function (l, i) {
        l.classList.toggle('is-active', i === cur);
      });

      if (inspector) {
        inspector.innerHTML =
          '<div class="sheet-inspector-head">' +
            '<span>DRAWING SHEET ' + d.num + ' / 05</span>' +
            '<span>REV A \u2022 SCALE 1:1</span>' +
          '</div>' +
          '<h3>' + d.name + '</h3>' +
          '<p>' + d.desc + '</p>' +
          '<a class="btn btn-small" href="' + d.href + '">Open Sheet ' + d.num + ' \u2192</a>';
      }
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        setActive(cur + 1);
      }, 2800);
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    links.forEach(function (l, i) {
      l.addEventListener('mouseenter', function () {
        setActive(i);
        stopTimer();
      });
      l.addEventListener('mouseleave', function () {
        startTimer();
      });
      l.addEventListener('click', function (e) {
        if (isMobile() && !l.classList.contains('is-active')) {
          e.preventDefault();
          setActive(i);
          stopTimer();
          setTimeout(startTimer, 5000);
        }
      });
    });

    setActive(0);
    startTimer();
  }

  /* ==========================================================================
     OPTION 5: Scroll-Drawn Toolpath (index-5.html)
     ========================================================================== */
  function initOption5() {
    var path = document.getElementById('path');
    if (!path) return;
    var line = path.querySelector('.path-line');
    var stns = path.querySelectorAll('.stn');
    var layers = document.querySelectorAll('.layer');
    var cap = document.getElementById('cap');
    if (!stns.length) return;

    var cur = -1;
    var draw = function () {
      var r = path.getBoundingClientRect();
      var focal = window.innerHeight * (isMobile() ? 0.5 : 0.6);
      var y = focal - r.top;
      if (line) line.style.height = Math.max(0, Math.min(r.height, y)) + 'px';

      var newCur = -1;
      stns.forEach(function (s, i) {
        var triggerOffset = isMobile() ? s.offsetTop + 40 : s.offsetTop + s.offsetHeight / 2;
        var on = triggerOffset < y;
        s.classList.toggle('on', on);
        if (on) newCur = i;
      });

      if (newCur !== cur) {
        cur = newCur;
        layers.forEach(function (l, i) {
          l.classList.toggle('on', i === cur);
        });
        if (cap) {
          cap.textContent = cur < 0 ? 'Fig. 00 \u2014 Anthony Aughenbaugh' : 'Fig. 0' + (cur + 1) + ' \u2014 ' + (stns[cur].dataset.name || '');
        }
      }
    };

    window.addEventListener('scroll', draw, { passive: true });
    window.addEventListener('resize', draw);
    draw();

    // Subtle mobile simulated tour if user hasn't scrolled
    var autoTourRan = false;
    if (isMobile()) {
      var autoTimer = setTimeout(function () {
        if (autoTourRan || window.scrollY > 40) return;
        autoTourRan = true;
        // Preview stations 0 through 2 gently
        var step = 0;
        var stepInterval = setInterval(function () {
          if (step >= stns.length || window.scrollY > 40) {
            clearInterval(stepInterval);
            return;
          }
          stns[step].classList.add('on');
          var img = stns[step].querySelector('.stn-img');
          if (img) img.style.opacity = '1';
          step++;
        }, 1200);
      }, 1500);

      window.addEventListener('scroll', function () {
        clearTimeout(autoTimer);
      }, { passive: true, once: true });
    }
  }

  /* ==========================================================================
     Cursor-following preview (peek) for standard index lists
     ========================================================================== */
  function initPeek() {
    var peek = document.querySelector('.peek');
    if (!peek) return;
    document.querySelectorAll('.index a').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        peek.style.backgroundImage = 'url(' + a.dataset.img + ')';
        peek.classList.add('on');
      });
      a.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
      a.addEventListener('mousemove', function (e) {
        peek.style.left = (e.clientX + 24) + 'px';
        peek.style.top = (e.clientY - 90) + 'px';
      });
    });
  }

  // Initialize all options on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initOption1();
    initOption2();
    initOption3();
    initOption4();
    initOption5();
    initPeek();
  }

})();
