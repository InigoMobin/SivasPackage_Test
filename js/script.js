/* ==========================================================
   Sivas Package — Landing page interactions
   ========================================================== */
   (function () {
    'use strict';
  
    /* ==========================================================
       SETTINGS
       1. Go to https://web3forms.com, enter the email that should
          RECEIVE enquiries and click "Create Access Key".
          The key arrives by email.
       2. Paste that key between the quotes below.
       Until a key is added, the form falls back to opening the
       visitor's email app, so the site keeps working.
  
       TESTING: enquiries currently go to the developer's address.
       Before going live:
         - create a new access key with sivaspackage@gmail.com
           and paste it below, and
         - set ENQUIRY_EMAIL back to 'sivaspackage@gmail.com'.
       ========================================================== */
    const WEB3FORMS_ACCESS_KEY = 'd86a83b8-ff76-4e10-a597-a9878d5aed23';
    const ENQUIRY_EMAIL = 'er.a.mobin@gmail.com'; // TEST — live: 'sivaspackage@gmail.com'
    const COMPANY_WHATSAPP = '919841742207'; // country code + number, no spaces
  
    document.documentElement.classList.add('js');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  
    /* ---------- Footer year ---------- */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  
    /* ---------- Header style on scroll ---------- */
    const header = $('#siteHeader');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  
    /* ---------- Mobile menu ---------- */
    const navToggle = $('#navToggle');
    const nav = $('#mainNav');
    const setMenu = (open) => {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
    };
    navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) setMenu(false); });
  
    /* ---------- Highlight current section in nav ---------- */
    const navLinks = $$('a', nav);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      navLinks.forEach((a) => { const t = $(a.getAttribute('href')); if (t) io.observe(t); });
    }
  
    /* ---------- Reveal on scroll (replays when you scroll back down) ----------
       An element animates in when it enters the screen. When it leaves through
       the BOTTOM of the screen (you scrolled back up past it), it resets, so it
       animates again next time you scroll down. Content above you stays visible. */
    const reveals = $$('.reveal');
    if ('IntersectionObserver' in window && !prefersReduced) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const el = en.target;
          if (en.isIntersecting) {
            const sibs = $$(':scope > .reveal', el.parentElement);
            const i = Math.max(0, sibs.indexOf(el));
            el.style.transitionDelay = Math.min(i * 80, 320) + 'ms';
            el.classList.remove('is-resetting');
            el.classList.add('is-visible');
          } else if (en.boundingClientRect.top > 0) {
            // fully below the viewport: reset instantly, ready to replay
            el.classList.add('is-resetting');
            el.style.transitionDelay = '0ms';
            el.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }
  
    /* ---------- Count-up numbers (replay every time they come into view) ---------- */
    const countUp = (el) => {
      const target = parseInt(el.dataset.count, 10);
      cancelAnimationFrame(el._raf);
      if (prefersReduced) { el.textContent = target; return; }
      const start = performance.now(), dur = 1600;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) el._raf = requestAnimationFrame(tick);
      };
      el._raf = requestAnimationFrame(tick);
    };
    const counters = $$('[data-count]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const el = en.target;
          if (en.isIntersecting) {
            if (!el._counted) { el._counted = true; countUp(el); }
          } else {
            // off screen: reset so it counts up again next time
            el._counted = false;
            cancelAnimationFrame(el._raf);
            el.textContent = '0';
          }
        });
      }, { threshold: 0.5 });
      counters.forEach((c) => io.observe(c));
    } else {
      counters.forEach((c) => (c.textContent = c.dataset.count));
    }
  
    /* ---------- Client marquee: duplicate for a seamless loop ---------- */
    const track = $('#marqueeTrack');
    if (track) track.innerHTML += track.innerHTML;
  
    /* ---------- Flute explorer (B vs NF) ---------- */
    const FLUTES = {
      b:  { pitch: 40, top: 14, bottom: 76, shift: 0,   note: 'Taller flute with good crush resistance and cushioning, a strong all-rounder for shipping cartons.' },
      nf: { pitch: 14, top: 14, bottom: 34, shift: -42, note: 'A very fine, thin flute with a smooth surface, ideal for sharp multicolour printing on retail cartons.' }
    };
    const waveFor = ({ pitch, top, bottom }) => {
      let d = `M0 ${bottom}`;
      for (let x = 0; x < 400; x += pitch) {
        const q = pitch / 4;
        d += ` C${x + q} ${bottom} ${x + q} ${top} ${x + pitch / 2} ${top}`;
        d += ` C${x + 3 * q} ${top} ${x + 3 * q} ${bottom} ${x + pitch} ${bottom}`;
      }
      return d;
    };
    const wave = $('.flute-preview .wave');
    const bottomLiner = $('.flute-preview .lnr-bottom');
    const fluteNote = $('#fluteNote');
    const fluteBtns = $$('[data-flute]');
    const setFlute = (key) => {
      const f = FLUTES[key];
      wave.style.opacity = 0;
      setTimeout(() => { wave.setAttribute('d', waveFor(f)); wave.style.opacity = 1; }, prefersReduced ? 0 : 180);
      bottomLiner.style.transform = `translateY(${f.shift}px)`;
      fluteNote.textContent = f.note;
      fluteBtns.forEach((b) => {
        const on = b.dataset.flute === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    };
    if (wave) {
      wave.setAttribute('d', waveFor(FLUTES.b));
      fluteBtns.forEach((b) => b.addEventListener('click', () => setFlute(b.dataset.flute)));
    }
  
    /* ---------- Jump to the quote form ---------- */
    const form = $('#quote');
    const goToQuote = (product) => {
      if (product) form.elements.product.value = product;
      // if a thank-you message is showing, bring the form back
      if (!$('#formSuccess').hidden) $('#sendAnother').click();
      const top = form.getBoundingClientRect().top + window.scrollY - (header.offsetHeight + 24);
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'auto' : 'smooth' });
      setTimeout(() => {
        form.classList.remove('is-highlight');
        void form.offsetWidth; // restart the highlight animation
        form.classList.add('is-highlight');
        form.elements.name.focus({ preventScroll: true });
      }, prefersReduced ? 0 : 650);
    };
    $$('[data-goto-quote]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setMenu(false); goToQuote(); }));
    $$('[data-product]').forEach((b) => b.addEventListener('click', () => goToQuote(b.dataset.product)));
  
    /* ---------- Quote form: sends directly by email ---------- */
    const status = $('#formStatus');
    const formBody = $('#formBody');
    const success = $('#formSuccess');
    const submitBtn = $('#submitBtn');
    const btnLabel = $('.btn-label', submitBtn);
    const keyIsSet = WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.startsWith('PASTE');
  
    const setError = (input, msg) => {
      const field = input.closest('.field');
      field.classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = $('.error', field);
      if (err) err.textContent = msg || '';
    };
  
    const setStatus = (msg, isError) => {
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
    };
  
    const validate = () => {
      const { name, phone, email } = form.elements;
      let ok = true;
      [name, phone, email].forEach((i) => setError(i, ''));
      if (!name.value.trim()) { setError(name, 'Enter your name.'); ok = false; }
      if (phone.value.replace(/\D/g, '').length < 10) { setError(phone, 'Enter a phone number with at least 10 digits.'); ok = false; }
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, 'Enter a valid email address, or leave it blank.'); ok = false; }
      if (!ok) $('[aria-invalid="true"]', form).focus();
      return ok;
    };
  
    const val = (n) => (form.elements[n].value || '').trim();
  
    const message = () => [
      'Quote request from the Sivas Package website',
      '',
      'Name: ' + (val('name') || '-'),
      'Phone: ' + (val('phone') || '-'),
      'Email: ' + (val('email') || '-'),
      'Company: ' + (val('company') || '-'),
      'Product: ' + (val('product') || '-'),
      'Details: ' + (val('details') || '-')
    ].join('\n');
  
    const setLoading = (on) => {
      submitBtn.classList.toggle('is-loading', on);
      submitBtn.disabled = on;
      btnLabel.textContent = on ? 'Sending…' : 'Get my quote';
    };
  
    const showSuccess = () => {
      $('#successName').textContent = val('name').split(' ')[0] || 'we have your enquiry';
      $('#successPhone').textContent = val('phone') || 'your phone';
      formBody.hidden = true;
      $('.quote-card-head', form).hidden = true;
      success.hidden = false;
      success.focus();
    };
  
    const resetForm = () => {
      form.reset();
      setStatus('');
      success.hidden = true;
      formBody.hidden = false;
      $('.quote-card-head', form).hidden = false;
      form.elements.name.focus();
    };
  
    // Fallback used only until the access key is added
    const openEmailApp = () => {
      const subject = 'Quote request: ' + val('product') + ' – ' + val('name');
      window.location.href = 'mailto:' + ENQUIRY_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message());
      setStatus('Your email app has opened with your enquiry filled in. Press send to deliver it to us.');
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('');
      if (form.elements.botcheck.checked) return; // spam bot filled the hidden field
      if (!validate()) return;
      if (!keyIsSet) { openEmailApp(); return; }
  
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New quote request: ' + val('product') + ' – ' + val('name') + (val('company') ? ' (' + val('company') + ')' : ''),
        from_name: 'Sivas Package Website',
        name: val('name'),
        phone: val('phone'),
        company: val('company') || '-',
        product: val('product'),
        details: val('details') || '-',
        page: window.location.href
      };
      if (val('email')) payload.email = val('email'); // lets you press Reply in Gmail
  
      setLoading(true);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timer);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          showSuccess();
        } else {
          throw new Error(data.message || 'Request failed');
        }
      } catch (err) {
        console.error('Quote form error:', err);
        setStatus('Your enquiry could not be sent. Check your internet connection and try again, or call 98417 42207.', true);
      } finally {
        setLoading(false);
      }
    });
  
    $('#sendAnother').addEventListener('click', resetForm);
  
    $('#waSend').addEventListener('click', () => {
      if (!validate()) return;
      window.open('https://wa.me/' + COMPANY_WHATSAPP + '?text=' + encodeURIComponent(message()), '_blank', 'noopener');
      setStatus('WhatsApp has opened with your enquiry. Press send to deliver it to us.');
    });
  
    $$('input', form).forEach((input) => input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, '');
    }));
  })();