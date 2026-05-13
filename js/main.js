/* =========================
   HERO GRADIENT
========================= */
const hero = document.querySelector('.hero-section');

if (hero) {
  let mouseX = 50;
  let mouseY = 50;

  let x1 = 50, y1 = 50;
  let x2 = 50, y2 = 50;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();

    mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    mouseY = ((e.clientY - rect.top) / rect.height) * 100;
  });

  function animateHero() {
    x1 += (mouseX - x1) * 0.12;
    y1 += (mouseY - y1) * 0.12;

    x2 += (mouseX - x2) * 0.05;
    y2 += (mouseY - y2) * 0.05;

    hero.style.setProperty('--x1', x1 + '%');
    hero.style.setProperty('--y1', y1 + '%');
    hero.style.setProperty('--x2', x2 + '%');
    hero.style.setProperty('--y2', y2 + '%');

    requestAnimationFrame(animateHero);
  }

  animateHero();
}

/* =========================
   BRAND & OFFERINGS REVEAL
========================= */

// wrap each text node's lines for reveal
function wrapTextLines(el) {
  const text = el.innerHTML;
  // split on <br> or sentence boundaries inside the element
  el.innerHTML = `<span class="reveal-line">${text}</span>`;
}

// split .text.large into per-line reveal spans by sentence
function splitIntoLines(el) {
  // Replace period/comma boundaries with split markers
  const raw = el.innerHTML;
  const lines = raw
    .split(/(?<=\.)\s+|(?<=,)\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  el.innerHTML = lines
    .map(line => `<span class="reveal-line" style="display:block;">${line}</span>`)
    .join(' ');
}

document.querySelectorAll('.section.split').forEach(section => {
  const context = section.querySelector('.context');
  const textEl  = section.querySelector('.text.large');
  const subline  = section.querySelector('.subline');
  const ticker   = section.querySelector('.service-ticker');
  const bigNum   = section.querySelector('.big-number');

  // wrap context
  if (context) context.classList.add('reveal-line');

  // split main copy into lines
  if (textEl) splitIntoLines(textEl);

  const allReveal = section.querySelectorAll('.reveal-line');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      section.classList.add('active');
      if (bigNum) bigNum.classList.add('revealed');

      // stagger each line
      allReveal.forEach((line, i) => {
        setTimeout(() => line.classList.add('show'), i * 140);
      });

      // draw subline after lines finish
      const delay = allReveal.length * 140 + 200;
      if (subline) setTimeout(() => subline.classList.add('draw'), delay);

      // stagger ticker items
      if (ticker) {
        const items = ticker.querySelectorAll('.ticker-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('show'), delay + 100 + i * 120);
        });
      }

      observer.unobserve(section);
    });
  }, { threshold: 0.25 });

  observer.observe(section);
});

/* ============================================================
   SERVICE SECTIONS  (03 – 06)  — Reveal + Animations
   Append to the bottom of js/global.js
   ============================================================ */


/* ── Shared utilities ──────────────────────────────────────── */

/**
 * Fires callback once the first time el enters the viewport.
 * @param {Element} el
 * @param {Function} cb
 * @param {number} threshold  0–1
 */
function onceInView(el, cb, threshold) {
  threshold = threshold || 0.25;
  var obs = new IntersectionObserver(function(entries, self) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      cb();
      self.unobserve(el);
    });
  }, { threshold: threshold });
  obs.observe(el);
}

/**
 * Fires onEnter / onLeave every time el crosses the threshold.
 * @param {Element}  el
 * @param {Function} onEnter
 * @param {Function} onLeave
 * @param {number}   threshold
 */
function toggleInView(el, onEnter, onLeave, threshold) {
  threshold = threshold || 0.3;
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      e.isIntersecting ? onEnter() : onLeave();
    });
  }, { threshold: threshold }).observe(el);
}


/* ── Shared reveal: text + chapter numeral + subline ───────── */
document.querySelectorAll('.svc-section').forEach(function(section) {
  var reveals = section.querySelectorAll('.svc-reveal');
  var subline  = section.querySelector('.svc-subline');

  onceInView(section, function() {
    section.classList.add('svc-entered');   // brightens the big number

    reveals.forEach(function(el, i) {
      setTimeout(function() {
        el.classList.add('show');
      }, i * 140);
    });

    if (subline) {
      setTimeout(function() {
        subline.classList.add('draw');
      }, reveals.length * 140 + 200);
    }
  });
});


/* ============================================================
   03  CHATBOTS — scripted phone conversation
   ============================================================ */
