const WorldInfoGenerator = {
    title: 'World Info',
    defaultWorldInfo: {
        entries: {}
    },

    entryIdCounter: 0,

    render(container) {
        container.innerHTML = `
            <div class="form-section">
                <h3 class="form-section-title">世界书信息</h3>
                <div class="form-group">
                    <label class="form-label">世界书名称</label>
                    <input type="text" class="form-input" id="wi-name" placeholder="我的世界书">
                </div>
                <div class="form-group">
                    <label class="form-label">描述</label>
                    <textarea class="form-textarea" id="wi-description" placeholder="对这个世界书的简要说明..." rows="2"></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">世界书条目</h3>
                <div id="wi-entries"></div>
                <button class="btn-add-entry" id="btn-add-wi-entry">+ 添加条目</button>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">模板库</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-small btn-secondary template-btn" data-type="character">角色模板</button>
                    <button class="btn btn-small btn-secondary template-btn" data-type="location">地点模板</button>
                    <button class="btn btn-small btn-secondary template-btn" data-type="lore">世界观模板</button>
                    <button class="btn btn-small btn-secondary template-btn" data-type="item">物品/技能模板</button>
                </div>
            </div>
        `;

        this._initTemplateButtons();
        this._initAddButton();
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

        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const template = templates[type];
                const container = document.getElementById('wi-entries');
                addWIEntry(container, template);
            });
        });
    },

    _initAddButton() {
        document.getElementById('btn-add-wi-entry').addEventListener('click', () => {
            const container = document.getElementById('wi-entries');
            addWIEntry(container);
        });
    },

    getData() {
        const entries = {};
        const cards = document.querySelectorAll('#wi-entries .entry-card');
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

        return { entries };
    },

    getPreviewFiles() {
        return [
            { name: 'world_info.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    download() {
        const name = (document.getElementById('wi-name').value || 'world_info').replace(/\s+/g, '_');
        DownloadUtils.downloadJSON(this.getData(), `${name}.json`);
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

function addWIEntry(container, template = null) {
    const id = WorldInfoGenerator.entryIdCounter++;
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-card';
    entryDiv.dataset.entryId = id;

    const keys = template ? template.keys : [];
    const content = template ? template.content : '';
    const comment = template ? template.comment : '';
    const order = template ? template.insertion_order : 100;

    entryDiv.innerHTML = `
        <div class="entry-card-header">
            <div style="display:flex;align-items:center;gap:10px;">
                <h4>${comment || `条目 #${id}`}</h4>
            </div>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-small wi-toggle-btn" style="background:var(--bg-tertiary);">收起</button>
                <button class="btn btn-small btn-danger wi-remove-btn">删除</button>
            </div>
        </div>
        <div class="entry-card-content">
            <div class="form-group">
                <label class="form-label">备注/标题</label>
                <input type="text" class="form-input wi-entry-comment" value="${WorldInfoGenerator.escapeHTML(comment)}" placeholder="条目标题/备注...">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 主关键词</label>
                    <input type="text" class="form-input wi-entry-keys" value="${keys.join(', ')}" placeholder="用逗号分隔，如：角色名, 昵称">
                </div>
                <div class="form-group">
                    <label class="form-label">辅助关键词</label>
                    <input type="text" class="form-input wi-entry-secondary-keys" value="${template && template.secondary_keys ? template.secondary_keys.join(', ') : ''}" placeholder="可选辅助过滤词">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label"><span class="required">*</span> 注入内容</label>
                <textarea class="form-textarea wi-entry-content" rows="5" placeholder="触发时注入到上下文的内容...">${WorldInfoGenerator.escapeHTML(content)}</textarea>
            </div>
            <div class="form-row-3">
                <div class="form-group">
                    <label class="form-label">插入位置</label>
                    <select class="form-select wi-entry-position">
                        <option value="before_char">角色之前</option>
                        <option value="after_char">角色之后</option>
                        <option value="top_an">顶部 AN</option>
                        <option value="bottom_an">底部 AN</option>
                        <option value="before_examples">示例之前</option>
                        <option value="after_examples">示例之后</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">插入顺序</label>
                    <input type="number" class="form-input wi-entry-order" value="${order}" min="1" max="9999">
                </div>
                <div class="form-group">
                    <label class="form-label">触发概率%</label>
                    <input type="number" class="form-input wi-entry-probability" value="100" min="0" max="100">
                </div>
            </div>
            <div class="form-row-3">
                <div class="form-group">
                    <label class="form-label">分组</label>
                    <input type="text" class="form-input wi-entry-group" placeholder="同组只触发一个">
                </div>
                <div class="form-group">
                    <label class="form-label">组权重</label>
                    <input type="number" class="form-input wi-entry-group-weight" value="100" min="1">
                </div>
                <div class="form-group">
                    <label class="form-label">触发器过滤</label>
                    <input type="text" class="form-input wi-entry-triggers" placeholder="生成类型过滤，逗号分隔">
                </div>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-constant">
                    <label>常量 (始终触发)</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-selective">
                    <label>选择性匹配</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-regex">
                    <label>使用正则表达式</label>
                </div>
                <div class="regex-hint wi-regex-hint" style="display:none;margin-top:6px;font-size:11px;color:var(--accent);background:rgba(233,69,96,0.08);padding:8px 12px;border-radius:6px;">
                    正则模式已启用。关键词将作为正则表达式匹配。<br>点击左侧「正则工具」快速测试和生成表达式。
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-case-sensitive">
                    <label>大小写敏感</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-enabled" checked>
                    <label>启用</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-group-prioritize">
                    <label>组内优先</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="wi-entry-group-scoring">
                    <label>组内评分</label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">延迟触发 (消息数)</label>
                    <input type="number" class="form-input wi-entry-delay" value="0" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">粘性 (消息数)</label>
                    <input type="number" class="form-input wi-entry-sticky" value="0" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">冷却 (消息数)</label>
                    <input type="number" class="form-input wi-entry-cooldown" value="0" min="0">
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
        entryDiv.querySelector('h4').textContent = this.value || `条目 #${id}`;
    });

    entryDiv.querySelector('.wi-entry-regex').addEventListener('change', function() {
        const hint = entryDiv.querySelector('.wi-regex-hint');
        if (hint) hint.style.display = this.checked ? '' : 'none';
    });

    container.appendChild(entryDiv);
}
