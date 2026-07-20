const CharacterCardGenerator = {
    title: 'Character Card',
    personaImage: null,

    specInfo: {
        v3: { spec: 'chara_card_v3', spec_version: '3.0', display: 'V3 (当前)' },
        v2: { spec: 'chara_card_v2', spec_version: '2.0', display: 'V2 (兼容旧版)' }
    },

    _activeSpec: 'v3',

    render(container) {
        this.personaImage = null;
        container.innerHTML = `
            <div class="form-section">
                <h3 class="form-section-title">导出规格</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Character Card 版本</label>
                        <select class="form-select" id="cc-spec-select">
                            <option value="v3">V3 (当前) - 标准格式 + extensions</option>
                            <option value="v2">V2 (兼容旧版) - 扁平结构</option>
                        </select>
                        <span class="form-hint">V3 包含 extensions 字段，V2 使用扁平结构兼容旧版酒馆</span>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">导入角色卡</h3>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <label class="btn btn-secondary" style="cursor:pointer;">
                        <span id="cc-import-json-label">选择 JSON 文件</span>
                        <input type="file" id="cc-import-json-file" accept=".json" style="display:none;">
                    </label>
                    <label class="btn btn-secondary" style="cursor:pointer;">
                        <span id="cc-import-png-label">选择 PNG 图片</span>
                        <input type="file" id="cc-import-png-file" accept=".png" style="display:none;">
                    </label>
                    <span class="form-hint">导入已有角色卡 JSON/PNG 进行编辑。PNG 支持 V3/V2 角色卡解析</span>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">角色头像</h3>
                <div class="persona-image-preview" id="cc-avatar-preview">
                    <span style="color:var(--text-muted);font-size:13px;">点击上传头像</span>
                </div>
                <input type="file" id="cc-avatar-input" accept="image/*" style="display:none;">
                <span class="form-hint">可选，支持 PNG/JPG。最终会导出为嵌入角色数据的 PNG 图片</span>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">基本信息</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> 角色名称</label>
                        <input type="text" class="form-input" id="cc-name" placeholder="角色名称">
                    </div>
                    <div class="form-group">
                        <label class="form-label">版本</label>
                        <input type="text" class="form-input" id="cc-version" value="1.0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">创建者</label>
                    <input type="text" class="form-input" id="cc-creator" placeholder="你的名字">
                </div>
                <div class="form-group">
                    <label class="form-label">标签</label>
                    <div class="tags-input" id="cc-tags">
                        <input type="text" placeholder="输入标签后按回车...">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">创建者备注</label>
                    <textarea class="form-textarea" id="cc-creator-notes" placeholder="给使用者的备注，不会发送给 AI..." rows="2"></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">角色设定</h3>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 描述 (Description)</label>
                    <textarea class="form-textarea" id="cc-description" placeholder="角色的外貌、背景、身份等描述..." rows="6"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 性格 (Personality)</label>
                    <textarea class="form-textarea" id="cc-personality" placeholder="性格关键词和摘要..." rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">场景 (Scenario)</label>
                    <textarea class="form-textarea" id="cc-scenario" placeholder="对话发生的背景和情境..." rows="3"></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">对话设定</h3>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 开场白 (First Message)</label>
                    <textarea class="form-textarea" id="cc-first-mes" placeholder="角色开口说的第一句话..." rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">对话示例 (Message Example)</label>
                    <textarea class="form-textarea" id="cc-mes-example" placeholder="&lt;START&gt;&#10;{{user}}: 你好&#10;{{char}}: 你好呀！...&#10;&lt;START&gt;&#10;{{user}}: ...&#10;{{char}}: ..." rows="6"></textarea>
                    <span class="form-hint">使用 <code>&lt;START&gt;</code> 分隔多组对话示例</span>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">高级设定</h3>
                <div class="form-group">
                    <label class="form-label">系统提示词 (System Prompt)</label>
                    <textarea class="form-textarea" id="cc-system-prompt" placeholder="角色专属的系统提示词（覆盖全局设置）..." rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">后历史指令 (Post History Instructions)</label>
                    <textarea class="form-textarea" id="cc-post-history" placeholder="在对话历史之后追加的指令..." rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">备选开场白</label>
                    <div class="tags-input" id="cc-alt-greetings">
                        <input type="text" placeholder="输入后按回车添加...">
                    </div>
                    <span class="form-hint">可以在酒馆中切换使用不同开场白</span>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">嵌入世界书 (Character Book)</h3>
                <div class="form-group">
                    <label class="form-label">世界书名称</label>
                    <input type="text" class="form-input" id="cc-book-name" placeholder="世界书名称 (留空则不嵌入)">
                </div>
                <div id="cc-book-entries"></div>
                <button class="btn-add-entry" id="btn-add-book-entry">+ 添加世界书条目</button>
            </div>
        `;

        this._initSpecSelect();
        this._initImport();
        this._initImageUpload();
        this._initTagsInput('cc-tags');
        this._initTagsInput('cc-alt-greetings');
        this._initBookEntries();
    },

    _initSpecSelect() {
        const select = document.getElementById('cc-spec-select');
        if (select) {
            select.value = this._activeSpec;
            select.addEventListener('change', () => {
                this._activeSpec = select.value;
            });
        }
    },

    _initImport() {
        const jsonInput = document.getElementById('cc-import-json-file');
        const pngInput = document.getElementById('cc-import-png-file');
        const jsonLabel = document.getElementById('cc-import-json-label');
        const pngLabel = document.getElementById('cc-import-png-label');

        if (jsonInput) {
            jsonInput.addEventListener('change', () => {
                const file = jsonInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this._populateForm(data);
                        if (jsonLabel) jsonLabel.textContent = file.name;
                        this._showToast('角色卡 JSON 已导入');
                    } catch (err) {
                        this._showToast('导入失败：无效的 JSON 文件');
                    }
                };
                reader.readAsText(file);
            });
        }

        if (pngInput) {
            pngInput.addEventListener('change', async () => {
                const file = pngInput.files[0];
                if (!file) return;
                try {
                    const chunks = await PNGUtils.decodePNG(file);
                    const base64 = chunks.ccv3 || chunks.chara || chunks.v2;
                    if (base64) {
                        const jsonStr = atob(base64);
                        const data = JSON.parse(jsonStr);
                        this._populateForm(data);
                        if (pngLabel) pngLabel.textContent = file.name;
                        this._showToast('角色卡 PNG 已导入');
                    } else {
                        this._showToast('PNG 中未找到角色卡数据');
                    }
                } catch (err) {
                    this._showToast('导入失败：无法解析 PNG 中的角色卡数据');
                }
            });
        }
    },

    _populateForm(data) {
        const inner = data.data || data;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

        setVal('cc-name', inner.name || '');
        setVal('cc-version', inner.character_version || inner.version || '1.0');
        setVal('cc-creator', inner.creator || '');
        setVal('cc-creator-notes', inner.creator_notes || '');
        setVal('cc-description', inner.description || '');
        setVal('cc-personality', inner.personality || '');
        setVal('cc-scenario', inner.scenario || '');
        setVal('cc-first-mes', inner.first_mes || '');
        setVal('cc-mes-example', inner.mes_example || '');
        setVal('cc-system-prompt', inner.system_prompt || '');
        setVal('cc-post-history', inner.post_history_instructions || '');

        const spec = data.spec || '';
        if (spec === 'chara_card_v2') {
            this._activeSpec = 'v2';
        } else {
            this._activeSpec = 'v3';
        }
        const specSelect = document.getElementById('cc-spec-select');
        if (specSelect) specSelect.value = this._activeSpec;

        if (inner.tags && Array.isArray(inner.tags)) {
            const container = document.getElementById('cc-tags');
            inner.tags.forEach(t => this._addTag(container, t));
        }
        if (inner.alternate_greetings && Array.isArray(inner.alternate_greetings)) {
            const container = document.getElementById('cc-alt-greetings');
            inner.alternate_greetings.forEach(t => this._addTag(container, t));
        }

        if (inner.character_book) {
            setVal('cc-book-name', inner.character_book.name || '');
            const bookEntries = inner.character_book.entries || [];
            const container = document.getElementById('cc-book-entries');
            container.innerHTML = '';
            bookEntries.forEach(entry => this._addBookEntry(container, entry));
        }
    },

    _initImageUpload() {
        const preview = document.getElementById('cc-avatar-preview');
        const input = document.getElementById('cc-avatar-input');

        preview.addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.personaImage = e.target.result;
                    preview.innerHTML = `<img src="${e.target.result}" alt="avatar">`;
                };
                reader.readAsDataURL(file);
            }
        });
    },

    _initTagsInput(containerId) {
        const container = document.getElementById(containerId);
        const input = container.querySelector('input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = input.value.replace(/,/g, '').trim();
                if (value) {
                    this._addTag(container, value);
                    input.value = '';
                }
            }
            if (e.key === 'Backspace' && input.value === '') {
                const tags = container.querySelectorAll('.tag');
                if (tags.length > 0) {
                    tags[tags.length - 1].remove();
                }
            }
        });
    },

    _addTag(container, text) {
        const input = container.querySelector('input');
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${escapeHTML(text)} <span class="tag-remove">&times;</span>`;
        tag.querySelector('.tag-remove').addEventListener('click', () => tag.remove());
        container.insertBefore(tag, input);
    },

    _initBookEntries() {
        const container = document.getElementById('cc-book-entries');
        container.innerHTML = '';
        document.getElementById('btn-add-book-entry').addEventListener('click', () => {
            this._addBookEntry(container);
        });
    },

    _addBookEntry(container, data) {
        const index = container.children.length;
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-card';
        entryDiv.innerHTML = `
            <div class="entry-card-header">
                <h4>${data && data.comment ? escapeHTML(data.comment) : ('条目 #' + (index + 1))}</h4>
                <button class="btn btn-small btn-danger book-entry-remove">删除</button>
            </div>
            <div class="entry-card-content">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">关键词</label>
                        <input type="text" class="form-input book-entry-keys" value="${escapeHTML(data ? (Array.isArray(data.keys) ? data.keys.join(',') : (data.key ? (Array.isArray(data.key) ? data.key.join(',') : data.key) : '')) : '')}" placeholder="用逗号分隔多个关键词">
                    </div>
                    <div class="form-group">
                        <label class="form-label">位置</label>
                        <select class="form-select book-entry-position">
                            <option value="before_char">角色之前 (before_char)</option>
                            <option value="after_char">角色之后 (after_char)</option>
                            <option value="top_an">顶部 AN (top_an)</option>
                            <option value="bottom_an">底部 AN (bottom_an)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">内容</label>
                    <textarea class="form-textarea book-entry-content" rows="3" placeholder="触发后注入的内容...">${escapeHTML(data ? (data.content || '') : '')}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">备注</label>
                        <input type="text" class="form-input book-entry-comment" value="${escapeHTML(data ? (data.comment || '') : '')}" placeholder="备注说明">
                    </div>
                    <div class="form-group">
                        <label class="form-label">插入顺序</label>
                        <input type="number" class="form-input book-entry-order" value="${data ? (data.insertion_order || data.order || 100) : 100}" min="1">
                    </div>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="book-entry-constant">
                    <label>常量条目 (始终触发)</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="book-entry-selective">
                    <label>选择性匹配</label>
                </div>
            </div>
        `;

        if (data) {
            const posSelect = entryDiv.querySelector('.book-entry-position');
            if (posSelect && data.position) posSelect.value = data.position;
            if (data.constant) {
                const cb = entryDiv.querySelector('.book-entry-constant');
                if (cb) cb.checked = true;
            }
            if (data.selective) {
                const cb = entryDiv.querySelector('.book-entry-selective');
                if (cb) cb.checked = true;
            }
        }

        entryDiv.querySelector('.book-entry-remove').addEventListener('click', () => {
            entryDiv.remove();
            this._updateBookEntryNumbers(container);
        });

        entryDiv.querySelector('.book-entry-comment').addEventListener('input', function() {
            entryDiv.querySelector('h4').textContent = this.value || ('条目 #' + (entryDiv.parentNode ? Array.from(entryDiv.parentNode.children).indexOf(entryDiv) + 1 : 1));
        });

        container.appendChild(entryDiv);
    },

    _updateBookEntryNumbers(container) {
        const headers = container.querySelectorAll('.entry-card-header h4');
        headers.forEach((h, i) => {
            if (!h.closest('.entry-card').querySelector('.book-entry-comment').value) {
                h.textContent = '条目 #' + (i + 1);
            }
        });
    },

    _collectBookEntries() {
        const entries = [];
        const cards = document.querySelectorAll('#cc-book-entries .entry-card');
        cards.forEach(card => {
            const keysStr = card.querySelector('.book-entry-keys').value;
            entries.push({
                keys: keysStr ? keysStr.split(',').map(k => k.trim()).filter(Boolean) : [],
                content: card.querySelector('.book-entry-content').value || '',
                comment: card.querySelector('.book-entry-comment').value || '',
                constant: card.querySelector('.book-entry-constant').checked,
                selective: card.querySelector('.book-entry-selective').checked,
                insertion_order: parseInt(card.querySelector('.book-entry-order').value) || 100,
                position: card.querySelector('.book-entry-position').value || 'before_char',
                enabled: true,
                case_sensitive: false
            });
        });
        return entries;
    },

    getData() {
        const bookName = document.getElementById('cc-book-name').value.trim();
        const bookEntries = this._collectBookEntries();
        const isV2 = this._activeSpec === 'v2';

        const inner = {
            name: document.getElementById('cc-name').value || 'Unnamed',
            description: document.getElementById('cc-description').value || '',
            personality: document.getElementById('cc-personality').value || '',
            scenario: document.getElementById('cc-scenario').value || '',
            first_mes: document.getElementById('cc-first-mes').value || '',
            mes_example: document.getElementById('cc-mes-example').value || '',
            creator_notes: document.getElementById('cc-creator-notes').value || '',
            creator: document.getElementById('cc-creator').value || '',
            character_version: document.getElementById('cc-version').value || '1.0',
            tags: this._getTagsFromContainer(document.getElementById('cc-tags')),
            system_prompt: document.getElementById('cc-system-prompt').value || '',
            post_history_instructions: document.getElementById('cc-post-history').value || '',
            alternate_greetings: this._getTagsFromContainer(document.getElementById('cc-alt-greetings'))
        };

        if (bookName && bookEntries.length > 0) {
            inner.character_book = {
                name: bookName,
                description: '',
                scan_depth: 50,
                token_budget: 500,
                recursive_scanning: false,
                extensions: {},
                entries: bookEntries
            };
        }

        if (isV2) {
            return { spec: 'chara_card_v2', spec_version: '2.0', data: inner };
        }

        return {
            spec: 'chara_card_v3',
            spec_version: '3.0',
            data: inner,
            extensions: {
                world: '',
                depth_prompt: {},
                fav: false,
                talkativeness: 0,
                create_date: new Date().toISOString().split('T')[0]
            }
        };
    },

    _getTagsFromContainer(container) {
        const tags = container.querySelectorAll('.tag');
        return Array.from(tags).map(t => t.childNodes[0].textContent.trim());
    },

    loadDraft(data) {
        this._populateForm(data);
    },

    validate() {
        const errors = [];
        const name = document.getElementById('cc-name')?.value?.trim();
        const firstMes = document.getElementById('cc-first-mes')?.value?.trim();
        if (!name) errors.push('请输入角色名称');
        if (!firstMes) errors.push('请输入开场白');
        return { valid: errors.length === 0, errors };
    },

    getPreviewFiles() {
        return [
            { name: 'character_card.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    async download() {
        const data = this.getData();
        const name = (data.data ? data.data.name : data.name || 'character').replace(/\s+/g, '_');

        if (data.data && data.data.name && data.data.first_mes) {
            try {
                const pngBlob = await PNGUtils.encodePNG(data, this.personaImage, data.spec);
                DownloadUtils.downloadPNG(pngBlob, name + '.png');
                return;
            } catch (e) {
                console.error('PNG encoding failed, falling back to JSON:', e);
            }
        }

        DownloadUtils.downloadJSON(data, name + '.json');
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
    }
};


delete window.addBookEntry;
delete window.initCharacterBookEntries;
delete window.collectBookEntries;
delete window.updateBookEntryNumbers;
