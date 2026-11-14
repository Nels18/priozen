/* ============================================================
   MODALE « NOUVELLE TÂCHE » (TASK-01)
   Chargé avant le script principal : les variables ci-dessous
   (let globales) sont partagées avec lui.
   ============================================================ */
let modalOpen = false;
let modalState = 'empty'; // 'empty' | 'filled' | 'error'
let modalSubs = [];       // sous-tâches en cours de saisie (enregistrées seulement à la validation)
let modalAnim = false;

const MODAL_FOLDER_ICONS = { 'Priozen App': '💻', 'Travail': '💼', 'Perso': '🏠' };

function openModal(state) {
  modalState = state || 'empty';
  const src = modalState === 'filled' && editId !== null ? TASKS.find((x) => x.id === editId) : null;
  modalSubs = src && src.subtasks ? src.subtasks.map((s) => ({ t: s.t, d: s.d })) : [];
  modalOpen = true;
  modalAnim = true;
  renderAll();
}

function closeModal() {
  modalOpen = false;
  const sel = document.getElementById('screen-select');
  if (sel) sel.value = currentScreen;
  renderAll();
}

function activeFrameId() {
  if (currentDevice === 'mobile') return 'frame-mobile';
  if (currentDevice === 'tablet') return 'frame-tablet';
  return 'frame-desktop';
}

// Recrée la modale dans le cadre de l'appareil actif (appelé par renderAll).
function renderModal() {
  document.querySelectorAll('.modal-layer').forEach((el) => el.remove());
  if (!modalOpen) return;
  const frame = document.getElementById(activeFrameId());
  if (!frame) return;
  const layer = document.createElement('div');
  layer.className = 'modal-layer' + (currentDevice === 'mobile' ? ' is-sheet' : '') + (modalAnim ? ' anim' : '');
  modalAnim = false;
  layer.innerHTML = modalHTML(modalState);
  frame.appendChild(layer);
  const title = document.getElementById('m-title');
  if (title && modalState === 'empty') title.focus({ preventScroll: true });
}

function modalSubsHTML() {
  return modalSubs.map((s, i) => `
    <li class="m-sub">
      <input class="m-sub-input${s.d ? ' done' : ''}" type="text" value="${escAttr(s.t)}" aria-label="Titre de la sous-tâche" oninput="modalSubs[${i}].t = this.value" onkeydown="if (event.key === 'Enter') { event.preventDefault(); document.getElementById('m-sub').focus(); }">
      <button type="button" class="m-sub-del" aria-label="Retirer la sous-tâche : ${escAttr(s.t)}" onclick="delModalSub(${i})">${ic('trash', 16)}</button>
    </li>`).join('');
}
function refreshModalSubs() {
  const ul = document.getElementById('m-subs');
  if (ul) ul.innerHTML = modalSubsHTML();
}
function addModalSub() {
  const inp = document.getElementById('m-sub');
  const v = inp ? inp.value.trim() : '';
  if (!v) { if (inp) inp.focus(); return; }
  modalSubs.push({ t: v, d: false });
  inp.value = '';
  refreshModalSubs();
  inp.focus();
}
function delModalSub(i) { modalSubs.splice(i, 1); refreshModalSubs(); }
function modalSubKey(e) { if (e.key === 'Enter') { e.preventDefault(); addModalSub(); } }

function showTitleError() {
  const input = document.getElementById('m-title');
  const err = document.getElementById('m-title-err');
  if (!input || !err) return;
  input.classList.add('has-error');
  input.setAttribute('aria-invalid', 'true');
  err.hidden = false;
  input.focus();
}

function clearTitleError() {
  const input = document.getElementById('m-title');
  const err = document.getElementById('m-title-err');
  if (!input || !err) return;
  input.classList.remove('has-error');
  input.removeAttribute('aria-invalid');
  err.hidden = true;
}

function submitModal(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const title = String(data.get('title') || '').trim();
  if (!title) {
    showTitleError();
    return;
  }
  const folder = String(data.get('folder') || 'Aucun');
  const due = String(data.get('due') || '').trim();
  const pending = (document.getElementById('m-sub') || { value: '' }).value.trim();
  if (pending) modalSubs.push({ t: pending, d: false });
  modalSubs = modalSubs.filter((s) => s.t.trim());
  const subs = modalSubs.length ? modalSubs.map((s) => ({ t: s.t, d: s.d })) : null;
  if (modalState === 'filled') {
    const t = editId !== null ? TASKS.find((x) => x.id === editId) : null;
    if (t) {
      t.title = title;
      t.quadrant = String(data.get('quadrant'));
      t.description = String(data.get('desc') || '').trim();
      t.folder = folder === 'Aucun' ? null : folder;
      t.subtasks = subs;
    }
    modalOpen = false;
    const sel0 = document.getElementById('screen-select');
    if (sel0) sel0.value = currentScreen;
    renderAll();
    showToast('Modifications enregistrées');
    return;
  }
  TASKS.push({
    id: Date.now(),
    title,
    quadrant: String(data.get('quadrant')),
    folder: folder === 'Aucun' ? null : folder,
    folderIcon: MODAL_FOLDER_ICONS[folder] || null,
    subtasks: subs,
    description: String(data.get('desc') || '').trim(),
    date: due || null,
    dateType: due ? 'future' : null,
    done: false
  });
  modalOpen = false;
  const sel = document.getElementById('screen-select');
  if (sel) sel.value = currentScreen;
  renderAll();
  showToast('Tâche créée');
}

