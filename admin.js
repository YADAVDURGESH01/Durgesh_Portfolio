/* ============================================================
   SUPER ADMIN — auth + editors + publish/export
   ============================================================ */

const AUTH_KEY = 'noc_admin_auth_v1';
const SESSION_KEY = 'noc_admin_session_v1';
const LOCK_KEY = 'noc_admin_lock_v1';
const SESSION_TTL = 2 * 60 * 60 * 1000; // 2h

let draft = null;      // working copy of content being edited
let dirty = false;

/* ---------- utils ---------- */
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(message, type = 'info') {
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '›'}</span> ${escapeHtml(message)}`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3600);
}

function markDirty() {
  dirty = true;
  const s = $('#saveState');
  if (s) { s.textContent = '● unsaved changes'; s.classList.add('dirty'); }
}
function markClean() {
  dirty = false;
  const s = $('#saveState');
  if (s) { s.textContent = 'all changes published'; s.classList.remove('dirty'); }
}

/* ---------- hashing (SHA-256 when available, fallback otherwise) ---------- */
async function hashPassword(pw) {
  const salt = 'noc-portfolio::';
  const data = salt + pw;
  if (window.crypto && crypto.subtle && crypto.subtle.digest) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
      return 'sha256:' + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { /* insecure context → fall through */ }
  }
  // FNV-1a fallback (demo-grade, still not plaintext)
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return 'fnv:' + h.toString(16) + ':' + data.length;
}

/* ---------- auth ---------- */
async function ensureAuthStore() {
  let store;
  try { store = JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { store = null; }
  if (!store || !store.user) {
    store = {
      user: 'admin',
      passHash: await hashPassword('Admin@123'),
      updated: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(store));
  }
  return store;
}

function getSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (s && s.expires > Date.now()) return s;
  } catch (e) { /* ignore */ }
  return null;
}

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, expires: Date.now() + SESSION_TTL, token: Math.random().toString(36).slice(2) }));
}
function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

function getLock() {
  try { return JSON.parse(localStorage.getItem(LOCK_KEY)) || { fails: 0, until: 0 }; }
  catch (e) { return { fails: 0, until: 0 }; }
}

async function initAuth() {
  await ensureAuthStore();
  const session = getSession();

  if (session) {
    showApp();
  } else {
    showLogin();
  }

  // login submit
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lock = getLock();
    const err = $('#loginError');
    if (lock.until > Date.now()) {
      const sec = Math.ceil((lock.until - Date.now()) / 1000);
      err.hidden = false;
      err.textContent = `Locked out — too many attempts. Try again in ${sec}s.`;
      return;
    }

    const user = $('#loginUser').value.trim();
    const pass = $('#loginPass').value;
    const store = await ensureAuthStore();
    const passHash = await hashPassword(pass);

    if (user === store.user && passHash === store.passHash) {
      localStorage.removeItem(LOCK_KEY);
      setSession(user);
      err.hidden = true;
      $('#loginPass').value = '';
      showApp();
      toast('Access granted. Welcome back.', 'success');
    } else {
      const fails = (lock.fails || 0) + 1;
      const newLock = { fails, until: fails >= 5 ? Date.now() + 60000 : 0 };
      if (newLock.until) newLock.fails = 0;
      localStorage.setItem(LOCK_KEY, JSON.stringify(newLock));
      err.hidden = false;
      err.textContent = newLock.until
        ? 'Too many failed attempts — locked for 60 seconds.'
        : `Invalid credentials. ${5 - fails} attempt(s) before lockout.`;
      $('#loginPass').value = '';
    }
  });

  $('#logoutBtn').addEventListener('click', () => {
    clearSession();
    showLogin();
    toast('Logged out.', 'success');
  });
}

function showLogin() {
  $('#loginView').hidden = false;
  $('#appView').hidden = true;
  document.body.classList.add('on-login');
}

function showApp() {
  $('#loginView').hidden = true;
  $('#appView').hidden = false;
  document.body.classList.remove('on-login');
  bootEditors();
}

/* ---------- navigation ---------- */
function initNav() {
  $$('.side-link').forEach(btn => {
    btn.addEventListener('click', () => openPanel(btn.dataset.panel));
  });
  $$('.qa-btn').forEach(btn => {
    btn.addEventListener('click', () => openPanel(btn.dataset.goto));
  });

  $('#sideToggle').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
  });

  $('#previewBtn').addEventListener('click', () => {
    if (dirty) publish(true); // silent so preview shows latest
    window.open('../index.html', '_blank');
  });

  $('#publishBtn').addEventListener('click', () => publish(false));
}

function openPanel(id) {
  $$('.side-link').forEach(b => b.classList.toggle('active', b.dataset.panel === id));
  $$('.apanel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));
  const titles = {
    overview: 'Overview', hero: 'Hero & Stats', about: 'About', skills: 'Skills',
    experience: 'Experience', education: 'Education', contact: 'Contact',
    photos: 'Photos', resume: 'Resume', messages: 'Messages', settings: 'Settings'
  };
  $('#panelTitle').textContent = titles[id] || id;
  $('#panelCrumb').textContent = '// control / ' + id;
  $('#sidebar').classList.remove('open');
  if (id === 'messages') renderMessages();
  if (id === 'photos') renderPhotoPreviews();
  if (id === 'resume') renderResumeAdmin();
  window.scrollTo({ top: 0 });
}

/* ---------- boot editors ---------- */
function bootEditors() {
  draft = getContent(); // defaults + published overrides
  buildHeroForm();
  buildAboutForm();
  buildSkillsEditor();
  buildExpEditor();
  buildEduEditor();
  buildContactForm();
  buildPhotos();
  buildResumeAdmin();
  bindSettings();
  renderMessages();
  updateOverview();
  markClean();
  initNavOnce();
}

let navBound = false;
function initNavOnce() {
  if (navBound) return;
  navBound = true;
  initNav();
}

/* ---------- generic list editor ---------- */
function listEditor(hostId, items, fields, opts = {}) {
  const host = document.getElementById(hostId);
  if (!host) return;
  host.innerHTML = '';

  items.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'edit-item';

    let fieldsHtml = '';
    fields.forEach(f => {
      const val = item[f.key] ?? '';
      if (f.type === 'textarea') {
        fieldsHtml += `<div class="af-group"><label>${f.label}</label><textarea data-idx="${idx}" data-field="${f.key}" rows="${f.rows || 3}">${escapeHtml(val)}</textarea></div>`;
      } else if (f.type === 'select') {
        fieldsHtml += `<div class="af-group"><label>${f.label}</label><select data-idx="${idx}" data-field="${f.key}">${
          f.options.map(o => `<option value="${escapeHtml(o)}" ${o === val ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')
        }</select></div>`;
      } else if (f.type === 'checkbox') {
        fieldsHtml += `<div class="af-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" data-idx="${idx}" data-field="${f.key}" ${val ? 'checked' : ''} style="width:auto"> ${f.label}</label></div>`;
      } else {
        fieldsHtml += `<div class="af-group"><label>${f.label}</label><input type="${f.type || 'text'}" data-idx="${idx}" data-field="${f.key}" value="${escapeHtml(val)}"></div>`;
      }
    });

    wrap.innerHTML = `
      <div class="item-head">
        <span class="item-title">${escapeHtml(opts.title || 'ITEM')} ${idx + 1}</span>
        <div class="item-tools">
          <button class="tool-btn" data-act="up" data-idx="${idx}" title="Move up">↑</button>
          <button class="tool-btn" data-act="down" data-idx="${idx}" title="Move down">↓</button>
          <button class="tool-btn danger" data-act="del" data-idx="${idx}" title="Delete">✕</button>
        </div>
      </div>
      ${fieldsHtml}`;

    host.appendChild(wrap);
  });

  // bindings
  host.oninput = (e) => {
    const t = e.target;
    if (!t.dataset.field) return;
    const i = Number(t.dataset.idx);
    let v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.type === 'number' || t.dataset.field === 'percent' || t.dataset.field === 'value') v = Number(v) || 0;
    items[i][t.dataset.field] = v;
    markDirty();
  };
  host.onchange = (e) => {
    if (e.target.type === 'checkbox') {
      const t = e.target;
      items[Number(t.dataset.idx)][t.dataset.field] = t.checked;
      markDirty();
    }
  };
  host.onclick = (e) => {
    const btn = e.target.closest('.tool-btn');
    if (!btn) return;
    const i = Number(btn.dataset.idx);
    if (btn.dataset.act === 'del') {
      if (!confirm('Delete this item?')) return;
      items.splice(i, 1);
    } else if (btn.dataset.act === 'up' && i > 0) {
      [items[i - 1], items[i]] = [items[i], items[i - 1]];
    } else if (btn.dataset.act === 'down' && i < items.length - 1) {
      [items[i + 1], items[i]] = [items[i], items[i + 1]];
    }
    markDirty();
    // re-render via callback
    opts.onChange ? opts.onChange() : listEditor(hostId, items, fields, opts);
  };
}

