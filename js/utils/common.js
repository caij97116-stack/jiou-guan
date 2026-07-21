window.escapeHTML = function(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
};

window.showToast = function(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

window.DraftManager = {
    _prefix: 'jiou_draft_',
    _autoSaveInterval: null,

    save(type, data) {
        try {
            localStorage.setItem(this._prefix + type, JSON.stringify(data));
        } catch (e) {
            // quota exceeded, silently fail
        }
    },

    load(type) {
        try {
            const raw = localStorage.getItem(this._prefix + type);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    remove(type) {
        localStorage.removeItem(this._prefix + type);
    },

    hasDraft(type) {
        return localStorage.getItem(this._prefix + type) !== null;
    },

    hasAnyDraft() {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith(this._prefix)) return true;
        }
        return false;
    },

    clearAll() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k.startsWith(this._prefix)) keys.push(k);
        }
        keys.forEach(k => localStorage.removeItem(k));
    }
};
