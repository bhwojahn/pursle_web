(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Parallax only when a hover-capable pointer exists + no reduced motion */
  var hoverCapable =
    window.matchMedia('(any-hover: hover)').matches ||
    window.matchMedia('(hover: hover)').matches;

  function qs(sel, root) {
    return (root || doc).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  }

  /* ---- year ---- */
  var yearEl = qs('#year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---- custom cursor (always mounted; visibility via CSS @media (hover: hover)) ---- */
  var cursor = doc.createElement('div');
  cursor.id = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  var cursorInner = doc.createElement('div');
  cursorInner.className = 'cursor__inner';
  cursor.appendChild(cursorInner);
  body.appendChild(cursor);
  body.classList.add('is-cursor');

  var mouseX = 0;
  var mouseY = 0;
  var curX = 0;
  var curY = 0;
  var lerp = 0.14;

  doc.addEventListener(
    'mousemove',
    function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  function animateCursor() {
    curX += (mouseX - curX) * lerp;
    curY += (mouseY - curY) * lerp;
    cursor.style.transform =
      'translate3d(' + curX + 'px,' + curY + 'px,0) translate(-50%, -50%)';
    window.requestAnimationFrame(animateCursor);
  }
  animateCursor();

  doc.addEventListener(
    'mousemove',
    function (e) {
      var el = doc.elementFromPoint(e.clientX, e.clientY);
      var section = el && el.closest('[data-cursor]');
      var light = section && section.getAttribute('data-cursor') === 'light';
      var interactive = el && (el.closest('a') || el.closest('button') || el.closest('[role="button"]') || el.closest('input') || el.closest('textarea') || el.closest('select'));
      cursor.classList.toggle('is-light', !!light);
      cursor.classList.toggle('is-hover', !!interactive);
    },
    { passive: true }
  );

  /* ---- parallax (hero ghosts) ---- */
  var parallaxLayers = qsa('.parallax-layer');
  if (parallaxLayers.length && hoverCapable && !reduceMotion) {
    function parallaxTick() {
      var y = window.scrollY || window.pageYOffset;
      parallaxLayers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute('data-parallax') || '0.35') || 0.35;
        var offset = y * speed * 0.38;
        layer.style.transform = 'translate3d(0,' + offset + 'px,0)';
      });
      window.requestAnimationFrame(parallaxTick);
    }
    parallaxTick();
  }

  /* ---- sticky nav ---- */
  var header = qs('.site-header');
  function onScrollNav() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('is-scrolled', y > 80);
    }
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---- mobile nav ---- */
  var navToggle = qs('#nav-toggle');
  var siteNav = qs('#site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = !siteNav.classList.contains('is-open');
      siteNav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'close menu' : 'open menu');
      body.style.overflow = open ? 'hidden' : '';
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'open menu');
        body.style.overflow = '';
      }
    });
  }

  /* ---- scroll reveal ---- */
  var revealEls = qsa('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- CSRF + contact form ---- */
  var form = qs('#contact-form');
  var csrfInput = qs('#csrf-field');
  var formStatus = qs('#form-status');
  var formDone = qs('#form-done');

  function setText(el, text) {
    if (el) {
      el.textContent = text;
    }
  }

  if (csrfInput) {
    fetch('/api/csrf-token', { credentials: 'same-origin' })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && data.csrfToken) {
          csrfInput.value = data.csrfToken;
        }
      })
      .catch(function () {
        setText(formStatus, 'refresh the page to send a message.');
      });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setText(formStatus, '');

      var token = csrfInput ? csrfInput.value : '';
      if (!token) {
        setText(formStatus, 'refresh the page and try again.');
        return;
      }

      var payload = {
        _csrf: token,
        name: (qs('#name', form) && qs('#name', form).value) || '',
        company: (qs('#company', form) && qs('#company', form).value) || '',
        email: (qs('#email', form) && qs('#email', form).value) || '',
        slowing: (qs('#slowing', form) && qs('#slowing', form).value) || '',
        website: (qs('#website', form) && qs('#website', form).value) || '',
      };

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          return r.text().then(function (text) {
            var data = {};
            try {
              data = text ? JSON.parse(text) : {};
            } catch (ignore) {
              data = {};
            }
            return { ok: r.ok, status: r.status, data: data };
          });
        })
        .then(function (res) {
          if (res.ok && res.data && res.data.ok) {
            form.hidden = true;
            form.setAttribute('aria-hidden', 'true');
            if (formDone) {
              formDone.hidden = false;
              formDone.removeAttribute('aria-hidden');
            }
            return;
          }
          setText(
            formStatus,
            (res.data && res.data.error) ||
              'something went wrong. please try again.'
          );
        })
        .catch(function () {
          setText(formStatus, 'something went wrong. please try again.');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
          }
        });
    });
  }
})();
