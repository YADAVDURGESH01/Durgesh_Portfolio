/* ============================================================
   PORTFOLIO ENGINE — renders content + NOC interactions
   ============================================================ */

/* ---------- Inline SVG icon set (no external deps) ---------- */
const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  cap: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/><path d="M22 10v6"/>',
  school: '<path d="M4 10v6"/><path d="M8 8v10"/><path d="M12 6v14"/><path d="M16 8v10"/><path d="M20 10v6"/><path d="M2 20h20"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  twitter: '<path d="M4 4l16 16M20 4L4 20"/>',
  whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 9.5c.5 3 2.5 5 5.5 5.5l1-1.5-2-1-1 .5c-.8-.4-1.6-1.2-2-2l.5-1-1-2z"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-2h14v2"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  bug: '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 2v4M6 13H2M22 13h-4M6 19l-3 3M18 19l3 3M6 8L3 6M18 8l3-2"/>',
  down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  win: '<rect x="2" y="3" width="9" height="9"/><rect x="13" y="3" width="9" height="9"/><rect x="2" y="14" width="9" height="9"/><rect x="13" y="14" width="9" height="9"/>',
  term: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2-1 2-1"/><path d="M2 21h20"/><path d="M12 4v3M12 1v1"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  medical: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  up: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'
};

function ico(name) {
  const path = ICONS[name] || ICONS.grid;
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
}

/** Fill all <svg class="i"> placeholders in static HTML with icon paths by context */
function paintStaticIcons() {
  const map = [
    ['.nav-link[href="#home"] .i', 'home'],
    ['.nav-link[href="#about"] .i', 'user'],
    ['.nav-link[href="#skills"] .i', 'cog'],
    ['.nav-link[href="#experience"] .i', 'briefcase'],
    ['.nav-link[href="#education"] .i', 'cap'],
    ['.nav-link[href="#resume"] .i', 'down'],
    ['.nav-link[href="#contact"] .i', 'mail'],
    ['.nav-admin .i', 'lock'],
    ['.hero-buttons .btn-primary .i', 'send'],
    ['.hero-buttons .btn-ghost .i', 'briefcase'],
    ['.hero-buttons .btn-outline .i', 'down'],
    ['.ftag:nth-child(1) .i', 'win'],
    ['.ftag:nth-child(2) .i', 'db'],
    ['.ftag:nth-child(3) .i', 'network'],
    ['.ftag:nth-child(4) .i', 'cloud'],
    ['#contactSocials ~ * .i', 'link'],
    ['.social-connect h4 .i', 'link'],
    ['label[for="name"] .i', 'user'],
    ['label[for="email"] .i', 'mail'],
    ['label[for="subject"] .i', 'send'],
    ['label[for="message"] .i', 'quote'],
    ['.contact-form button .i', 'send'],
    ['#scrollTop .i', 'up']
  ];
  map.forEach(([sel, name]) => {
    document.querySelectorAll(sel).forEach(el => {
      el.outerHTML = ico(name);
    });
  });
}

