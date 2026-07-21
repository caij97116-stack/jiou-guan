(function() {
    'use strict';

    const generators = {
        extension: ExtensionGenerator,
        'character-card': CharacterCardGenerator,
        'world-info': WorldInfoGenerator,
        theme: ThemeAIGenerator,
        'quick-reply': QuickReplyGenerator,
        'regex-tool': RegexToolGenerator,
        'preset-jailbreak': PresetJailbreakGenerator
    };

    let currentType = 'extension';
    let previewVisible = false;
    let sidebarOpen = false;
    let draftSaveTimer = null;
    let draftLoaded = false;
    let draftBannerDismissed = {};

    function init() {
        bindNavItems();
        bindTopActions();
        bindMobileMenu();
        bindDraftBanner();
        switchGenerator('extension');
    }

    function bindMobileMenu() {
        const btn = document.getElementById('btn-mobile-menu');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!btn || !sidebar || !overlay) return;

        function openSidebar() {
            sidebarOpen = true;
            sidebar.classList.add('open');
            overlay.classList.add('active');
        }

        function closeSidebar() {
            sidebarOpen = false;
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            sidebarOpen ? closeSidebar() : openSidebar();
        });

        overlay.addEventListener('click', closeSidebar);

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (sidebarOpen) closeSidebar();
            });
        });
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

    function bindDraftBanner() {
        document.getElementById('btn-draft-restore').addEventListener('click', () => {
            restoreDraft();
        });
        document.getElementById('btn-draft-dismiss').addEventListener('click', () => {
            const type = currentType;
            draftBannerDismissed[type] = true;
            DraftManager.remove(type);
            hideDraftBanner();
        });
    }

    function startAutoSave() {
        if (draftSaveTimer) clearInterval(draftSaveTimer);
        draftSaveTimer = setInterval(() => {
            saveCurrentDraft();
        }, 3000);
    }

    function stopAutoSave() {
        if (draftSaveTimer) {
            clearInterval(draftSaveTimer);
            draftSaveTimer = null;
        }
    }

    function saveCurrentDraft() {
        if (draftLoaded) return;
        const generator = generators[currentType];
        if (!generator || !generator.getData) return;
        try {
            const data = generator.getData();
            DraftManager.save(currentType, data);
        } catch (e) {}
    }

    function restoreDraft() {
        const generator = generators[currentType];
        const data = DraftManager.load(currentType);
        if (!generator || !data) return;

        const editorPanel = document.getElementById('editor-panel');
        editorPanel.innerHTML = '';
        generator.render(editorPanel);

        if (generator.loadDraft) {
            generator.loadDraft(data);
        }

        if (currentType === 'extension' && generator.applyTemplate) {
            generator.applyTemplate('blank');
        }

        draftLoaded = true;
        hideDraftBanner();
        startAutoSave();
        showToast('草稿已恢复', 'success');
    }

    function showDraftBanner() {
        const banner = document.getElementById('draft-banner');
        if (banner) banner.style.display = 'flex';
    }

    function hideDraftBanner() {
        const banner = document.getElementById('draft-banner');
        if (banner) banner.style.display = 'none';
    }

    function switchGenerator(type) {
        saveCurrentDraft();
        stopAutoSave();
        draftLoaded = false;

        currentType = type;
        const generator = generators[type];
        if (!generator) return;

        const titleMap = {
            extension: '扩展 Extension',
            'character-card': '角色卡 Character Card',
            'world-info': '世界书 World Info',
            theme: '主题 AI 助手',
            'quick-reply': '快速回复 Quick Reply',
            'regex-tool': '正则工具 Regex Tool',
            'preset-jailbreak': '预设/破限 Preset & Jailbreak'
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

        if (DraftManager.hasDraft(type) && !draftBannerDismissed[type]) {
            showDraftBanner();
        } else {
            hideDraftBanner();
        }

        startAutoSave();
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

        if (generator.validate) {
            const result = generator.validate();
            if (!result.valid) {
                showToast(result.errors.join('；'), 'error');
                return;
            }
        }

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
