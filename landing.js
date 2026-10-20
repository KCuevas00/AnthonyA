(function () {
  var peek = document.querySelector('.peek');
  if (peek) document.querySelectorAll('.index a').forEach(function (a) {
    a.addEventListener('mouseenter', function () { peek.style.backgroundImage = 'url(' + a.dataset.img + ')'; peek.classList.add('on'); });
    a.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
    a.addEventListener('mousemove', function (e) { peek.style.left = (e.clientX + 24) + 'px'; peek.style.top = (e.clientY - 90) + 'px'; });
  });
  var path = document.getElementById('path');
  if (path) {
    var line = path.querySelector('.path-line'), stns = path.querySelectorAll('.stn');
    var draw = function () {
      var r = path.getBoundingClientRect(), y = window.innerHeight * 0.6 - r.top;
      line.style.height = Math.max(0, Math.min(r.height, y)) + 'px';
      var cur = -1;
      stns.forEach(function (s, i) { var on = s.offsetTop + s.offsetHeight / 2 < y; s.classList.toggle('on', on); if (on) cur = i; });
      document.querySelectorAll('.layer').forEach(function (l, i) { l.classList.toggle('on', i === cur); });
      var cap = document.getElementById('cap'); if (cap) cap.textContent = cur < 0 ? 'Fig. 00 \u2014 Anthony Aughenbaugh' : 'Fig. 0' + (cur + 1) + ' \u2014 ' + stns[cur].dataset.name;
    };
    window.addEventListener('scroll', draw, { passive: true }); window.addEventListener('resize', draw); draw();
  }
})();
