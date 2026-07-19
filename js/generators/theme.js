const ThemeGenerator = {
    title: 'Theme',
    defaultTheme: {
        name: '',
        author: '',
        version: '1.0.0',
        colors: {
            mainText: '#d4d4d4',
            italics: '#a0a0b0',
            chatBackground: '#1a1a2e',
            uiBackground: '#16213e',
            userMessage: '#0f3460',
            aiMessage: '#1e2a4a',
            accent: '#e94560',
            border: '#2a2a4a',
            inputBackground: '#16213e',
            inputText: '#e0e0e0',
            buttonBackground: '#e94560',
            buttonText: '#ffffff',
            link: '#e94560'
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
                <h3 class="form-section-title">配色方案</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">主文字颜色</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-mainText" value="#d4d4d4">
                            <input type="text" class="form-input" value="#d4d4d4" data-color="tc-mainText">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">斜体文字</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-italics" value="#a0a0b0">
                            <input type="text" class="form-input" value="#a0a0b0" data-color="tc-italics">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">聊天背景</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-chatBackground" value="#1a1a2e">
                            <input type="text" class="form-input" value="#1a1a2e" data-color="tc-chatBackground">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">UI 背景</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-uiBackground" value="#16213e">
                            <input type="text" class="form-input" value="#16213e" data-color="tc-uiBackground">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">用户消息气泡</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-userMessage" value="#0f3460">
                            <input type="text" class="form-input" value="#0f3460" data-color="tc-userMessage">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">AI 消息气泡</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-aiMessage" value="#1e2a4a">
                            <input type="text" class="form-input" value="#1e2a4a" data-color="tc-aiMessage">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">强调色</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-accent" value="#e94560">
                            <input type="text" class="form-input" value="#e94560" data-color="tc-accent">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">边框颜色</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-border" value="#2a2a4a">
                            <input type="text" class="form-input" value="#2a2a4a" data-color="tc-border">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">输入框背景</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-inputBackground" value="#16213e">
                            <input type="text" class="form-input" value="#16213e" data-color="tc-inputBackground">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">输入框文字</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-inputText" value="#e0e0e0">
                            <input type="text" class="form-input" value="#e0e0e0" data-color="tc-inputText">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">按钮背景</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-buttonBackground" value="#e94560">
                            <input type="text" class="form-input" value="#e94560" data-color="tc-buttonBackground">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">按钮文字</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="tc-buttonText" value="#ffffff">
                            <input type="text" class="form-input" value="#ffffff" data-color="tc-buttonText">
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
        `;

        this._initColorSync();
        this._initPresets();
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
                if (colorInput) colorInput.value = textInput.value;
            });
        });
    },

    _initPresets() {
        const presets = {
            dark: {
                mainText: '#d4d4d4', italics: '#a0a0b0', chatBackground: '#1a1a2e',
                uiBackground: '#16213e', userMessage: '#0f3460', aiMessage: '#1e2a4a',
                accent: '#e94560', border: '#2a2a4a', inputBackground: '#16213e',
                inputText: '#e0e0e0', buttonBackground: '#e94560', buttonText: '#ffffff',
                link: '#e94560'
            },
            light: {
                mainText: '#333333', italics: '#888888', chatBackground: '#f5f5f5',
                uiBackground: '#ffffff', userMessage: '#e3f2fd', aiMessage: '#fce4ec',
                accent: '#1976d2', border: '#e0e0e0', inputBackground: '#ffffff',
                inputText: '#333333', buttonBackground: '#1976d2', buttonText: '#ffffff',
                link: '#1976d2'
            },
            sakura: {
                mainText: '#4a2040', italics: '#8a6080', chatBackground: '#fff0f5',
                uiBackground: '#fff5f8', userMessage: '#ffe0ec', aiMessage: '#fff0f5',
                accent: '#e91e8c', border: '#f0c0d8', inputBackground: '#fff5f8',
                inputText: '#4a2040', buttonBackground: '#e91e8c', buttonText: '#ffffff',
                link: '#e91e8c'
            },
            ocean: {
                mainText: '#c0d8e8', italics: '#8098b0', chatBackground: '#0a1628',
                uiBackground: '#0d1f3c', userMessage: '#1a3a5c', aiMessage: '#0f2844',
                accent: '#00bcd4', border: '#1a3050', inputBackground: '#0d1f3c',
                inputText: '#c0d8e8', buttonBackground: '#00bcd4', buttonText: '#ffffff',
                link: '#00bcd4'
            },
            forest: {
                mainText: '#c8d6c0', italics: '#889878', chatBackground: '#1a2416',
                uiBackground: '#1e2a1a', userMessage: '#2a3a22', aiMessage: '#1e2e1a',
                accent: '#4caf50', border: '#2a3a22', inputBackground: '#1e2a1a',
                inputText: '#c8d6c0', buttonBackground: '#4caf50', buttonText: '#ffffff',
                link: '#4caf50'
            }
        };

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = presets[btn.dataset.preset];
                for (const [key, value] of Object.entries(preset)) {
                    const colorInput = document.getElementById(`tc-${key}`);
                    const textInput = document.querySelector(`[data-color="tc-${key}"]`);
                    if (colorInput) colorInput.value = value;
                    if (textInput) textInput.value = value;
                }
            });
        });
    },

    getData() {
        const colors = {};
        document.querySelectorAll('input[type="color"]').forEach(input => {
            const key = input.id.replace('tc-', '');
            colors[key] = input.value;
        });

        return {
            name: document.getElementById('theme-name').value || 'My Theme',
            author: document.getElementById('theme-author').value || 'Anonymous',
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

:root {
  --main-text-color: ${c.mainText};
  --italics-color: ${c.italics};
  --chat-bg: ${c.chatBackground};
  --ui-bg: ${c.uiBackground};
  --user-msg-bg: ${c.userMessage};
  --ai-msg-bg: ${c.aiMessage};
  --accent-color: ${c.accent};
  --border-color: ${c.border};
  --input-bg: ${c.inputBackground};
  --input-text-color: ${c.inputText};
  --button-bg: ${c.buttonBackground};
  --button-text-color: ${c.buttonText};
  --link-color: ${c.link || c.accent};
}

body {
  background: ${c.uiBackground};
  color: ${c.mainText};
}

#chat {
  background: ${c.chatBackground};
}

.mes {
  background: ${c.aiMessage};
}

.mes[is_user="true"] {
  background: ${c.userMessage};
}

input, textarea, select {
  background: ${c.inputBackground} !important;
  color: ${c.inputText} !important;
  border-color: ${c.border} !important;
}

button, .menu_button {
  background: ${c.buttonBackground} !important;
  color: ${c.buttonText} !important;
}

a {
  color: ${c.link || c.accent};
}
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

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
