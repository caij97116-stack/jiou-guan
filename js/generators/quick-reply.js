const QuickReplyGenerator = {
    title: 'Quick Reply',

    defaultQRSet: {
        name: '',
        disableSend: false,
        placeBeforeChat: false,
        quickReplies: []
    },

    entryIdCounter: 0,

    defaultEntry() {
        return {
            id: ++this.entryIdCounter,
            label: '',
            title: '',
            message: '',
            isUser: true,
            icon: '',
            enabled: true,
            start: '',
            end: '',
            inject: false,
            mode: 0,
            sortOrder: this.entryIdCounter * 10
        };
    },

    templates: {
        rpHelper: {
            name: '角色扮演助手',
            disableSend: false,
            placeBeforeChat: true,
            quickReplies: [
                { id: 1, label: '继续', title: '让 AI 继续回复', message: '(继续)', isUser: false, icon: '▶', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 10 },
                { id: 2, label: '重试', title: '重新生成回复', message: '(重试)', isUser: false, icon: '↻', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 20 },
                { id: 3, label: '描述场景', title: '让 AI 描述当前场景', message: '[请详细描述当前场景的环境、氛围和细节]', isUser: true, icon: '🏞', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 30 },
                { id: 4, label: '内心独白', title: '生成角色内心想法', message: '[请以{{char}}的视角，写一段内心独白，表达他/她此刻的真实想法和感受]', isUser: true, icon: '💭', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 40 },
            ]
        },
        commandSet: {
            name: '系统命令集',
            disableSend: false,
            placeBeforeChat: false,
            quickReplies: [
                { id: 1, label: '/help', title: '显示帮助', message: '/help', isUser: true, icon: '❓', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 10 },
                { id: 2, label: '/sys', title: '系统提示', message: '/sys ', isUser: true, icon: '⚙', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 20 },
                { id: 3, label: '/note', title: '添加备注', message: '/note ', isUser: true, icon: '📝', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 30 }
            ]
        },
        nsfwHelper: {
            name: 'NSFW 辅助',
            disableSend: false,
            placeBeforeChat: false,
            quickReplies: [
                { id: 1, label: '更详细', title: '要求更详细的描写', message: '(请用更丰富生动的细节描写接下来的场景，使用感官语言描述视觉、触觉、声音、气味等)', isUser: true, icon: '🔍', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 10 },
                { id: 2, label: '角色主动', title: '让角色更主动', message: '(让{{char}}更加主动地推进场景，展现他/她的欲望和个性)', isUser: true, icon: '🔥', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 20 },
                { id: 3, label: '放慢节奏', title: '放慢互动节奏', message: '(请放慢节奏，详细描写每一个细微的动作、眼神交流和情感变化)', isUser: true, icon: '🐌', enabled: true, start: '', end: '', inject: false, mode: 0, sortOrder: 30 }
            ]
        }
    },

    render(container) {
        this.entryIdCounter = 0;
        container.innerHTML = `
            <div class="form-section">
                <h3 class="form-section-title">快速回复集信息</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> 集合名称</label>
                        <input type="text" class="form-input" id="qr-name" placeholder="My Quick Replies">
                    </div>
                    <div class="form-group" style="display:flex;gap:16px;align-items:flex-end;padding-bottom:8px;">
                        <div class="form-checkbox-group">
                            <input type="checkbox" id="qr-disableSend">
                            <label>禁止自动发送</label>
                        </div>
                        <div class="form-checkbox-group">
                            <input type="checkbox" id="qr-placeBeforeChat">
                            <label>放在聊天框前</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">预设模板</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="rpHelper">角色扮演助手</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="commandSet">系统命令集</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="nsfwHelper">NSFW 辅助</button>
                </div>
            </div>
            <div class="form-section">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 class="form-section-title" style="margin:0;">回复条目</h3>
                    <button class="btn btn-small btn-primary" id="qr-add-entry">+ 添加条目</button>
                </div>
                <div id="qr-entries"></div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">导入快速回复</h3>
                <div style="display:flex;gap:10px;align-items:center;">
                    <label class="btn btn-secondary" style="cursor:pointer;">
                        <span id="qr-import-label">选择 QRSet JSON 文件</span>
                        <input type="file" id="qr-import-file" accept=".json" style="display:none;">
                    </label>
                    <span class="form-hint">导入已有 SillyTavern 快速回复集进行编辑</span>
                </div>
            </div>
        `;

        this._bindEvents();
        this._renderQRItems([]);
    },

    _renderQRItems(quickReplies) {
        const container = document.getElementById('qr-entries');
        if (!container) return;

        if (quickReplies.length === 0) {
            container.innerHTML = '<div class="empty-state">还没有条目，点击上方"添加条目"按钮</div>';
            return;
        }

        container.innerHTML = quickReplies.map(qr => `
            <div class="entry-card qr-entry" data-id="${qr.id}">
                <div class="entry-card-header">
                    <h4>条目 #${qr.id}</h4>
                    <div style="display:flex;gap:4px;">
                        <button class="btn btn-small btn-secondary qr-move-up" data-id="${qr.id}" title="上移">↑</button>
                        <button class="btn btn-small btn-secondary qr-move-down" data-id="${qr.id}" title="下移">↓</button>
                        <button class="btn btn-small btn-danger qr-delete-entry" data-id="${qr.id}">删除</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">按钮标签</label>
                        <input type="text" class="form-input qr-label" data-id="${qr.id}" value="${escapeHTML(qr.label)}" placeholder="按钮上显示的文字">
                    </div>
                    <div class="form-group">
                        <label class="form-label">提示文字</label>
                        <input type="text" class="form-input qr-title" data-id="${qr.id}" value="${escapeHTML(qr.title || '')}" placeholder="鼠标悬停提示">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">发送内容</label>
                    <textarea class="form-textarea qr-message" data-id="${qr.id}" rows="3" placeholder="点击按钮后发送的消息内容">${escapeHTML(qr.message)}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">图标</label>
                        <input type="text" class="form-input qr-icon" data-id="${qr.id}" value="${escapeHTML(qr.icon || '')}" placeholder="📝">
                        <span class="form-hint">支持 Emoji 或 Unicode 字符</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">执行模式</label>
                        <select class="form-select qr-mode" data-id="${qr.id}">
                            <option value="0" ${qr.mode === 0 ? 'selected' : ''}>直接发送</option>
                            <option value="1" ${qr.mode === 1 ? 'selected' : ''}>填入输入框</option>
                            <option value="2" ${qr.mode === 2 ? 'selected' : ''}>弹出确认</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:16px;align-items:center;">
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="qr-enabled" data-id="${qr.id}" ${qr.enabled ? 'checked' : ''}>
                        <label>启用</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="qr-isUser" data-id="${qr.id}" ${qr.isUser ? 'checked' : ''}>
                        <label>用户消息样式</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="qr-inject" data-id="${qr.id}" ${qr.inject ? 'checked' : ''}>
                        <label>注入模式</label>
                    </div>
                </div>
            </div>
        `).join('');

        this._bindEntryEvents();
    },

    _bindEvents() {
        const addBtn = document.getElementById('qr-add-entry');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const qrs = this._collectEntries();
                qrs.push(this.defaultEntry());
                this._renderQRItems(qrs);
            });
        }

        document.querySelectorAll('.qr-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tpl = this.templates[btn.dataset.template];
                if (!tpl) return;
                const nameEl = document.getElementById('qr-name');
                if (nameEl) nameEl.value = tpl.name;
                const disableEl = document.getElementById('qr-disableSend');
                if (disableEl) disableEl.checked = tpl.disableSend;
                const placeEl = document.getElementById('qr-placeBeforeChat');
                if (placeEl) placeEl.checked = tpl.placeBeforeChat;
                this._renderQRItems(JSON.parse(JSON.stringify(tpl.quickReplies)));
            });
        });

        const fileInput = document.getElementById('qr-import-file');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        const nameEl = document.getElementById('qr-name');
                        const disableEl = document.getElementById('qr-disableSend');
                        const placeEl = document.getElementById('qr-placeBeforeChat');
                        const labelEl = document.getElementById('qr-import-label');

                        if (data.name && nameEl) nameEl.value = data.name;
                        if (disableEl) disableEl.checked = !!data.disableSend;
                        if (placeEl) placeEl.checked = !!data.placeBeforeChat;
                        if (labelEl) labelEl.textContent = file.name;

                        const entries = data.quickReplies || data.entries || [];
                        if (entries.length > 0) {
                            this._renderQRItems(JSON.parse(JSON.stringify(entries)));
                        }
                        this._showToast('快速回复集已导入');
                    } catch (err) {
                        this._showToast('导入失败：无效的 JSON 文件');
                    }
                };
                reader.readAsText(file);
            });
        }
    },

    _bindEntryEvents() {
        document.querySelectorAll('.qr-delete-entry').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                let qrs = this._collectEntries();
                qrs = qrs.filter(q => q.id !== id);
                this._renderQRItems(qrs);
            });
        });

        document.querySelectorAll('.qr-move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                let qrs = this._collectEntries();
                const idx = qrs.findIndex(q => q.id === id);
                if (idx > 0) {
                    [qrs[idx-1], qrs[idx]] = [qrs[idx], qrs[idx-1]];
                    this._renderQRItems(qrs);
                }
            });
        });

        document.querySelectorAll('.qr-move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                let qrs = this._collectEntries();
                const idx = qrs.findIndex(q => q.id === id);
                if (idx < qrs.length - 1) {
                    [qrs[idx], qrs[idx+1]] = [qrs[idx+1], qrs[idx]];
                    this._renderQRItems(qrs);
                }
            });
        });
    },

    _collectEntries() {
        const entries = [];
        document.querySelectorAll('.qr-entry').forEach(el => {
            const id = parseInt(el.dataset.id);
            const label = el.querySelector('.qr-label')?.value || '';
            const title = el.querySelector('.qr-title')?.value || '';
            const message = el.querySelector('.qr-message')?.value || '';
            const icon = el.querySelector('.qr-icon')?.value || '';
            const mode = parseInt(el.querySelector('.qr-mode')?.value || '0');
            const enabled = el.querySelector('.qr-enabled')?.checked ?? true;
            const isUser = el.querySelector('.qr-isUser')?.checked ?? true;
            const inject = el.querySelector('.qr-inject')?.checked ?? false;
            entries.push({
                id, label, title, message, isUser, icon, enabled,
                start: '', end: '', inject, mode,
                sortOrder: entries.length * 10
            });
        });
        return entries;
    },

    getData() {
        return {
            name: document.getElementById('qr-name')?.value || 'Quick Replies',
            disableSend: document.getElementById('qr-disableSend')?.checked ?? false,
            placeBeforeChat: document.getElementById('qr-placeBeforeChat')?.checked ?? false,
            quickReplies: this._collectEntries()
        };
    },

    getPreviewFiles() {
        return [
            { name: 'qrset.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    download() {
        const data = this.getData();
        const name = data.name.replace(/\s+/g, '-').toLowerCase() || 'quick-replies';
        DownloadUtils.downloadJSON(data, name + '.qrset.json');
    },

    validate() {
        const errors = [];
        const entries = document.querySelectorAll('#qr-entries .qr-entry');
        if (entries.length === 0) {
            errors.push('请至少添加一条快速回复');
        }
        return { valid: errors.length === 0, errors };
    },

    _showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    loadDraft(data) {
        const nameEl = document.getElementById('qr-name');
        if (nameEl && data.name) nameEl.value = data.name;
        const disableEl = document.getElementById('qr-disableSend');
        if (disableEl) disableEl.checked = !!data.disableSend;
        const placeEl = document.getElementById('qr-placeBeforeChat');
        if (placeEl) placeEl.checked = !!data.placeBeforeChat;

        const repls = data.quickReplies || [];
        const container = document.getElementById('qr-entries');
        if (container) {
            container.innerHTML = '';
            this.entryIdCounter = 0;
            repls.forEach(repl => this._addQREntry(container, repl));
        }
    }
};
