const WorldInfoGenerator = {
    title: 'World Info',
    defaultWorldInfo: {
        entries: {}
    },

    entryIdCounter: 0,

    render(container) {
        this.entryIdCounter = 0;
        container.innerHTML = `
            <div class="form-section">
                <h3 class="form-section-title">世界书信息</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> 世界书名称</label>
                        <input type="text" class="form-input" id="wi-name" placeholder="我的世界书">
                    </div>
                    <div class="form-group">
                        <label class="form-label">扫描深度</label>
                        <input type="number" class="form-input" id="wi-scan-depth" value="50" min="1" max="999">
                        <span class="form-hint">每次对话扫描的历史消息深度</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Token 预算</label>
                        <input type="number" class="form-input" id="wi-token-budget" value="500" min="0" max="9999">
                        <span class="form-hint">世界书可用的最大 Token 数。0=无限制</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">描述</label>
                        <textarea class="form-textarea" id="wi-description" placeholder="对这个世界书的简要说明..." rows="2"></textarea>
                    </div>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:8px;">
                    <div class="form-checkbox-group">
                        <input type="checkbox" id="wi-recursive">
                        <label>递归扫描</label>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h3 class="form-section-title" style="margin:0;">世界书条目</h3>
                    <button class="btn btn-small btn-primary" id="btn-add-wi-entry">+ 添加条目</button>
                </div>
                <div id="wi-entries"></div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">模板库</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-small btn-secondary wi-template-btn" data-type="character">角色模板</button>
                    <button class="btn btn-small btn-secondary wi-template-btn" data-type="location">地点模板</button>
                    <button class="btn btn-small btn-secondary wi-template-btn" data-type="lore">世界观模板</button>
                    <button class="btn btn-small btn-secondary wi-template-btn" data-type="item">物品/技能模板</button>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">导入世界书</h3>
                <div style="display:flex;gap:10px;align-items:center;">
                    <label class="btn btn-secondary" style="cursor:pointer;">
                        <span id="wi-import-label">选择 world_info.json 文件</span>
                        <input type="file" id="wi-import-file" accept=".json" style="display:none;">
                    </label>
                    <span class="form-hint">导入已有 SillyTavern 世界书 JSON 进行编辑</span>
                </div>
            </div>
        `;

        this._initTemplateButtons();
        this._initAddButton();
        this._initImport();
    },

    _initTemplateButtons() {
        const templates = {
            character: {
                keys: ['角色名'],
                content: '【角色名】的详细设定：\n- 外貌：\n- 性格：\n- 背景故事：\n- 能力/技能：\n- 与其他角色的关系：',
                comment: '角色模板',
                insertion_order: 100
            },
            location: {
                keys: ['地点名'],
                content: '【地点名】的描述：\n- 地理位置：\n- 环境氛围：\n- 建筑风格：\n- 重要设施：\n- 历史背景：',
                comment: '地点模板',
                insertion_order: 100
            },
            lore: {
                keys: ['世界观'],
                content: '世界观设定：\n- 时代背景：\n- 势力分布：\n- 魔法/科技体系：\n- 社会结构：\n- 重要历史事件：',
                comment: '世界观模板',
                insertion_order: 100
            },
            item: {
                keys: ['物品名'],
                content: '【物品/技能名】的说明：\n- 外观/形态：\n- 功能/效果：\n- 来源/获取方式：\n- 使用限制：\n- 相关传说：',
                comment: '物品技能模板',
                insertion_order: 100
            }
        };

        document.querySelectorAll('.wi-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const template = templates[type];
                const container = document.getElementById('wi-entries');
                this._addWIEntry(container, template);
            });
        });
    },

    _initAddButton() {
        const btn = document.getElementById('btn-add-wi-entry');
        if (btn) {
            btn.addEventListener('click', () => {
                const container = document.getElementById('wi-entries');
                this._addWIEntry(container);
            });
        }
    },

    _initImport() {
        const fileInput = document.getElementById('wi-import-file');
        const label = document.getElementById('wi-import-label');
        if (!fileInput) return;

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.name) {
                        const el = document.getElementById('wi-name');
                        if (el) el.value = data.name;
                    }
                    if (data.description) {
                        const el = document.getElementById('wi-description');
                        if (el) el.value = data.description;
                    }
                    if (data.scan_depth != null) {
                        const el = document.getElementById('wi-scan-depth');
                        if (el) el.value = data.scan_depth;
                    }
                    if (data.token_budget != null) {
                        const el = document.getElementById('wi-token-budget');
                        if (el) el.value = data.token_budget;
                    }
                    if (data.recursive_scanning) {
                        const el = document.getElementById('wi-recursive');
                        if (el) el.checked = true;
                    }
                    if (label) label.textContent = file.name;

                    const entries = data.entries || {};
                    const container = document.getElementById('wi-entries');
                    if (container) {
                        container.innerHTML = '';
                        for (const [id, entry] of Object.entries(entries)) {
                            this._addWIEntry(container, entry);
                        }
                    }
                    window.showToast('世界书已导入');
                } catch (err) {
                    window.showToast('导入失败：无效的 JSON 文件');
                }
            };
            reader.readAsText(file);
        });
    },

    _addWIEntry(container, template) {
        const id = ++this.entryIdCounter;
        const order = (template && template.insertion_order) ? template.insertion_order : 100;
        const keysDefault = (template && template.keys) ? template.keys.join(',') : '';
        const contentDefault = (template && template.content) || '';
        const commentDefault = (template && template.comment) || '';

        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-card wi-entry';
        entryDiv.dataset.entryId = id;

        entryDiv.innerHTML = `
            <div class="entry-card-header">
                <h4>${commentDefault || '条目 #' + id}</h4>
                <div>
                    <button class="btn btn-small btn-secondary wi-toggle-btn">展开</button>
                    <button class="btn btn-small btn-danger wi-remove-btn">删除</button>
                </div>
            </div>
            <div class="entry-card-content">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">主关键词</label>
                        <input type="text" class="form-input wi-entry-keys" value="${escapeHTML(Array.isArray(template?.key) ? template.key.join(',') : (template?.key || keysDefault))}" placeholder="触发词，逗号分隔">
                    </div>
                    <div class="form-group">
                        <label class="form-label">辅助关键词</label>
                        <input type="text" class="form-input wi-entry-secondary-keys" value="${escapeHTML(Array.isArray(template?.secondary_keys) ? template.secondary_keys.join(',') : (template?.secondary_keys || ''))}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input wi-entry-comment" value="${escapeHTML(template?.comment || commentDefault)}" placeholder="条目备注（会显示在标题栏）">
                </div>
                <div class="form-group">
                    <label class="form-label">内容</label>
                    <textarea class="form-textarea wi-entry-content" rows="5" placeholder="条目内容...">${escapeHTML(template?.content || contentDefault)}</textarea>
                </div>
                <div class="form-row-3">
                    <div class="form-group">
                        <label class="form-label">插入位置</label>
                        <select class="form-select wi-entry-position">
                            <option value="before_char" ${template?.position === 'before_char' ? 'selected' : ''}>角色之前</option>
                            <option value="after_char" ${template?.position === 'after_char' ? 'selected' : ''}>角色之后</option>
                            <option value="top_an" ${template?.position === 'top_an' ? 'selected' : ''}>顶部 AN</option>
                            <option value="bottom_an" ${template?.position === 'bottom_an' ? 'selected' : ''}>底部 AN</option>
                            <option value="before_examples" ${template?.position === 'before_examples' ? 'selected' : ''}>示例之前</option>
                            <option value="after_examples" ${template?.position === 'after_examples' ? 'selected' : ''}>示例之后</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">插入顺序</label>
                        <input type="number" class="form-input wi-entry-order" value="${template?.insertion_order || order}" min="1" max="9999">
                    </div>
                    <div class="form-group">
                        <label class="form-label">触发概率%</label>
                        <input type="number" class="form-input wi-entry-probability" value="${template?.probability || 100}" min="0" max="100">
                    </div>
                </div>
                <div class="form-row-3">
                    <div class="form-group">
                        <label class="form-label">分组</label>
                        <input type="text" class="form-input wi-entry-group" value="${escapeHTML(template?.group || '')}" placeholder="同组只触发一个">
                    </div>
                    <div class="form-group">
                        <label class="form-label">组权重</label>
                        <input type="number" class="form-input wi-entry-group-weight" value="${template?.group_weight || 100}" min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">触发器过滤</label>
                        <input type="text" class="form-input wi-entry-triggers" value="${escapeHTML(Array.isArray(template?.triggers) ? template.triggers.join(',') : (template?.triggers || ''))}" placeholder="生成类型过滤，逗号分隔">
                    </div>
                </div>
                <div style="display:flex;gap:16px;flex-wrap:wrap;">
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-constant" ${template?.constant ? 'checked' : ''}>
                        <label>常量 (始终触发)</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-selective" ${template?.selective ? 'checked' : ''}>
                        <label>选择性匹配</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-regex" ${template?.use_regex ? 'checked' : ''}>
                        <label>使用正则表达式</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-case-sensitive" ${template?.case_sensitive ? 'checked' : ''}>
                        <label>大小写敏感</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-enabled" ${template?.enabled !== false ? 'checked' : ''}>
                        <label>启用</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-group-prioritize" ${template?.group_prioritize ? 'checked' : ''}>
                        <label>组内优先</label>
                    </div>
                    <div class="form-checkbox-group">
                        <input type="checkbox" class="wi-entry-group-scoring" ${template?.group_scoring ? 'checked' : ''}>
                        <label>组内评分</label>
                    </div>
                </div>
                <div class="regex-hint wi-regex-hint" style="display:${template?.use_regex ? '' : 'none'};margin-top:6px;font-size:11px;color:var(--accent);background:rgba(233,69,96,0.08);padding:8px 12px;border-radius:6px;">
                    正则模式已启用。关键词将作为正则表达式匹配。<br>点击左侧「正则工具」快速测试和生成表达式。
                </div>
                <div class="form-row" style="margin-top:12px;">
                    <div class="form-group">
                        <label class="form-label">延迟触发 (消息数)</label>
                        <input type="number" class="form-input wi-entry-delay" value="${template?.delay || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">粘性 (消息数)</label>
                        <input type="number" class="form-input wi-entry-sticky" value="${template?.sticky || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">冷却 (消息数)</label>
                        <input type="number" class="form-input wi-entry-cooldown" value="${template?.cooldown || 0}" min="0">
                    </div>
                </div>
            </div>
        `;

        entryDiv.querySelector('.wi-remove-btn').addEventListener('click', () => {
            entryDiv.remove();
        });

        entryDiv.querySelector('.wi-toggle-btn').addEventListener('click', function() {
            const content = entryDiv.querySelector('.entry-card-content');
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? '' : 'none';
            this.textContent = isCollapsed ? '收起' : '展开';
        });

        entryDiv.querySelector('.wi-entry-comment').addEventListener('input', function() {
            entryDiv.querySelector('h4').textContent = this.value || ('条目 #' + id);
        });

        entryDiv.querySelector('.wi-entry-regex').addEventListener('change', function() {
            const hint = entryDiv.querySelector('.wi-regex-hint');
            if (hint) hint.style.display = this.checked ? '' : 'none';
        });

        container.appendChild(entryDiv);
    },

    getData() {
        const entries = {};
        const cards = document.querySelectorAll('#wi-entries .wi-entry');
        cards.forEach(card => {
            const id = card.dataset.entryId;
            const keysStr = card.querySelector('.wi-entry-keys').value;
            const secondaryKeysStr = card.querySelector('.wi-entry-secondary-keys').value;
            const groupStr = card.querySelector('.wi-entry-group').value;
            const triggerStr = card.querySelector('.wi-entry-triggers').value;

            entries[id] = {
                uid: parseInt(id),
                key: keysStr ? keysStr.split(',').map(k => k.trim()).filter(Boolean) : [],
                secondary_keys: secondaryKeysStr ? secondaryKeysStr.split(',').map(k => k.trim()).filter(Boolean) : [],
                comment: card.querySelector('.wi-entry-comment').value || '',
                content: card.querySelector('.wi-entry-content').value || '',
                constant: card.querySelector('.wi-entry-constant').checked,
                selective: card.querySelector('.wi-entry-selective').checked,
                insertion_order: parseInt(card.querySelector('.wi-entry-order').value) || 100,
                enabled: card.querySelector('.wi-entry-enabled').checked,
                position: card.querySelector('.wi-entry-position').value || 'before_char',
                case_sensitive: card.querySelector('.wi-entry-case-sensitive').checked,
                use_regex: card.querySelector('.wi-entry-regex').checked,
                probability: parseInt(card.querySelector('.wi-entry-probability').value) || 100,
                group: groupStr.trim(),
                group_weight: parseInt(card.querySelector('.wi-entry-group-weight').value) || 100,
                group_prioritize: card.querySelector('.wi-entry-group-prioritize').checked,
                group_scoring: card.querySelector('.wi-entry-group-scoring').checked,
                automation_id: '',
                character_filter: [],
                character_filter_exclude: false,
                tags_filter: [],
                tags_filter_exclude: false,
                triggers: triggerStr ? triggerStr.split(',').map(t => t.trim()).filter(Boolean) : [],
                additional_matching: [],
                vectorized: false,
                delay: parseInt(card.querySelector('.wi-entry-delay').value) || 0,
                sticky: parseInt(card.querySelector('.wi-entry-sticky').value) || 0,
                cooldown: parseInt(card.querySelector('.wi-entry-cooldown').value) || 0,
                outlet_name: ''
            };
        });

        return {
            name: document.getElementById('wi-name')?.value || 'World Info',
            description: document.getElementById('wi-description')?.value || '',
            scan_depth: parseInt(document.getElementById('wi-scan-depth')?.value) || 50,
            token_budget: parseInt(document.getElementById('wi-token-budget')?.value) || 500,
            recursive_scanning: document.getElementById('wi-recursive')?.checked || false,
            entries
        };
    },

    getPreviewFiles() {
        return [
            { name: 'world_info.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    download() {
        const name = (document.getElementById('wi-name')?.value || 'world_info').replace(/\s+/g, '_');
        DownloadUtils.downloadJSON(this.getData(), name + '.json');
    },

    validate() {
        const errors = [];
        const entries = document.querySelectorAll('#wi-entries .wi-entry');
        if (entries.length === 0) {
            errors.push('请至少添加一条世界书条目');
        }
        return { valid: errors.length === 0, errors };
    },




    loadDraft(data) {
        if (data.name) {
            const el = document.getElementById('wi-name');
            if (el) el.value = data.name;
        }
        if (data.description) {
            const el = document.getElementById('wi-description');
            if (el) el.value = data.description;
        }
        if (data.scan_depth != null) {
            const el = document.getElementById('wi-scan-depth');
            if (el) el.value = data.scan_depth;
        }
        if (data.token_budget != null) {
            const el = document.getElementById('wi-token-budget');
            if (el) el.value = data.token_budget;
        }
        if (data.recursive_scanning) {
            const el = document.getElementById('wi-recursive');
            if (el) el.checked = true;
        }
        const entries = data.entries || {};
        const container = document.getElementById('wi-entries');
        if (container) {
            container.innerHTML = '';
            this.entryIdCounter = 0;
            for (const [id, entry] of Object.entries(entries)) {
                this._addWIEntry(container, entry);
            }
        }
    }
};

// Backward compat - remove old global function
delete window.addWIEntry;
