// ============================================================
//  ui.js — Composants UI réutilisables
//  Nour Al Zawwaj · v1.0
// ============================================================

// ── TOAST ──────────────────────────────────────────────────

let toastContainer = null;

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 28px; right: 28px;
            z-index: 9999;
            display: flex; flex-direction: column; gap: 10px;
            max-width: 360px;
        `;
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Affiche un toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {number} duration  — ms
 */
export function toast(message, type = 'info', duration = 4000) {
    const icons = {
        success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
        error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    };

    const colors = {
        success: { bg: '#f0faf4', border: 'rgba(26,122,74,.25)', text: '#1a2e35', icon: '#1a7a4a' },
        error:   { bg: '#fdf0f0', border: 'rgba(192,57,43,.25)', text: '#1a2e35', icon: '#c0392b' },
        warning: { bg: '#fffbf0', border: 'rgba(201,162,39,.3)',  text: '#1a2e35', icon: '#a8851e' },
        info:    { bg: '#f0f6fa', border: 'rgba(15,76,92,.2)',    text: '#1a2e35', icon: '#0F4C5C' },
    };

    const c = colors[type] || colors.info;
    const el = document.createElement('div');
    el.style.cssText = `
        display: flex; align-items: flex-start; gap: 12px;
        padding: 14px 16px;
        background: ${c.bg};
        border: 1px solid ${c.border};
        border-radius: 4px;
        box-shadow: 0 8px 32px rgba(0,0,0,.1);
        font-family: 'Jost', system-ui, sans-serif;
        font-size: .85rem; line-height: 1.5; color: ${c.text};
        transform: translateX(120%);
        transition: transform .35s cubic-bezier(.22,1,.36,1);
        cursor: pointer;
    `;

    el.innerHTML = `
        <span style="color:${c.icon};flex-shrink:0;margin-top:1px">${icons[type]}</span>
        <span>${message}</span>
    `;

    getToastContainer().appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });

    const remove = () => {
        el.style.transform = 'translateX(120%)';
        setTimeout(() => el.remove(), 350);
    };

    el.addEventListener('click', remove);
    const timer = setTimeout(remove, duration);
    el.addEventListener('click', () => clearTimeout(timer));
}

// ── BOUTON LOADING ─────────────────────────────────────────

/**
 * Met un bouton en état de chargement et retourne une fonction de restauration.
 *
 * @param {HTMLButtonElement} btn
 * @param {string} [loadingText]
 * @returns {Function} restore()
 */
export function btnLoading(btn, loadingText = 'Chargement…') {
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = '.75';
    btn.style.cursor = 'not-allowed';
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="animation:spin .7s linear infinite;display:inline-block">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        ${loadingText}
    `;

    // Injecter le keyframe spin si absent
    if (!document.getElementById('ui-spin-style')) {
        const s = document.createElement('style');
        s.id = 'ui-spin-style';
        s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
    }

    return function restore() {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
        btn.innerHTML = original;
    };
}

// ── ERREUR DE CHAMP ────────────────────────────────────────

/**
 * Affiche ou masque le message d'erreur sous un champ.
 *
 * @param {string}  fieldId   — id du <input> ou <select>
 * @param {string|null} message — null pour effacer
 */
export function fieldError(fieldId, message) {
    const inp = document.getElementById(fieldId);
    if (!inp) return;

    let errEl = inp.parentElement?.querySelector('.dyn-error')
             || document.getElementById(`err-${fieldId}`);

    if (message) {
        inp.style.borderColor = 'var(--error, #c0392b)';
        inp.style.boxShadow   = '0 0 0 3px rgba(192,57,43,.08)';
        if (errEl) { errEl.textContent = message; errEl.style.display = 'block'; }
    } else {
        inp.style.borderColor = '';
        inp.style.boxShadow   = '';
        if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    }
}

/**
 * Efface toutes les erreurs dans un formulaire.
 */
export function clearAllErrors(form) {
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
    });
    form.querySelectorAll('.dyn-error, .field-error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// ── VALIDATION EMAIL ───────────────────────────────────────
export function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
}

// ── OVERLAY PLEIN ÉCRAN ────────────────────────────────────

let overlayEl = null;

export function showOverlay(message = 'Chargement…') {
    if (overlayEl) return;
    overlayEl = document.createElement('div');
    overlayEl.style.cssText = `
        position:fixed;inset:0;z-index:8888;
        background:rgba(10,53,67,.65);backdrop-filter:blur(4px);
        display:flex;align-items:center;justify-content:center;
        flex-direction:column;gap:20px;
    `;
    overlayEl.innerHTML = `
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="2"
             style="animation:spin .8s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p style="font-family:'Jost',sans-serif;font-size:.85rem;letter-spacing:.1em;
                  text-transform:uppercase;color:rgba(255,255,255,.6)">${message}</p>
    `;
    document.body.appendChild(overlayEl);
}

export function hideOverlay() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
}
