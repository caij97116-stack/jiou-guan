(function() {
    'use strict';

    const generators = {
        extension: ExtensionGenerator,
        'character-card': CharacterCardGenerator,
        'world-info': WorldInfoGenerator,
        theme: ThemeGenerator,
        'quick-reply': QuickReplyGenerator
    };

    let currentType = 'extension';
    let previewVisible = false;

    function init() {
        bindNavItems();
        bindTopActions();
        switchGenerator('extension');
    }

    function bindNavItems() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                if (type === currentType) return;

                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                switchGenerator(type);
            });
        });
    }

    function bindTopActions() {
        document.getElementById('btn-preview').addEventListener('click', togglePreview);
        document.getElementById('btn-close-preview').addEventListener('click', () => {
            hidePreview();
        });
        document.getElementById('btn-download').addEventListener('click', handleDownload);
    }

    function switchGenerator(type) {
        currentType = type;
        const generator = generators[type];
        if (!generator) return;

        const titleMap = {
            extension: '扩展 Extension',
            'character-card': '角色卡 Character Card',
            'world-info': '世界书 World Info',
            theme: '主题 Theme',
            'quick-reply': '快速回复 Quick Reply'
        };
        document.getElementById('current-title').textContent = (titleMap[type] || generator.title) + ' 创建器';

        const editorPanel = document.getElementById('editor-panel');
        editorPanel.innerHTML = '';
        generator.render(editorPanel);

        if (type === 'extension' && generator.applyTemplate) {
            generator.applyTemplate('blank');
        }

        if (previewVisible) {
            updatePreview();
        }
    }

    function togglePreview() {
        previewVisible = !previewVisible;

        const previewPanel = document.getElementById('preview-panel');
        const btn = document.getElementById('btn-preview');

        if (previewVisible) {
            previewPanel.classList.remove('hidden');
            btn.textContent = '隐藏预览';
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-secondary');
            updatePreview();
        } else {
            hidePreview();
        }
    }

    function hidePreview() {
        previewVisible = false;
        document.getElementById('preview-panel').classList.add('hidden');
        const btn = document.getElementById('btn-preview');
        btn.textContent = '预览代码';
        btn.classList.add('btn-secondary');
        btn.classList.remove('btn-primary');
    }

    function updatePreview() {
        const generator = generators[currentType];
        if (!generator || !generator.getPreviewFiles) return;

        const files = generator.getPreviewFiles();
        const tabsContainer = document.getElementById('preview-tabs');
        const contentContainer = document.getElementById('preview-content');

        tabsContainer.innerHTML = '';
        files.forEach((file, i) => {
            const tab = document.createElement('button');
            tab.className = 'preview-tab' + (i === 0 ? ' active' : '');
            tab.textContent = file.name;
            tab.addEventListener('click', () => {
                tabsContainer.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                showFileContent(file);
            });
            tabsContainer.appendChild(tab);
        });

        if (files.length > 0) {
            showFileContent(files[0]);
        }
    }

    function showFileContent(file) {
        const contentContainer = document.getElementById('preview-content');
        const lang = file.lang || '';
        const escaped = escapeHTML(file.content);
        contentContainer.innerHTML = `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    }

    function handleDownload() {
        const generator = generators[currentType];
        if (!generator) return;

        if (generator.download) {
            generator.download();
            showToast('下载已开始!', 'success');
        } else {
            showToast('此类型暂不支持下载', 'error');
        }
    }

    function showToast(message, type) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
