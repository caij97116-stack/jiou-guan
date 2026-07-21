const ThemeAIGenerator = {
    title: '主题 AI 助手',

    SYSPROMPT: `你是一个 SillyTavern (ST) 前端主题 CSS 专家。用户会用自然语言描述想要的主题效果，你生成纯 CSS 代码。

## ST 主题机制
ST 主题通过 :root 中的 CSS 变量和自定义 CSS 规则实现。ST 设置面板提供基础选项，高级效果需在 Custom CSS 中注入。

## ST 官方 CSS 变量 (必须优先使用)

### 颜色体系
--SmartThemeBodyColor          主文字颜色
--SmartThemeEmColor            斜体/强调/次要文字
--SmartThemeUnderlineColor     下划线颜色
--SmartThemeQuoteColor         引用文字颜色
--SmartThemeBlurTintColor      UI 面板 / 全局模糊底色
--SmartThemeChatTintColor      聊天区背景底色
--SmartThemeUserMesBlurTintColor  用户消息气泡底色 (需配合 body.bubblechat)
--SmartThemeBotMesBlurTintColor   AI 消息气泡底色 (需配合 body.bubblechat)
--SmartThemeShadowColor        元素阴影颜色
--SmartThemeBorderColor        所有边框颜色

### 尺寸/布局
--blurStrength                 模糊强度 (px 数值, 默认 10)
--shadowWidth                  阴影宽度 (px 数值)
--fontScale                    字体缩放比例 (1.0 = 默认)
--mainFontFamily               聊天字体
--mainFontSize                 由 calc(var(--fontScale) * 15px) 计算
--sheldWidth                   聊天区宽度 (vw)
--avatar-base-width            头像宽度 (px)
--avatar-base-height           头像高度 (px)
--avatar-base-border-radius-rounded  圆角头像半径 (px)
--animation-duration           标准动画时长 (ms, 默认 125)
--animation-duration-slow      慢速动画时长 (ms, 默认 250)

### 内部变量 (可在自定义 CSS 中覆盖)
--transparent                全透明
--black30a                  30% 黑透明
--black70a                  70% 黑透明
--white20a                  20% 白透明
--grey10-75                 75% 灰
--fullred                   纯红
--crimson70a                70% 深红
--okGreen70a                70% 成功绿
--golden                    金色
--warning                   警告色
--active                    高亮色
--interactable-outline-color  可聚焦元素轮廓色
--reasoning-body-color      推理文字颜色
--crimson-hover            深红悬停
--progColor / --progFlashColor  STscript 进度动画色

## 核心 CSS 选择器速查

### 消息系统
.mes                            消息容器
.mes[is_user="true"]            用户消息
.mes[is_system="true"]          系统消息
.last_mes / .smallSysMes        最后一条/紧凑系统
.mes_text / .mes_block          消息正文/内容区
.mes_reasoning                  推理/思维链文字
.ch_name / .mes_bias            角色名/附注
.mesAvatarWrapper               头像包裹层

### 头像
.avatar / .avatar img            头像/头像图片
.avatar.interactable             可交互头像
.avatars_inline                  内联头像
.zoomed_avatar / .zoomed_avatar_container  放大头像
img.expression                   角色表达图

### 布局
#chat                            聊天区
#sheld                           主外壳
#top-bar                         顶栏
#send_form / #send_textarea      发送表单
#left-nav-panel / #right-nav-panel  左/右面板
.drawer / .drawer-content / .closedDrawer  抽屉
.drawer-content.openDrawer       展开的抽屉

### 交互
.menu_button / .menu_button_icon   按钮
.menu_button:hover                 按钮悬停
.menu_button_default / .popup-button-ok  弹窗按钮
.interactable / .checkbox_label    可聚焦/复选框
.neo-range-slider / .range-block   滑块
.drag-grabber / .pull-tab          拖拽

### Popup / 弹窗
.popup / .popup-body / .popup-content   弹窗
.popup[opening] / .popup[open] / .popup[closing]  状态
.popup::backdrop                   遮罩层
.popup .popup-button-close         关闭按钮

### 滑动/操作
.swipe_left / .swipe_right         左右滑动
.swipes-counter                    滑动计数
.mes_button / .mes_bookmark        消息按钮/书签

### Body 状态类
body.big-avatars                   大头像模式
body.no-blur                       无模糊
body.movingUI                      拖拽中
body.waifuMode                     Waifu 模式
body.bubblechat                    气泡聊天气泡
body[data-generating="true"]       生成中
body[data-stscript-style="dark"]   脚本暗色
body[data-stscript-style="light"]  脚本亮色

### 代码/引用
code, pre, .code-block            代码块
blockquote                         引用块
::selection                        选中文字

### 滚动条
::-webkit-scrollbar                滚动条整体
::-webkit-scrollbar-thumb          滚动条滑块
::-webkit-scrollbar-thumb:hover    滑块悬停
::-webkit-scrollbar-track          滚动条轨道

### 动画关键帧 (可覆盖)
@keyframes pop-in / pop-out        弹窗缩放
@keyframes fade-in / fade-out      淡入淡出
@keyframes flash / pulse           闪烁/脉冲
@keyframes infinite-spinning       旋转
@keyframes slide                   消息滑入

### 移动端
@media screen and (max-width: 1000px)  平板/宽手机
@media screen and (max-width: 450px)   窄手机
@media screen and (orientation: landscape)  横屏

### WCAG 访问性提示
- 正文对比度 ≥ 4.5:1
- 大文字对比度 ≥ 3:1
- 不要只用颜色传达信息
- 保持键盘可聚焦元素可见

## 输出规则

1. **必须输出完整的 :root 块**，包含所有修改的 ST 变量
2. **只输出 CSS 代码**，用 Markdown 代码块包裹 \`\`\`css ... \`\`\`
3. 如果用户只描述一种感觉/风格，自由发挥创意
4. 对于动画效果，使用 CSS transition/animation + @keyframes
5. 对于背景图片切换，使用 background-image + transition
6. 用户消息气泡、AI 气泡必须通过 body class 配合样式实现
7. 代码注释用中文标注每个区块的用途
8. 最后附一段简短说明（2-3 句话）解释关键设计选择`,

    state: {
        apiConfig: {
            endpoint: '',
            apiKey: '',
            model: ''
        },
        presets: [],
        messages: [],
        generatedCSS: '',
        isLoading: false
    },

    _loadState() {
        try {
            const saved = localStorage.getItem('jiou_theme_ai_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.apiConfig = parsed.apiConfig || this.state.apiConfig;
                this.state.presets = parsed.presets || [];
                this.state.messages = parsed.messages || [];
                this.state.generatedCSS = parsed.generatedCSS || '';
            }
        } catch (e) {}
    },

    _saveState() {
        try {
            localStorage.setItem('jiou_theme_ai_state', JSON.stringify({
                apiConfig: this.state.apiConfig,
                presets: this.state.presets,
                messages: this.state.messages,
                generatedCSS: this.state.generatedCSS
            }));
        } catch (e) {}
    },

    render(container) {
        this._loadState();

        container.innerHTML = `
<div class="themai-container">
    <div class="themai-header">
        <div class="themai-header-left">
            <button class="btn btn-small btn-secondary" id="themai-btn-config">
                <span class="themai-icon">&#9881;</span> API 配置
            </button>
            <button class="btn btn-small btn-secondary" id="themai-btn-new-chat">新对话</button>
        </div>
        <div class="themai-header-right">
            <span class="themai-preset-selector" id="themai-preset-selector"></span>
        </div>
    </div>

    <div class="themai-config-panel hidden" id="themai-config-panel">
        <div class="form-section">
            <h3 class="form-section-title">API 配置</h3>
            <div class="form-row">
                <div class="form-group" style="flex:2;">
                    <label class="form-label">API 端点 URL</label>
                    <input type="text" class="form-input" id="themai-endpoint"
                        placeholder="https://api.openai.com/v1" value="${this._escAttr(this.state.apiConfig.endpoint)}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:2;">
                    <label class="form-label">API Key</label>
                    <input type="password" class="form-input" id="themai-apikey"
                        placeholder="sk-..." value="${this._escAttr(this.state.apiConfig.apiKey)}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">模型</label>
                    <div style="display:flex;gap:6px;">
                        <input type="text" class="form-input" id="themai-model"
                            placeholder="gpt-4o" value="${this._escAttr(this.state.apiConfig.model)}">
                        <button class="btn btn-small btn-secondary" id="themai-btn-fetch-models"
                            style="white-space:nowrap;">拉取模型</button>
                    </div>
                    <select class="form-select hidden" id="themai-model-select" size="1"
                        style="margin-top:4px;"></select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">预设管理</label>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input type="text" class="form-input" id="themai-preset-name"
                            placeholder="预设名称" style="flex:1;">
                        <button class="btn btn-small btn-primary" id="themai-btn-save-preset">保存预设</button>
                    </div>
                    <div id="themai-preset-list" style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="themai-chat" id="themai-chat">
        <div class="themai-welcome" id="themai-welcome">
            <div class="themai-welcome-icon">&#9881;</div>
            <h2>ST 主题 AI 助手</h2>
            <p>用自然语言描述你想要的主题效果，AI 会生成对应的 CSS 代码</p>
            <div class="themai-suggestions">
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个暗色赛博朋克风格主题，带霓虹光晕和动态扫描线效果">赛博朋克霓虹</button>
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个日系樱花风格主题，柔和的粉色系">&#x1F338; 日系樱花</button>
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个透明玻璃拟态风格主题，消息带模糊毛玻璃效果">玻璃拟态</button>
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个深色OLED主题，纯黑背景配上低饱和彩色强调">OLED 暗色</button>
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个复古CRT主题，带扫描线和轻微失真效果">CRT 复古</button>
                <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个游戏风格主题，切换角色时切换背景图片，加入过渡动画">游戏主题</button>
            </div>
        </div>
    </div>

    <div class="themai-input-area" id="themai-input-area">
        <div class="themai-output-bar hidden" id="themai-output-bar">
            <span id="themai-css-status"></span>
            <div>
                <button class="btn btn-small btn-primary" id="themai-btn-copy-css">复制 CSS</button>
                <button class="btn btn-small btn-secondary" id="themai-btn-download-css">下载 CSS</button>
            </div>
        </div>
        <div class="themai-input-row">
            <textarea class="form-textarea themai-input" id="themai-input"
                rows="2" placeholder="描述你想要的主题效果..."
                style="resize:none;min-height:44px;"></textarea>
            <button class="btn btn-primary themai-send-btn" id="themai-btn-send"
                style="align-self:flex-end;">
                <span id="themai-send-text">发送</span>
                <span id="themai-send-spinner" class="hidden">发送中...</span>
            </button>
        </div>
    </div>
</div>`;

        this._renderPresetList();
        this._renderMessages();
        this._renderPresetSelector();
        this._bindEvents();
        this._updateOutputBar();
    },

    _escAttr(s) {
        return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    _escHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    _bindEvents() {
        const cfgPanel = document.getElementById('themai-config-panel');
        document.getElementById('themai-btn-config').addEventListener('click', () => {
            cfgPanel.classList.toggle('hidden');
        });

        document.getElementById('themai-btn-new-chat').addEventListener('click', () => {
            this.state.messages = [];
            this.state.generatedCSS = '';
            this._saveState();
            this._renderMessages();
            this._updateOutputBar();
            document.getElementById('themai-welcome')?.classList.remove('hidden');
        });

        document.getElementById('themai-btn-fetch-models').addEventListener('click', () => {
            this._fetchModels();
        });

        document.getElementById('themai-model-select').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('themai-model').value = e.target.value;
            }
        });

        document.getElementById('themai-btn-save-preset').addEventListener('click', () => {
            this._savePreset();
        });

        document.getElementById('themai-btn-send').addEventListener('click', () => {
            this._handleSend();
        });

        document.getElementById('themai-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSend();
            }
        });

        document.getElementById('themai-btn-copy-css').addEventListener('click', () => {
            this._copyCSS();
        });

        document.getElementById('themai-btn-download-css').addEventListener('click', () => {
            this.download();
        });

        document.querySelectorAll('.themai-sugg').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('themai-input').value = btn.dataset.text;
                this._handleSend();
            });
        });
    },

    async _fetchModels() {
        const endpoint = document.getElementById('themai-endpoint').value.trim();
        const apiKey = document.getElementById('themai-apikey').value.trim();

        if (!endpoint || !apiKey) {
            window.showToast('请先填写 API 端点和 Key');
            return;
        }

        const btn = document.getElementById('themai-btn-fetch-models');
        btn.disabled = true;
        btn.textContent = '拉取中...';

        try {
            const endpointClean = endpoint.replace(/\/+$/, '');
            const resp = await fetch(endpointClean + '/models', {
                headers: { 'Authorization': 'Bearer ' + apiKey }
            });

            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status + ' ' + resp.statusText);
            }

            const data = await resp.json();
            const models = (data.data || []).map(m => m.id).sort();

            if (models.length === 0) {
                window.showToast('未获取到模型列表');
                return;
            }

            const select = document.getElementById('themai-model-select');
            select.classList.remove('hidden');
            select.innerHTML = '<option value="">-- 选择模型 --</option>' +
                models.map(m => '<option value="' + this._escAttr(m) + '">' + this._escHtml(m) + '</option>').join('');

            window.showToast('已获取 ' + models.length + ' 个模型');
        } catch (err) {
            window.showToast('拉取失败: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.textContent = '拉取模型';
        }
    },

    _savePreset() {
        const nameInput = document.getElementById('themai-preset-name');
        const name = nameInput.value.trim();
        if (!name) { window.showToast('请输入预设名称'); return; }

        const config = {
            name: name,
            endpoint: document.getElementById('themai-endpoint').value.trim(),
            apiKey: document.getElementById('themai-apikey').value.trim(),
            model: document.getElementById('themai-model').value.trim()
        };

        const idx = this.state.presets.findIndex(p => p.name === name);
        if (idx >= 0) {
            this.state.presets[idx] = config;
        } else {
            this.state.presets.push(config);
        }

        this._saveState();
        this._renderPresetList();
        this._renderPresetSelector();
        nameInput.value = '';
        window.showToast('预设「' + name + '」已保存');
    },

    _loadPreset(index) {
        const preset = this.state.presets[index];
        if (!preset) return;

        document.getElementById('themai-endpoint').value = preset.endpoint || '';
        document.getElementById('themai-apikey').value = preset.apiKey || '';
        document.getElementById('themai-model').value = preset.model || '';
        this.state.apiConfig = {
            endpoint: preset.endpoint || '',
            apiKey: preset.apiKey || '',
            model: preset.model || ''
        };
        this._saveState();
        this._renderPresetSelector();
        window.showToast('已切换到预设「' + preset.name + '」');
    },

    _deletePreset(index) {
        const preset = this.state.presets[index];
        if (!preset) return;
        this.state.presets.splice(index, 1);
        this._saveState();
        this._renderPresetList();
        this._renderPresetSelector();
        window.showToast('预设「' + preset.name + '」已删除');
    },

    _renderPresetList() {
        const list = document.getElementById('themai-preset-list');
        if (!list) return;

        if (this.state.presets.length === 0) {
            list.innerHTML = '<span class="form-hint">暂无保存的预设</span>';
            return;
        }

        list.innerHTML = this.state.presets.map((p, i) => `
            <span class="themai-preset-tag" title="端点: ${this._escAttr(p.endpoint)}&#10;模型: ${this._escAttr(p.model)}">
                ${this._escHtml(p.name)}
                <button class="themai-preset-load" data-index="${i}" title="加载">&#9654;</button>
                <button class="themai-preset-del" data-index="${i}" title="删除">&times;</button>
            </span>
        `).join('');

        list.querySelectorAll('.themai-preset-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._loadPreset(parseInt(btn.dataset.index));
            });
        });

        list.querySelectorAll('.themai-preset-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._deletePreset(parseInt(btn.dataset.index));
            });
        });
    },

    _renderPresetSelector() {
        const el = document.getElementById('themai-preset-selector');
        if (!el) return;

        const activeName = this.state.apiConfig.endpoint
            ? (this.state.presets.find(p => p.endpoint === this.state.apiConfig.endpoint && p.apiKey === this.state.apiConfig.apiKey)?.name || '自定义')
            : '';

        el.innerHTML = activeName
            ? '<span class="themai-active-preset">&#9881; ' + this._escHtml(activeName) + '</span>'
            : '<span class="form-hint">未配置 API</span>';
    },

    async _handleSend() {
        if (this.state.isLoading) return;

        const input = document.getElementById('themai-input');
        const text = input.value.trim();
        if (!text) return;

        const endpoint = document.getElementById('themai-endpoint').value.trim();
        const apiKey = document.getElementById('themai-apikey').value.trim();
        const model = document.getElementById('themai-model').value.trim();

        if (!endpoint || !apiKey || !model) {
            window.showToast('请先在 API 配置中填写端点、Key 和模型');
            return;
        }

        this.state.apiConfig = { endpoint, apiKey, model };

        input.value = '';
        document.getElementById('themai-welcome')?.classList.add('hidden');

        this.state.messages.push({ role: 'user', content: text });
        this.state.messages.push({ role: 'assistant', content: '...' });
        this._renderMessages();
        this._scrollToBottom();
        this._saveState();

        this.state.isLoading = true;
        this._setSendButtonLoading(true);

        try {
            const endpointClean = endpoint.replace(/\/+$/, '');
            const payload = {
                model: model,
                messages: [
                    { role: 'system', content: this.SYSPROMPT },
                    ...this.state.messages.slice(0, -1)
                ],
                temperature: 0.7,
                stream: true
            };

            const resp = await fetch(endpointClean + '/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error('API 错误 (HTTP ' + resp.status + '): ' + errText.substring(0, 200));
            }

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let fullReply = '';
            const lastMsg = this.state.messages[this.state.messages.length - 1];
            let lastUpdate = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;
                    try {
                        const json = JSON.parse(data);
                        const delta = json.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullReply += delta;
                            lastMsg.content = fullReply;
                            const now = Date.now();
                            if (now - lastUpdate > 30) {
                                lastUpdate = now;
                                this._renderMessages();
                                this._scrollToBottom();
                            }
                        }
                    } catch (e) { /* 忽略解析错误 */ }
                }
            }

            lastMsg.content = fullReply || '（未返回内容）';
            this._extractCSS(fullReply);
            this._renderMessages();
            this._updateOutputBar();
            this._scrollToBottom();
            this._saveState();
        } catch (err) {
            const lastMsg = this.state.messages[this.state.messages.length - 1];
            lastMsg.content = '**请求失败:** ' + err.message;
            this._renderMessages();
            this._scrollToBottom();
            this._saveState();
        } finally {
            this.state.isLoading = false;
            this._setSendButtonLoading(false);
        }
    },

    _setSendButtonLoading(loading) {
        document.getElementById('themai-send-text').classList.toggle('hidden', loading);
        document.getElementById('themai-send-spinner').classList.toggle('hidden', !loading);
        document.getElementById('themai-btn-send').disabled = loading;
        document.getElementById('themai-input').disabled = loading;
    },

    _extractCSS(text) {
        const match = text.match(/```css\s*([\s\S]*?)```/);
        if (match) {
            this.state.generatedCSS = match[1].trim();
        } else {
            const match2 = text.match(/```\s*([\s\S]*?)```/);
            if (match2) {
                this.state.generatedCSS = match2[1].trim();
            }
        }
    },

    _renderMessages() {
        const chat = document.getElementById('themai-chat');
        if (!chat) return;

        const msgs = this.state.messages;
        let html = '';

        if (msgs.length === 0) {
            html = `
            <div class="themai-welcome" id="themai-welcome">
                <div class="themai-welcome-icon">&#9881;</div>
                <h2>ST 主题 AI 助手</h2>
                <p>用自然语言描述你想要的主题效果，AI 会生成对应的 CSS 代码</p>
                <div class="themai-suggestions">
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个暗色赛博朋克风格主题，带霓虹光晕和动态扫描线效果">赛博朋克霓虹</button>
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个日系樱花风格主题，柔和的粉色系">&#x1F338; 日系樱花</button>
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个透明玻璃拟态风格主题，消息带模糊毛玻璃效果">玻璃拟态</button>
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个深色OLED主题，纯黑背景配上低饱和彩色强调">OLED 暗色</button>
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个复古CRT主题，带扫描线和轻微失真效果">CRT 复古</button>
                    <button class="btn btn-small btn-secondary themai-sugg" data-text="请帮我设计一个游戏风格主题，切换角色时切换背景图片，加入过渡动画">游戏主题</button>
                </div>
            </div>`;
        } else {
            for (const msg of msgs) {
                const roleClass = msg.role === 'user' ? 'themai-msg-user' : 'themai-msg-assistant';
                const roleLabel = msg.role === 'user' ? '你' : 'AI';
                const content = this._formatMessage(msg.content);
                html += `
                <div class="themai-msg ${roleClass}">
                    <div class="themai-msg-avatar">${roleLabel}</div>
                    <div class="themai-msg-content">${content}</div>
                </div>`;
            }
        }

        chat.innerHTML = html;

        if (msgs.length === 0) {
            document.querySelectorAll('.themai-sugg').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('themai-input').value = btn.dataset.text;
                    this._handleSend();
                });
            });
        }
    },

    _formatMessage(text) {
        let html = this._escHtml(text);
        html = html.replace(/```css\s*([\s\S]*?)```/g, '<pre><code class="language-css">$1</code></pre>');
        html = html.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, code) => {
            return '<pre><code class="' + (lang ? 'language-' + lang : '') + '">' + this._escHtml(code) + '</code></pre>';
        });
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\n/g, '<br>');
        return html;
    },

    _updateOutputBar() {
        const bar = document.getElementById('themai-output-bar');
        const status = document.getElementById('themai-css-status');
        if (!bar || !status) return;

        if (this.state.generatedCSS) {
            bar.classList.remove('hidden');
            const lines = this.state.generatedCSS.split('\n').length;
            status.textContent = '已生成 CSS (' + lines + ' 行, ' + this.state.generatedCSS.length + ' 字符)';
        } else {
            bar.classList.add('hidden');
        }
    },

    _scrollToBottom() {
        const chat = document.getElementById('themai-chat');
        if (chat) {
            setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
        }
    },

    _copyCSS() {
        if (!this.state.generatedCSS) {
            window.showToast('暂无生成的 CSS');
            return;
        }
        navigator.clipboard.writeText(this.state.generatedCSS).then(() => {
            window.showToast('CSS 已复制到剪贴板');
        }).catch(() => {
            window.showToast('复制失败，请手动选择');
        });
    },

    /* ── 标准模块接口 ── */
    getData() {
        return {
            messages: this.state.messages,
            generatedCSS: this.state.generatedCSS,
            apiConfig: this.state.apiConfig
        };
    },

    getPreviewFiles() {
        const css = this.state.generatedCSS;
        if (!css) return [{ name: '(无内容)', content: '等待 AI 生成 CSS...', lang: 'text' }];
        return [
            { name: 'theme.css', content: css, lang: 'css' }
        ];
    },

    validate() {
        return { valid: true, errors: [] };
    },

    download() {
        const css = this.state.generatedCSS;
        if (!css) {
            window.showToast('暂无生成的 CSS 可下载');
            return;
        }
        DownloadUtils.downloadZip({ 'theme.css': css });
    },

    loadDraft(data) {
        if (!data) return;
        if (data.messages) this.state.messages = data.messages;
        if (data.generatedCSS) this.state.generatedCSS = data.generatedCSS;
        if (data.apiConfig) this.state.apiConfig = data.apiConfig;
        this._renderMessages();
        this._renderPresetList();
        this._renderPresetSelector();
        this._updateOutputBar();
    },



};
