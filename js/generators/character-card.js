const CharacterCardGenerator = {
    title: 'Character Card',
    defaultCard: {
        spec: 'chara_card_v3',
        spec_version: '3.0',
        data: {
            name: '',
            description: '',
            personality: '',
            scenario: '',
            first_mes: '',
            mes_example: '',
            creator_notes: '',
            creator: '',
            character_version: '1.0',
            tags: [],
            system_prompt: '',
            post_history_instructions: '',
            alternate_greetings: [],
            character_book: undefined
        }
    },

    personaImage: null,

    render(container) {
        container.innerHTML = `
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

        this._initImageUpload();
        this._initTagsInput('cc-tags');
        this._initTagsInput('cc-alt-greetings');
        initCharacterBookEntries();
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
        tag.innerHTML = `${text} <span class="tag-remove">&times;</span>`;
        tag.querySelector('.tag-remove').addEventListener('click', () => tag.remove());
        container.insertBefore(tag, input);
    },

    getData() {
        const bookName = document.getElementById('cc-book-name').value.trim();
        const bookEntries = collectBookEntries();

        const data = {
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
            data.character_book = {
                name: bookName,
                entries: bookEntries
            };
        }

        return {
            spec: 'chara_card_v3',
            spec_version: '3.0',
            data: data
        };
    },

    _getTagsFromContainer(container) {
        const tags = container.querySelectorAll('.tag');
        return Array.from(tags).map(t => t.childNodes[0].textContent.trim());
    },

    getPreviewFiles() {
        return [
            { name: 'character_card.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    async download() {
        const data = this.getData();
        const name = data.data.name.replace(/\s+/g, '_') || 'character';

        if (data.data.name && data.data.first_mes) {
            try {
                const pngBlob = await PNGUtils.encodePNG(data, this.personaImage, 'chara_card_v3');
                DownloadUtils.downloadPNG(pngBlob, `${name}.png`);
                return;
            } catch (e) {
                console.error('PNG encoding failed, falling back to JSON:', e);
            }
        }

        DownloadUtils.downloadJSON(data, `${name}.json`);
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

function initCharacterBookEntries() {
    const container = document.getElementById('cc-book-entries');
    container.innerHTML = '';
    document.getElementById('btn-add-book-entry').addEventListener('click', () => {
        addBookEntry(container);
    });
}

function addBookEntry(container, data = null) {
    const index = container.children.length;
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-card';
    entryDiv.innerHTML = `
        <div class="entry-card-header">
            <h4>条目 #${index + 1}</h4>
            <button class="btn btn-small btn-danger remove-book-entry">删除</button>
        </div>
        <div class="entry-card-content">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">关键词</label>
                    <input type="text" class="form-input book-entry-keys" value="${data ? data.keys.join(', ') : ''}" placeholder="用逗号分隔多个关键词">
                </div>
                <div class="form-group">
                    <label class="form-label">位置</label>
                    <select class="form-select book-entry-position">
                        <option value="before_char" ${data && data.position === 'before_char' ? 'selected' : ''}>角色之前 (before_char)</option>
                        <option value="after_char" ${data && data.position === 'after_char' ? 'selected' : ''}>角色之后 (after_char)</option>
                        <option value="top_an" ${data && data.position === 'top_an' ? 'selected' : ''}>顶部 AN (top_an)</option>
                        <option value="bottom_an" ${data && data.position === 'bottom_an' ? 'selected' : ''}>底部 AN (bottom_an)</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">内容</label>
                <textarea class="form-textarea book-entry-content" rows="3" placeholder="触发后注入的内容...">${data ? data.content : ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input book-entry-comment" value="${data ? (data.comment || '') : ''}" placeholder="备注说明">
                </div>
                <div class="form-group">
                    <label class="form-label">插入顺序</label>
                    <input type="number" class="form-input book-entry-order" value="${data ? (data.insertion_order || 100) : 100}" min="1">
                </div>
            </div>
            <div class="form-checkbox-group">
                <input type="checkbox" class="book-entry-constant" ${data && data.constant ? 'checked' : ''}>
                <label>常量条目 (始终触发)</label>
            </div>
            <div class="form-checkbox-group">
                <input type="checkbox" class="book-entry-selective" ${data && data.selective ? 'checked' : ''}>
                <label>选择性匹配</label>
            </div>
        </div>
    `;

    entryDiv.querySelector('.remove-book-entry').addEventListener('click', () => {
        entryDiv.remove();
        updateBookEntryNumbers(container);
    });

    container.appendChild(entryDiv);
}

function updateBookEntryNumbers(container) {
    const headers = container.querySelectorAll('.entry-card-header h4');
    headers.forEach((h, i) => { h.textContent = `条目 #${i + 1}`; });
}

function collectBookEntries() {
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
}