/* ---------- Toast ---------- */
function toast(message, type = 'info') {
  const host = document.getElementById('toastHost');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '›'}</span> ${escapeHtml(message)}`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3800);
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Photo helpers ---------- */
function photoSrc(path) {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('/')) return path;
  return path; // relative
}

function setPhoto(el, path, alt) {
  if (!el) return;
  const src = photoSrc(path);
  if (!src) { el.innerHTML = `<span class="avatar-initials${el.id === 'aboutPhoto' ? ' big' : ''}">DY</span>`; return; }
  const img = new Image();
  img.onload = () => { el.innerHTML = ''; el.appendChild(img); };
  img.onerror = () => { el.innerHTML = `<span class="avatar-initials${el.id === 'aboutPhoto' ? ' big' : ''}">DY</span>`; };
  img.src = src;
  img.alt = alt || 'Portrait';
}

/* ---------- Renderers ---------- */
let CONTENT = null;

function renderAll() {
  CONTENT = getContent();
  const p = CONTENT.profile;

  // Names
  document.title = `${p.name} — IT Infrastructure Specialist`;
  setText('navName', p.name);
  setText('heroName', p.name);
  setText('termName', p.name);
  setText('footerName', p.name);
  setText('heroDesc', p.heroDescription);
  setText('aboutLead', p.aboutLead);
  setText('aboutBody', p.aboutBody);
  setText('contactIntroTitle', CONTENT.contact.introTitle);
  setText('contactIntroText', CONTENT.contact.introText);
  setText('footerTagline', CONTENT.footer.tagline);
  setText('year', new Date().getFullYear());
  setText('tickerTrack', CONTENT.footer.ticker.repeat(4));

  // Photos
  setPhoto(document.getElementById('heroAvatar'), p.avatar, p.name);
  setPhoto(document.getElementById('aboutPhoto'), p.photo, p.name);

  renderStats(p.stats);
  renderInfoCards(p.infoCards);
  renderTraits(p.traits);
  renderHeroSocials();
  renderContactInfo();
  renderContactSocials(CONTACT_socials());
  renderSkills();
  renderExperience();
  renderEducation();
  renderResume();

  initCounters();
}

function CONTACT_socials() { return CONTENT.contact.socials || []; }

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function socialIcon(platform) {
  const map = { linkedin: 'linkedin', github: 'github', twitter: 'twitter', whatsapp: 'whatsapp', email: 'mail' };
  return ico(map[platform] || 'link');
}

function renderHeroSocials() {
  const host = document.getElementById('heroSocials');
  if (!host) return;
  const labels = { linkedin: 'LinkedIn', github: 'GitHub', twitter: 'X / Twitter', whatsapp: 'WhatsApp', email: 'Email' };
  host.innerHTML = (CONTENT.contact.socials || []).map(s => `
    <a href="${escapeHtml(s.url || '#')}" class="social-icon" target="_blank" rel="noopener">
      ${socialIcon(s.platform)}
      <span class="tip">${escapeHtml(labels[s.platform] || s.platform)}</span>
    </a>`).join('');
}

function renderContactSocials() {
  const host = document.getElementById('contactSocials');
  const host2 = document.getElementById('footerSocials');
  const html = (CONTENT.contact.socials || []).map(s => `
    <a href="${escapeHtml(s.url || '#')}" class="social-icon" target="_blank" rel="noopener" aria-label="${escapeHtml(s.platform)}">
      ${socialIcon(s.platform)}
    </a>`).join('');
  if (host) host.innerHTML = html;
  if (host2) host2.innerHTML = html;
}

function renderStats(stats) {
  const host = document.getElementById('statsGrid');
  if (!host) return;
  host.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon">${ico(s.icon)}</div>
      <div class="stat-num" data-target="${Number(s.value) || 0}">0</div>
      <div class="stat-label">${escapeHtml(s.label)}</div>
    </div>`).join('');
}

function renderInfoCards(cards) {
  const host = document.getElementById('infoGrid');
  if (!host) return;
  host.innerHTML = cards.map(c => `
    <div class="info-card">
      <div class="info-icon">${ico(c.icon)}</div>
      <div><h4>${escapeHtml(c.title)}</h4><p>${escapeHtml(c.value)}</p></div>
    </div>`).join('');
}

function renderTraits(traits) {
  const host = document.getElementById('traitRow');
  if (!host) return;
  host.innerHTML = traits.map(t => `<span class="trait">${ico(t.icon)} ${escapeHtml(t.label)}</span>`).join('');
}

function renderContactInfo() {
  const host = document.getElementById('contactMethods');
  if (!host) return;
  const c = CONTENT.contact;
  const methods = [
    { icon: 'mail',  title: 'Email',  value: c.email,  href: 'mailto:' + c.email },
    { icon: 'phone', title: 'Phone',  value: c.phone,  href: 'tel:' + String(c.phone).replace(/\s/g, '') },
    { icon: 'pin',   title: 'Location', value: c.location, href: null },
    { icon: 'linkedin', title: 'LinkedIn', value: c.linkedin, href: c.linkedin && !c.linkedin.startsWith('http') ? 'https://' + c.linkedin : c.linkedin }
  ];
  host.innerHTML = methods.map(m => `
    <div class="contact-method">
      <div class="method-icon">${ico(m.icon)}</div>
      <div class="method-details">
        <h4>${m.title}</h4>
        ${m.href ? `<a href="${escapeHtml(m.href)}" ${m.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeHtml(m.value)}</a>` : `<p>${escapeHtml(m.value)}</p>`}
      </div>
    </div>`).join('');
}