function modalHTML(state) {
  const hasError = state === 'error';
  const v = state === 'filled'
    ? { title: 'Préparer la réunion client', desc: 'Envoyer le support avant jeudi et préparer les questions.', due: '12/11/2026', folder: 'Travail', q: 'critique' }
    : { title: '', desc: '', due: '', folder: 'Aucun', q: 'schedule' };

  const src = state === 'filled' && editId !== null ? TASKS.find((x) => x.id === editId) : null;
  if (src) { v.title = src.title; v.desc = src.description || ''; v.folder = src.folder || 'Aucun'; v.q = src.quadrant; }

  const quadrants = [
    { key: 'critique', label: 'Critique', desc: 'Urgent et important', c: '--critique', bg: '--critique-bg' },
    { key: 'schedule', label: 'À planifier', desc: 'Important, pas urgent', c: '--primary', bg: '--schedule-bg' },
    { key: 'delegate', label: 'À déléguer', desc: 'Urgent, pas important', c: '--delegate', bg: '--delegate-bg' },
    { key: 'secondary', label: 'Secondaire', desc: 'Ni urgent ni important', c: '--secondary-c', bg: '--secondary-bg' }
  ];
  const folders = ['Aucun', 'Priozen App', 'Travail', 'Perso'];

  const check = '<svg class="q-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  return `
    <div class="modal-scrim" onclick="closeModal()"></div>
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="m-heading">
      <div class="modal-handle"><span></span></div>
      <header class="modal-head">
        <h2 class="modal-title" id="m-heading">${state === 'filled' ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
        <button type="button" class="modal-close" aria-label="Fermer" onclick="closeModal()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>

      <form class="modal-form" onsubmit="submitModal(event)" novalidate>
        <div>
          <label class="m-label" for="m-title">Titre</label>
          <input id="m-title" name="title" type="text" class="m-input${hasError ? ' has-error' : ''}" placeholder="Ex. : Préparer la réunion client" value="${v.title}" autocomplete="off" oninput="clearTitleError()" aria-describedby="m-title-err"${hasError ? ' aria-invalid="true"' : ''}>
          <p id="m-title-err" class="m-error" role="alert"${hasError ? '' : ' hidden'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>
            Le titre est obligatoire.
          </p>
        </div>

        <fieldset class="m-fieldset">
          <legend class="m-legend">Quadrant</legend>
          <div class="q-grid">
            ${quadrants.map((q) => `
              <label class="q-opt" style="--q:var(${q.c});--qbg:var(${q.bg})">
                <input type="radio" name="quadrant" value="${q.key}"${v.q === q.key ? ' checked' : ''}>
                <span class="q-name"><span class="q-dot"></span>${q.label}${check}</span>
                <span class="q-desc">${q.desc}</span>
              </label>`).join('')}
          </div>
        </fieldset>

        <div>
          <label class="m-label" for="m-desc">Description <span class="m-opt">(facultatif)</span></label>
          <textarea id="m-desc" name="desc" class="m-input" rows="3" placeholder="Ajoutez un détail utile">${v.desc}</textarea>
        </div>

        <div>
          <label class="m-label" for="m-sub">Sous-tâches <span class="m-opt">(facultatif)</span></label>
          <ul class="m-subs" id="m-subs">${modalSubsHTML()}</ul>
          <div class="m-sub-add">
            <input id="m-sub" type="text" class="m-input" placeholder="Ajouter une sous-tâche" autocomplete="off" onkeydown="modalSubKey(event)">
            <button type="button" class="m-btn m-btn-cancel m-sub-btn" onclick="addModalSub()">Ajouter</button>
          </div>
        </div>

        <div class="m-row">
          <div>
            <label class="m-label" for="m-due">Échéance</label>
            <div class="m-field">
              <svg class="m-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>
              <input id="m-due" name="due" type="text" class="m-input" placeholder="jj/mm/aaaa" value="${v.due}" autocomplete="off">
            </div>
          </div>
          <div>
            <label class="m-label" for="m-folder">Dossier</label>
            <div class="m-field">
              <svg class="m-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5A2 2 0 015.5 5.5h4l2 2.5h7a2 2 0 012 2v7.5a2 2 0 01-2 2h-13a2 2 0 01-2-2z"/></svg>
              <select id="m-folder" name="folder" class="m-input">
                ${folders.map((f) => `<option${f === v.folder ? ' selected' : ''}>${f}</option>`).join('')}
              </select>
              <svg class="m-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <footer class="modal-foot">
          ${state === 'filled' ? `<button type="button" class="m-btn-danger" onclick="deleteTask(editId !== null ? editId : 2)">Supprimer</button>` : ''}
          <button type="button" class="m-btn m-btn-cancel" onclick="closeModal()">Annuler</button>
          <button type="submit" class="m-btn m-btn-ok">${state === 'filled' ? 'Enregistrer' : 'Créer la tâche'}</button>
        </footer>
      </form>
    </section>`;
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalOpen) closeModal();
});