(function() {
  var section = document.getElementById('chatbots');
  var msgsEl  = document.getElementById('chat-msgs');
  var typEl   = document.getElementById('chat-typing');
  if (!section || !msgsEl || !typEl) return;

  var script = [
    { from: 'bot',  text: 'hi! how can we help today?' },
    { from: 'user', text: 'looking to automate our lead intake.' },
    { from: 'bot',  text: 'got it. how many leads / week?' },
    { from: 'user', text: 'around 200.' },
    { from: 'bot',  text: 'perfect — booking a 20min call ✨' },
  ];

  var live = false;

  function runChat() {
    msgsEl.innerHTML = '';
    typEl.classList.remove('on');
    var i = 0;

    function step() {
      if (!live || i >= script.length) {
        if (live) setTimeout(runChat, 2500);
        return;
      }

      typEl.classList.add('on');

      setTimeout(function() {
        if (!live) return;
        typEl.classList.remove('on');

        var msg = script[i++];
        var el  = document.createElement('div');
        el.className   = 'chat-bubble ' + msg.from;
        el.textContent = msg.text;
        msgsEl.appendChild(el);
        msgsEl.scrollTop = msgsEl.scrollHeight;

        setTimeout(step, 1400);
      }, 900);
    }

    step();
  }

  toggleInView(section,
    function() { live = true;  runChat(); },
    function() { live = false; }
  );
}());


/* ============================================================
   04  CONSULTANCY — bottleneck pipe
   ============================================================ */
(function() {
  var section = document.getElementById('consultancy');
  var svg     = document.getElementById('pipe-svg');
  if (!section || !svg) return;

  var NS = 'http://www.w3.org/2000/svg';

  /* ─ Build SVG elements once ─────────────────────────────── */
  var defs = document.createElementNS(NS, 'defs');
  var grad = document.createElementNS(NS, 'linearGradient');
  grad.setAttribute('id', 'pipeGrad');
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '0%');

  var s1 = document.createElementNS(NS, 'stop');
  s1.setAttribute('offset', '0%');
  s1.setAttribute('stop-color', 'rgba(255,255,255,0.05)');
  var s2 = document.createElementNS(NS, 'stop');
  s2.setAttribute('offset', '100%');
  s2.setAttribute('stop-color', 'rgba(45,31,110,0.4)');
  grad.appendChild(s1);
  grad.appendChild(s2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  /*
   * Both paths share the same command structure so CSS `d` transition
   * can interpolate smoothly between them.
   *
   * BOTTLENECK: pipe pinched at midpoint (x=250)
   * FLOW:       open rectangle (midpoints flush to edges)
   */
  var D_NECK = 'M 20 80 L 220 80 L 250 110 L 280 80 L 480 80 ' +
               'L 480 160 L 280 160 L 250 130 L 220 160 L 20 160 Z';
  var D_FLOW = 'M 20 80 L 220 80 L 250 80  L 280 80 L 480 80 ' +
               'L 480 160 L 280 160 L 250 160 L 220 160 L 20 160 Z';

  var pipe = document.createElementNS(NS, 'path');
  pipe.setAttribute('id', 'pipe-path');
  pipe.setAttribute('fill', 'url(#pipeGrad)');
  pipe.setAttribute('stroke', 'rgba(232,232,235,0.15)');
  pipe.setAttribute('stroke-width', '1');
  pipe.setAttribute('d', D_NECK);
  svg.appendChild(pipe);

  /* ─ Flow dots ─────────────────────────────────────────────── */
  var DOT_N = 9;
  var dots  = [];

  for (var i = 0; i < DOT_N; i++) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('r',  '5');
    c.setAttribute('cy', '120');
    c.setAttribute('cx', String(40 + (i / DOT_N) * 170));
    c.style.transition = 'cx 1.2s cubic-bezier(0.16,1,0.3,1), fill 0.6s ease';
    svg.appendChild(c);
    dots.push(c);
  }

  /* ─ Status label ─────────────────────────────────────────── */
  var label = document.createElementNS(NS, 'text');
  label.setAttribute('id', 'pipe-label');
  label.setAttribute('x', '250');
  label.setAttribute('y', '52');
  svg.appendChild(label);

  /* ─ Inject pipeFlow keyframe once ───────────────────────── */
  var ks = document.createElement('style');
  ks.textContent =
    '@keyframes pipeFlow{' +
    '0%{transform:translateX(-16px);opacity:.5}' +
    '50%{opacity:1}' +
    '100%{transform:translateX(16px);opacity:.5}}';
  document.head.appendChild(ks);

  /* ─ Phase setter ─────────────────────────────────────────── */
  function setPhase(phase) {
    if (phase === 'neck') {
      pipe.setAttribute('d', D_NECK);
      label.setAttribute('y',    '52');
      label.setAttribute('fill', '#e8a23a');
      label.textContent = '// bottleneck';
      dots.forEach(function(c, i) {
        c.setAttribute('cx',   String(40 + (i / DOT_N) * 170));
        c.setAttribute('fill', i > 5 ? '#e8a23a' : 'var(--slate)');
        c.style.animation = 'none';
      });
    } else {
      pipe.setAttribute('d', D_FLOW);
      label.setAttribute('y',    '218');
      label.setAttribute('fill', '#7ad17a');
      label.textContent = '// flow restored';
      dots.forEach(function(c, i) {
        c.setAttribute('cx',   String(50 + (i / DOT_N) * 400));
        c.setAttribute('fill', 'var(--slate)');
        c.style.animation = 'pipeFlow 2s linear ' + (i * 0.15) + 's infinite';
      });
    }
  }

  /* ─ Lifecycle ─────────────────────────────────────────────── */
  var timers = [], active = false;

  function startPipe() {
    active = true;
    setPhase('neck');

    var t1 = setTimeout(function() {
      if (active) setPhase('flow');
    }, 3500);

    var loop = setInterval(function() {
      if (!active) { clearInterval(loop); return; }
      setPhase('neck');
      setTimeout(function() {
        if (active) setPhase('flow');
      }, 3500);
    }, 7500);

    timers = [t1, loop];
  }

  function stopPipe() {
    active = false;
    timers.forEach(function(t) { clearTimeout(t); });
    timers = [];
  }

  toggleInView(section, startPipe, stopPipe);
}());