/* ----- Skills (rack tabs + meters + cards) ----- */
function renderSkills() {
  const tabsHost = document.getElementById('skillTabs');
  const metersHost = document.getElementById('skillMeters');
  const cardsHost = document.getElementById('skillsGrid');
  const cats = CONTENT.skills.categories;

  tabsHost.innerHTML = cats.map((c, i) => `
    <button class="rack-tab ${i === 0 ? 'active' : ''}" data-tab="${escapeHtml(c.id)}">
      ${ico(c.icon)} ${escapeHtml(c.label)}
    </button>`).join('');

  metersHost.innerHTML = cats.map((c, i) => `
    <div class="meters-body ${i === 0 ? 'active' : ''}" data-panel="${escapeHtml(c.id)}" style="display:${i === 0 ? 'block' : 'none'}">
      ${c.items.map(it => `
        <div class="meter">
          <div class="meter-head">
            <span class="meter-name">${ico(it.icon || 'cog')} ${escapeHtml(it.name)}</span>
            <span class="meter-pct">${Number(it.percent) || 0}%</span>
          </div>
          <div class="meter-track"><div class="meter-fill" data-progress="${Number(it.percent) || 0}"></div></div>
        </div>`).join('')}
    </div>`).join('');
  metersHost.classList.add('active');

  cardsHost.innerHTML = (CONTENT.skills.cards || []).map(card => `
    <div class="skill-card">
      <div class="card-icon">${ico(card.icon)}</div>
      <h3>${escapeHtml(card.title)}</h3>
      <div class="skill-tags">
        ${String(card.tags || '').split(',').map(t => t.trim()).filter(Boolean)
          .map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>`).join('');

  // tab clicks
  tabsHost.querySelectorAll('.rack-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsHost.querySelectorAll('.rack-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.tab;
      metersHost.querySelectorAll('.meters-body').forEach(panel => {
        const on = panel.dataset.panel === id;
        panel.style.display = on ? 'block' : 'none';
        if (on) animateMeters(panel);
      });
    });
  });

  // first panel animation when in view
  observeOnce(document.getElementById('skills'), () => {
    const first = metersHost.querySelector('.meters-body');
    if (first) animateMeters(first);
  });
}

function animateMeters(scope) {
  scope.querySelectorAll('.meter-fill').forEach((bar, i) => {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = (Number(bar.dataset.progress) || 0) + '%'; }, 80 + i * 120);
  });
}