/* ---------- HERO panel ---------- */
function buildHeroForm() {
  const p = draft.profile;
  $('#f_name').value = p.name;
  $('#f_roles').value = (p.roles || []).join('\n');
  $('#f_heroDesc').value = p.heroDescription;
  $('#f_ticker').value = draft.footer.ticker;

  $('#f_name').oninput = e => { p.name = e.target.value; markDirty(); };
  $('#f_roles').oninput = e => { p.roles = e.target.value.split('\n').map(s => s.trim()).filter(Boolean); markDirty(); };
  $('#f_heroDesc').oninput = e => { p.heroDescription = e.target.value; markDirty(); };
  $('#f_ticker').oninput = e => { draft.footer.ticker = e.target.value; markDirty(); };

  const renderStats = () => listEditor('statsEditor', p.stats,
    [
      { key: 'icon', label: 'ICON (grid|server|award|clock|…)' },
      { key: 'value', label: 'NUMBER', type: 'number' },
      { key: 'label', label: 'LABEL' }
    ],
    { title: 'STAT', onChange: renderStats });

  renderStats();
  $('#addStat').onclick = () => { p.stats.push({ icon: 'grid', value: 1, label: 'New stat' }); markDirty(); renderStats(); };
}

/* ---------- ABOUT panel ---------- */
function buildAboutForm() {
  const p = draft.profile;
  $('#f_aboutLead').value = p.aboutLead;
  $('#f_aboutBody').value = p.aboutBody;
  $('#f_aboutLead').oninput = e => { p.aboutLead = e.target.value; markDirty(); };
  $('#f_aboutBody').oninput = e => { p.aboutBody = e.target.value; markDirty(); };

  const renderInfo = () => listEditor('infoEditor', p.infoCards,
    [
      { key: 'icon', label: 'ICON (cake|flag|globe|pin|…)' },
      { key: 'title', label: 'TITLE' },
      { key: 'value', label: 'VALUE' }
    ],
    { title: 'INFO', onChange: renderInfo });
  renderInfo();
  $('#addInfo').onclick = () => { p.infoCards.push({ icon: 'flag', title: 'New info', value: '—' }); markDirty(); renderInfo(); };

  const renderTraits = () => listEditor('traitEditor', p.traits,
    [
      { key: 'icon', label: 'ICON (bulb|users|rocket|trend|…)' },
      { key: 'label', label: 'LABEL' }
    ],
    { title: 'TRAIT', onChange: renderTraits });
  renderTraits();
  $('#addTrait').onclick = () => { p.traits.push({ icon: 'bulb', label: 'New trait' }); markDirty(); renderTraits(); };
}

