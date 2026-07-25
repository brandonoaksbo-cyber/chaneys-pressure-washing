/* =========================================================================
   Chaney's Pressure Washing & Soft Wash — site behaviour
   No dependencies. Everything degrades gracefully without JavaScript:
   the nav links still jump, and the quote form still submits normally.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Mobile navigation drawer
     --------------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var scrim = document.getElementById('navScrim');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    scrim.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (nav && toggle && scrim) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    scrim.addEventListener('click', function () { setNav(false); });

    // Close after tapping a link, and when resizing up to the desktop layout
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000) setNav(false);
    });
  }

  /* ---------------------------------------------------------------------
     Header shadow once the page scrolls
     --------------------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     Quote form: validation, spam protection, submission
     --------------------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var success = document.getElementById('quoteSuccess');
  var formError = document.getElementById('formError');
  var submitBtn = document.getElementById('quoteSubmit');
  var loadedAt = document.getElementById('formLoadedAt');

  // Spam protection #1: bots fill forms instantly. Record when the page loaded
  // so we can ignore anything submitted in under 3 seconds.
  // (Spam protection #2 is the hidden honeypot field in the HTML.)
  var startTime = Date.now();
  if (loadedAt) loadedAt.value = String(startTime);

  var MAX_FILES = 3;
  var MAX_FILE_MB = 10;

  var messages = {
    name:            'Please enter your name.',
    phone:           'Please enter a phone number we can reach you on.',
    phoneFormat:     'Please enter a valid phone number, e.g. 850-566-9274.',
    email:           'Please enter your email address.',
    emailFormat:     'Please enter a valid email address, e.g. name@example.com.',
    address:         'Please enter the property address or ZIP code.',
    property_type:   'Please choose residential or commercial.',
    service:         'Please choose the service you need.',
    contact_method:  'Please choose how you would like us to reach you.',
    photosCount:     'Please select no more than ' + MAX_FILES + ' images.',
    photosSize:      'Each image must be under ' + MAX_FILE_MB + 'MB.',
    photosType:      'Please upload image files only.'
  };

  function showError(name, message) {
    var box = document.getElementById('err-' + name);
    if (box) {
      box.textContent = message;
      box.hidden = false;
    }
    var fields = form.querySelectorAll('[name="' + name + '"]');
    Array.prototype.forEach.call(fields, function (f) {
      f.setAttribute('aria-invalid', 'true');
    });
  }

  function clearError(name) {
    var box = document.getElementById('err-' + name);
    if (box) {
      box.textContent = '';
      box.hidden = true;
    }
    var fields = form.querySelectorAll('[name="' + name + '"]');
    Array.prototype.forEach.call(fields, function (f) {
      f.removeAttribute('aria-invalid');
    });
  }

  function validateField(name) {
    clearError(name);

    if (name === 'photos') {
      var files = form.photos && form.photos.files ? form.photos.files : [];
      if (files.length > MAX_FILES) { showError(name, messages.photosCount); return false; }
      for (var i = 0; i < files.length; i++) {
        if (files[i].type && files[i].type.indexOf('image/') !== 0) {
          showError(name, messages.photosType); return false;
        }
        if (files[i].size > MAX_FILE_MB * 1024 * 1024) {
          showError(name, messages.photosSize); return false;
        }
      }
      return true;
    }

    var group = form.querySelectorAll('[name="' + name + '"]');
    if (!group.length) return true;

    var first = group[0];

    // Radio groups
    if (first.type === 'radio') {
      var picked = Array.prototype.some.call(group, function (r) { return r.checked; });
      if (!picked) { showError(name, messages[name]); return false; }
      return true;
    }

    var value = (first.value || '').trim();

    if (!first.hasAttribute('required') && !value) return true;
    if (!value) { showError(name, messages[name]); return false; }

    if (name === 'phone') {
      var digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) { showError(name, messages.phoneFormat); return false; }
    }

    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      showError(name, messages.emailFormat); return false;
    }

    return true;
  }

  var validated = ['name', 'phone', 'email', 'address', 'property_type', 'service', 'contact_method', 'photos'];

  // Re-check a field once the visitor has left it, and clear errors as they type
  validated.forEach(function (name) {
    var group = form.querySelectorAll('[name="' + name + '"]');
    Array.prototype.forEach.call(group, function (field) {
      var evt = (field.type === 'radio' || field.tagName === 'SELECT' || field.type === 'file') ? 'change' : 'blur';
      field.addEventListener(evt, function () { validateField(name); });
      if (evt === 'blur') {
        field.addEventListener('input', function () {
          if (field.getAttribute('aria-invalid') === 'true') clearError(name);
        });
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formError.hidden = true;

    var firstBad = null;
    validated.forEach(function (name) {
      if (!validateField(name) && !firstBad) firstBad = name;
    });

    if (firstBad) {
      var field = form.querySelector('[name="' + firstBad + '"]');
      if (field) {
        field.focus({ preventScroll: true });
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Spam checks — fail quietly, exactly as a real submission would look
    var honeypot = form.querySelector('[name="_gotcha"]');
    var tooFast = Date.now() - startTime < 3000;
    if ((honeypot && honeypot.value) || tooFast) {
      showSuccess();
      return;
    }

    var action = form.getAttribute('action') || '';

    // The form has not been connected to a destination yet.
    if (!action || action.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
      formError.textContent =
        'This form is not connected to a destination yet. Please call 850-566-WASH (9274) to request your quote. ' +
        '(Site owner: see README.md → "The quote form".)';
      formError.hidden = false;
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.classList.add('is-busy');
    submitBtn.textContent = 'Sending…';

    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (res.ok) { showSuccess(); return; }
        return res.json().catch(function () { return null; }).then(function (data) {
          var detail = data && data.errors && data.errors.length ? data.errors[0].message : '';
          throw new Error(detail || 'Request failed');
        });
      })
      .catch(function (err) {
        submitBtn.classList.remove('is-busy');
        submitBtn.textContent = 'Get My Free Quote';
        formError.textContent =
          'Sorry — your request could not be sent' + (err && err.message ? ' (' + err.message + ')' : '') +
          '. Please try again, or call 850-566-WASH (9274) and we will take the details over the phone.';
        formError.hidden = false;
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
  });

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