/* ----- Experience ----- */
function renderExperience() {
  const host = document.getElementById('timeline');
  if (!host) return;
  host.innerHTML = CONTENT.experience.map(x => `
    <div class="timeline-item ${x.current ? 'is-current' : ''} reveal">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <span class="tl-badge ${x.current ? '' : 'past'}">${x.current ? '● Current' : 'Past'}</span><br>
        <span class="tl-date">${ico('clock')} ${escapeHtml(x.date)}</span>
        <div class="company-header">
          <div class="company-icon">${ico(x.icon || 'building')}</div>
          <div>
            <h3>${escapeHtml(x.role)}</h3>
            <h4>${escapeHtml(x.company)}</h4>
            <p class="location">${ico('pin')} ${escapeHtml(x.location)}</p>
          </div>
        </div>
        <ul class="responsibilities">
          ${(x.responsibilities || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
        <div class="tech-stack">
          ${String(x.tech || '').split(',').map(t => t.trim()).filter(Boolean)
            .map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
  observeReveals(host.querySelectorAll('.reveal'));
}

/* ----- Education ----- */
function renderEducation() {
  const host = document.getElementById('eduGrid');
  if (!host) return;
  host.innerHTML = CONTENT.education.map(e => `
    <div class="edu-card is-${escapeHtml(e.kind || 'degree')} reveal">
      <div class="edu-head">
        <div class="edu-icon">${ico(e.icon || 'cap')}</div>
        <span class="edu-ribbon">${escapeHtml(e.ribbon || '')}</span>
      </div>
      <div class="edu-body">
        <h3>${escapeHtml(e.title)}</h3>
        <p class="edu-sub">${escapeHtml(e.subtitle || '')}</p>
        ${e.badge ? `<span class="edu-badge">${ico('award')} ${escapeHtml(e.badge)}</span>` : ''}
        ${e.footer ? `<div class="edu-footer">${ico('cap')} ${escapeHtml(e.footer)}</div>` : ''}
      </div>
    </div>`).join('');
  observeReveals(host.querySelectorAll('.reveal'));
}

/* ---------- Resume ---------- */
function renderResume() {
  const r = CONTENT.resume || {};
  const titleEl = document.getElementById('resumeTitle');
  const metaEl = document.getElementById('resumeMeta');
  const tagsEl = document.getElementById('resumeTags');
  const lsEl = document.getElementById('resumeLs');
  if (!titleEl) return;

  titleEl.textContent = r.fileName || (CONTENT.profile.name + ' — Resume');
  const has = !!r.file;

  if (has) {
    const b64 = r.file.startsWith('data:') ? (r.file.split(',')[1] || '') : '';
    const size = b64 ? fmtBytes(Math.round(b64.length * 0.75)) : null;
    metaEl.textContent = [
      (r.fileName && /\.(doc|docx)$/i.test(r.fileName)) ? 'DOC' : 'PDF',
      r.updated ? 'updated ' + r.updated : 'ready',
      size ? '· ' + size : null
    ].filter(Boolean).join(' ');
    metaEl.className = 'mono resume-meta c-green';
    if (tagsEl) tagsEl.innerHTML =
      '<span class="tag">up-to-date</span><span class="tag">download ready</span>';
    if (lsEl) lsEl.textContent = `-rw-r--r--  1 ${slugName(CONTENT.profile.name)}  staff  ${size || 'path'}  ${(r.fileName || 'resume.pdf')}`;
  } else {
    metaEl.textContent = 'No file uploaded yet — available on request';
    metaEl.className = 'mono resume-meta dim';
    if (tagsEl) tagsEl.innerHTML = '<span class="tag">available on request</span>';
    if (lsEl) lsEl.textContent = 'resume/ is empty — upload via owner';
  }

  const btn = document.getElementById('resumeDownload');
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = '1';
    btn.addEventListener('click', downloadResume);
  }
}

function slugName(n) {
  return String(n || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function fmtBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  if (filename) a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadResume() {
  const r = (CONTENT && CONTENT.resume) || {};
  if (!r.file) {
    toast('Resume not available yet — please request it via the contact form.', 'error');
    return;
  }
  const name = r.fileName || 'resume.pdf';

  if (r.file.startsWith('data:')) {
    triggerDownload(r.file, name);
    toast('Resume download started.', 'success');
    return;
  }

  // path-based file: verify it exists before downloading
  try {
    const resp = await fetch(r.file, { method: 'HEAD' });
    if (!resp.ok) throw new Error('missing');
    triggerDownload(r.file, name);
    toast('Resume download started.', 'success');
  } catch (e) {
    toast('Resume file not found on the server yet.', 'error');
  }
}

/* ---------- Counters ---------- */
function hasIO() { return typeof IntersectionObserver !== 'undefined'; }

function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const run = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = Number(el.dataset.target) || 0;
    const dur = 1400; const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(step);
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(step);
    else el.textContent = target;
  };
  if (!hasIO()) { nums.forEach(run); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}

/* ---------- Reveal on scroll ---------- */
function observeReveals(nodeList) {
  if (!hasIO()) { nodeList.forEach(n => n.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = Number(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), d);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  nodeList.forEach(n => io.observe(n));
}

function observeOnce(el, cb) {
  if (!el) return;
  if (!hasIO()) { cb(); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { cb(); io.disconnect(); } });
  }, { threshold: 0.25 });
  io.observe(el);
}

/* ---------- Navigation ---------- */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else { spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; }); }
  });

  links.forEach(l => l.addEventListener('click', () => navMenu.classList.remove('active')));

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // active section
    let current = 'home';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 180) current = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    // scroll top
    const st = document.getElementById('scrollTop');
    if (st) st.classList.toggle('active', window.scrollY > 400);
  }, { passive: true });

  const st = document.getElementById('scrollTop');
  if (st) st.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Statusbar: clock, uptime, ping ---------- */
function initStatusbar() {
  const start = Date.now();
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => {
    const now = new Date();
    const clock = document.getElementById('clock');
    const up = document.getElementById('uptime');
    if (clock) clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    if (up) {
      const s = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      up.textContent = `${pad(h)}:${pad(m)}:${pad(sec)}`;
    }
  }, 1000);
  // fake ping jitter
  setInterval(() => {
    const el = document.getElementById('ping');
    if (el) el.textContent = (8 + Math.floor(Math.random() * 25)) + 'ms';
  }, 2600);
}

/* ---------- Typing effect (role) ---------- */
function initTyping() {
  const roles = (CONTENT && CONTENT.profile.roles) || ['IT Professional'];
  const termRole = document.getElementById('termRole');
  const chip = document.querySelector('.role-chip');
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const role = roles[ri % roles.length];
    if (!deleting) {
      ci++;
      if (ci > role.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      ci--;
      if (ci < 0) { deleting = false; ri++; ci = 0; setTimeout(tick, 350); return; }
    }
    const part = role.slice(0, Math.max(0, ci));
    if (termRole) termRole.textContent = part;
    if (chip) chip.textContent = part;
    setTimeout(tick, deleting ? 40 : 85);
  }
  tick();
}

/* ---------- Network topology canvas ---------- */
function initNetCanvas() {
  const canvas = document.getElementById('netCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return; // canvas unsupported → skip background animation
  let w, h, nodes = [], raf;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width * devicePixelRatio;
    h = canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const count = Math.min(70, Math.floor((rect.width * rect.height) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      r: (Math.random() * 1.6 + 1.2) * devicePixelRatio
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const maxD = 140 * devicePixelRatio;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      // link
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.14 * (1 - d / maxD)})`;
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      // mouse link
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < maxD * 1.4) {
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.25 * (1 - md / (maxD * 1.4))})`;
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * devicePixelRatio;
    mouse.y = (e.clientY - rect.top) * devicePixelRatio;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
}

/* ---------- Contact form → messages store ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '› transmitting...';
    btn.disabled = true;

    setTimeout(() => {
      addMessage({
        name: String(data.name || ''),
        email: String(data.email || ''),
        subject: String(data.subject || ''),
        message: String(data.message || '')
      });
      form.reset();
      btn.innerHTML = original;
      btn.disabled = false;
      toast('Message transmitted — saved to Admin inbox.', 'success');
    }, 900);
  });
}

/* ---------- CV download: real resume if available, else generated text CV ---------- */
async function downloadCV() {
  const c = getContent();
  if (c.resume && c.resume.file) {
    CONTENT = c;
    await downloadResume();
    return;
  }
  const lines = [
    c.profile.name,
    c.profile.roles.join(' | '),
    '='.repeat(50),
    'CONTACT',
    'Email:  ' + c.contact.email,
    'Phone:  ' + c.contact.phone,
    'Location: ' + c.contact.location,
    'LinkedIn: ' + c.contact.linkedin,
    '',
    'ABOUT',
    c.profile.aboutLead,
    c.profile.aboutBody,
    '',
    'SKILLS'
  ];
  c.skills.categories.forEach(cat => {
    lines.push('[' + cat.label + ']');
    cat.items.forEach(i => lines.push('  - ' + i.name + ' (' + i.percent + '%)'));
  });
  lines.push('', 'EXPERIENCE');
  c.experience.forEach(x => {
    lines.push(x.role + ' @ ' + x.company + ' — ' + x.date + ' (' + x.location + ')');
    x.responsibilities.forEach(r => lines.push('  • ' + r));
    lines.push('');
  });
  lines.push('EDUCATION');
  c.education.forEach(e => lines.push('  • ' + e.title + ' — ' + e.subtitle));

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = c.profile.name.replace(/\s+/g, '_') + '_CV.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('CV downloaded.', 'success');
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  paintStaticIcons();
  renderAll();
  initNavigation();
  initStatusbar();
  initTyping();
  initNetCanvas();
  initContactForm();
  observeReveals(document.querySelectorAll('.reveal'));
  window.downloadCV = downloadCV;
  window.downloadResume = downloadResume;
});

window.showNotification = toast;
