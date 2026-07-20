const ThemeGenerator = {
    title: 'Theme',
    defaultTheme: {
        name: '',
        author: '',
        version: '1.0.0',
        colors: {
            bodyColor: '#d4d4d4',
            emColor: '#a0a0b0',
            chatBg: '#1a1a2e',
            uiBg: '#16213e',
            userMsgBg: '#0f3460',
            aiMsgBg: '#1e2a4a',
            accent: '#e94560',
            borderColor: '#2a2a4a',
            inputBg: '#16213e',
            inputColor: '#e0e0e0',
            buttonBg: '#e94560',
            buttonColor: '#ffffff',
            linkColor: '#e94560',
            panelsBg: '#16213e',
            shadowColor: 'rgba(0,0,0,0.3)',
            blurTint: 'rgba(26,26,46,0.7)'
        }
    },

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
                <h3 class="form-section-title">文字与背景</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">主文字颜色 (--SmartThemeBodyColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-bodyColor" value="#d4d4d4">
                            <input type="text" class="form-input" value="#d4d4d4" data-color="tc-bodyColor">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">强调/斜体 (--SmartThemeEmColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-emColor" value="#a0a0b0">
                            <input type="text" class="form-input" value="#a0a0b0" data-color="tc-emColor">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">聊天区背景 (--SmartThemeChatBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-chatBg" value="#1a1a2e">
                            <input type="text" class="form-input" value="#1a1a2e" data-color="tc-chatBg">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">UI 背景 (--SmartThemeBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-uiBg" value="#16213e">
                            <input type="text" class="form-input" value="#16213e" data-color="tc-uiBg">
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">消息气泡</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">用户消息 (--SmartThemeUserMsgBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-userMsgBg" value="#0f3460">
                            <input type="text" class="form-input" value="#0f3460" data-color="tc-userMsgBg">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">AI 消息 (--SmartThemeAIMsgBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-aiMsgBg" value="#1e2a4a">
                            <input type="text" class="form-input" value="#1e2a4a" data-color="tc-aiMsgBg">
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">交互元素</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">强调色 (--SmartThemeAccent)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-accent" value="#e94560">
                            <input type="text" class="form-input" value="#e94560" data-color="tc-accent">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">边框 (--SmartThemeBorderColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-borderColor" value="#2a2a4a">
                            <input type="text" class="form-input" value="#2a2a4a" data-color="tc-borderColor">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">输入框背景 (--SmartThemeInputBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-inputBg" value="#16213e">
                            <input type="text" class="form-input" value="#16213e" data-color="tc-inputBg">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">输入框文字 (--SmartThemeInputColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-inputColor" value="#e0e0e0">
                            <input type="text" class="form-input" value="#e0e0e0" data-color="tc-inputColor">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">按钮背景 (--SmartThemeButtonBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-buttonBg" value="#e94560">
                            <input type="text" class="form-input" value="#e94560" data-color="tc-buttonBg">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">按钮文字 (--SmartThemeButtonColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-buttonColor" value="#ffffff">
                            <input type="text" class="form-input" value="#ffffff" data-color="tc-buttonColor">
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">高级</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">链接颜色 (--SmartThemeLinkColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-linkColor" value="#e94560">
                            <input type="text" class="form-input" value="#e94560" data-color="tc-linkColor">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">面板背景 (--SmartThemePanelsBg)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-panelsBg" value="#16213e">
                            <input type="text" class="form-input" value="#16213e" data-color="tc-panelsBg">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">阴影颜色 (--SmartThemeShadowColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-shadowColor" value="#000000">
                            <input type="text" class="form-input" value="rgba(0,0,0,0.3)" data-color="tc-shadowColor">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">模糊遮罩 (--SmartThemeBlurTintColor)</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-blurTint" value="#1a1a2e">
                            <input type="text" class="form-input" value="rgba(26,26,46,0.7)" data-color="tc-blurTint">
                        </div>
                    </div>
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
            </div>
        `;

        this._initColorSync();
        this._initPresets();
        this._initImport();
    },

    _initColorSync() {
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            colorInput.addEventListener('input', () => {
                const textInput = document.querySelector(`[data-color="${colorInput.id}"]`);
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

    _initPresets() {
        const presets = {
            dark: {
                bodyColor: '#d4d4d4', emColor: '#a0a0b0', chatBg: '#1a1a2e',
                uiBg: '#16213e', userMsgBg: '#0f3460', aiMsgBg: '#1e2a4a',
                accent: '#e94560', borderColor: '#2a2a4a', inputBg: '#16213e',
                inputColor: '#e0e0e0', buttonBg: '#e94560', buttonColor: '#ffffff',
                linkColor: '#e94560', panelsBg: '#16213e',
                shadowColor: '#000000', blurTint: '#1a1a2e'
            },
            light: {
                bodyColor: '#333333', emColor: '#888888', chatBg: '#f5f5f5',
                uiBg: '#ffffff', userMsgBg: '#e3f2fd', aiMsgBg: '#fce4ec',
                accent: '#1976d2', borderColor: '#e0e0e0', inputBg: '#ffffff',
                inputColor: '#333333', buttonBg: '#1976d2', buttonColor: '#ffffff',
                linkColor: '#1976d2', panelsBg: '#f0f0f0',
                shadowColor: '#000000', blurTint: '#f5f5f5'
            },
            sakura: {
                bodyColor: '#4a2040', emColor: '#8a6080', chatBg: '#fff0f5',
                uiBg: '#fff5f8', userMsgBg: '#ffe0ec', aiMsgBg: '#fff0f5',
                accent: '#e91e8c', borderColor: '#f0c0d8', inputBg: '#fff5f8',
                inputColor: '#4a2040', buttonBg: '#e91e8c', buttonColor: '#ffffff',
                linkColor: '#e91e8c', panelsBg: '#fff0f3',
                shadowColor: '#e91e8c', blurTint: '#fff0f5'
            },
            ocean: {
                bodyColor: '#c0d8e8', emColor: '#8098b0', chatBg: '#0a1628',
                uiBg: '#0d1f3c', userMsgBg: '#1a3a5c', aiMsgBg: '#0f2844',
                accent: '#00bcd4', borderColor: '#1a3050', inputBg: '#0d1f3c',
                inputColor: '#c0d8e8', buttonBg: '#00bcd4', buttonColor: '#ffffff',
                linkColor: '#00bcd4', panelsBg: '#0d1f3c',
                shadowColor: '#001020', blurTint: '#0a1628'
            },
            forest: {
                bodyColor: '#c8d6c0', emColor: '#889878', chatBg: '#1a2416',
                uiBg: '#1e2a1a', userMsgBg: '#2a3a22', aiMsgBg: '#1e2e1a',
                accent: '#4caf50', borderColor: '#2a3a22', inputBg: '#1e2a1a',
                inputColor: '#c8d6c0', buttonBg: '#4caf50', buttonColor: '#ffffff',
                linkColor: '#4caf50', panelsBg: '#1e2a1a',
                shadowColor: '#0a1408', blurTint: '#1a2416'
            }
        };

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = presets[btn.dataset.preset];
                if (!preset) return;
                for (const [key, value] of Object.entries(preset)) {
                    const colorInput = document.getElementById(`tc-${key}`);
                    const textInput = document.querySelector(`[data-color="tc-${key}"]`);
                    if (colorInput) colorInput.value = value;
                    if (textInput) textInput.value = value;
                }
            });
        });
    },

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
                    if (data.name) {
                        const nameEl = document.getElementById('theme-name');
                        if (nameEl) nameEl.value = data.name;
                    }
                    if (data.author) {
                        const authorEl = document.getElementById('theme-author');
                        if (authorEl) authorEl.value = data.author;
                    }
                    if (data.colors) {
                        for (const [key, value] of Object.entries(data.colors)) {
                            const colorInput = document.getElementById(`tc-${key}`);
                            const textInput = document.querySelector(`[data-color="tc-${key}"]`);
                            if (colorInput) colorInput.value = value;
                            if (textInput) textInput.value = value;
                        }
                    }
                    if (label) label.textContent = file.name;
                    this._showToast('主题已导入');
                } catch (err) {
                    this._showToast('导入失败：无效的 JSON 文件');
                }
            };
            reader.readAsText(file);
        });
    },

    getData() {
        const colors = {};
        document.querySelectorAll('input[type="color"]').forEach(input => {
            const key = input.id.replace('tc-', '');
            colors[key] = input.value;
        });

        return {
            name: document.getElementById('theme-name')?.value || 'My Theme',
            author: document.getElementById('theme-author')?.value || 'Anonymous',
            version: '1.0.0',
            colors: colors
        };
    },

    getPreviewFiles() {
        const data = this.getData();
        const css = this._generateCSS(data);
        return [
            { name: 'theme.json', content: JSON.stringify(data, null, 2), lang: 'json' },
            { name: 'style.css', content: css, lang: 'css' }
        ];
    },

    _generateCSS(data) {
        const c = data.colors;
        return `/* ${data.name} - SillyTavern Theme */
/* Author: ${data.author} */
/* 直接粘贴到 SillyTavern 自定义 CSS 中即可生效 */

:root {
  --SmartThemeBodyColor: ${c.bodyColor};
  --SmartThemeEmColor: ${c.emColor};
  --SmartThemeChatBg: ${c.chatBg};
  --SmartThemeBg: ${c.uiBg};
  --SmartThemeUserMsgBg: ${c.userMsgBg};
  --SmartThemeAIMsgBg: ${c.aiMsgBg};
  --SmartThemeAccent: ${c.accent};
  --SmartThemeBorderColor: ${c.borderColor};
  --SmartThemeInputBg: ${c.inputBg};
  --SmartThemeInputColor: ${c.inputColor};
  --SmartThemeButtonBg: ${c.buttonBg};
  --SmartThemeButtonColor: ${c.buttonColor};
  --SmartThemeLinkColor: ${c.linkColor};
  --SmartThemePanelsBg: ${c.panelsBg};
  --SmartThemeShadowColor: ${c.shadowColor || 'rgba(0,0,0,0.3)'};
  --SmartThemeBlurTintColor: ${c.blurTint || 'rgba(26,26,46,0.7)'};
}

/* 可选：更深度的自定义（取消注释以启用） */
/*
.mes {
  background: var(--SmartThemeAIMsgBg);
}
.mes[is_user="true"] {
  background: var(--SmartThemeUserMsgBg);
}
input, textarea, select {
  background: var(--SmartThemeInputBg) !important;
  color: var(--SmartThemeInputColor) !important;
  border-color: var(--SmartThemeBorderColor) !important;
}
button, .menu_button {
  background: var(--SmartThemeButtonBg) !important;
  color: var(--SmartThemeButtonColor) !important;
}
a {
  color: var(--SmartThemeLinkColor);
}
*/
`;
    },

    download() {
        const data = this.getData();
        const name = data.name.replace(/\s+/g, '-').toLowerCase() || 'theme';
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

    loadDraft(data) {
        const nameEl = document.getElementById('theme-name');
        if (nameEl && data.name) nameEl.value = data.name;
        const authorEl = document.getElementById('theme-author');
        if (authorEl && data.author) authorEl.value = data.author;

        const colors = data.colors || {};
        for (const [key, value] of Object.entries(colors)) {
            const el = document.getElementById('tc-' + key);
            if (el) el.value = value;
        }
    }
};