/* ============================================================
   05  AUTOMATION — terminal task runner
   ============================================================ */
(function() {
  var section = document.getElementById('automation');
  var listEl  = document.getElementById('task-list');
  var totalEl = document.getElementById('term-total');
  if (!section || !listEl || !totalEl) return;

  var TASKS = [
    { name: 'sync hubspot → notion',         time: '0.4s' },
    { name: 'enrich new leads via clearbit',  time: '0.7s' },
    { name: 'draft follow-up emails',         time: '1.1s' },
    { name: 'post daily report to slack',     time: '0.3s' },
  ];

  var live = false, timers = [];

  function buildRows() {
    listEl.innerHTML = '';
    TASKS.forEach(function(task) {
      var li = document.createElement('li');
      li.className = 'task-row';
      li.innerHTML =
        '<span class="task-lhs">' +
          '<span class="task-icon">·</span>' +
          '<span class="task-label">' + task.name + '</span>' +
        '</span>' +
        '<span class="task-time">...</span>';
      listEl.appendChild(li);
    });
    totalEl.innerHTML = '<span class="term-cursor"></span>';
  }

  function runTerminal() {
    buildRows();
    timers = [];

    var rows = listEl.querySelectorAll('.task-row');

    rows.forEach(function(row, i) {
      var t = setTimeout(function() {
        if (!live) return;
        row.classList.add('visible');

        var t2 = setTimeout(function() {
          if (!live) return;
          row.classList.add('done');
          row.querySelector('.task-icon').textContent = '✓';
          row.querySelector('.task-time').textContent = TASKS[i].time;
        }, 220);
        timers.push(t2);
      }, 700 + i * 700);
      timers.push(t);
    });

    var doneAt = 700 + TASKS.length * 700;

    var tDone = setTimeout(function() {
      if (!live) return;
      totalEl.innerHTML = '<span class="total-text">4 tasks · 2.5s · 0 errors</span>';
    }, doneAt);
    timers.push(tDone);

    var tLoop = setTimeout(function() {
      if (live) runTerminal();
    }, doneAt + 2500);
    timers.push(tLoop);
  }

  toggleInView(section,
    function() { live = true;  runTerminal(); },
    function() {
      live = false;
      timers.forEach(function(t) { clearTimeout(t); });
      timers = [];
    }
  );
}());


/* ============================================================
   06  INTEGRATION — node constellation
   ============================================================ */