/* ---------- SKILLS panel ---------- */
function buildSkillsEditor() {
  renderSkillCats();
  renderSkillCards();

  $('#addSkillCat').onclick = () => {
    draft.skills.categories.push({
      id: 'cat' + Date.now(),
      icon: 'cog',
      label: 'New Category',
      items: [{ name: 'New skill', icon: 'cog', percent: 80 }]
    });
    markDirty(); renderSkillCats();
  };

  $('#addSkillCard').onclick = () => {
    draft.skills.cards.push({ icon: 'server', title: 'New skill card', tags: 'Tag one, Tag two' });
    markDirty(); renderSkillCards();
  };
}

function renderSkillCats() {
  const host = $('#skillCatEditor');
  const cats = draft.skills.categories;
  host.innerHTML = '';

  cats.forEach((cat, ci) => {
    const box = document.createElement('div');
    box.className = 'skill-cat';
    box.innerHTML = `
      <div class="cat-head">
        <span class="item-title">CATEGORY ${ci + 1}</span>
        <div class="item-tools">
          <button class="tool-btn" data-act="up">↑</button>
          <button class="tool-btn" data-act="down">↓</button>
          <button class="tool-btn danger" data-act="del">✕</button>
        </div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>LABEL</label><input data-cat="${ci}" data-f="label" value="${escapeHtml(cat.label)}"></div>
        <div class="af-group"><label>ICON</label><input data-cat="${ci}" data-f="icon" value="${escapeHtml(cat.icon || '')}"></div>
      </div>
      <div class="skill-items">
        ${cat.items.map((it, ii) => `
          <div class="skill-item-row">
            <input data-cat="${ci}" data-item="${ii}" data-f="name" value="${escapeHtml(it.name)}" placeholder="Skill name">
            <input data-cat="${ci}" data-item="${ii}" data-f="icon" value="${escapeHtml(it.icon || '')}" placeholder="icon">
            <input type="number" min="0" max="100" data-cat="${ci}" data-item="${ii}" data-f="percent" value="${Number(it.percent) || 0}" title="percent">
            <button class="tool-btn danger" data-act="delItem" data-cat="${ci}" data-item="${ii}">✕</button>
          </div>`).join('')}
      </div>
      <button class="mini-add" data-act="addItem" data-cat="${ci}">+ skill</button>`;

    box.onclick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const ci2 = Number(btn.dataset.cat);
      const act = btn.dataset.act;
      if (act === 'del') {
        if (!confirm('Delete this category?')) return;
        cats.splice(ci2, 1);
      } else if (act === 'up' && ci2 > 0) {
        [cats[ci2 - 1], cats[ci2]] = [cats[ci2], cats[ci2 - 1]];
      } else if (act === 'down' && ci2 < cats.length - 1) {
        [cats[ci2 + 1], cats[ci2]] = [cats[ci2], cats[ci2 + 1]];
      } else if (act === 'delItem') {
        cats[ci2].items.splice(Number(btn.dataset.item), 1);
      } else if (act === 'addItem') {
        cats[ci2].items.push({ name: 'New skill', icon: 'cog', percent: 80 });
      } else return;
      markDirty(); renderSkillCats();
    };

    box.oninput = (e) => {
      const t = e.target;
      const ci2 = Number(t.dataset.cat);
      if (isNaN(ci2) || !t.dataset.f) return;
      if (t.dataset.item !== undefined && t.dataset.item !== '') {
        const ii = Number(t.dataset.item);
        cats[ci2].items[ii][t.dataset.f] = t.dataset.f === 'percent' ? Number(t.value) || 0 : t.value;
      } else {
        cats[ci2][t.dataset.f] = t.value;
      }
      markDirty();
    };

    host.appendChild(box);
  });
}

