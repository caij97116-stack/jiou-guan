const RegexToolGenerator = {
    title: 'Regex',

    commonPatterns: [
        {
            category: '酒馆世界书常用',
            patterns: [
                { name: '精确匹配中文词', regex: '角色名|昵称|称呼', desc: '匹配任意一个词' },
                { name: '中文词边界匹配', regex: '(?<![一-鿿])角色名(?![一-鿿])', desc: '避免匹配到长词的一部分' },
                { name: '多个别名', regex: 'Alice|AL|艾莉丝', desc: '匹配角色的多个称呼' },
                { name: '整词匹配', regex: '\\bsword\\b', desc: '匹配完整英文单词，不会匹配 swordsman' },
                { name: '忽略大小写', regex: '(?i)dragon', desc: '匹配 Dragon, dragon, DRAGON' },
                { name: '匹配任意表情', regex: '[😀-🙏]', desc: '匹配常见 emoji 表情' },
            ]
        },
        {
            category: 'RPG 数值匹配',
            patterns: [
                { name: '伤害数值', regex: '(\\d+)点?伤害', desc: '匹配"30伤害"或"30点伤害"，捕获数值' },
                { name: 'HP/MP 变化', regex: '[Hh][Pp]\\s*[-+]\\s*\\d+', desc: '匹配 HP+10, hp -5 等' },
                { name: '掷骰表达式', regex: '(\\d+)?[dD](\\d+)([+-]\\d+)?', desc: '匹配 2d6, 1d20+5, 3D8-1' },
                { name: '等级范围', regex: '[Ll][Vv]\\.?\\s*\\d+', desc: '匹配 Lv.10, lv5, LV99' },
                { name: '物品数量', regex: '[×xX]\\s*(\\d+)', desc: '匹配 x5, 10 等数量标记' },
                { name: '百分比', regex: '(\\d+(?:\\.\\d+)?)\\s*%', desc: '匹配 50%, 33.3%' },
            ]
        },
        {
            category: '文本处理',
            patterns: [
                { name: '提取引号内容', regex: '[""]([^""]+)[""]', desc: '匹配双引号内的文本' },
                { name: '提取括号内容', regex: '\\(([^)]+)\\)', desc: '匹配圆括号内的文本' },
                { name: '提取方括号内容', regex: '\\[([^\\]]+)\\]', desc: '匹配方括号内的文本' },
                { name: '提取星号动作', regex: '\\*([^*]+)\\*', desc: '匹配*动作描述*' },
                { name: '分割对话和动作', regex: '^([^*].*?)(?=\\*|$)', desc: '匹配非动作的对话文本' },
                { name: '以 START 分割', regex: '<START>', desc: '分割对话示例' },
            ]
        },
        {
            category: '基础匹配',
            patterns: [
                { name: '纯数字', regex: '\\d+', desc: '匹配一个或多个数字' },
                { name: '中文汉字', regex: '[\\u4e00-\\u9fff]+', desc: '匹配一个或多个中文汉字' },
                { name: '英文单词', regex: '[a-zA-Z]+', desc: '匹配一个或多个英文字母' },
                { name: 'URL 链接', regex: 'https?://[^\\s]+', desc: '匹配网址' },
                { name: '邮箱地址', regex: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', desc: '匹配邮箱地址' },
                { name: '日期格式', regex: '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}', desc: '匹配 2024-01-01 或 2024/1/1' },
                { name: '空行分割', regex: '\\n\\s*\\n', desc: '匹配段落之间的空行' },
            ]
        }
    ],

    syntaxRef: [
        { section: '基础元字符', items: [
            { char: '.', desc: '匹配任意单个字符（除换行）' },
            { char: '\\d', desc: '匹配数字 [0-9]' },
            { char: '\\D', desc: '匹配非数字' },
            { char: '\\w', desc: '匹配字母数字下划线 [a-zA-Z0-9_]' },
            { char: '\\W', desc: '匹配非字母数字下划线' },
            { char: '\\s', desc: '匹配空白字符（空格、制表、换行）' },
            { char: '\\S', desc: '匹配非空白字符' },
            { char: '\\b', desc: '单词边界' },
            { char: '\\B', desc: '非单词边界' },
            { char: '\\n', desc: '换行符' },
            { char: '\\t', desc: '制表符' },
        ]},
        { section: '量词（重复次数）', items: [
            { char: '*', desc: '0 次或多次' },
            { char: '+', desc: '1 次或多次' },
            { char: '?', desc: '0 次或 1 次（可选）' },
            { char: '{n}', desc: '恰好 n 次' },
            { char: '{n,}', desc: '至少 n 次' },
            { char: '{n,m}', desc: 'n 到 m 次' },
            { char: '*?', desc: '0 次或多次（非贪婪）' },
            { char: '+?', desc: '1 次或多次（非贪婪）' },
        ]},
        { section: '字符类', items: [
            { char: '[abc]', desc: '匹配 a、b 或 c 中任意一个' },
            { char: '[^abc]', desc: '匹配除 a、b、c 外的任意字符' },
            { char: '[a-z]', desc: '匹配 a 到 z 的任意小写字母' },
            { char: '[0-9]', desc: '匹配 0 到 9 的任意数字' },
            { char: '[\\u4e00-\\u9fff]', desc: '匹配一个中文汉字' },
        ]},
        { section: '分组与捕获', items: [
            { char: '(abc)', desc: '捕获组，匹配并记住 abc' },
            { char: '(?:abc)', desc: '非捕获组，匹配但不记住' },
            { char: '(?<name>abc)', desc: '命名捕获组' },
            { char: '\\1, \\2', desc: '反向引用第 1、2 个捕获组' },
            { char: 'a|b', desc: '或，匹配 a 或 b' },
        ]},
        { section: '断言（环视）', items: [
            { char: '(?=abc)', desc: '正向先行断言：后面是 abc' },
            { char: '(?!abc)', desc: '负向先行断言：后面不是 abc' },
            { char: '(?<=abc)', desc: '正向后行断言：前面是 abc' },
            { char: '(?<!abc)', desc: '负向后行断言：前面不是 abc' },
        ]},
        { section: '锚点', items: [
            { char: '^', desc: '行的开头' },
            { char: '$', desc: '行的结尾' },
            { char: '\\A', desc: '字符串开头' },
            { char: '\\Z', desc: '字符串结尾' },
        ]},
        { section: '标志（Flags）', items: [
            { char: '/.../g', desc: '全局匹配（找所有结果）' },
            { char: '/.../i', desc: '忽略大小写' },
            { char: '/.../m', desc: '多行模式（^$ 匹配行首尾）' },
            { char: '/.../s', desc: 'dotAll（. 也匹配换行）' },
            { char: '/.../u', desc: 'Unicode 模式' },
        ]},
    ],

    render(container) {
        const patternsHTML = this.commonPatterns.map(cat => `
            <div class="regex-category">
                <h3 class="regex-cat-title">${cat.category}</h3>
                <div class="regex-pattern-list">
                    ${cat.patterns.map(p => `
                        <div class="regex-pattern-item" data-regex="${this.escapeAttr(p.regex)}" data-name="${this.escapeAttr(p.name)}">
                            <div class="regex-pattern-name">${this.escapeHTML(p.name)}</div>
                            <code class="regex-pattern-expr">${this.escapeHTML(p.regex)}</code>
                            <div class="regex-pattern-desc">${this.escapeHTML(p.desc)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const syntaxHTML = this.syntaxRef.map(s => `
            <div class="regex-category">
                <h3 class="regex-cat-title">${s.section}</h3>
                <table class="regex-syntax-table">
                    ${s.items.map(item => `
                        <tr>
                            <td class="regex-syntax-char"><code>${item.char}</code></td>
                            <td class="regex-syntax-desc">${item.desc}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="regex-layout">
                <div class="regex-main-col">
                    <div class="form-section">
                        <h3 class="form-section-title">正则表达式测试器</h3>
                        <div class="form-group">
                            <label class="form-label">正则表达式</label>
                            <div class="regex-input-row">
                                <input type="text" class="form-input regex-test-pattern" id="regex-pattern" placeholder="输入正则表达式，如 (\\d+)点?伤害">
                                <span class="regex-flags" id="regex-flags-display"></span>
                                <button class="btn btn-small btn-secondary" id="btn-regex-clear">清空</button>
                            </div>
                            <div class="regex-flag-toggles">
                                <label class="regex-flag-label"><input type="checkbox" class="regex-flag" data-flag="g" checked> 全局 g</label>
                                <label class="regex-flag-label"><input type="checkbox" class="regex-flag" data-flag="i"> 忽略大小写 i</label>
                                <label class="regex-flag-label"><input type="checkbox" class="regex-flag" data-flag="m"> 多行 m</label>
                                <label class="regex-flag-label"><input type="checkbox" class="regex-flag" data-flag="s"> 点匹配换行 s</label>
                                <label class="regex-flag-label"><input type="checkbox" class="regex-flag" data-flag="u"> Unicode u</label>
                            </div>
                            <div class="regex-error" id="regex-error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">测试文本</label>
                            <textarea class="form-textarea regex-test-text" id="regex-test-text" rows="6" placeholder="在此粘贴要测试的文本...&#10;&#10;例如：&#10;角色受到了30点伤害！&#10;HP -15，状态变为虚弱&#10;Alice 使用魔法攻击造成了 50点伤害"></textarea>
                        </div>
                        <div class="regex-match-result" id="regex-match-result">
                            <div class="regex-match-empty">输入正则和测试文本查看匹配结果</div>
                        </div>
                    </div>
                </div>
                <div class="regex-side-col">
                    <div class="regex-side-tabs">
                        <button class="regex-side-tab active" data-regextab="regex-patterns">预置模式</button>
                        <button class="regex-side-tab" data-regextab="regex-syntax">语法速查</button>
                    </div>
                    <div class="regex-side-content active" id="regex-patterns">
                        ${patternsHTML}
                    </div>
                    <div class="regex-side-content" id="regex-syntax">
                        ${syntaxHTML}
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    },

    _bindEvents() {
        const patternInput = document.getElementById('regex-pattern');
        const testText = document.getElementById('regex-test-text');
        const clearBtn = document.getElementById('btn-regex-clear');
        const errorEl = document.getElementById('regex-error');

        if (patternInput) {
            patternInput.addEventListener('input', () => this._runTest());
        }
        if (testText) {
            testText.addEventListener('input', () => this._runTest());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (patternInput) patternInput.value = '';
                if (testText) testText.value = '';
                this._runTest();
            });
        }

        document.querySelectorAll('.regex-flag').forEach(cb => {
            cb.addEventListener('change', () => {
                this._updateFlagsDisplay();
                this._runTest();
            });
        });

        document.querySelectorAll('.regex-side-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.regextab;
                document.querySelectorAll('.regex-side-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.regex-side-content').forEach(c => c.classList.remove('active'));
                document.getElementById(tabName).classList.add('active');
            });
        });

        document.querySelectorAll('.regex-pattern-item').forEach(item => {
            item.addEventListener('click', () => {
                const regex = item.dataset.regex;
                const patternInput = document.getElementById('regex-pattern');
                if (patternInput && regex) {
                    patternInput.value = regex;
                    this._runTest();
                    patternInput.scrollIntoView({ behavior: 'smooth' });
                    patternInput.focus();
                }
            });
        });

        this._updateFlagsDisplay();
    },

    _getFlags() {
        const flags = [];
        document.querySelectorAll('.regex-flag:checked').forEach(cb => {
            flags.push(cb.dataset.flag);
        });
        return flags.join('');
    },

    _updateFlagsDisplay() {
        const display = document.getElementById('regex-flags-display');
        const flags = this._getFlags();
        if (display) {
            display.textContent = flags ? '/' + flags : '';
        }
    },

    _runTest() {
        const patternInput = document.getElementById('regex-pattern');
        const testTextEl = document.getElementById('regex-test-text');
        const resultEl = document.getElementById('regex-match-result');
        const errorEl = document.getElementById('regex-error');

        if (!patternInput || !testTextEl || !resultEl) return;

        const pattern = patternInput.value.trim();
        const text = testTextEl.value;
        const flags = this._getFlags();

        errorEl.textContent = '';
        errorEl.classList.remove('visible');

        if (!pattern && !text) {
            resultEl.innerHTML = '<div class="regex-match-empty">输入正则和测试文本查看匹配结果</div>';
            return;
        }

        if (!pattern) {
            resultEl.innerHTML = '<div class="regex-match-empty">请输入正则表达式</div>';
            return;
        }

        let regex;
        try {
            regex = new RegExp(pattern, flags);
        } catch (e) {
            errorEl.textContent = '语法错误: ' + e.message;
            errorEl.classList.add('visible');
            resultEl.innerHTML = '';
            return;
        }

        if (!text) {
            resultEl.innerHTML = '<div class="regex-match-empty">请输入测试文本</div>';
            return;
        }

        const matches = [];
        let match;
        if (flags.includes('g')) {
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    text: match[0],
                    groups: match.slice(1)
                });
                if (match[0].length === 0) {
                    regex.lastIndex++;
                    if (regex.lastIndex > text.length) break;
                }
            }
        } else {
            match = regex.exec(text);
            if (match) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    text: match[0],
                    groups: match.slice(1)
                });
            }
        }

        if (matches.length === 0) {
            resultEl.innerHTML = '<div class="regex-match-empty">无匹配结果</div>';
            return;
        }

        const highlightedText = this._highlightMatches(text, matches);
        let groupsHTML = '';

        const hasGroups = matches.some(m => m.groups.length > 0);
        if (hasGroups) {
            groupsHTML = `
                <div class="regex-groups-section">
                    <div class="regex-groups-title">捕获组</div>
                    <table class="regex-groups-table">
                        <thead><tr><th>#</th><th>匹配文本</th><th>组内容</th></tr></thead>
                        <tbody>
                            ${matches.map((m, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td><code>${this.escapeHTML(m.text)}</code></td>
                                    <td>${m.groups.map((g, j) => '<span class="regex-group-badge">$' + (j + 1) + ': ' + this.escapeHTML(g || '') + '</span>').join(' ')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        resultEl.innerHTML = `
            <div class="regex-match-header">
                共 <strong>${matches.length}</strong> 处匹配
            </div>
            <div class="regex-highlighted-text">${highlightedText}</div>
            ${groupsHTML}
            <div class="regex-match-list">
                <div class="regex-match-list-title">匹配列表</div>
                ${matches.map((m, i) => `
                    <div class="regex-match-item">
                        <span class="regex-match-index">${i + 1}</span>
                        <code class="regex-match-text">${this.escapeHTML(m.text)}</code>
                        <span class="regex-match-pos">位置 ${m.index}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    _highlightMatches(text, matches) {
        let result = '';
        let lastEnd = 0;

        for (const m of matches) {
            if (m.index > lastEnd) {
                result += this.escapeHTML(text.substring(lastEnd, m.index));
            }
            result += '<mark class="regex-highlight">' + this.escapeHTML(m.text) + '</mark>';
            lastEnd = m.index + m.length;
        }

        if (lastEnd < text.length) {
            result += this.escapeHTML(text.substring(lastEnd));
        }

        return result;
    },

    getPreviewFiles() {
        return [{ name: '提示', content: '正则工具为在线测试工具，无需下载文件。你可以复制预置模式中的正则表达式到世界书或扩展中使用。', lang: 'text' }];
    },

    download() {},

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
};