(function() {
  var section = document.getElementById('integration');
  var svg     = document.getElementById('nodes-svg');
  if (!section || !svg) return;

  var NS = 'http://www.w3.org/2000/svg';

  var NODES = [
    { id: 'hubspot',  x: 80,  y: 60  },
    { id: 'stripe',   x: 260, y: 40  },
    { id: 'gmail',    x: 420, y: 90  },
    { id: 'notion',   x: 100, y: 200 },
    { id: 'slack',    x: 250, y: 240 },
    { id: 'postgres', x: 400, y: 220 },
    { id: 'sheets',   x: 250, y: 140 }, // hub node (index 6)
  ];

  var EDGES = [
    [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],
    [0,1],[3,4],[4,5],[1,2],
  ];

  /* ─ Store references for later activation ─ */
  var edgeLines    = [];
  var pulseCircles = [];
  var nodeCircles  = [];
  var nodeLabels   = [];

  /* ─ Build edges ────────────────────────────────────────────── */
  EDGES.forEach(function(pair, i) {
    var A   = NODES[pair[0]];
    var B   = NODES[pair[1]];
    var len = Math.hypot(B.x - A.x, B.y - A.y);

    /* Edge line (starts hidden via dashoffset) */
    var line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', A.x); line.setAttribute('y1', A.y);
    line.setAttribute('x2', B.x); line.setAttribute('y2', B.y);
    line.setAttribute('stroke', 'rgba(232,232,235,0.18)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', len);
    line.setAttribute('stroke-dashoffset', len);
    line.style.transition =
      'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) ' + (i * 120) + 'ms';
    svg.appendChild(line);
    edgeLines.push(line);

    /* Travelling pulse along the edge */
    var pulse = document.createElementNS(NS, 'circle');
    pulse.setAttribute('r', '2.5');
    pulse.setAttribute('fill', '#a78bfa');
    pulse.style.opacity    = '0';
    pulse.style.transition = 'opacity 0.4s ease';

    var anim = document.createElementNS(NS, 'animateMotion');
    anim.setAttribute('dur',         (2.5 + (i % 3) * 0.7) + 's');
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('path',        'M ' + A.x + ' ' + A.y + ' L ' + B.x + ' ' + B.y);
    anim.setAttribute('begin',       (1 + i * 0.2) + 's');
    pulse.appendChild(anim);

    svg.appendChild(pulse);
    pulseCircles.push(pulse);
  });

  /* ─ Build nodes ────────────────────────────────────────────── */
  NODES.forEach(function(n, i) {
    var isHub = (i === 6);

    var circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
    circle.setAttribute('r',    isHub ? 22 : 16);
    circle.setAttribute('fill', isHub ? 'rgba(45,31,110,0.6)' : 'rgba(255,255,255,0.05)');
    circle.setAttribute('stroke', 'rgba(232,232,235,0.3)');
    circle.setAttribute('stroke-width', '1');
    circle.style.opacity    = '0';
    circle.style.transition = 'opacity 0.6s ease ' + (i * 100) + 'ms';
    svg.appendChild(circle);
    nodeCircles.push(circle);

    var text = document.createElementNS(NS, 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', isHub ? n.y + 4 : n.y - 24);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill',        'var(--slate)');
    text.setAttribute('font-size',   '10');
    text.setAttribute('font-family', 'Montserrat');
    text.setAttribute('letter-spacing', '.05em');
    text.textContent    = n.id;
    text.style.opacity    = '0';
    text.style.transition = 'opacity 0.6s ease ' + (i * 100) + 'ms';
    svg.appendChild(text);
    nodeLabels.push(text);
  });

  /* ─ Activate on first scroll into view ─────────────────────── */
  onceInView(section, function() {
    edgeLines.forEach(function(l) {
      l.style.strokeDashoffset = '0';
    });
    pulseCircles.forEach(function(p) {
      p.style.opacity = '1';
    });
    nodeCircles.forEach(function(c) {
      c.style.opacity = '1';
    });
    nodeLabels.forEach(function(t) {
      t.style.opacity = '1';
    });
  }, 0.3);
}());


/* ============================================================
   PROCESS v2 — scroll-driven card expansion
   ============================================================ */
(function () {
  var driver  = document.getElementById('process');
  if (!driver) return;

  var cards   = driver.querySelectorAll('.ps-card');
  var dots    = driver.querySelectorAll('.ps-ind-dot');
  var hint    = driver.querySelector('.ps-scroll-hint');
  var current = -1;

  function setActive(i) {
    if (i === current) return;
    current = i;
    cards.forEach(function (c, idx) { c.classList.toggle('active', idx === i); });
    dots.forEach(function  (d, idx) { d.classList.toggle('active', idx === i); });
  }

  setActive(0); // initialise

  window.addEventListener('scroll', function () {
    var rect     = driver.getBoundingClientRect();
    var scrolled = -rect.top;
    var total    = driver.offsetHeight - window.innerHeight;
    var progress = Math.max(0, Math.min(1, scrolled / total));
    var step     = Math.min(3, Math.floor(progress * 4));

    setActive(step);
    if (hint) hint.classList.toggle('hidden', progress > 0.04);
  }, { passive: true });
}());