const ThemeGenerator = {
    title: 'Theme',

    /* ── 默认预设 ── */
    defaultTheme: {
        name: '',
        author: '',
        version: '1.0.0',
        /* ST 官方色盘 (实际 --SmartTheme* 变量) */
        colors: {
            bodyColor: '#d4d4d4',
            emColor: '#a0a0b0',
            underlineColor: '#bce7cf',
            quoteColor: '#e18a24',
            blurTint: 'rgba(23,23,23,1)',
            chatTint: 'rgba(23,23,23,1)',
            userMesBlurTint: 'rgba(0,0,0,0.3)',
            botMesBlurTint: 'rgba(60,60,60,0.3)',
            shadowColor: 'rgba(0,0,0,0.5)',
            borderColor: 'rgba(0,0,0,0.5)'
        },
        /* 扩展色盘 (社区通用, 通过自定义 CSS 注入) */
        extra: {
            accent: '#e94560',
            chatBg: '#1a1a2e',
            uiBg: '#16213e',
            userMsgBg: '#0f3460',
            aiMsgBg: '#1e2a4a',
            inputBg: '#16213e',
            inputColor: '#e0e0e0',
            buttonBg: '#e94560',
            buttonColor: '#ffffff',
            linkColor: '#e94560',
            panelsBg: '#16213e',
            codeBg: '#0d1117',
            codeColor: '#c9d1d9',
            quoteBg: '#161b22',
            highlightBg: '#264f78',
            highlightColor: '#ffffff',
            scrollbarColor: '#2a2a4a',
            scrollbarHover: '#3a3a5a',
            filterColor: 'rgba(0,0,0,0)'
        },
        fonts: {
            chatFont: 'Noto Sans, "Microsoft YaHei", sans-serif',
            mainFont: 'Noto Sans, "Microsoft YaHei", sans-serif',
            fontScale: 1.0
        },
        layout: {
            messageStyle: 'default',
            chatWidth: 50,
            borderRadius: 8,
            messagePadding: 16,
            avatarStyle: 'circle',
            avatarSize: 50,
            avatarBorderRadius: 10,
            shadowWidth: 2,
            animationDuration: 125
        },
        effects: {
            glassEffect: false,
            glassBlur: 10,
            glassOpacity: 0.7,
            reducedMotion: false
        },
        customCSS: ''
    },

    /* ── 渲染表单 ── */
    render(container) {
        container.innerHTML = `
<div class="form-section">
    <h3 class="form-section-title">主题信息</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label"><span class="required">*</span> 主题名称</label>
            <input type="text" class="form-input" id="theme-name" placeholder="My Theme">
        </div>
        <div class="form-group">
            <label class="form-label">作者</label>
            <input type="text" class="form-input" id="theme-author" placeholder="Your Name">
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">ST 官方 — 文字颜色</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">主文字 (--SmartThemeBodyColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-bodyColor" value="#d4d4d4">
                <input type="text" class="form-input" value="#d4d4d4" data-color="tc-bodyColor">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">斜体/强调 (--SmartThemeEmColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-emColor" value="#a0a0b0">
                <input type="text" class="form-input" value="#a0a0b0" data-color="tc-emColor">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">下划线 (--SmartThemeUnderlineColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-underlineColor" value="#bce7cf">
                <input type="text" class="form-input" value="#bce7cf" data-color="tc-underlineColor">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">引用文字 (--SmartThemeQuoteColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-quoteColor" value="#e18a24">
                <input type="text" class="form-input" value="#e18a24" data-color="tc-quoteColor">
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">ST 官方 — 背景/模糊颜色</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">UI 模糊底色 (--SmartThemeBlurTintColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-blurTint" value="#171717">
                <input type="text" class="form-input" value="rgba(23,23,23,1)" data-color="tc-blurTint">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">聊天区底色 (--SmartThemeChatTintColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-chatTint" value="#171717">
                <input type="text" class="form-input" value="rgba(23,23,23,1)" data-color="tc-chatTint">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">用户气泡底色 (--SmartThemeUserMesBlurTintColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-userMesBlurTint" value="#000000">
                <input type="text" class="form-input" value="rgba(0,0,0,0.3)" data-color="tc-userMesBlurTint">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">AI 气泡底色 (--SmartThemeBotMesBlurTintColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-botMesBlurTint" value="#3c3c3c">
                <input type="text" class="form-input" value="rgba(60,60,60,0.3)" data-color="tc-botMesBlurTint">
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">ST 官方 — 边框 / 阴影</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">边框颜色 (--SmartThemeBorderColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-borderColor" value="#000000">
                <input type="text" class="form-input" value="rgba(0,0,0,0.5)" data-color="tc-borderColor">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">阴影颜色 (--SmartThemeShadowColor)</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-shadowColor" value="#000000">
                <input type="text" class="form-input" value="rgba(0,0,0,0.5)" data-color="tc-shadowColor">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">阴影宽度 (--shadowWidth，px)</label>
            <div class="slider-group">
                <input type="range" id="theme-shadowWidth" min="0" max="6" step="1" value="2">
                <span class="slider-value" id="theme-shadowWidth-val">2px</span>
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">扩展色彩 — 交互元素</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">强调色</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-accent" value="#e94560">
                <input type="text" class="form-input" value="#e94560" data-color="tc-accent">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">面板背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-panelsBg" value="#16213e">
                <input type="text" class="form-input" value="#16213e" data-color="tc-panelsBg">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">输入框背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-inputBg" value="#16213e">
                <input type="text" class="form-input" value="#16213e" data-color="tc-inputBg">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">输入框文字</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-inputColor" value="#e0e0e0">
                <input type="text" class="form-input" value="#e0e0e0" data-color="tc-inputColor">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">按钮背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-buttonBg" value="#e94560">
                <input type="text" class="form-input" value="#e94560" data-color="tc-buttonBg">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">按钮文字</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-buttonColor" value="#ffffff">
                <input type="text" class="form-input" value="#ffffff" data-color="tc-buttonColor">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">链接颜色</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-linkColor" value="#e94560">
                <input type="text" class="form-input" value="#e94560" data-color="tc-linkColor">
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">扩展色彩 — 高级</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">代码块背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-codeBg" value="#0d1117">
                <input type="text" class="form-input" value="#0d1117" data-color="tc-codeBg">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">代码块文字</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-codeColor" value="#c9d1d9">
                <input type="text" class="form-input" value="#c9d1d9" data-color="tc-codeColor">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">引用块背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-quoteBg" value="#161b22">
                <input type="text" class="form-input" value="#161b22" data-color="tc-quoteBg">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">文字选中高亮背景</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-highlightBg" value="#264f78">
                <input type="text" class="form-input" value="#264f78" data-color="tc-highlightBg">
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">滚动条颜色</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-scrollbarColor" value="#2a2a4a">
                <input type="text" class="form-input" value="#2a2a4a" data-color="tc-scrollbarColor">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">滚动条悬停</label>
            <div class="color-input-wrapper">
                <input type="color" id="tc-scrollbarHover" value="#3a3a5a">
                <input type="text" class="form-input" value="#3a3a5a" data-color="tc-scrollbarHover">
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">字体系统</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">聊天字体 (--mainFontFamily)</label>
            <select class="form-select" id="theme-chatFont">
                <option value='Noto Sans, "Microsoft YaHei", sans-serif'>Noto Sans (ST 默认)</option>
                <option value='"Source Sans Pro", "Microsoft YaHei", sans-serif'>Source Sans Pro</option>
                <option value='"Inter", "Microsoft YaHei", sans-serif'>Inter</option>
                <option value='"LXGW WenKai", "楷体", serif'>霞鹜文楷</option>
                <option value='"Noto Serif SC", "宋体", serif'>思源宋体</option>
                <option value='"JetBrains Mono", "Fira Code", monospace'>JetBrains Mono (等宽)</option>
                <option value='"HarmonyOS Sans", "Microsoft YaHei", sans-serif'>HarmonyOS Sans</option>
                <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'>系统默认</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">界面字体</label>
            <select class="form-select" id="theme-mainFont">
                <option value='Noto Sans, "Microsoft YaHei", sans-serif'>Noto Sans (ST 默认)</option>
                <option value='"Source Sans Pro", "Microsoft YaHei", sans-serif'>Source Sans Pro</option>
                <option value='"Inter", "Microsoft YaHei", sans-serif'>Inter</option>
                <option value='"HarmonyOS Sans", "Microsoft YaHei", sans-serif'>HarmonyOS Sans</option>
                <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'>系统默认</option>
            </select>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">字体缩放 (--fontScale)</label>
            <div class="slider-group">
                <input type="range" id="theme-fontScale" min="0.7" max="1.5" step="0.05" value="1.0">
                <span class="slider-value" id="theme-fontScale-val">1.00x</span>
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">消息布局</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">消息样式 (<code>body</code> class)</label>
            <select class="form-select" id="theme-messageStyle">
                <option value="default">默认 (Default)</option>
                <option value="bubble">气泡 (Bubble)</option>
                <option value="flat">扁平 (Flat)</option>
                <option value="document">文档 (Document)</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">聊天区宽度 (--sheldWidth, vw)</label>
            <div class="slider-group">
                <input type="range" id="theme-chatWidth" min="30" max="100" step="5" value="50">
                <span class="slider-value" id="theme-chatWidth-val">50vw</span>
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">全局圆角 (px)</label>
            <div class="slider-group">
                <input type="range" id="theme-borderRadius" min="0" max="24" step="2" value="8">
                <span class="slider-value" id="theme-borderRadius-val">8px</span>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">消息内边距 (px)</label>
            <div class="slider-group">
                <input type="range" id="theme-messagePadding" min="8" max="32" step="4" value="16">
                <span class="slider-value" id="theme-messagePadding-val">16px</span>
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">头像样式</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">头像形状</label>
            <select class="form-select" id="theme-avatarStyle">
                <option value="circle">圆形</option>
                <option value="rounded">圆角方形</option>
                <option value="square">方形</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">头像大小 (--avatar-base-width/height, px)</label>
            <div class="slider-group">
                <input type="range" id="theme-avatarSize" min="32" max="96" step="4" value="50">
                <span class="slider-value" id="theme-avatarSize-val">50px</span>
            </div>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">圆角头像半径 (--avatar-base-border-radius-rounded, px)</label>
            <div class="slider-group">
                <input type="range" id="theme-avatarBorderRadius" min="4" max="24" step="2" value="10">
                <span class="slider-value" id="theme-avatarBorderRadius-val">10px</span>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">动画速度 (--animation-duration, ms)</label>
            <div class="slider-group">
                <input type="range" id="theme-animationDuration" min="0" max="500" step="25" value="125">
                <span class="slider-value" id="theme-animationDuration-val">125ms</span>
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">特效</h3>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">模糊效果 (--blurStrength)</label>
            <div class="slider-group">
                <input type="range" id="theme-glassBlur" min="0" max="30" step="2" value="10">
                <span class="slider-value" id="theme-glassBlur-val">10px</span>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">减少动画</label>
            <select class="form-select" id="theme-reducedMotion">
                <option value="false">关闭</option>
                <option value="true">开启 (推荐低配设备)</option>
            </select>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">透明度 (用于扩展元素)</label>
            <div class="slider-group">
                <input type="range" id="theme-glassOpacity" min="0.3" max="1.0" step="0.05" value="0.7">
                <span class="slider-value" id="theme-glassOpacity-val">0.70</span>
            </div>
        </div>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">自定义 CSS</h3>
    <div class="form-group">
        <label class="form-label">在此输入额外的 CSS，会追加到输出末尾</label>
        <textarea class="form-textarea" id="theme-customCSS" rows="8" placeholder="/* 自定义滚动条 */\n/* 自定义消息间距 */\n/* 会追加到输出 CSS 末尾 */"></textarea>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">预设主题</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-small btn-secondary preset-btn" data-preset="dark">深色经典</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="light">浅色优雅</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="sakura">樱花粉</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="ocean">深海蓝</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="forest">森林绿</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="cyberpunk">赛博霓虹</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="sunset">落日橙</button>
        <button class="btn btn-small btn-secondary preset-btn" data-preset="mint">薄荷清茶</button>
    </div>
</div>
<div class="form-section">
    <h3 class="form-section-title">导入主题</h3>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <label class="btn btn-secondary" style="cursor:pointer;">
            <span id="theme-import-label">选择 theme.json 文件</span>
            <input type="file" id="theme-import-file" accept=".json" style="display:none;">
        </label>
        <span class="form-hint">导入已有 SillyTavern 主题 JSON 进行编辑</span>
    </div>
</div>`;

        this._initColorSync();
        this._initSliders();
        this._initPresets();
        this._initImport();
    },

    /* ── 颜色同步 ── */
    _initColorSync() {
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            colorInput.addEventListener('input', () => {
                const textInput = document.querySelector('[data-color="' + colorInput.id + '"]');
                if (textInput) textInput.value = colorInput.value;
            });
        });
        document.querySelectorAll('input[data-color]').forEach(textInput => {
            textInput.addEventListener('input', () => {
                const colorInput = document.getElementById(textInput.dataset.color);
                if (colorInput) {
                    colorInput.value = textInput.value;
                    colorInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        });
    },

    /* ── 滑块数值同步 ── */
    _initSliders() {
        const sliderMap = {
            'theme-fontScale':        { unit: 'x',    fixed: 2 },
            'theme-chatWidth':        { unit: 'vw',   fixed: 0 },
            'theme-borderRadius':     { unit: 'px',   fixed: 0 },
            'theme-messagePadding':   { unit: 'px',   fixed: 0 },
            'theme-avatarSize':       { unit: 'px',   fixed: 0 },
            'theme-avatarBorderRadius': { unit: 'px', fixed: 0 },
            'theme-animationDuration':  { unit: 'ms', fixed: 0 },
            'theme-shadowWidth':      { unit: 'px',   fixed: 0 },
            'theme-glassBlur':        { unit: 'px',   fixed: 0 },
            'theme-glassOpacity':     { unit: '',      fixed: 2 }
        };

        Object.entries(sliderMap).forEach(([id, cfg]) => {
            const slider = document.getElementById(id);
            const valEl = document.getElementById(id + '-val');
            if (!slider || !valEl) return;
            const update = () => {
                const v = parseFloat(slider.value);
                valEl.textContent = cfg.unit ? v.toFixed(isNaN(cfg.fixed) ? 0 : cfg.fixed) + cfg.unit : v.toFixed(cfg.fixed);
            };
            slider.addEventListener('input', update);
            update();
        });
    },

    /* ── 预设 ── */
    _initPresets() {
        const presets = {
            dark: {
                colors: { bodyColor: '#d4d4d4', emColor: '#a0a0b0', underlineColor: '#bce7cf', quoteColor: '#e18a24', blurTint: 'rgba(23,23,23,1)', chatTint: 'rgba(23,23,23,1)', userMesBlurTint: 'rgba(0,0,0,0.3)', botMesBlurTint: 'rgba(60,60,60,0.3)', shadowColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(0,0,0,0.5)' },
                extra: { accent: '#e94560', chatBg: '#1a1a2e', uiBg: '#16213e', userMsgBg: '#0f3460', aiMsgBg: '#1e2a4a', inputBg: '#16213e', inputColor: '#e0e0e0', buttonBg: '#e94560', buttonColor: '#ffffff', linkColor: '#e94560', panelsBg: '#16213e', codeBg: '#0d1117', codeColor: '#c9d1d9', quoteBg: '#161b22', highlightBg: '#264f78', highlightColor: '#ffffff', scrollbarColor: '#2a2a4a', scrollbarHover: '#3a3a5a', filterColor: 'rgba(0,0,0,0)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'default', chatWidth: 50, borderRadius: 8, messagePadding: 16, avatarStyle: 'circle', avatarSize: 50, avatarBorderRadius: 10, shadowWidth: 2, animationDuration: 125 },
                effects: { glassEffect: false, glassBlur: 10, glassOpacity: 0.7, reducedMotion: false },
                customCSS: ''
            },
            light: {
                colors: { bodyColor: '#333333', emColor: '#888888', underlineColor: '#4a90d9', quoteColor: '#e67e22', blurTint: 'rgba(245,245,245,1)', chatTint: 'rgba(255,255,255,1)', userMesBlurTint: 'rgba(227,242,253,0.5)', botMesBlurTint: 'rgba(252,228,236,0.5)', shadowColor: 'rgba(0,0,0,0.1)', borderColor: 'rgba(0,0,0,0.12)' },
                extra: { accent: '#1976d2', chatBg: '#f5f5f5', uiBg: '#ffffff', userMsgBg: '#e3f2fd', aiMsgBg: '#fce4ec', inputBg: '#ffffff', inputColor: '#333333', buttonBg: '#1976d2', buttonColor: '#ffffff', linkColor: '#1976d2', panelsBg: '#f0f0f0', codeBg: '#f0f0f0', codeColor: '#333333', quoteBg: '#f8f8f8', highlightBg: '#90caf9', highlightColor: '#000000', scrollbarColor: '#cccccc', scrollbarHover: '#aaaaaa', filterColor: 'rgba(255,255,255,0)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'bubble', chatWidth: 60, borderRadius: 12, messagePadding: 18, avatarStyle: 'rounded', avatarSize: 48, avatarBorderRadius: 12, shadowWidth: 1, animationDuration: 125 },
                effects: { glassEffect: false, glassBlur: 10, glassOpacity: 0.7, reducedMotion: false },
                customCSS: ''
            },
            sakura: {
                colors: { bodyColor: '#4a2040', emColor: '#8a6080', underlineColor: '#e91e8c', quoteColor: '#ad1457', blurTint: 'rgba(255,245,248,1)', chatTint: 'rgba(255,240,245,1)', userMesBlurTint: 'rgba(255,224,236,0.5)', botMesBlurTint: 'rgba(255,240,245,0.3)', shadowColor: 'rgba(233,30,140,0.15)', borderColor: 'rgba(240,192,216,0.5)' },
                extra: { accent: '#e91e8c', chatBg: '#fff0f5', uiBg: '#fff5f8', userMsgBg: '#ffe0ec', aiMsgBg: '#fff0f5', inputBg: '#fff5f8', inputColor: '#4a2040', buttonBg: '#e91e8c', buttonColor: '#ffffff', linkColor: '#e91e8c', panelsBg: '#fff0f3', codeBg: '#fff0f5', codeColor: '#4a2040', quoteBg: '#ffe8f0', highlightBg: '#f8bbd0', highlightColor: '#4a2040', scrollbarColor: '#f0c0d8', scrollbarHover: '#e0a0c8', filterColor: 'rgba(255,240,245,0)' },
                fonts: { fontScale: 1.05 },
                layout: { messageStyle: 'bubble', chatWidth: 55, borderRadius: 12, messagePadding: 18, avatarStyle: 'circle', avatarSize: 52, avatarBorderRadius: 10, shadowWidth: 1, animationDuration: 150 },
                effects: { glassEffect: false, glassBlur: 15, glassOpacity: 0.7, reducedMotion: false },
                customCSS: ''
            },
            ocean: {
                colors: { bodyColor: '#c0d8e8', emColor: '#8098b0', underlineColor: '#00bcd4', quoteColor: '#4dd0e1', blurTint: 'rgba(10,22,40,1)', chatTint: 'rgba(10,22,40,1)', userMesBlurTint: 'rgba(0,0,0,0.3)', botMesBlurTint: 'rgba(0,0,0,0.2)', shadowColor: 'rgba(0,16,32,0.5)', borderColor: 'rgba(26,48,80,0.5)' },
                extra: { accent: '#00bcd4', chatBg: '#0a1628', uiBg: '#0d1f3c', userMsgBg: '#1a3a5c', aiMsgBg: '#0f2844', inputBg: '#0d1f3c', inputColor: '#c0d8e8', buttonBg: '#00bcd4', buttonColor: '#ffffff', linkColor: '#00bcd4', panelsBg: '#0d1f3c', codeBg: '#0a1628', codeColor: '#c0d8e8', quoteBg: '#0d1f3c', highlightBg: '#1a5a7c', highlightColor: '#ffffff', scrollbarColor: '#1a3050', scrollbarHover: '#2a4060', filterColor: 'rgba(0,0,0,0)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'default', chatWidth: 55, borderRadius: 8, messagePadding: 16, avatarStyle: 'circle', avatarSize: 48, avatarBorderRadius: 10, shadowWidth: 2, animationDuration: 125 },
                effects: { glassEffect: true, glassBlur: 20, glassOpacity: 0.6, reducedMotion: false },
                customCSS: ''
            },
            forest: {
                colors: { bodyColor: '#c8d6c0', emColor: '#889878', underlineColor: '#66bb6a', quoteColor: '#81c784', blurTint: 'rgba(26,36,22,1)', chatTint: 'rgba(26,36,22,1)', userMesBlurTint: 'rgba(0,0,0,0.3)', botMesBlurTint: 'rgba(0,0,0,0.2)', shadowColor: 'rgba(10,20,8,0.5)', borderColor: 'rgba(42,58,34,0.5)' },
                extra: { accent: '#4caf50', chatBg: '#1a2416', uiBg: '#1e2a1a', userMsgBg: '#2a3a22', aiMsgBg: '#1e2e1a', inputBg: '#1e2a1a', inputColor: '#c8d6c0', buttonBg: '#4caf50', buttonColor: '#ffffff', linkColor: '#4caf50', panelsBg: '#1e2a1a', codeBg: '#0d140a', codeColor: '#c8d6c0', quoteBg: '#1a2416', highlightBg: '#3a5a2a', highlightColor: '#ffffff', scrollbarColor: '#2a3a22', scrollbarHover: '#3a4a32', filterColor: 'rgba(0,0,0,0)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'document', chatWidth: 65, borderRadius: 4, messagePadding: 20, avatarStyle: 'square', avatarSize: 44, avatarBorderRadius: 2, shadowWidth: 1, animationDuration: 100 },
                effects: { glassEffect: false, glassBlur: 10, glassOpacity: 0.7, reducedMotion: false },
                customCSS: ''
            },
            cyberpunk: {
                colors: { bodyColor: '#00ffcc', emColor: '#ff00de', underlineColor: '#ff006e', quoteColor: '#ff00de', blurTint: 'rgba(10,10,15,1)', chatTint: 'rgba(10,10,15,1)', userMesBlurTint: 'rgba(26,0,80,0.5)', botMesBlurTint: 'rgba(0,26,51,0.5)', shadowColor: 'rgba(255,0,110,0.3)', borderColor: 'rgba(26,26,62,0.8)' },
                extra: { accent: '#ff006e', chatBg: '#0a0a0f', uiBg: '#0d0d1a', userMsgBg: '#1a0050', aiMsgBg: '#001a33', inputBg: '#0d0d1a', inputColor: '#00ffcc', buttonBg: '#ff006e', buttonColor: '#000000', linkColor: '#00e5ff', panelsBg: '#0d0d1a', codeBg: '#000000', codeColor: '#00ff88', quoteBg: '#0d0d1a', highlightBg: '#ff006e', highlightColor: '#000000', scrollbarColor: '#1a1a3e', scrollbarHover: '#ff006e', filterColor: 'rgba(255,0,110,0.05)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'flat', chatWidth: 50, borderRadius: 0, messagePadding: 14, avatarStyle: 'square', avatarSize: 44, avatarBorderRadius: 0, shadowWidth: 4, animationDuration: 75 },
                effects: { glassEffect: true, glassBlur: 16, glassOpacity: 0.5, reducedMotion: false },
                customCSS: ''
            },
            sunset: {
                colors: { bodyColor: '#ffe0c0', emColor: '#cc9060', underlineColor: '#ffab40', quoteColor: '#ff7043', blurTint: 'rgba(42,26,16,1)', chatTint: 'rgba(42,26,16,1)', userMesBlurTint: 'rgba(74,42,26,0.5)', botMesBlurTint: 'rgba(58,32,22,0.3)', shadowColor: 'rgba(255,112,67,0.2)', borderColor: 'rgba(74,48,32,0.5)' },
                extra: { accent: '#ff7043', chatBg: '#2a1a10', uiBg: '#2e1e12', userMsgBg: '#4a2a1a', aiMsgBg: '#3a2016', inputBg: '#2e1e12', inputColor: '#ffe0c0', buttonBg: '#ff7043', buttonColor: '#ffffff', linkColor: '#ffab40', panelsBg: '#2e1e12', codeBg: '#1a0e08', codeColor: '#ffe0c0', quoteBg: '#2a1a10', highlightBg: '#ff7043', highlightColor: '#ffffff', scrollbarColor: '#4a3020', scrollbarHover: '#6a4a3a', filterColor: 'rgba(255,112,67,0.03)' },
                fonts: { fontScale: 1.05 },
                layout: { messageStyle: 'bubble', chatWidth: 55, borderRadius: 16, messagePadding: 20, avatarStyle: 'rounded', avatarSize: 56, avatarBorderRadius: 16, shadowWidth: 2, animationDuration: 175 },
                effects: { glassEffect: false, glassBlur: 10, glassOpacity: 0.7, reducedMotion: false },
                customCSS: ''
            },
            mint: {
                colors: { bodyColor: '#2d3436', emColor: '#636e72', underlineColor: '#00b894', quoteColor: '#00b894', blurTint: 'rgba(240,255,244,1)', chatTint: 'rgba(245,255,248,1)', userMesBlurTint: 'rgba(224,251,232,0.5)', botMesBlurTint: 'rgba(240,255,244,0.3)', shadowColor: 'rgba(0,184,148,0.1)', borderColor: 'rgba(200,230,208,0.5)' },
                extra: { accent: '#00b894', chatBg: '#f0fff4', uiBg: '#ffffff', userMsgBg: '#e0fbe8', aiMsgBg: '#f0fff4', inputBg: '#ffffff', inputColor: '#2d3436', buttonBg: '#00b894', buttonColor: '#ffffff', linkColor: '#00b894', panelsBg: '#f5fff8', codeBg: '#e8fff0', codeColor: '#2d3436', quoteBg: '#e8fff0', highlightBg: '#55efc4', highlightColor: '#2d3436', scrollbarColor: '#c8e6d0', scrollbarHover: '#a0d8b8', filterColor: 'rgba(0,184,148,0.03)' },
                fonts: { fontScale: 1.0 },
                layout: { messageStyle: 'bubble', chatWidth: 60, borderRadius: 10, messagePadding: 16, avatarStyle: 'rounded', avatarSize: 48, avatarBorderRadius: 12, shadowWidth: 1, animationDuration: 125 },
                effects: { glassEffect: false, glassBlur: 10, glassOpacity: 0.7, reducedMotion: true },
                customCSS: ''
            }
        };

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = presets[btn.dataset.preset];
                if (!preset) return;

                const apply = (obj, prefix) => {
                    for (const [key, value] of Object.entries(obj)) {
                        if (prefix === 'tc-') {
                            const colorInput = document.getElementById(prefix + key);
                            const textInput = document.querySelector('[data-color="' + prefix + key + '"]');
                            if (colorInput) colorInput.value = value;
                            if (textInput) textInput.value = value;
                        } else {
                            const el = document.getElementById(prefix + key);
                            if (el) {
                                el.value = value;
                                el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
                            }
                        }
                    }
                };

                if (preset.colors) apply(preset.colors, 'tc-');
                if (preset.extra) apply(preset.extra, 'tc-');
                if (preset.fonts) apply(preset.fonts, 'theme-');
                if (preset.layout) apply(preset.layout, 'theme-');
                if (preset.effects) apply(preset.effects, 'theme-');

                if (preset.customCSS !== undefined) {
                    const cssEl = document.getElementById('theme-customCSS');
                    if (cssEl) cssEl.value = preset.customCSS;
                }
            });
        });
    },

    /* ── 导入 JSON ── */
    _initImport() {
        const fileInput = document.getElementById('theme-import-file');
        const label = document.getElementById('theme-import-label');
        if (!fileInput) return;

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this._applyImportData(data, file.name, label);
                } catch (err) {
                    this._showToast('导入失败：无效的 JSON 文件');
                }
            };
            reader.readAsText(file);
        });
    },

    _applyImportData(data, filename, label) {
        if (data.name) {
            const nameEl = document.getElementById('theme-name');
            if (nameEl) nameEl.value = data.name;
        }
        if (data.author) {
            const authorEl = document.getElementById('theme-author');
            if (authorEl) authorEl.value = data.author;
        }

        const fill = (obj, prefix) => {
            for (const [key, value] of Object.entries(obj)) {
                if (prefix === 'tc-') {
                    const colorInput = document.getElementById(prefix + key);
                    const textInput = document.querySelector('[data-color="' + prefix + key + '"]');
                    if (colorInput) colorInput.value = value;
                    if (textInput) textInput.value = value;
                } else {
                    const el = document.getElementById(prefix + key);
                    if (el) {
                        el.value = value;
                        el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
                    }
                }
            }
        };

        if (data.colors) fill(data.colors, 'tc-');
        if (data.extra) fill(data.extra, 'tc-');
        if (data.fonts) fill(data.fonts, 'theme-');
        if (data.layout) fill(data.layout, 'theme-');
        if (data.effects) fill(data.effects, 'theme-');

        if (data.customCSS !== undefined) {
            const cssEl = document.getElementById('theme-customCSS');
            if (cssEl) cssEl.value = data.customCSS;
        }
        if (label) label.textContent = filename;
        this._showToast('主题已导入');
    },

    /* ── 收集表单数据 ── */
    getData() {
        const collectColor = (id) => {
            const textInput = document.querySelector('[data-color="' + id + '"]');
            if (textInput) return textInput.value;
            const colorInput = document.getElementById(id);
            return colorInput ? colorInput.value : '';
        };

        const collect = (keys) => {
            const obj = {};
            keys.forEach(k => { obj[k] = collectColor('tc-' + k); });
            return obj;
        };

        const val = (id) => document.getElementById(id)?.value;

        return {
            name: val('theme-name') || 'My Theme',
            author: val('theme-author') || 'Anonymous',
            version: '1.0.0',
            colors: collect(['bodyColor', 'emColor', 'underlineColor', 'quoteColor', 'blurTint', 'chatTint', 'userMesBlurTint', 'botMesBlurTint', 'shadowColor', 'borderColor']),
            extra: collect(['accent', 'chatBg', 'uiBg', 'userMsgBg', 'aiMsgBg', 'inputBg', 'inputColor', 'buttonBg', 'buttonColor', 'linkColor', 'panelsBg', 'codeBg', 'codeColor', 'quoteBg', 'highlightBg', 'highlightColor', 'scrollbarColor', 'scrollbarHover', 'filterColor']),
            fonts: {
                chatFont: val('theme-chatFont') || 'Noto Sans, "Microsoft YaHei", sans-serif',
                mainFont: val('theme-mainFont') || 'Noto Sans, "Microsoft YaHei", sans-serif',
                fontScale: parseFloat(val('theme-fontScale') || 1.0)
            },
            layout: {
                messageStyle: val('theme-messageStyle') || 'default',
                chatWidth: parseInt(val('theme-chatWidth') || 50),
                borderRadius: parseInt(val('theme-borderRadius') || 8),
                messagePadding: parseInt(val('theme-messagePadding') || 16),
                avatarStyle: val('theme-avatarStyle') || 'circle',
                avatarSize: parseInt(val('theme-avatarSize') || 50),
                avatarBorderRadius: parseInt(val('theme-avatarBorderRadius') || 10),
                shadowWidth: parseInt(val('theme-shadowWidth') || 2),
                animationDuration: parseInt(val('theme-animationDuration') || 125)
            },
            effects: {
                glassEffect: parseInt(val('theme-glassBlur') || 10) > 0,
                glassBlur: parseInt(val('theme-glassBlur') || 10),
                glassOpacity: parseFloat(val('theme-glassOpacity') || 0.7),
                reducedMotion: val('theme-reducedMotion') === 'true'
            },
            customCSS: val('theme-customCSS') || ''
        };
    },

    getPreviewFiles() {
        const data = this.getData();
        return [
            { name: 'theme.json', content: JSON.stringify(data, null, 2), lang: 'json' },
            { name: 'style.css',  content: this._generateCSS(data), lang: 'css' }
        ];
    },

    /* ── 生成 CSS ── */
    _generateCSS(data) {
        const c = data.colors || {};
        const x = data.extra || {};
        const f = data.fonts || {};
        const l = data.layout || {};
        const e = data.effects || {};

        let css = '/* ===========================================\n';
        css += '   ' + (data.name || 'Untitled') + ' — SillyTavern Theme\n';
        css += '   Author: ' + (data.author || 'Anonymous') + '\n';
        css += '   \n';
        css += '   用法:\n';
        css += '   1. ST 自定义 CSS: 粘贴全部内容到 Custom CSS 框\n';
        css += '   2. 手动替换: 只复制 :root 块替换 ST 对应变量\n';
        css += '   =========================================== */\n\n';

        /* :root — ST 官方变量 */
        css += ':root {\n';
        css += '  /* ══ ST 官方色盘 ══ */\n';
        if (c.bodyColor)       css += '  --SmartThemeBodyColor: '         + c.bodyColor       + ';\n';
        if (c.emColor)         css += '  --SmartThemeEmColor: '           + c.emColor         + ';\n';
        if (c.underlineColor)  css += '  --SmartThemeUnderlineColor: '    + c.underlineColor  + ';\n';
        if (c.quoteColor)      css += '  --SmartThemeQuoteColor: '        + c.quoteColor      + ';\n';
        if (c.blurTint)        css += '  --SmartThemeBlurTintColor: '     + c.blurTint        + ';\n';
        if (c.chatTint)        css += '  --SmartThemeChatTintColor: '     + c.chatTint        + ';\n';
        if (c.userMesBlurTint) css += '  --SmartThemeUserMesBlurTintColor: ' + c.userMesBlurTint + ';\n';
        if (c.botMesBlurTint)  css += '  --SmartThemeBotMesBlurTintColor: '  + c.botMesBlurTint  + ';\n';
        if (c.shadowColor)     css += '  --SmartThemeShadowColor: '       + c.shadowColor     + ';\n';
        if (c.borderColor)     css += '  --SmartThemeBorderColor: '       + c.borderColor     + ';\n';

        css += '\n  /* ══ ST 官方尺寸 ══ */\n';
        css += '  --blurStrength: '       + (e.glassBlur || 10)             + ';\n';
        css += '  --shadowWidth: '        + (l.shadowWidth || 2)            + ';\n';
        css += '  --fontScale: '          + (f.fontScale || 1.0)            + ';\n';
        css += '  --mainFontFamily: '     + (f.chatFont || 'Noto Sans, sans-serif') + ';\n';
        css += '  --mainFontSize: calc(var(--fontScale) * 15px);\n';
        css += '  --sheldWidth: '         + (l.chatWidth || 50)             + 'vw;\n';
        css += '  --avatar-base-width: '  + (l.avatarSize || 50)            + 'px;\n';
        css += '  --avatar-base-height: ' + (l.avatarSize || 50)            + 'px;\n';
        if (l.avatarBorderRadius !== undefined)
            css += '  --avatar-base-border-radius-rounded: ' + l.avatarBorderRadius + 'px;\n';
        css += '  --animation-duration: ' + (l.animationDuration || 125)    + 'ms;\n';
        css += '  --animation-duration-slow: ' + ((l.animationDuration || 125) * 2) + 'ms;\n';
        css += '}\n';

        /* body class 提示 */
        css += '\n/* ══ 消息样式 (ST 设置面板中选择) ══ */\n';
        if (l.messageStyle === 'bubble')
            css += '/* 请在 ST Settings → Chat/Message Handling → Chat Style 中选 "Bubble Chat" */\n';
        else if (l.messageStyle === 'flat')
            css += '/* 请在 ST Settings → Chat/Message Handling → Chat Style 中选 "Flat Chat" */\n';
        else if (l.messageStyle === 'document')
            css += '/* 请在 ST Settings → Chat/Message Handling → Chat Style 中选 "Document" */\n';
        else
            css += '/* 使用 ST 默认消息样式 (Default) */\n';

        /* 头像形状 */
        css += '\n/* ══ 头像形状 ══ */\n';
        if (l.avatarStyle === 'circle')
            css += '.avatar img { border-radius: 50% !important; }\n';
        else if (l.avatarStyle === 'rounded')
            css += '.avatar img { border-radius: ' + (l.avatarBorderRadius || 10) + 'px !important; }\n';
        else
            css += '.avatar img { border-radius: 0 !important; }\n';

        /* 全局圆角 */
        css += '\n/* ══ 全局圆角 ══ */\n';
        css += '.mes, .mes_block, input, textarea, select, button, .menu_button, .panel, .card, .popup {\n';
        css += '  border-radius: ' + (l.borderRadius || 8) + 'px !important;\n';
        css += '}\n';

        /* 消息内边距 */
        if (l.messagePadding !== undefined) {
            css += '\n/* ══ 消息内边距 ══ */\n';
            css += '.mes, .mes_block { padding: ' + l.messagePadding + 'px !important; }\n';
        }

        /* 减少动画 */
        if (e.reducedMotion) {
            css += '\n/* ══ 减少动画 ══ */\n';
            css += '* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }\n';
        }

        /* 扩展色盘 */
        css += '\n/* ═══════════════════════════════════ */\n';
        css += '/*  以下为扩展定制 (非 ST 官方变量)   */\n';
        css += '/* ═══════════════════════════════════ */\n';

        if (x.accent) {
            css += '\n/* 强调色 */\n';
            css += 'a, .menu_button:hover, .drawer-icon:hover, .fa-solid:hover, .button:hover { color: ' + x.accent + ' !important; }\n';
            css += ':root { --SmartThemeAccent: ' + x.accent + '; }\n';
        }
        if (x.inputBg)  css += 'input, textarea, select { background: ' + x.inputBg + ' !important; }\n';
        if (x.inputColor) css += 'input, textarea, select { color: ' + x.inputColor + ' !important; }\n';
        if (x.buttonBg)  css += 'button, .menu_button { background: ' + x.buttonBg + ' !important; }\n';
        if (x.buttonColor) css += 'button, .menu_button { color: ' + x.buttonColor + ' !important; }\n';
        if (x.linkColor)  css += 'a { color: ' + x.linkColor + ' !important; }\n';
        if (x.panelsBg)   css += '.drawer-content, .panel, .popup { background: ' + x.panelsBg + ' !important; }\n';

        if (x.highlightBg)  css += '::selection { background: ' + x.highlightBg + '; color: ' + (x.highlightColor || '#ffffff') + '; }\n';
        if (x.codeBg)       css += 'code, pre, .code-block { background: ' + x.codeBg + ' !important; }\n';
        if (x.codeColor)    css += 'code, pre, .code-block { color: ' + x.codeColor + ' !important; }\n';
        if (x.quoteBg)      css += 'blockquote, .quote { background: ' + x.quoteBg + ' !important; }\n';
        if (x.scrollbarColor)  css += '::-webkit-scrollbar-thumb { background: ' + x.scrollbarColor + ' !important; }\n';
        if (x.scrollbarHover)  css += '::-webkit-scrollbar-thumb:hover { background: ' + x.scrollbarHover + ' !important; }\n';
        if (x.filterColor && x.filterColor !== 'rgba(0,0,0,0)')
            css += '.main-container, .chat { background-color: ' + x.filterColor + '; }\n';

        /* 自定义 CSS */
        if (data.customCSS) {
            css += '\n/* ══ 自定义 CSS ══ */\n';
            css += data.customCSS + '\n';
        }

        /* ST 选择器速查 */
        css += '\n/* ════════════════════════════════════════ */\n';
        css += '/*  ST 常用 CSS 选择器速查 (方便进阶定制)  */\n';
        css += '/* ════════════════════════════════════════ */\n';
        css += '/*\n';
        css += '  消息系统:\n';
        css += '    .mes              消息容器\n';
        css += '    .mes_text         消息正文\n';
        css += '    .mes_block        消息内容区\n';
        css += '    .last_mes         最后一条消息\n';
        css += '    .mes[is_user="true"]   用户消息\n';
        css += '    .mes[is_system="true"] 系统消息\n';
        css += '    .smallSysMes      紧凑系统消息\n';
        css += '    .mesAvatarWrapper 头像包裹层\n';
        css += '    .ch_name          角色名\n';
        css += '    .mes_bias         偏见/附注文字\n';
        css += '    .mes_reasoning    推理/思维链\n';
        css += '\n';
        css += '  滑动/操作:\n';
        css += '    .swipe_left / .swipe_right  滑动按钮\n';
        css += '    .swipes-counter             滑动计数器\n';
        css += '    .mes_button                 消息操作按钮\n';
        css += '    .mes_bookmark               书签标记\n';
        css += '\n';
        css += '  布局:\n';
        css += '    #chat               聊天区域\n';
        css += '    #sheld              主外壳\n';
        css += '    #top-bar            顶部栏\n';
        css += '    #send_form / #send_textarea  发送表单\n';
        css += '    #leftSendForm / #rightSendForm  发送表单左右栏\n';
        css += '    #left-nav-panel / #right-nav-panel  侧面板\n';
        css += '    .drawer / .drawer-content / .closedDrawer  抽屉面板\n';
        css += '\n';
        css += '  头像:\n';
        css += '    .avatar / .avatar img           头像元素\n';
        css += '    .avatar.interactable            可交互头像\n';
        css += '    .avatars_inline                 内联头像列表\n';
        css += '    .zoomed_avatar / .zoomed_avatar_container  放大头像\n';
        css += '    img.expression                  角色表情图\n';
        css += '\n';
        css += '  交互:\n';
        css += '    .menu_button / .menu_button_icon  菜单按钮\n';
        css += '    .interactable                     键盘可聚焦元素\n';
        css += '    .checkbox_label                   复选框标签\n';
        css += '    .range-block / .neo-range-slider  范围滑块\n';
        css += '    .drag-grabber / .pull-tab         拖拽手柄\n';
        css += '\n';
        css += '  Popup / 弹窗:\n';
        css += '    .popup / .popup-body / .popup-content  弹窗框架\n';
        css += '    .popup-controls / .popup-inputs        按钮区\n';
        css += '    .popup[opening] / .popup[open] / .popup[closing]  弹窗状态\n';
        css += '    .popup::backdrop                  弹窗遮罩层\n';
        css += '    .popup .popup-button-close        关闭按钮 (X)\n';
        css += '    .menu_button.menu_button_default  默认按钮\n';
        css += '    .menu_button.popup-button-ok      确认按钮\n';
        css += '    .popup--animation-fast / --slow / --none  弹窗动画速度\n';
        css += '\n';
        css += '  Toast / 提示:\n';
        css += '    #toast-container / .toast-top-left / .toast-top-right  提示容器\n';
        css += '\n';
        css += '  动画 / 特效:\n';
        css += '    @keyframes pop-in / pop-out      弹窗缩放动画\n';
        css += '    @keyframes fade-in / fade-out    淡入淡出\n';
        css += '    @keyframes flash / pulse         闪烁/脉冲\n';
        css += '    @keyframes infinite-spinning     无限旋转\n';
        css += '    @keyframes slide                 消息滑入动画\n';
        css += '\n';
        css += '  Body 类标识:\n';
        css += '    body.big-avatars         大头像模式\n';
        css += '    body.no-blur             无模糊效果\n';
        css += '    body.movingUI            UI 拖拽中\n';
        css += '    body.waifuMode           Waifu 模式\n';
        css += '    body.bubblechat          气泡聊天气泡\n';
        css += '    body[data-generating="true"]  生成中\n';
        css += '    body[data-stscript-style="dark/light/theme"]  脚本主题\n';
        css += '\n';
        css += '  内部变量 (非 SmartTheme, 可在自定义 CSS 中覆盖):\n';
        css += '    --transparent, --black30a, --black70a\n';
        css += '    --white20a, --grey10-75\n';
        css += '    --fullred, --crimson70a, --okGreen70a\n';
        css += '    --golden, --warning, --active\n';
        css += '    --interactable-outline-color, --reasoning-body-color\n';
        css += '*/\n';

        return css;
    },

    download() {
        const data = this.getData();
        const name = (data.name || 'theme').replace(/\s+/g, '-').toLowerCase();
        const css = this._generateCSS(data);

        DownloadUtils.downloadZip({
            [name + '.json']: JSON.stringify(data, null, 2),
            [name + '.css']: css
        });
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

    validate() {
        if (!(document.getElementById('theme-name')?.value.trim())) {
            this._showToast('请输入主题名称');
            return false;
        }
        return true;
    },

    loadDraft(data) {
        const nameEl = document.getElementById('theme-name');
        if (nameEl && data.name) nameEl.value = data.name;
        const authorEl = document.getElementById('theme-author');
        if (authorEl && data.author) authorEl.value = data.author;

        const fill = (obj, prefix) => {
            for (const [key, value] of Object.entries(obj)) {
                if (prefix === 'tc-') {
                    const colorInput = document.getElementById(prefix + key);
                    const textInput = document.querySelector('[data-color="' + prefix + key + '"]');
                    if (colorInput) colorInput.value = value;
                    if (textInput) textInput.value = value;
                } else {
                    const el = document.getElementById(prefix + key);
                    if (el) {
                        el.value = value;
                        el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
                    }
                }
            }
        };

        if (data.colors) fill(data.colors, 'tc-');
        if (data.extra) fill(data.extra, 'tc-');
        if (data.fonts) fill(data.fonts, 'theme-');
        if (data.layout) fill(data.layout, 'theme-');
        if (data.effects) fill(data.effects, 'theme-');

        if (data.customCSS !== undefined) {
            const cssEl = document.getElementById('theme-customCSS');
            if (cssEl) cssEl.value = data.customCSS;
        }
    }
};