function renderSkillCards() {
  listEditor('skillCardEditor', draft.skills.cards,
    [
      { key: 'icon', label: 'ICON (server|network|cloud|shield|video|headphones|…)' },
      { key: 'title', label: 'TITLE' },
      { key: 'tags', label: 'TAGS (comma separated)', type: 'textarea', rows: 2 }
    ],
    { title: 'CARD', onChange: renderSkillCards });
}

/* ---------- EXPERIENCE panel ---------- */
function buildExpEditor() { renderExp(); $('#addExp').onclick = () => {
  draft.experience.push({
    current: false, date: '2026 – Present', icon: 'building',
    role: 'New Role', company: 'Company', location: 'City, Country',
    responsibilities: ['Responsibility one', 'Responsibility two'],
    tech: 'Windows, Linux'
  });
  markDirty(); renderExp();
}; }

function renderExp() {
  const host = $('#expEditor');
  const list = draft.experience;
  host.innerHTML = '';

  list.forEach((x, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'edit-item';
    wrap.style.marginBottom = '14px';
    wrap.innerHTML = `
      <div class="item-head">
        <span class="item-title">ROLE ${idx + 1} ${x.current ? '· CURRENT' : ''}</span>
        <div class="item-tools">
          <button class="tool-btn" data-act="up">↑</button>
          <button class="tool-btn" data-act="down">↓</button>
          <button class="tool-btn danger" data-act="del">✕</button>
        </div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>JOB TITLE</label><input data-i="${idx}" data-f="role" value="${escapeHtml(x.role)}"></div>
        <div class="af-group"><label>COMPANY</label><input data-i="${idx}" data-f="company" value="${escapeHtml(x.company)}"></div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>DATE RANGE</label><input data-i="${idx}" data-f="date" value="${escapeHtml(x.date)}"></div>
        <div class="af-group"><label>LOCATION</label><input data-i="${idx}" data-f="location" value="${escapeHtml(x.location)}"></div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>ICON (building|truck|medical|server|…)</label><input data-i="${idx}" data-f="icon" value="${escapeHtml(x.icon || '')}"></div>
        <div class="af-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:26px">
          <input type="checkbox" data-i="${idx}" data-f="current" ${x.current ? 'checked' : ''} style="width:auto"> Show "CURRENT" badge</label></div>
      </div>
      <div class="af-group">
        <label>RESPONSIBILITIES (one per line)</label>
        <textarea data-i="${idx}" data-f="responsibilities" rows="5">${escapeHtml((x.responsibilities || []).join('\n'))}</textarea>
      </div>
      <div class="af-group"><label>TECH BADGES (comma separated)</label><input data-i="${idx}" data-f="tech" value="${escapeHtml(x.tech || '')}"></div>`;

    wrap.onclick = (e) => {
      const btn = e.target.closest('.tool-btn');
      if (!btn) return;
      const i = Number(idx);
      if (btn.dataset.act === 'del') {
        if (!confirm('Delete this role?')) return;
        list.splice(i, 1);
      } else if (btn.dataset.act === 'up' && i > 0) {
        [list[i - 1], list[i]] = [list[i], list[i - 1]];
      } else if (btn.dataset.act === 'down' && i < list.length - 1) {
        [list[i + 1], list[i]] = [list[i], list[i + 1]];
      } else return;
      markDirty(); renderExp();
    };

    wrap.oninput = (e) => {
      const t = e.target;
      if (t.dataset.f === undefined || t.dataset.i === undefined) return;
      const i = Number(t.dataset.i);
      if (t.dataset.f === 'responsibilities') {
        list[i].responsibilities = t.value.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (t.type === 'checkbox') {
        list[i].current = t.checked;
      } else {
        list[i][t.dataset.f] = t.value;
      }
      markDirty();
    };
    wrap.onchange = (e) => {
      if (e.target.type === 'checkbox') {
        const i = Number(e.target.dataset.i);
        list[i].current = e.target.checked;
        markDirty();
      }
    };

    host.appendChild(wrap);
  });
}

/* ---------- EDUCATION panel ---------- */
function buildEduEditor() { renderEdu(); $('#addEdu').onclick = () => {
  draft.education.push({
    kind: 'degree', icon: 'cap', ribbon: 'Degree',
    title: 'New qualification', subtitle: 'Details', footer: 'Institution', badge: ''
  });
  markDirty(); renderEdu();
}; }

function renderEdu() {
  const host = $('#eduEditor');
  const list = draft.education;
  host.innerHTML = '';

  list.forEach((ed, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'edit-item';
    wrap.style.marginBottom = '12px';
    wrap.innerHTML = `
      <div class="item-head">
        <span class="item-title">ENTRY ${idx + 1}</span>
        <div class="item-tools">
          <button class="tool-btn" data-act="up">↑</button>
          <button class="tool-btn" data-act="down">↓</button>
          <button class="tool-btn danger" data-act="del">✕</button>
        </div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>TYPE</label>
          <select data-i="${idx}" data-f="kind">
            ${['degree', 'cert', 'school'].map(k => `<option ${k === ed.kind ? 'selected' : ''}>${k}</option>`).join('')}
          </select></div>
        <div class="af-group"><label>RIBBON TEXT</label><input data-i="${idx}" data-f="ribbon" value="${escapeHtml(ed.ribbon || '')}"></div>
      </div>
      <div class="af-group"><label>TITLE</label><input data-i="${idx}" data-f="title" value="${escapeHtml(ed.title)}"></div>
      <div class="af-row">
        <div class="af-group"><label>SUBTITLE</label><input data-i="${idx}" data-f="subtitle" value="${escapeHtml(ed.subtitle || '')}"></div>
        <div class="af-group"><label>ICON</label><input data-i="${idx}" data-f="icon" value="${escapeHtml(ed.icon || '')}"></div>
      </div>
      <div class="af-row">
        <div class="af-group"><label>FOOTER (optional)</label><input data-i="${idx}" data-f="footer" value="${escapeHtml(ed.footer || '')}"></div>
        <div class="af-group"><label>BADGE (optional, e.g. Professional)</label><input data-i="${idx}" data-f="badge" value="${escapeHtml(ed.badge || '')}"></div>
      </div>`;

    wrap.onclick = (e) => {
      const btn = e.target.closest('.tool-btn');
      if (!btn) return;
      const i = idx;
      if (btn.dataset.act === 'del') {
        if (!confirm('Delete this entry?')) return;
        list.splice(i, 1);
      } else if (btn.dataset.act === 'up' && i > 0) {
        [list[i - 1], list[i]] = [list[i], list[i - 1]];
      } else if (btn.dataset.act === 'down' && i < list.length - 1) {
        [list[i + 1], list[i]] = [list[i], list[i + 1]];
      } else return;
      markDirty(); renderEdu();
    };
    wrap.oninput = (e) => {
      const t = e.target;
      if (t.dataset.f === undefined) return;
      list[Number(t.dataset.i)][t.dataset.f] = t.value;
      markDirty();
    };
    wrap.onchange = (e) => {
      if (e.target.dataset.f === 'kind') {
        list[Number(e.target.dataset.i)].kind = e.target.value;
        markDirty();
      }
    };
    host.appendChild(wrap);
  });
}

/* ---------- CONTACT panel ---------- */
function buildContactForm() {
  const c = draft.contact;
  $('#f_cTitle').value = c.introTitle;
  $('#f_cText').value = c.introText;
  $('#f_cEmail').value = c.email;
  $('#f_cPhone').value = c.phone;
  $('#f_cLocation').value = c.location;
  $('#f_cLinkedin').value = c.linkedin;
  $('#f_tagline').value = draft.footer.tagline;

  $('#f_cTitle').oninput = e => { c.introTitle = e.target.value; markDirty(); };
  $('#f_cText').oninput = e => { c.introText = e.target.value; markDirty(); };
  $('#f_cEmail').oninput = e => { c.email = e.target.value; markDirty(); };
  $('#f_cPhone').oninput = e => { c.phone = e.target.value; markDirty(); };
  $('#f_cLocation').oninput = e => { c.location = e.target.value; markDirty(); };
  $('#f_cLinkedin').oninput = e => { c.linkedin = e.target.value; markDirty(); };
  $('#f_tagline').oninput = e => { draft.footer.tagline = e.target.value; markDirty(); };

  const renderSocials = () => listEditor('socialEditor', c.socials,
    [
      { key: 'platform', label: 'PLATFORM (linkedin|github|twitter|whatsapp|email)' },
      { key: 'url', label: 'URL' }
    ],
    { title: 'LINK', onChange: renderSocials });
  renderSocials();
  $('#addSocial').onclick = () => { c.socials.push({ platform: 'linkedin', url: '#' }); markDirty(); renderSocials(); };
}

/* ---------- PHOTOS ---------- */
function buildPhotos() {
  $('#avatarPick').onclick = () => $('#avatarFile').click();
  $('#photoPick').onclick = () => $('#photoFile').click();

  $('#avatarFile').onchange = e => loadPhotoFile(e, 'avatar', 400);
  $('#photoFile').onchange = e => loadPhotoFile(e, 'photo', 800);

  $('#avatarReset').onclick = () => { draft.profile.avatar = 'assets/avatar.jpg'; markDirty(); renderPhotoPreviews(); };
  $('#photoReset').onclick = () => { draft.profile.photo = 'assets/profile.jpg'; markDirty(); renderPhotoPreviews(); };

  renderPhotoPreviews();
}

function loadPhotoFile(e, field, maxSize) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('Please choose an image file.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      // square center crop (face-biased: top 15%)
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = Math.max(0, (img.height - side) * 0.15);
      const canvas = document.createElement('canvas');
      canvas.width = maxSize; canvas.height = maxSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      draft.profile[field] = dataUrl;
      markDirty();
      renderPhotoPreviews();
      toast('Photo loaded — press Publish Changes to save.', 'success');
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function renderPhotoPreviews() {
  const paint = (el, src) => {
    if (!el) return;
    if (src) {
      el.innerHTML = `<img src="${src}" alt="preview">`;
    } else {
      el.innerHTML = `<span class="avatar-initials${el.id === 'prevPhoto' ? ' big' : ''}">AK</span>`;
    }
  };
  paint($('#prevAvatar'), draft.profile.avatar);
  paint($('#prevPhoto'), draft.profile.photo);
}

/* ---------- RESUME ---------- */
function ensureResume() {
  if (!draft.resume) draft.resume = { file: null, fileName: '', updated: '' };
  return draft.resume;
}

function fmtBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

function resumeSize(file) {
  if (!file) return 0;
  if (file.startsWith('data:')) {
    // approx decoded size
    const comma = file.indexOf(',');
    const b64 = file.slice(comma + 1);
    const pad = file.slice(0, comma).includes(';base64') ? 0 : 0;
    return Math.round(b64.length * 0.75) + pad;
  }
  return 0; // path-based: unknown (kept on host)
}

function buildResumeAdmin() {
  $('#resumePick').onclick = () => $('#resumeFile').click();

  $('#resumeFile').onchange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const ok = /\.(pdf|doc|docx)$/i.test(f.name) || f.type === 'application/pdf';
    if (!ok) { toast('Please choose a PDF, DOC, or DOCX file.', 'error'); return; }
    if (f.size > 3 * 1024 * 1024) { toast('File is larger than 3 MB — please use a smaller file or the path option.', 'error'); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const r = ensureResume();
      r.file = reader.result;
      r.fileName = f.name;
      r.updated = new Date().toISOString().slice(0, 10);
      markDirty();
      renderResumeAdmin();
      toast(`Resume "${f.name}" loaded — press Publish Changes.`, 'success');
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  $('#resumeClear').onclick = () => {
    if (!confirm('Remove the uploaded resume?')) return;
    const r = ensureResume();
    r.file = null; r.fileName = ''; r.updated = '';
    markDirty();
    renderResumeAdmin();
  };

  $('#resumePathApply').onclick = () => {
    const path = $('#resumePath').value.trim();
    const r = ensureResume();
    if (!path) { r.file = null; r.fileName = ''; r.updated = ''; }
    else {
      r.file = path;
      if (!r.fileName) r.fileName = path.split('/').pop() || 'resume.pdf';
      r.updated = new Date().toISOString().slice(0, 10);
    }
    markDirty();
    renderResumeAdmin();
    toast(path ? 'Path applied — publish to save.' : 'Resume path cleared.', 'success');
  };

  $('#resumeTestDl').onclick = () => {
    const r = ensureResume();
    if (r.file) {
      const a = document.createElement('a');
      a.href = r.file;
      a.download = r.fileName || 'resume.pdf';
      a.click();
    }
  };

  renderResumeAdmin();
}

function renderResumeAdmin() {
  const r = ensureResume();
  const has = !!r.file;
  const prev = $('#resumeAdminPrev');
  if (prev) prev.classList.toggle('has-file', has);
  $('#raName').textContent = has ? (r.fileName || 'resume.pdf') : 'No resume uploaded yet';
  let meta = '—';
  if (has) {
    const size = resumeSize(r.file);
    meta = [
      r.file.startsWith('data:') ? 'embedded in content' : 'path: ' + r.file,
      size ? fmtBytes(size) : null,
      r.updated ? 'updated ' + r.updated : null
    ].filter(Boolean).join(' · ');
  }
  $('#raMeta').textContent = meta;
  $('#resumeClear').hidden = !has;
  $('#resumeTestDl').hidden = !has;
  $('#resumePath').value = has && !r.file.startsWith('data:') ? r.file : '';
}

/* ---------- MESSAGES ---------- */
function updateMsgBadges(count) {
  const b1 = $('#msgBadge'), b2 = $('#qaMsgBadge');
  [b1, b2].forEach(b => {
    if (!b) return;
    b.textContent = count;
    b.hidden = count === 0;
  });
}

function renderMessages() {
  const list = getMessages();
  const unread = list.filter(m => !m.read).length;
  updateMsgBadges(unread);
  $('#ovMsg').textContent = list.length;

  const host = $('#messagesList');
  if (!list.length) {
    host.innerHTML = `<div class="empty-state">📭 Inbox empty — messages from the contact form will appear here.</div>`;
    return;
  }

  host.innerHTML = list.map(m => `
    <div class="msg-card ${m.read ? '' : 'unread'}" data-id="${escapeHtml(m.id)}">
      <div class="msg-head">
        <span class="msg-from">${escapeHtml(m.name)} <span class="dim">&lt;${escapeHtml(m.email)}&gt;</span></span>
        <span class="msg-date">${new Date(m.date).toLocaleString()}</span>
      </div>
      <div class="msg-subject">Re: ${escapeHtml(m.subject)}</div>
      <div class="msg-body">${escapeHtml(m.message)}</div>
      <div class="msg-tools">
        <a class="msg-tool" href="mailto:${escapeHtml(m.email)}?subject=Re: ${escapeHtml(m.subject)}">Reply by email</a>
        <button class="msg-tool" data-act="read">${m.read ? 'Mark unread' : 'Mark read'}</button>
        <button class="msg-tool danger" data-act="del">Delete</button>
      </div>
    </div>`).join('');

  host.onclick = (e) => {
    const btn = e.target.closest('button.msg-tool');
    if (!btn) return;
    const id = btn.closest('.msg-card').dataset.id;
    let msgs = getMessages();
    const idx = msgs.findIndex(m => m.id === id);
    if (idx < 0) return;
    if (btn.dataset.act === 'read') msgs[idx].read = !msgs[idx].read;
    if (btn.dataset.act === 'del') {
      if (!confirm('Delete this message?')) return;
      msgs.splice(idx, 1);
    }
    saveMessages(msgs);
    renderMessages();
    updateOverview();
  };
}

function bindMessageActions() {
  $('#clearMsgs').onclick = () => {
    if (!getMessages().length) return;
    if (!confirm('Delete ALL messages? This cannot be undone.')) return;
    saveMessages([]);
    renderMessages();
    toast('Inbox cleared.', 'success');
  };
  $('#exportMsgs').onclick = () => {
    const msgs = getMessages();
    if (!msgs.length) { toast('No messages to export.', 'error'); return; }
    const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const rows = [['Date', 'Name', 'Email', 'Subject', 'Message', 'Read'].join(',')]
      .concat(msgs.map(m => [m.date, m.name, m.email, m.subject, m.message, m.read ? 'yes' : 'no'].map(esc).join(',')));
    downloadBlob(rows.join('\n'), 'messages.csv', 'text/csv');
    toast('Messages exported.', 'success');
  };
}

/* ---------- SETTINGS ---------- */
function updateOverview() {
  $('#ovExp').textContent = (draft || getContent()).experience.length;
  const cats = (draft || getContent()).skills.categories;
  $('#ovSkills').textContent = cats.reduce((n, c) => n + c.items.length, 0);
  $('#ovEdu').textContent = (draft || getContent()).education.length;
  const list = getMessages();
  $('#ovMsg').textContent = list.length;
  updateMsgBadges(list.filter(m => !m.read).length);
}

function bindSettings() {
  $('#exportJs').onclick = () => {
    // Snapshot current draft (including unsaved edits) into a content.js file
    const snapshot = dirty ? draft : getContent();
    const file =
`/* ============================================================
   PORTFOLIO CONTENT — exported from Super Admin
   Generated: ${new Date().toISOString()}
   Replace the content.js file on your host with this file.
   ============================================================ */

const DEFAULT_CONTENT = ${JSON.stringify(snapshot, null, 2)};

/* ---------- Storage helpers (shared by site + admin) ---------- */

const CONTENT_STORE_KEY = "noc_portfolio_content_v1";
const MESSAGES_STORE_KEY = "noc_portfolio_messages_v1";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(dst, src) {
  if (!src || typeof src !== "object") return dst;
  Object.keys(src).forEach(function (k) {
    if (
      src[k] &&
      typeof src[k] === "object" &&
      !Array.isArray(src[k]) &&
      dst[k] &&
      typeof dst[k] === "object" &&
      !Array.isArray(dst[k])
    ) {
      deepMerge(dst[k], src[k]);
    } else {
      dst[k] = Array.isArray(src[k]) ? deepClone(src[k]) : src[k];
    }
  });
  return dst;
}

function getContent() {
  var base = deepClone(DEFAULT_CONTENT);
  try {
    var raw = localStorage.getItem(CONTENT_STORE_KEY);
    if (raw) deepMerge(base, JSON.parse(raw));
  } catch (e) { /* corrupted store → fall back to defaults */ }
  return base;
}

function saveContent(content) {
  localStorage.setItem(CONTENT_STORE_KEY, JSON.stringify(content));
}

function resetContent() {
  localStorage.removeItem(CONTENT_STORE_KEY);
}

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_STORE_KEY) || "[]");
  } catch (e) { return []; }
}

function saveMessages(list) {
  localStorage.setItem(MESSAGES_STORE_KEY, JSON.stringify(list));
}

function addMessage(msg) {
  var list = getMessages();
  msg.id = "m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  msg.date = new Date().toISOString();
  msg.read = false;
  list.unshift(msg);
  saveMessages(list);
  return msg;
}
`;
    downloadBlob(file, 'content.js', 'application/javascript');
    toast('content.js exported — upload it to your host.', 'success');
  };

  $('#importJsonBtn').onclick = () => $('#importJsonFile').click();
  $('#importJsonFile').onchange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.profile || !data.skills) throw new Error('bad shape');
        draft = deepClone(data);
        publish(false, true); // rebuild editors after save
        toast('JSON imported & published.', 'success');
      } catch (err) {
        toast('Invalid content JSON file.', 'error');
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  };

  $('#changePassBtn').onclick = async () => {
    const u = $('#newUser').value.trim();
    const p1 = $('#newPass').value;
    const p2 = $('#newPass2').value;
    if (!u) { toast('Username required.', 'error'); return; }
    if (p1.length < 6) { toast('Password must be at least 6 characters.', 'error'); return; }
    if (p1 !== p2) { toast('Passwords do not match.', 'error'); return; }
    const store = await ensureAuthStore();
    store.user = u;
    store.passHash = await hashPassword(p1);
    store.updated = Date.now();
    localStorage.setItem(AUTH_KEY, JSON.stringify(store));
    $('#newUser').value = $('#newPass').value = $('#newPass2').value = '';
    toast('Credentials updated.', 'success');
  };

  $('#resetContentBtn').onclick = () => {
    if (!confirm('Reset ALL content edits back to defaults? (messages & credentials are kept)')) return;
    resetContent();
    draft = getContent();
    bootEditors();
    markClean();
    toast('Content reset to defaults.', 'success');
  };
}

/* ---------- publish ---------- */
function publish(silent = false, rebuild = false) {
  try {
    saveContent(draft);
    markClean();
    if (!silent) {
      toast('Published! This browser shows the updates now.', 'success');
      setTimeout(() => toast('For the live site: Settings → Export content.js → upload.', 'info'), 1600);
    }
    if (rebuild) bootEditors();
    updateOverview();
  } catch (err) {
    // localStorage full (often base64 photos)
    toast('Save failed — storage full. Try smaller images.', 'error');
  }
}

function downloadBlob(text, filename, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- beforeunload guard ---------- */
window.addEventListener('beforeunload', (e) => {
  if (dirty) { e.preventDefault(); e.returnValue = ''; }
});

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  bindMessageActions();
  initAuth();
});
