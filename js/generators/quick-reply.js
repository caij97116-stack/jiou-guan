const QuickReplyGenerator = {
    title: 'Quick Reply',

    render(container) {
        container.innerHTML = `
            <div class="form-section">
                <h3 class="form-section-title">快速回复集信息</h3>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 名称</label>
                    <input type="text" class="form-input" id="qr-name" placeholder="我的快速回复集">
                </div>
                <div class="form-group">
                    <label class="form-label">描述</label>
                    <textarea class="form-textarea" id="qr-description" placeholder="描述这个快速回复集的用途..." rows="2"></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">STscript 命令参考</h3>
                <div style="background:var(--bg-card);border-radius:var(--radius);padding:16px;font-size:12px;line-height:1.8;max-height:200px;overflow-y:auto;">
                    <div style="margin-bottom:8px;color:var(--accent);font-weight:600;">消息操作</div>
                    <div><code>/send</code> - 发送消息</div>
                    <div><code>/sendas name=Name</code> - 以指定角色发送</div>
                    <div><code>/sys</code> - 发送系统消息</div>
                    <div><code>/echo</code> - 回显文本（仅自己可见）</div>
                    <div><code>/comment</code> - 添加注释</div>
                    <div><code>/narvin</code> - 注入旁白</div>
                    <div style="margin:8px 0;color:var(--accent);font-weight:600;">上下文操作</div>
                    <div><code>/inject id=task [position=chat] [depth=0] [ephemeral=true] ...</code> - 注入提示</div>
                    <div><code>/gen</code> - 触发 AI 生成</div>
                    <div><code>/continue</code> - 继续生成</div>
                    <div><code>/abort</code> - 中止生成</div>
                    <div><code>/cut</code> - 剪切到该点</div>
                    <div style="margin:8px 0;color:var(--accent);font-weight:600;">变量与控制流</div>
                    <div><code>/setvar key=name value</code> - 设置变量</div>
                    <div><code>/getvar name</code> - 获取变量</div>
                    <div><code>/if left=... rule=eq right=... else="..." ...</code> - 条件判断</div>
                    <div><code>{{pipe}}</code>, <code>{{arg}}</code> - 传递管道和参数</div>
                    <div><code>{{char}}</code> / <code>{{user}}</code> - 角色名/用户名</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">快速回复条目</h3>
                <div id="qr-entries"></div>
                <button class="btn-add-entry" id="btn-add-qr-entry">+ 添加条目</button>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">快捷模板</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="greeting">开场问候</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="describe">描述场景</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="narration">系统旁白</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="inject">注入提示</button>
                    <button class="btn btn-small btn-secondary qr-template-btn" data-template="reroll">重新生成</button>
                </div>
            </div>
        `;

        this._initTemplates();
        this._initAddButton();
    },

    _initTemplates() {
        const templates = {
            greeting: {
                label: '问候',
                content: '/sys [系统提示] 角色 {{char}} 热情地向 {{user}} 打招呼。\n/sendas name={{char}} 你好呀，{{user}}！今天过得怎么样？',
                isUser: false
            },
            describe: {
                label: '场景描述',
                content: '/sys [场景] {{user}} 环顾四周，仔细观察着周围的环境。\n/gen',
                isUser: false
            },
            narration: {
                label: '旁白',
                content: '/narvin 夜幕降临，街道上的灯光逐渐亮起，城市进入了另一种节奏。\n/gen',
                isUser: false
            },
            inject: {
                label: '注入提示',
                content: '/inject id=reminder position=chat depth=0 ephemeral=true\n[提醒] 请以第一人称视角回复，使用生动的描述性语言。\n/gen',
                isUser: false
            },
            reroll: {
                label: '重新生成',
                content: '/sys [重试] 请重新生成回答，这次更加详细和生动。\n/continue',
                isUser: false
            }
        };

        document.querySelectorAll('.qr-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = templates[btn.dataset.template];
                const container = document.getElementById('qr-entries');
                addQREntry(container, template);
            });
        });
    },

    _initAddButton() {
        document.getElementById('btn-add-qr-entry').addEventListener('click', () => {
            const container = document.getElementById('qr-entries');
            addQREntry(container);
        });
    },

    getData() {
        const entries = [];
        const cards = document.querySelectorAll('#qr-entries .entry-card');
        cards.forEach((card, i) => {
            entries.push({
                id: i,
                label: card.querySelector('.qr-entry-label').value || `Quick Reply ${i + 1}`,
                content: card.querySelector('.qr-entry-content').value || '',
                isUser: card.querySelector('.qr-entry-is-user').checked,
                enabled: card.querySelector('.qr-entry-enabled').checked,
                icon: card.querySelector('.qr-entry-icon').value || ''
            });
        });

        return {
            name: document.getElementById('qr-name').value || 'My Quick Replies',
            description: document.getElementById('qr-description').value || '',
            entries: entries
        };
    },

    getPreviewFiles() {
        return [
            { name: 'quick_replies.json', content: JSON.stringify(this.getData(), null, 2), lang: 'json' }
        ];
    },

    download() {
        const name = (document.getElementById('qr-name').value || 'quick_replies').replace(/\s+/g, '_');
        DownloadUtils.downloadJSON(this.getData(), `${name}.json`);
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

function addQREntry(container, template = null) {
    const index = container.children.length;
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-card';

    entryDiv.innerHTML = `
        <div class="entry-card-header">
            <h4>${template ? template.label : '条目 #' + (index + 1)}</h4>
            <button class="btn btn-small btn-danger qr-remove-btn">删除</button>
        </div>
        <div class="entry-card-content">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">标签</label>
                    <input type="text" class="form-input qr-entry-label" value="${template ? template.label : ''}" placeholder="按钮显示的文字">
                </div>
                <div class="form-group">
                    <label class="form-label">图标 (可选)</label>
                    <input type="text" class="form-input qr-entry-icon" placeholder="emoji 或 FontAwesome 类名">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">STscript 内容</label>
                <textarea class="form-textarea qr-entry-content" rows="6" style="font-family:'Fira Code','Consolas',monospace;font-size:13px;" placeholder="输入 STscript 命令...">${template ? template.content : ''}</textarea>
            </div>
            <div style="display:flex;gap:16px;">
                <div class="form-checkbox-group">
                    <input type="checkbox" class="qr-entry-is-user" ${template && template.isUser ? 'checked' : ''}>
                    <label>用户消息模式</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="qr-entry-enabled" checked>
                    <label>启用</label>
                </div>
            </div>
        </div>
    `;

    entryDiv.querySelector('.qr-remove-btn').addEventListener('click', () => {
        entryDiv.remove();
    });

    entryDiv.querySelector('.qr-entry-label').addEventListener('input', function() {
        entryDiv.querySelector('h4').textContent = this.value || '条目 #' + (index + 1);
    });

    container.appendChild(entryDiv);
}
