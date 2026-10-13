/* ===========================================================
   NEXTGEN : The GamerZ Paradise — all site behaviour lives here
   =========================================================== */

/* ---------- ✏️ EDIT ME: site settings ---------- */
const WHATSAPP = '919820895622';                 // country code + number, no "+" or spaces
const PHONE_LABEL = '+91 98208 95622';
const ADDRESS = '';                              // e.g. 'Shop 12, Link Road, Andheri West, Mumbai 400053'
const MAP_URL = '';                              // Google Maps "Share" link, e.g. 'https://maps.app.goo.gl/xxxx'
const MAP_EMBED = '';                            // Google Maps "Embed a map" src URL (optional)
const HOURS = '';                                // e.g. 'Mon–Sun · 11:00 AM – 2:00 AM'
const DEFAULT_WA_TEXT = 'Hi NEXTGEN GamerZ Paradise, I want to book a gaming session.';

const waLink = (text = DEFAULT_WA_TEXT) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Nav: solid background on scroll + back-to-top ---------- */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
  toTop.classList.toggle('show', window.scrollY > 700);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Footer year ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const setMenu = (open) => {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) nav.classList.add('scrolled');
  else onScroll();
};
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !e.target.closest('nav')) setMenu(false);
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

/* ---------- Scroll reveals ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
      // clear the stagger delay afterwards so hover effects stay snappy
      setTimeout(() => { e.target.style.transitionDelay = ''; }, 1000);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal-on-scroll, .zone, .rate, .perks li, .visit-box').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 80}ms`;
  io.observe(el);
});

/* ---------- Scroll-spy: highlight the nav link of the section in view ---------- */
const spyLinks = $$('.links a[href^="#"]:not(.nav-cta)');
const spyMap = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      spyLinks.forEach((a) => a.classList.remove('active'));
      spyMap.get(e.target.id)?.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
spyMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

/* ---------- WhatsApp links: one number, set from the config above ---------- */
$$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
const floatBtn = document.getElementById('waFloat');
floatBtn.href = waLink();
floatBtn.target = '_blank';
floatBtn.rel = 'noopener';
const waText = document.getElementById('waLink');
waText.href = waLink();
waText.textContent = PHONE_LABEL;

/* ---------- Visit section (address / hours / map) ---------- */
if (ADDRESS) document.getElementById('addr').textContent = ADDRESS;
if (HOURS) document.getElementById('hours').textContent = HOURS;
if (MAP_URL) {
  const ml = document.getElementById('mapLink');
  ml.href = MAP_URL; ml.target = '_blank'; ml.rel = 'noopener'; ml.hidden = false;
} else if (ADDRESS) {
  const ml = document.getElementById('mapLink');
  ml.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
  ml.target = '_blank'; ml.rel = 'noopener'; ml.hidden = false;
}
if (MAP_EMBED) {
  const box = document.getElementById('mapBox');
  const frame = document.createElement('iframe');
  frame.src = MAP_EMBED;
  frame.title = 'NEXTGEN The GamerZ Paradise on Google Maps';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  box.appendChild(frame);
  box.hidden = false;
}

/* ---------- Booking form -> WhatsApp ---------- */
const form = document.getElementById('bookForm');
const statusEl = document.getElementById('formStatus');
const timeErr = document.getElementById('timeErr');
const dateInput = form.elements.date;
const today = new Date();
const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
dateInput.min = iso;
dateInput.value = iso;

// Remember the visitor's name for next time (fails silently if storage is blocked)
try {
  const saved = localStorage.getItem('nextgen:name');
  if (saved) form.elements.name.value = saved;
} catch (_) { /* ignore */ }

const setStatus = (msg, bad = false) => {
  statusEl.textContent = msg;
  statusEl.classList.toggle('bad', bad);
};

// "Book this zone" buttons pre-select the zone in the form
document.querySelectorAll('[data-zone]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="zone"][value="${btn.dataset.zone}"]`);
    if (radio) radio.checked = true;
  });
});

form.addEventListener('input', (e) => {
  e.target.closest('label')?.classList.remove('invalid');
  setStatus('');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  ['name', 'date', 'time'].forEach((n) => {
    const field = form.elements[n];
    const bad = !field.value.trim();
    field.closest('label').classList.toggle('invalid', bad);
    if (bad && ok) { field.focus(); ok = false; }
  });
  if (!ok) { setStatus('Please fill in the highlighted fields.', true); return; }

  const f = form.elements;
  const when = new Date(`${f.date.value}T${f.time.value}`);

  // Don't allow booking a time that has already passed
  if (when.getTime() < Date.now() - 60000) {
    timeErr.textContent = 'That time has already passed';
    f.time.closest('label').classList.add('invalid');
    f.time.focus();
    setStatus('Please choose a time later than now.', true);
    return;
  }
  timeErr.textContent = 'Pick a time';

  const dateLabel = when.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeLabel = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const msg = [
    'Hi NEXTGEN GamerZ Paradise! I want to book a session.',
    `Name: ${f.name.value.trim()}`,
    `Zone: ${f.zone.value}`,
    `When: ${dateLabel}, ${timeLabel}`,
    `Players: ${f.players.value}`,
    `Duration: ${f.hours.value}`,
  ].join('\n');

  try { localStorage.setItem('nextgen:name', f.name.value.trim()); } catch (_) { /* ignore */ }
  setStatus('Opening WhatsApp… tap Send to confirm your request.');

  // Navigate directly so mobile browsers hand off to the WhatsApp app instead of blocking a popup
  window.location.href = waLink(msg);
});

/* ---------- PS5 Pro weekday / weekend pricing toggle ---------- */
const psButtons = document.querySelectorAll('[data-period]');
const psNote = document.getElementById('psNote');
const setPeriod = (period) => {
  psButtons.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.period === period)));
  document.querySelectorAll('#psGrid b').forEach((el) => { el.textContent = `₹${el.dataset[period]}`; });
  psNote.textContent = period === 'weekend'
    ? 'Showing weekend rates (Sat–Sun).'
    : 'Showing weekday rates (Mon–Fri).';
};
psButtons.forEach((b) => b.addEventListener('click', () => setPeriod(b.dataset.period)));
const day = new Date().getDay();
setPeriod(day === 0 || day === 6 ? 'weekend' : 'weekday');
