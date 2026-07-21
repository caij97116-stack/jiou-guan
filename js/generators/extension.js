const EXTENSION_TEMPLATES = {
    blank: {
        name: '空白模板',
        icon: '&#128221;',
        desc: '从零开始，包含基本的命令注册和事件监听骨架',
        tags: ['入门', '自定义'],
        manifest: {
            display_name: 'My Extension',
            loading_order: 900,
            requires: [],
            optional: [],
            js: 'index.js',
            css: '',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types } from '../../../../../script.js';

// 扩展名称，用于设置存储
const EXTENSION_NAME = 'my_extension';

// 默认设置
const defaultSettings = {
    enabled: true
};

jQuery(async () => {
    // 加载设置（如果不存在则使用默认值）
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    // 注册斜杠命令
    // /mycommand 参数 -> 执行回调
    registerSlashCommand('mycommand', (args, value) => {
        console.log('命令参数:', args);
        console.log('完整命令:', value);
        return '你好！这是我的扩展返回的消息。';
    });

    // 监听消息接收事件
    // 每次 AI 回复消息后触发
    eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
        console.log('收到消息:', data);
    });

    // 监听消息发送事件
    eventSource.on(event_types.MESSAGE_SENT, (data) => {
        console.log('发送消息:', data);
    });

    // 监听聊天切换事件
    eventSource.on(event_types.CHAT_CHANGED, () => {
        console.log('切换了聊天');
    });

    console.log('扩展已加载: ' + EXTENSION_NAME);
});
`,
        styleCSS: ''
    },

    musicPlayer: {
        name: '音乐播放器',
        icon: '&#127925;',
        desc: '在酒馆中嵌入一个浮动音频播放器，支持 URL 播放、播放列表、BGM 管理',
        tags: ['媒体', 'UI面板', '斜杠命令'],
        manifest: {
            display_name: 'Music Player',
            loading_order: 950,
            requires: [],
            optional: [],
            js: 'index.js',
            css: 'style.css',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types } from '../../../../../script.js';

const EXTENSION_NAME = 'music_player';

// 默认设置
const defaultSettings = {
    enabled: true,
    playlist: [],
    currentIndex: -1,
    volume: 0.5,
    loop: false,
    autoplay: false
};

let currentAudio = null;
let panelVisible = false;

// 创建播放器 UI 面板
function createPlayerPanel() {
    // 检查是否已存在面板
    if (document.getElementById('music-player-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'music-player-panel';
    panel.className = 'st-extension-panel music-player-panel';
    panel.innerHTML = \`
        <div class="music-player-header">
            <span class="music-player-title">Music Player</span>
            <div class="music-player-controls-top">
                <button class="music-btn music-btn-minimize" title="最小化">_</button>
                <button class="music-btn music-btn-close" title="关闭">&times;</button>
            </div>
        </div>
        <div class="music-player-body">
            <div class="music-player-now-playing">
                <span class="music-now-label">Now Playing:</span>
                <span class="music-now-title">-</span>
            </div>
            <div class="music-player-progress">
                <div class="music-progress-bar">
                    <div class="music-progress-fill"></div>
                </div>
                <span class="music-time">00:00 / 00:00</span>
            </div>
            <div class="music-player-buttons">
                <button class="music-btn" id="music-btn-prev" title="上一首">&#9664;&#9664;</button>
                <button class="music-btn music-btn-play" id="music-btn-play" title="播放/暂停">&#9654;</button>
                <button class="music-btn" id="music-btn-next" title="下一首">&#9654;&#9654;</button>
                <button class="music-btn" id="music-btn-loop" title="循环">&#128260;</button>
            </div>
            <div class="music-player-volume">
                <span>音量</span>
                <input type="range" class="music-volume-slider" min="0" max="100" value="50">
                <span class="music-volume-value">50%</span>
            </div>
            <div class="music-player-playlist">
                <div class="music-playlist-header">播放列表</div>
                <ul class="music-playlist-list"></ul>
            </div>
            <div class="music-player-add">
                <input type="text" class="music-add-input" placeholder="输入音频 URL 或本地路径...">
                <input type="text" class="music-add-name" placeholder="歌曲名称...">
                <button class="music-btn music-btn-add">添加</button>
            </div>
        </div>
    \`;

    // 插入到 #sheld 或 body 中
    const container = document.getElementById('sheld') || document.body;
    container.appendChild(panel);

    // 绑定事件
    bindPlayerEvents();

    // 更新播放列表 UI
    updatePlaylistUI();
}

function bindPlayerEvents() {
    const panel = document.getElementById('music-player-panel');
    if (!panel) return;

    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    // 最小化/关闭
    panel.querySelector('.music-btn-minimize').addEventListener('click', () => {
        panel.querySelector('.music-player-body').classList.toggle('music-minimized');
    });
    panel.querySelector('.music-btn-close').addEventListener('click', () => {
        panelVisible = false;
        panel.style.display = 'none';
        stopPlayback();
    });

    // 播放/暂停
    panel.querySelector('#music-btn-play').addEventListener('click', togglePlay);

    // 上一首/下一首
    panel.querySelector('#music-btn-prev').addEventListener('click', playPrev);
    panel.querySelector('#music-btn-next').addEventListener('click', playNext);

    // 循环
    panel.querySelector('#music-btn-loop').addEventListener('click', () => {
        settings.loop = !settings.loop;
        panel.querySelector('#music-btn-loop').classList.toggle('active', settings.loop);
        saveSettingsDebounced(EXTENSION_NAME, settings);
    });

    // 音量
    panel.querySelector('.music-volume-slider').addEventListener('input', (e) => {
        settings.volume = e.target.value / 100;
        if (currentAudio) currentAudio.volume = settings.volume;
        panel.querySelector('.music-volume-value').textContent = e.target.value + '%';
        saveSettingsDebounced(EXTENSION_NAME, settings);
    });

    // 添加歌曲
    panel.querySelector('.music-btn-add').addEventListener('click', () => {
        const urlInput = panel.querySelector('.music-add-input');
        const nameInput = panel.querySelector('.music-add-name');
        const url = urlInput.value.trim();
        const name = nameInput.value.trim() || url.split('/').pop() || '未命名';

        if (url) {
            settings.playlist.push({ name, url });
            urlInput.value = '';
            nameInput.value = '';
            saveSettingsDebounced(EXTENSION_NAME, settings);
            updatePlaylistUI();
        }
    });
}

function updatePlaylistUI() {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    const list = document.querySelector('.music-playlist-list');
    if (!list) return;

    list.innerHTML = '';
    settings.playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'music-playlist-item' + (index === settings.currentIndex ? ' active' : '');
        li.innerHTML = \`
            <span class="music-playlist-index">\${index + 1}.</span>
            <span class="music-playlist-name">\${escapeHTML(song.name)}</span>
            <button class="music-btn music-btn-remove" data-index="\${index}">&times;</button>
        \`;
        li.addEventListener('click', (e) => {
            if (!e.target.classList.contains('music-btn-remove')) {
                playIndex(index);
            }
        });
        li.querySelector('.music-btn-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            settings.playlist.splice(index, 1);
            if (settings.currentIndex === index) {
                stopPlayback();
                settings.currentIndex = -1;
            } else if (settings.currentIndex > index) {
                settings.currentIndex--;
            }
            saveSettingsDebounced(EXTENSION_NAME, settings);
            updatePlaylistUI();
        });
        list.appendChild(li);
    });
}

function playIndex(index) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (index < 0 || index >= settings.playlist.length) return;

    settings.currentIndex = index;
    saveSettingsDebounced(EXTENSION_NAME, settings);

    const song = settings.playlist[index];

    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    currentAudio = new Audio(song.url);
    currentAudio.volume = settings.volume;
    currentAudio.play().catch(err => console.log('播放失败:', err));

    document.querySelector('.music-now-title').textContent = song.name;
    document.querySelector('#music-btn-play').innerHTML = '&#9646;&#9646;';

    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', () => {
        if (settings.loop) {
            currentAudio.currentTime = 0;
            currentAudio.play();
        } else {
            playNext();
        }
    });

    updatePlaylistUI();
}

function togglePlay() {
    if (!currentAudio) {
        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
        if (settings.playlist.length > 0) {
            if (settings.currentIndex < 0) playIndex(0);
            else playIndex(settings.currentIndex);
        }
    } else if (currentAudio.paused) {
        currentAudio.play();
        document.querySelector('#music-btn-play').innerHTML = '&#9646;&#9646;';
    } else {
        currentAudio.pause();
        document.querySelector('#music-btn-play').innerHTML = '&#9654;';
    }
}

function playNext() {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (settings.playlist.length === 0) return;
    const next = (settings.currentIndex + 1) % settings.playlist.length;
    playIndex(next);
}

function playPrev() {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (settings.playlist.length === 0) return;
    const prev = settings.currentIndex <= 0 ? settings.playlist.length - 1 : settings.currentIndex - 1;
    playIndex(prev);
}

function stopPlayback() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    const nowTitle = document.querySelector('.music-now-title');
    if (nowTitle) nowTitle.textContent = '-';
    const playBtn = document.querySelector('#music-btn-play');
    if (playBtn) playBtn.innerHTML = '&#9654;';
}

function updateProgress() {
    if (!currentAudio) return;
    const fill = document.querySelector('.music-progress-fill');
    const time = document.querySelector('.music-time');
    if (!fill || !time) return;

    const pct = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
    fill.style.width = pct + '%';
    time.textContent = formatTime(currentAudio.currentTime) + ' / ' + formatTime(currentAudio.duration || 0);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 注册斜杠命令
jQuery(async () => {
    // /music - 打开/关闭音乐播放器
    registerSlashCommand('music', (args, value) => {
        if (args) {
            // /music play URL - 直接播放
            const parts = value.trim().split(/\\s+/);
            if (parts[0] === 'play' && parts[1]) {
                const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
                const url = parts[1];
                const name = parts.slice(2).join(' ') || url.split('/').pop();
                settings.playlist.push({ name, url });
                settings.currentIndex = settings.playlist.length - 1;
                saveSettingsDebounced(EXTENSION_NAME, settings);
                if (panelVisible) updatePlaylistUI();
                createPlayerPanel();
                playIndex(settings.currentIndex);
                return '正在播放: ' + name;
            }

            // /music add URL 名称 - 添加到列表
            if (parts[0] === 'add' && parts[1]) {
                const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
                const url = parts[1];
                const name = parts.slice(2).join(' ') || url.split('/').pop();
                settings.playlist.push({ name, url });
                saveSettingsDebounced(EXTENSION_NAME, settings);
                if (panelVisible) updatePlaylistUI();
                return '已添加: ' + name;
            }

            // /music stop - 停止
            if (parts[0] === 'stop') {
                stopPlayback();
                return '播放已停止';
            }
        }

        // 切换面板显示
        panelVisible = !panelVisible;
        if (panelVisible) {
            createPlayerPanel();
            document.getElementById('music-player-panel').style.display = '';
            updatePlaylistUI();
        } else {
            const panel = document.getElementById('music-player-panel');
            if (panel) panel.style.display = 'none';
            stopPlayback();
        }
        return panelVisible ? '音乐播放器已打开' : '音乐播放器已关闭';
    });

    console.log('Music Player 扩展已加载');
});
`,
        styleCSS: `/* 音乐播放器面板 - 浮动窗口样式 */.music-player-panel {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 320px;
    background: #1a1a2e;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 10000;
    font-family: sans-serif;
    color: #d4d4d4;
    overflow: hidden;
}

.music-player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: #16213e;
    border-bottom: 1px solid #2a2a4a;
}

.music-player-title {
    font-weight: 600;
    font-size: 14px;
    color: #e94560;
}

.music-player-body {
    padding: 12px;
}

.music-player-body.music-minimized {
    display: none;
}

.music-player-now-playing {
    margin-bottom: 8px;
    font-size: 12px;
}

.music-now-label {
    color: #888;
}

.music-now-title {
    color: #e94560;
    font-weight: 500;
}

.music-player-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.music-progress-bar {
    flex: 1;
    height: 4px;
    background: #2a2a4a;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
}

.music-progress-fill {
    height: 100%;
    background: #e94560;
    width: 0%;
    transition: width 0.3s;
}

.music-time {
    font-size: 11px;
    color: #888;
    min-width: 90px;
    text-align: right;
}

.music-player-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 12px;
}

.music-btn {
    background: #2a2a4a;
    border: none;
    color: #d4d4d4;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s;
}

.music-btn:hover {
    background: #e94560;
}

.music-btn.active {
    background: #e94560;
}

.music-btn-play {
    background: #e94560;
    padding: 6px 16px;
}

.music-player-volume {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 12px;
}

.music-volume-slider {
    flex: 1;
    accent-color: #e94560;
}

.music-volume-value {
    min-width: 36px;
    text-align: right;
    color: #888;
}

.music-playlist-header {
    font-size: 12px;
    color: #888;
    margin-bottom: 6px;
}

.music-playlist-list {
    list-style: none;
    padding: 0;
    margin: 0 0 12px 0;
    max-height: 150px;
    overflow-y: auto;
}

.music-playlist-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
}

.music-playlist-item:hover {
    background: #2a2a4a;
}

.music-playlist-item.active {
    background: #e9456033;
    color: #e94560;
}

.music-playlist-index {
    color: #888;
    min-width: 20px;
}

.music-playlist-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.music-btn-remove {
    background: transparent;
    color: #ff4444;
    padding: 2px 6px;
    font-size: 14px;
}

.music-player-add {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.music-add-input,
.music-add-name {
    padding: 6px 10px;
    background: #0d1b2a;
    border: 1px solid #2a2a4a;
    border-radius: 6px;
    color: #d4d4d4;
    font-size: 12px;
}

.music-add-input:focus,
.music-add-name:focus {
    outline: none;
    border-color: #e94560;
}

.music-btn-add {
    align-self: flex-end;
}`
    },

    mobilePhone: {
        name: '同层小手机',
        icon: '&#128241;',
        desc: '在聊天界面叠加一个仿真手机屏幕，适合现代题材角色扮演。用 /phone 命令开关',
        tags: ['角色扮演', 'UI面板', '沉浸式'],
        manifest: {
            display_name: 'Mobile Phone Simulator',
            loading_order: 910,
            requires: [],
            optional: [],
            js: 'index.js',
            css: 'style.css',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types, getContext } from '../../../../../script.js';

const EXTENSION_NAME = 'mobile_phone';

const defaultSettings = {
    enabled: true,
    phoneModel: 'SmartPhone X',
    carrier: '酒馆通信',
    timeFormat: '24h',
    wallpaper: '#1a1a2e',
    notifications: [],
    messages: []
};

let phoneVisible = false;

function createPhoneUI() {
    if (document.getElementById('mobile-phone-overlay')) return;

    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    const overlay = document.createElement('div');
    overlay.id = 'mobile-phone-overlay';
    overlay.className = 'mobile-phone-overlay';
    overlay.innerHTML = \`
        <div class="phone-device">
            <div class="phone-notch">
                <span class="phone-carrier">\${escapeHTML(settings.carrier)}</span>
                <span class="phone-time" id="phone-time">\${getCurrentTime()}</span>
                <span class="phone-battery">&#128267; 85%</span>
            </div>
            <div class="phone-screen" id="phone-screen">
                <div class="phone-notifications" id="phone-notifications"></div>
                <div class="phone-messages" id="phone-messages"></div>
            </div>
            <div class="phone-home-bar"></div>
        </div>
        <div class="phone-close-btn" id="phone-close-btn">&times;</div>
    \`;

    overlay.querySelector('#phone-close-btn').addEventListener('click', () => {
        phoneVisible = false;
        overlay.style.display = 'none';
    });

    document.body.appendChild(overlay);

    setInterval(() => {
        const timeEl = document.getElementById('phone-time');
        if (timeEl) timeEl.textContent = getCurrentTime();
    }, 30000);
}

function getCurrentTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
}

function addNotification(title, body) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    const notif = {
        id: Date.now(),
        title,
        body,
        time: getCurrentTime(),
        read: false
    };
    settings.notifications.unshift(notif);
    if (settings.notifications.length > 20) settings.notifications.pop();
    saveSettingsDebounced(EXTENSION_NAME, settings);

    const container = document.getElementById('phone-notifications');
    if (container) {
        renderNotifications(container, settings.notifications);
    }
}

function addMessage(sender, text, isUser) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    settings.messages.push({
        id: Date.now(),
        sender,
        text,
        isUser,
        time: getCurrentTime()
    });
    if (settings.messages.length > 50) settings.messages.shift();
    saveSettingsDebounced(EXTENSION_NAME, settings);

    const container = document.getElementById('phone-messages');
    if (container) {
        renderMessages(container, settings.messages);
    }
}

function renderNotifications(container, notifications) {
    container.innerHTML = notifications.slice(0, 5).map(n => \`
        <div class="phone-notification\${n.read ? '' : ' unread'}">
            <div class="phone-notif-title">\${escapeHTML(n.title)}</div>
            <div class="phone-notif-body">\${escapeHTML(n.body)}</div>
            <div class="phone-notif-time">\${n.time}</div>
        </div>
    \`).join('');
}

function renderMessages(container, messages) {
    container.innerHTML = messages.slice(-20).map(m => \`
        <div class="phone-message\${m.isUser ? ' sent' : ' received'}">
            <div class="phone-msg-sender">\${escapeHTML(m.sender)}</div>
            <div class="phone-msg-bubble">\${escapeHTML(m.text)}</div>
            <div class="phone-msg-time">\${m.time}</div>
        </div>
    \`).join('');
    container.scrollTop = container.scrollHeight;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

jQuery(async () => {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    registerSlashCommand('phone', (args, value) => {
        if (args) {
            const parts = value.trim().split(/\\s+/);

            // /phone notify 标题 内容
            if (parts[0] === 'notify' && parts[1]) {
                const title = parts[1];
                const body = parts.slice(2).join(' ') || '';
                addNotification(title, body);
                return '通知已发送: ' + title;
            }

            // /phone msg 发送者 内容
            if (parts[0] === 'msg' && parts[1]) {
                const sender = parts[1];
                const text = parts.slice(2).join(' ') || '';
                addMessage(sender, text, false);
                return '消息已记录: [' + sender + '] ' + text;
            }

            // /phone wallpaper URL
            if (parts[0] === 'wallpaper' && parts[1]) {
                settings.wallpaper = parts[1];
                saveSettingsDebounced(EXTENSION_NAME, settings);
                const screen = document.getElementById('phone-screen');
                if (screen) screen.style.backgroundImage = 'url(' + parts[1] + ')';
                return '壁纸已更新';
            }
        }

        phoneVisible = !phoneVisible;
        if (phoneVisible) {
            createPhoneUI();
            document.getElementById('mobile-phone-overlay').style.display = '';
            const notifContainer = document.getElementById('phone-notifications');
            const msgContainer = document.getElementById('phone-messages');
            if (notifContainer) renderNotifications(notifContainer, settings.notifications);
            if (msgContainer) renderMessages(msgContainer, settings.messages);
        } else {
            const overlay = document.getElementById('mobile-phone-overlay');
            if (overlay) overlay.style.display = 'none';
        }
        return phoneVisible ? '手机已打开' : '手机已关闭';
    });

    // 收到 AI 消息时，自动记录到手机
    eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
        if (!phoneVisible) return;
        const context = getContext();
        const charName = context.name2 || 'AI';
        const text = typeof data === 'string' ? data : (data.text || data.content || '');
        if (text) addMessage(charName, text, false);
    });

    // 用户发送消息时记录
    eventSource.on(event_types.MESSAGE_SENT, (data) => {
        if (!phoneVisible) return;
        const userName = getContext().name1 || 'You';
        const text = typeof data === 'string' ? data : (data.text || data.content || '');
        if (text) addMessage(userName, text, true);
    });

    console.log('Mobile Phone 扩展已加载');
});
`,
        styleCSS: `/* 同层小手机 - 仿真手机屏幕覆盖层 */.mobile-phone-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 380px;
    height: 100vh;
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;
    pointer-events: none;
}

.phone-device {
    width: 320px;
    height: 640px;
    background: #0a0a0a;
    border-radius: 32px;
    border: 3px solid #333;
    overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,0.5), inset 0 0 2px rgba(255,255,255,0.1);
    pointer-events: all;
    display: flex;
    flex-direction: column;
}

.phone-notch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px 6px;
    background: #0a0a0a;
    font-size: 11px;
    color: #ddd;
}

.phone-carrier {
    font-weight: 600;
}

.phone-time {
    font-weight: 600;
}

.phone-battery {
    font-size: 11px;
}

.phone-screen {
    flex: 1;
    background: #1a1a2e;
    background-size: cover;
    background-position: center;
    overflow-y: auto;
    padding: 12px;
}

.phone-notifications {
    margin-bottom: 12px;
}

.phone-notification {
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 6px;
    backdrop-filter: blur(10px);
}

.phone-notification.unread {
    border-left: 3px solid #4a9eff;
}

.phone-notif-title {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 2px;
}

.phone-notif-body {
    font-size: 12px;
    color: #aaa;
}

.phone-notif-time {
    font-size: 10px;
    color: #666;
    margin-top: 4px;
    text-align: right;
}

.phone-messages {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.phone-message {
    max-width: 85%;
    display: flex;
    flex-direction: column;
}

.phone-message.sent {
    align-self: flex-end;
    align-items: flex-end;
}

.phone-message.received {
    align-self: flex-start;
    align-items: flex-start;
}

.phone-msg-sender {
    font-size: 10px;
    color: #888;
    margin-bottom: 2px;
}

.phone-msg-bubble {
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.4;
    word-break: break-word;
}

.phone-message.sent .phone-msg-bubble {
    background: #4a9eff;
    color: #fff;
    border-bottom-right-radius: 4px;
}

.phone-message.received .phone-msg-bubble {
    background: #333;
    color: #ddd;
    border-bottom-left-radius: 4px;
}

.phone-msg-time {
    font-size: 10px;
    color: #666;
    margin-top: 2px;
}

.phone-home-bar {
    height: 24px;
    background: #0a0a0a;
    display: flex;
    justify-content: center;
    align-items: center;
}

.phone-home-bar::after {
    content: '';
    width: 100px;
    height: 4px;
    background: #444;
    border-radius: 2px;
}

.phone-close-btn {
    position: absolute;
    top: 24px;
    right: 16px;
    width: 30px;
    height: 30px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    pointer-events: all;
    z-index: 10;
}

.phone-close-btn:hover {
    background: #e94560;
}`
    },

    diceRoller: {
        name: '骰子与随机工具',
        icon: '&#127922;',
        desc: 'RPG 骰子掷点工具，支持 /roll 2d6+3、/coin 等命令，带掷骰动画和结果展示',
        tags: ['游戏', '斜杠命令', 'RPG'],
        manifest: {
            display_name: 'Dice Roller',
            loading_order: 800,
            requires: [],
            optional: [],
            js: 'index.js',
            css: 'style.css',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { registerSlashCommand } from '../../../slash-commands.js';import { eventSource, event_types, getContext } from '../../../../../script.js';

const EXTENSION_NAME = 'dice_roller';

// 解析骰子表达式，如 "2d6+3", "1d20", "4d8-2"
function parseDice(expr) {
    // 匹配 NdM[+-K] 格式
    const match = expr.match(/^(\\d+)?d(\\d+)(?:([+-])(\\d+))?$/i);
    if (!match) return null;

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const modifierOp = match[3] || null;
    const modifier = match[4] ? parseInt(match[4]) : 0;

    if (count < 1 || count > 100) return { error: '骰子数量必须在 1-100 之间' };
    if (sides < 2 || sides > 1000) return { error: '骰子面数必须在 2-1000 之间' };

    return { count, sides, modifierOp, modifier };
}

function rollDice(expr) {
    const parsed = parseDice(expr);
    if (!parsed) return null;
    if (parsed.error) return { error: parsed.error };

    const { count, sides, modifierOp, modifier } = parsed;
    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }

    if (modifierOp === '+') total += modifier;
    if (modifierOp === '-') total -= modifier;

    return {
        expression: \`\${count}d\${sides}\${modifierOp ? modifierOp + modifier : ''}\`,
        rolls,
        total,
        count,
        sides,
        modifierOp,
        modifier
    };
}

function formatResult(result) {
    if (result.error) return '错误: ' + result.error;

    const { expression, rolls, total, count, sides } = result;

    let text = '掷出了 ' + expression + ' = ';
    if (count === 1) {
        text += '**[ ' + total + ' ]**';
        if (sides === 20) {
            if (total === 20) text += ' <- 大成功!';
            else if (total === 1) text += ' <- 大失败...';
        }
    } else {
        text += rolls.join(' + ');
        if (result.modifierOp) {
            text += ' ' + result.modifierOp + ' ' + result.modifier;
        }
        text += ' = **[ ' + total + ' ]**';
    }
    return text;
}

function rollFudge() {
    const rolls = [];
    let total = 0;
    const symbols = { '-1': '-', '0': '0', '1': '+' };

    for (let i = 0; i < 4; i++) {
        const roll = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        rolls.push(symbols[roll]);
        total += roll;
    }

    return 'Fudge 骰子: [ ' + rolls.join(' ') + ' ] = ' + (total >= 0 ? '+' : '') + total;
}

// 随机表格滚动
function rollTable(tableName, items) {
    const index = Math.floor(Math.random() * items.length);
    return '随机抽取 [' + tableName + ']: **' + items[index] + '** (' + (index + 1) + '/' + items.length + ')';
}

jQuery(async () => {
    registerSlashCommand('roll', (args, value) => {
        if (!value || !value.trim()) return '用法: /roll NdM[+-K] (如 /roll 2d6+3) 或 /roll fudge 或 /roll table 名称/项目1,项目2,...';

        const expr = value.trim();

        // Fudge 骰子
        if (expr.toLowerCase() === 'fudge') {
            return rollFudge();
        }

        // 随机表格
        const tableMatch = expr.match(/^table\\s+(.+)/i);
        if (tableMatch) {
            const parts = tableMatch[1].split('/');
            const name = parts[0].trim();
            const items = parts.slice(1).join('/').split(',').map(s => s.trim()).filter(Boolean);
            if (items.length === 0) return '用法: /roll table 表名/项目1,项目2,项目3,...';
            return rollTable(name, items);
        }

        // 标准骰子
        const result = rollDice(expr);
        if (!result) return '格式错误，请使用 NdM 格式，如 2d6, 1d20+5, 3d8-1';
        return formatResult(result);
    });

    registerSlashCommand('coin', () => {
        const result = Math.random() < 0.5 ? '正面' : '反面';
        return '硬币抛出了: **' + result + '**';
    });

    registerSlashCommand('random', (args, value) => {
        if (!value || !value.trim()) return '用法: /random 选项1,选项2,选项3,...';

        const items = value.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length === 0) return '请提供至少一个选项';
        if (items.length === 1) return '只有一个选项: ' + items[0];

        const result = items[Math.floor(Math.random() * items.length)];
        return '从 ' + items.length + ' 个选项中随机选择了: **' + result + '**';
    });

    console.log('Dice Roller 扩展已加载');
});
`,
        styleCSS: `/* 骰子工具可选样式 - 在酒馆中掷骰结果会以斜杠命令返回值形式显示 *//* 如需自定义掷骰结果样式，可取消下面的注释并修改 */
/*
.st-extension-result {
    font-size: 14px;
    font-weight: 600;
    color: #e94560;
}
*/`
    },

    statusPanel: {
        name: '角色状态面板',
        icon: '&#128202;',
        desc: 'RPG 角色数值管理，HP/MP/等级追踪，带 /hp /mp /status 命令和可视化面板',
        tags: ['RPG', '数据管理', 'UI面板'],
        manifest: {
            display_name: 'Character Status Panel',
            loading_order: 850,
            requires: [],
            optional: [],
            js: 'index.js',
            css: 'style.css',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types, getContext } from '../../../../../script.js';

const EXTENSION_NAME = 'char_status';

const defaultSettings = {
    enabled: true,
    characters: {}
};

function getCharStatus(charName) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (!settings.characters[charName]) {
        settings.characters[charName] = {
            name: charName,
            hp: { current: 100, max: 100 },
            mp: { current: 50, max: 50 },
            level: 1,
            exp: 0,
            attributes: {},
            statusEffects: []
        };
        saveSettingsDebounced(EXTENSION_NAME, settings);
    }
    return settings.characters[charName];
}

function saveCharStatus(charName, status) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    settings.characters[charName] = status;
    saveSettingsDebounced(EXTENSION_NAME, settings);
}

function formatStatus(charName) {
    const status = getCharStatus(charName);
    const hpPct = Math.round((status.hp.current / status.hp.max) * 100);
    const mpPct = Math.round((status.mp.current / status.mp.max) * 100);

    const hpBar = makeBar(hpPct, 20);
    const mpBar = makeBar(mpPct, 20);

    let text = '**[ ' + charName + ' ]** Lv.' + status.level + '\\n';
    text += 'HP: ' + hpBar + ' ' + status.hp.current + '/' + status.hp.max + '\\n';
    text += 'MP: ' + mpBar + ' ' + status.mp.current + '/' + status.mp.max;

    if (status.statusEffects.length > 0) {
        text += '\\n状态: ' + status.statusEffects.join(', ');
    }

    return text;
}

function makeBar(pct, width) {
    const filled = Math.round(pct / 100 * width);
    const empty = width - filled;
    let bar = '[';
    for (let i = 0; i < filled; i++) bar += '#';
    for (let i = 0; i < empty; i++) bar += '-';
    bar += ']';
    return bar;
}

jQuery(async () => {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    registerSlashCommand('status', (args, value) => {
        const charName = value.trim() || getContext().name2 || '角色';
        return formatStatus(charName);
    });

    registerSlashCommand('hp', (args, value) => {
        if (!value || !value.trim()) return '用法: /hp +/-数值 [角色名]';

        const parts = value.trim().split(/\\s+/);
        const changeStr = parts[0];
        const change = parseInt(changeStr);
        if (isNaN(change)) return '请提供有效的数值变化，如 /hp -10 或 /hp +20';

        const charName = parts.slice(1).join(' ') || getContext().name2 || '角色';
        const status = getCharStatus(charName);

        status.hp.current = Math.max(0, Math.min(status.hp.max, status.hp.current + change));
        saveCharStatus(charName, status);

        return charName + ' HP变化 ' + (change >= 0 ? '+' : '') + change + ' -> 当前 HP: ' + status.hp.current + '/' + status.hp.max;
    });

    registerSlashCommand('mp', (args, value) => {
        if (!value || !value.trim()) return '用法: /mp +/-数值 [角色名]';

        const parts = value.trim().split(/\\s+/);
        const changeStr = parts[0];
        const change = parseInt(changeStr);
        if (isNaN(change)) return '请提供有效的数值变化，如 /mp -5 或 /mp +10';

        const charName = parts.slice(1).join(' ') || getContext().name2 || '角色';
        const status = getCharStatus(charName);

        status.mp.current = Math.max(0, Math.min(status.mp.max, status.mp.current + change));
        saveCharStatus(charName, status);

        return charName + ' MP变化 ' + (change >= 0 ? '+' : '') + change + ' -> 当前 MP: ' + status.mp.current + '/' + status.mp.max;
    });

    registerSlashCommand('levelup', (args, value) => {
        const charName = value.trim() || getContext().name2 || '角色';
        const status = getCharStatus(charName);

        status.level += 1;
        status.hp.max += 10;
        status.hp.current = status.hp.max;
        status.mp.max += 5;
        status.mp.current = status.mp.max;

        saveCharStatus(charName, status);
        return charName + ' 升级到 Lv.' + status.level + '! HP +10 MP +5 (已完全恢复)';
    });

    registerSlashCommand('sethp', (args, value) => {
        if (!value || !value.trim()) return '用法: /sethp 当前值/最大值 [角色名]';

        const parts = value.trim().split(/\\s+/);
        const hpParts = parts[0].split('/');
        const current = parseInt(hpParts[0]);
        const max = hpParts[1] ? parseInt(hpParts[1]) : null;

        if (isNaN(current)) return '请提供有效的数值';

        const charName = parts.slice(1).join(' ') || getContext().name2 || '角色';
        const status = getCharStatus(charName);

        status.hp.current = current;
        if (max) status.hp.max = max;
        saveCharStatus(charName, status);

        return charName + ' HP 已设置为: ' + status.hp.current + '/' + status.hp.max;
    });

    registerSlashCommand('setmp', (args, value) => {
        if (!value || !value.trim()) return '用法: /setmp 当前值/最大值 [角色名]';

        const parts = value.trim().split(/\\s+/);
        const mpParts = parts[0].split('/');
        const current = parseInt(mpParts[0]);
        const max = mpParts[1] ? parseInt(mpParts[1]) : null;

        if (isNaN(current)) return '请提供有效的数值';

        const charName = parts.slice(1).join(' ') || getContext().name2 || '角色';
        const status = getCharStatus(charName);

        status.mp.current = current;
        if (max) status.mp.max = max;
        saveCharStatus(charName, status);

        return charName + ' MP 已设置为: ' + status.mp.current + '/' + status.mp.max;
    });

    console.log('Character Status Panel 扩展已加载');
});
`,
        styleCSS: `/* 状态面板可选样式 - 状态信息通过斜杠命令返回值展示 *//* 如需自定义显示样式，可在此添加 */
`
    },

    memoryManager: {
        name: '记忆/摘要管理器',
        icon: '&#129504;',
        desc: '聊天记忆持久化管理，支持 /remember /recall /forget 命令，自动保存角色记忆',
        tags: ['数据管理', 'AI辅助', '斜杠命令'],
        manifest: {
            display_name: 'Memory Manager',
            loading_order: 950,
            requires: [],
            optional: [],
            js: 'index.js',
            css: '',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types, getContext, substituteParams } from '../../../../../script.js';

const EXTENSION_NAME = 'memory_manager';

const defaultSettings = {
    enabled: true,
    memories: {},
    maxMemoriesPerChar: 50
};

function getMemories(charName) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (!settings.memories[charName]) {
        settings.memories[charName] = [];
    }
    return settings.memories[charName];
}

function addMemory(charName, content, category) {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
    if (!settings.memories[charName]) {
        settings.memories[charName] = [];
    }

    const memories = settings.memories[charName];

    // 限制数量，删除最旧的
    if (memories.length >= settings.maxMemoriesPerChar) {
        memories.shift();
    }

    memories.push({
        id: Date.now(),
        content,
        category: category || 'general',
        timestamp: new Date().toISOString(),
        chatId: getContext().chatId
    });

    saveSettingsDebounced(EXTENSION_NAME, settings);
}

function formatMemoryList(charName) {
    const memories = getMemories(charName);
    if (memories.length === 0) return '暂无关于 ' + charName + ' 的记忆。';

    // 按类别分组
    const grouped = {};
    memories.forEach(m => {
        if (!grouped[m.category]) grouped[m.category] = [];
        grouped[m.category].push(m);
    });

    let text = '**[ ' + charName + ' 的记忆 ]** (' + memories.length + ' 条)\\n\\n';
    for (const [cat, items] of Object.entries(grouped)) {
        text += '[' + cat + ']\\n';
        items.forEach((m, i) => {
            text += (i + 1) + '. ' + m.content.substring(0, 80) + (m.content.length > 80 ? '...' : '') + '\\n';
        });
        text += '\\n';
    }
    return text;
}

jQuery(async () => {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    // /remember 内容 [类别] [角色名] - 保存记忆
    registerSlashCommand('remember', (args, value) => {
        if (!value || !value.trim()) return '用法: /remember 记忆内容 [类别] [角色名]';

        const parts = value.trim().split(/\\s+/);
        let content, category, charName;

        // 尝试解析: 如果最后一个参数不以 # 开头且不是数字，它可能是角色名
        // 简化处理：取全部内容作为记忆，可选类别
        const hashIdx = value.indexOf(' #');
        if (hashIdx > 0) {
            content = value.substring(0, hashIdx).trim();
            const rest = value.substring(hashIdx + 1).trim().split(/\\s+/);
            category = rest[0].replace('#', '');
            charName = rest.slice(1).join(' ') || getContext().name2 || 'Memory';
        } else {
            content = value.trim();
            charName = getContext().name2 || 'Memory';
        }

        // 替换 {{char}} {{user}} 等变量
        content = substituteParams(content);

        addMemory(charName, content, category || 'general');
        return '已记住关于 ' + charName + ' 的记忆: ' + content.substring(0, 50) + '...';
    });

    // /recall [角色名] [类别] - 查看记忆
    registerSlashCommand('recall', (args, value) => {
        let charName, category;

        if (value && value.trim()) {
            const parts = value.trim().split(/\\s+/);
            if (parts[0].startsWith('#')) {
                category = parts[0].replace('#', '');
                charName = parts.slice(1).join(' ') || getContext().name2 || 'Memory';
            } else {
                charName = parts.join(' ');
            }
        } else {
            charName = getContext().name2 || 'Memory';
        }

        const memories = getMemories(charName).filter(m => !category || m.category === category);
        if (memories.length === 0) {
            return '暂无关于 ' + charName + (category ? ' [' + category + ']' : '') + ' 的记忆。';
        }

        return formatMemoryList(charName);
    });

    // /forget [角色名] - 清除某个角色的所有记忆
    registerSlashCommand('forget', (args, value) => {
        const charName = value.trim() || getContext().name2 || 'Memory';
        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

        if (settings.memories[charName]) {
            delete settings.memories[charName];
            saveSettingsDebounced(EXTENSION_NAME, settings);
            return '已清除关于 ' + charName + ' 的所有记忆。';
        }
        return '没有关于 ' + charName + ' 的记忆。';
    });

    // /rememberall - 列出所有角色的记忆
    registerSlashCommand('rememberall', () => {
        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
        const chars = Object.keys(settings.memories);

        if (chars.length === 0) return '没有任何角色的记忆。';

        let text = '**[ 全部记忆 ]**\\n\\n';
        chars.forEach(name => {
            const count = settings.memories[name].length;
            text += '- ' + name + ': ' + count + ' 条记忆\\n';
        });
        return text;
    });

    console.log('Memory Manager 扩展已加载');
});
`,
        styleCSS: ''
    },

    cssInjector: {
        name: 'CSS 样式注入器',
        icon: '&#127912;',
        desc: '轻量级扩展模板，用于注入自定义 CSS 样式到酒馆界面，修改任意元素外观',
        tags: ['样式', 'UI定制', '简单'],
        manifest: {
            display_name: 'Custom CSS Injector',
            loading_order: 500,
            requires: [],
            optional: [],
            js: 'index.js',
            css: 'style.css',
            author: '',
            version: '1.0.0',
            homePage: '',
            auto_update: false
        },
        indexJS: `import { loadSettings, saveSettingsDebounced } from '../../../../../script.js';import { registerSlashCommand } from '../../../slash-commands.js';
import { eventSource, event_types } from '../../../../../script.js';

const EXTENSION_NAME = 'css_injector';

const defaultSettings = {
    enabled: true,
    customCSS: ''
};

jQuery(async () => {
    const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));

    // 注入自定义 CSS
    if (settings.customCSS) {
        injectCSS(settings.customCSS);
    }

    function injectCSS(css) {
        // 移除旧的注入样式
        const oldStyle = document.getElementById('css-injector-style');
        if (oldStyle) oldStyle.remove();

        if (!css) return;

        const style = document.createElement('style');
        style.id = 'css-injector-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // /css - 查看当前注入的CSS
    registerSlashCommand('css', (args, value) => {
        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
        if (!settings.customCSS) return '当前没有注入自定义 CSS。使用 /setcss 来设置。';
        return '当前注入的 CSS (' + settings.customCSS.length + ' 字符):\\n' + settings.customCSS.substring(0, 500);
    });

    // /setcss - 设置自定义CSS（需要在酒馆扩展设置面板中完整编辑）
    registerSlashCommand('setcss', (args, value) => {
        if (!value || !value.trim()) return '用法: /setcss CSS代码';

        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
        settings.customCSS = value.trim();
        saveSettingsDebounced(EXTENSION_NAME, settings);
        injectCSS(settings.customCSS);

        return 'CSS 已更新 (' + settings.customCSS.length + ' 字符)';
    });

    // /clearcss - 清除所有自定义CSS
    registerSlashCommand('clearcss', () => {
        const settings = Object.assign({}, defaultSettings, loadSettings(EXTENSION_NAME));
        settings.customCSS = '';
        saveSettingsDebounced(EXTENSION_NAME, settings);
        injectCSS('');

        return '自定义 CSS 已清除';
    });

    console.log('CSS Injector 扩展已加载');
});
`,
        styleCSS: `/* 把你想注入到酒馆的自定义 CSS 写在这里 *//* 这里留空，通过 /setcss 命令动态注入 */

/* 示例：修改聊天字体大小 */
/*
#chat .mes_text {
    font-size: 16px !important;
}
*/

/* 示例：修改用户消息气泡颜色 */
/*
.mes[is_user="true"] .mes_block {
    background: #1a3a5c !important;
}
*/

/* 示例：修改整个聊天区背景 */
/*
#chat {
    background: linear-gradient(180deg, #0a0a1a, #1a1a2e) !important;
}
*/`
    }
};

const ExtensionGenerator = {
    title: 'Extension',
    currentTemplate: 'blank',
    activeExtTab: 'ext-tab-templates',

    defaultManifest: {
        display_name: '',
        loading_order: 900,
        requires: [],
        optional: [],
        js: 'index.js',
        css: '',
        author: '',
        version: '1.0.0',
        homePage: '',
        auto_update: false
    },

    render(container) {
        this._renderUI(container);
        this._bindTemplateCards();
        this._bindExtTabs();
        this._bindInfoTags();
        this._bindGuideToggle();
        this._switchExtTab('ext-tab-templates');
    },

    _renderUI(container) {
        const templatesHTML = Object.entries(EXTENSION_TEMPLATES).map(([key, tpl]) => `
            <div class="tpl-card" data-template="${key}" id="tpl-${key}">
                <div class="tpl-card-icon">${tpl.icon}</div>
                <div class="tpl-card-info">
                    <div class="tpl-card-name">${tpl.name}</div>
                    <div class="tpl-card-desc">${tpl.desc}</div>
                    <div class="tpl-card-tags">
                        ${tpl.tags.map(t => `<span class="tpl-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        const apiRefHTML = this._buildAPIReference();

        container.innerHTML = `
            <div class="ext-tabs-nav">
                <button class="ext-tab-btn active" data-exttab="ext-tab-templates">选择模板</button>
                <button class="ext-tab-btn" data-exttab="ext-tab-basic">基本信息</button>
                <button class="ext-tab-btn" data-exttab="ext-tab-code">代码编辑</button>
                <button class="ext-tab-btn" data-exttab="ext-tab-apiref">API 参考</button>
            </div>
            <div class="ext-tab-content active" id="ext-tab-templates">
                <h3 class="form-section-title">选择一个模板开始</h3>
                <p class="form-hint" style="margin-bottom:16px;">选择最适合你需求的模板，然后切换到其他标签页进行自定义修改</p>
                <div class="tpl-card-grid">
                    ${templatesHTML}
                </div>
            </div>
            <div class="ext-tab-content" id="ext-tab-basic">
                <div class="form-section">
                    <h3 class="form-section-title">基本信息</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label"><span class="required">*</span> 扩展名称</label>
                            <input type="text" class="form-input" id="ext-display-name" placeholder="My Extension">
                            <span class="form-hint">在酒馆扩展面板中显示的名称</span>
                        </div>
                        <div class="form-group">
                            <label class="form-label"><span class="required">*</span> 版本号</label>
                            <input type="text" class="form-input" id="ext-version" placeholder="1.0.0">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label"><span class="required">*</span> 作者</label>
                            <input type="text" class="form-input" id="ext-author" placeholder="Your Name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">项目主页</label>
                            <input type="text" class="form-input" id="ext-homepage" placeholder="https://github.com/user/repo">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">加载顺序</label>
                        <input type="number" class="form-input" id="ext-loading-order" value="900" min="1" max="9999">
                        <span class="form-hint">数值越小越先加载，默认 900</span>
                    </div>
                    <div class="form-group">
                        <div class="form-checkbox-group">
                            <input type="checkbox" id="ext-auto-update">
                            <label for="ext-auto-update">启用自动更新</label>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <h3 class="form-section-title">依赖配置</h3>
                    <div class="form-group">
                        <label class="form-label">必需依赖</label>
                        <div class="tags-input" id="ext-requires">
                            <input type="text" placeholder="输入扩展名称后按回车...">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">可选依赖</label>
                        <div class="tags-input" id="ext-optional">
                            <input type="text" placeholder="输入扩展名称后按回车...">
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <h3 class="form-section-title">文件配置</h3>
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> JS 入口文件</label>
                        <input type="text" class="form-input" id="ext-js" value="index.js">
                    </div>
                    <div class="form-group">
                        <label class="form-label">CSS 样式文件</label>
                        <input type="text" class="form-input" id="ext-css" placeholder="style.css (可选)">
                    </div>
                </div>
            </div>
            <div class="ext-tab-content" id="ext-tab-code">
                <div class="code-editor-tabs">
                    <button class="code-tab-btn active" data-codetab="code-index-js">index.js</button>
                    <button class="code-tab-btn" data-codetab="code-style-css">style.css</button>
                </div>
                <div class="code-editor-panel active" id="code-index-js">
                    <textarea class="form-textarea code-editor-textarea" id="ext-index-js" style="min-height:500px;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.5;tab-size:2;" spellcheck="false"></textarea>
                </div>
                <div class="code-editor-panel" id="code-style-css">
                    <textarea class="form-textarea code-editor-textarea" id="ext-style-css" style="min-height:500px;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.5;tab-size:2;" spellcheck="false" placeholder="/* CSS 样式（可选） */"></textarea>
                </div>
                <div class="ext-guide" id="ext-guide">
                    <div class="ext-guide-header" id="ext-guide-header">
                        <span>&#9432; 操作指南</span>
                        <button class="ext-guide-toggle" id="ext-guide-toggle">收起</button>
                    </div>
                    <div class="ext-guide-body" id="ext-guide-body">
                        <ol>
                            <li><strong>基本信息</strong>：切换到「基本信息」标签页，填写扩展名称、版本号、作者等信息</li>
                            <li><strong>编写代码</strong>：在当前编辑器中编写 <code>index.js</code>（主逻辑）和 <code>style.css</code>（可选样式）</li>
                            <li><strong>预览下载</strong>：点击底部「预览」查看生成的文件结构，或直接「下载 ZIP」</li>
                            <li><strong>安装使用</strong>：将下载的 ZIP 解压到 SillyTavern 的 <code>data/default-user/extensions/</code> 目录</li>
                        </ol>
                        <div class="ext-guide-tips">
                            <strong>提示：</strong>参考「API 参考」标签页了解 Slash Command、Event 类型和可用的 ST 内置函数
                        </div>
                    </div>
                </div>
            </div>
            <div class="ext-tab-content" id="ext-tab-apiref">
                ${apiRefHTML}
            </div>
        `;
    },

    _bindTemplateCards() {
        document.querySelectorAll('.tpl-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.template;
                this.applyTemplate(key);
                document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });
    },

    _bindExtTabs() {
        document.querySelectorAll('.ext-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this._switchExtTab(btn.dataset.exttab);
            });
        });
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.codetab;
                document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.code-editor-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(tabName).classList.add('active');
            });
        });
    },

    _bindInfoTags() {
        this._initTagsInput('ext-requires');
        this._initTagsInput('ext-optional');
    },

    _bindGuideToggle() {
        const header = document.getElementById('ext-guide-header');
        const toggle = document.getElementById('ext-guide-toggle');
        const guide = document.getElementById('ext-guide');
        if (!header || !toggle || !guide) return;
        header.addEventListener('click', () => {
            guide.classList.toggle('collapsed');
            toggle.textContent = guide.classList.contains('collapsed') ? '展开' : '收起';
        });
    },

    _switchExtTab(tabId) {
        document.querySelectorAll('.ext-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.ext-tab-content').forEach(c => c.classList.remove('active'));

        const btn = document.querySelector(`[data-exttab="${tabId}"]`);
        if (btn) btn.classList.add('active');
        const content = document.getElementById(tabId);
        if (content) content.classList.add('active');

        this.activeExtTab = tabId;
    },

    applyTemplate(key) {
        if (!EXTENSION_TEMPLATES[key]) return;
        this.currentTemplate = key;
        const tpl = EXTENSION_TEMPLATES[key];

        const nameEl = document.getElementById('ext-display-name');
        const versionEl = document.getElementById('ext-version');
        const authorEl = document.getElementById('ext-author');
        const homepageEl = document.getElementById('ext-homepage');
        const orderEl = document.getElementById('ext-loading-order');
        const jsEl = document.getElementById('ext-js');
        const cssEl = document.getElementById('ext-css');
        const indexJSEl = document.getElementById('ext-index-js');
        const styleCSSEl = document.getElementById('ext-style-css');
        const autoUpdateEl = document.getElementById('ext-auto-update');

        if (nameEl) nameEl.value = tpl.manifest.display_name;
        if (versionEl) versionEl.value = tpl.manifest.version;
        if (authorEl) authorEl.value = tpl.manifest.author;
        if (homepageEl) homepageEl.value = tpl.manifest.homePage;
        if (orderEl) orderEl.value = tpl.manifest.loading_order;
        if (jsEl) jsEl.value = tpl.manifest.js;
        if (cssEl) cssEl.value = tpl.manifest.css || '';
        if (indexJSEl) indexJSEl.value = tpl.indexJS;
        if (styleCSSEl) styleCSSEl.value = tpl.styleCSS || '';
        if (autoUpdateEl) autoUpdateEl.checked = tpl.manifest.auto_update;

        this._clearTags('ext-requires');
        this._clearTags('ext-optional');
        (tpl.manifest.requires || []).forEach(r => this._addTagById('ext-requires', r));
        (tpl.manifest.optional || []).forEach(r => this._addTagById('ext-optional', r));

        document.getElementById('current-title').textContent = 'Extension - ' + tpl.name;
        this._switchExtTab('ext-tab-basic');
    },

    getManifest() {
        return {
            display_name: document.getElementById('ext-display-name')?.value || 'My Extension',
            loading_order: parseInt(document.getElementById('ext-loading-order')?.value) || 900,
            requires: this._getTags('ext-requires'),
            optional: this._getTags('ext-optional'),
            js: document.getElementById('ext-js')?.value || 'index.js',
            css: document.getElementById('ext-css')?.value || '',
            author: document.getElementById('ext-author')?.value || 'Anonymous',
            version: document.getElementById('ext-version')?.value || '1.0.0',
            homePage: document.getElementById('ext-homepage')?.value || '',
            auto_update: document.getElementById('ext-auto-update')?.checked || false
        };
    },

    getData() {
        return {
            manifest: this.getManifest(),
            indexJS: this.getIndexJS(),
            styleCSS: this.getStyleCSS(),
            templateKey: this.currentTemplate
        };
    },

    loadDraft(data) {
        if (!data) return;
        const m = data.manifest || {};
        const setVal = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
        setVal('ext-display-name', m.display_name);
        setVal('ext-loading-order', m.loading_order);
        setVal('ext-js', m.js);
        setVal('ext-css', m.css);
        setVal('ext-author', m.author);
        setVal('ext-version', m.version);
        setVal('ext-homepage', m.homePage);
        const autoEl = document.getElementById('ext-auto-update');
        if (autoEl) autoEl.checked = !!m.auto_update;

        this._clearTags('ext-requires');
        this._clearTags('ext-optional');
        (m.requires || []).forEach(r => this._addTagById('ext-requires', r));
        (m.optional || []).forEach(r => this._addTagById('ext-optional', r));

        const indexJSEl = document.getElementById('ext-index-js');
        if (indexJSEl && data.indexJS != null) indexJSEl.value = data.indexJS;
        const styleCSSEl = document.getElementById('ext-style-css');
        if (styleCSSEl && data.styleCSS != null) styleCSSEl.value = data.styleCSS;

        this.currentTemplate = data.templateKey || 'blank';
    },

    getIndexJS() {
        return document.getElementById('ext-index-js')?.value || '';
    },

    getStyleCSS() {
        return document.getElementById('ext-style-css')?.value || '';
    },

    getPreviewFiles() {
        const files = [
            { name: 'manifest.json', content: JSON.stringify(this.getManifest(), null, 2), lang: 'json' },
            { name: 'index.js', content: this.getIndexJS(), lang: 'javascript' }
        ];
        const css = this.getStyleCSS();
        const cssFile = this.getManifest().css;
        if (css || cssFile) {
            files.push({ name: cssFile || 'style.css', content: css, lang: 'css' });
        }
        return files;
    },

    download() {
        const manifest = this.getManifest();
        const indexJS = this.getIndexJS();
        const styleCSS = this.getStyleCSS();
        const folderName = (manifest.display_name || 'extension').replace(/\s+/g, '-').toLowerCase();

        const files = {
            [`${folderName}/manifest.json`]: JSON.stringify(manifest, null, 2),
            [`${folderName}/index.js`]: indexJS
        };
        if (styleCSS) {
            files[`${folderName}/${manifest.css || 'style.css'}`] = styleCSS;
        } else if (manifest.css) {
            files[`${folderName}/${manifest.css}`] = '/* ' + manifest.display_name + ' styles */\n';
        }

        DownloadUtils.downloadZip(files);
    },

    _initTagsInput(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const input = container.querySelector('input');
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = input.value.replace(/,/g, '').trim();
                if (value) {
                    this._addTag(container, value);
                    input.value = '';
                }
            }
            if (e.key === 'Backspace' && input.value === '') {
                const tags = container.querySelectorAll('.tag');
                if (tags.length > 0) tags[tags.length - 1].remove();
            }
        });
    },

    _addTag(container, text) {
        const input = container.querySelector('input');
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${escapeHTML(text)} <span class="tag-remove">&times;</span>`;
        tag.querySelector('.tag-remove').addEventListener('click', () => tag.remove());
        container.insertBefore(tag, input);
    },

    _addTagById(containerId, text) {
        const container = document.getElementById(containerId);
        if (container) this._addTag(container, text);
    },

    _getTags(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const tags = container.querySelectorAll('.tag');
        return Array.from(tags).map(t => t.textContent.replace('×', '').trim());
    },

    _clearTags(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.querySelectorAll('.tag').forEach(t => t.remove());
    },

    _buildAPIReference() {
        return `
            <div class="form-section">
                <h3 class="form-section-title">斜杠命令 API</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">registerSlashCommand(name, callback, options)</div>
                    <div class="api-ref-desc">注册一个 / 命令。callback 接收 (args, value) 两个参数，返回字符串会显示在聊天中。</div>
                    <pre class="api-ref-code">registerSlashCommand('mycmd', (args, value) => {
    // args: 命令后的第一个词
    // value: 完整参数字符串
    return '命令执行结果';
});</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">SlashClosure.getResult()</div>
                    <div class="api-ref-desc">获取斜杠命令链中的上一个返回值。</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">事件系统</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">eventSource.on(event_types.XXX, handler)</div>
                    <div class="api-ref-desc">监听事件。常见事件类型:</div>
                    <pre class="api-ref-code">import { eventSource, event_types } from '../../../../../script.js';

// 收到消息后触发
eventSource.on(event_types.MESSAGE_RECEIVED, (data) => { ... });

// 消息发送后触发
eventSource.on(event_types.MESSAGE_SENT, (data) => { ... });

// 切换聊天时触发
eventSource.on(event_types.CHAT_CHANGED, (chatId) => { ... });

// 角色被编辑后触发
eventSource.on(event_types.CHARACTER_EDITED, (data) => { ... });

// 消息被编辑后触发
eventSource.on(event_types.MESSAGE_EDITED, (messageId) => { ... });

// 消息被删除后触发
eventSource.on(event_types.MESSAGE_DELETED, (messageId) => { ... });

// 消息滑动/重新生成时触发
eventSource.on(event_types.MESSAGE_SWIPED, (data) => { ... });

// 群组更新后触发
eventSource.on(event_types.GROUP_UPDATED, () => { ... });

// 设置面板已渲染完成
eventSource.on(event_types.SETTINGS_LOADED, () => { ... });</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">eventSource.makeLast(handler)</div>
                    <div class="api-ref-desc">创建一次性监听器，触发一次后自动移除。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">eventSource.removeListener(event, handler)</div>
                    <div class="api-ref-desc">移除指定的监听器。</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">设置管理</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">loadSettings(extensionName?)</div>
                    <div class="api-ref-desc">从 localStorage 加载扩展设置。如果不传名称，加载全部设置。</div>
                    <pre class="api-ref-code">import { loadSettings } from '../../../../../script.js';
const settings = loadSettings('my_extension') || {};</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">saveSettingsDebounced(extensionName, settings)</div>
                    <div class="api-ref-desc">防抖保存扩展设置到 localStorage。推荐用于频繁更新的场景。</div>
                    <pre class="api-ref-code">import { saveSettingsDebounced } from '../../../../../script.js';
saveSettingsDebounced('my_extension', { enabled: true });</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">extension_settings</div>
                    <div class="api-ref-desc">全局扩展设置对象。可直接读写: extension_settings.myExt = {...}</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">上下文与角色</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">getContext()</div>
                    <div class="api-ref-desc">获取当前聊天上下文对象，包含 name1(用户名), name2(角色名), chatId, groupId, characterId 等。</div>
                    <pre class="api-ref-code">import { getContext } from '../../../../../script.js';
const ctx = getContext();
console.log(ctx.name1, ctx.name2, ctx.chatId);</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">characters[characterId]</div>
                    <div class="api-ref-desc">通过角色 ID 获取角色数据对象，包含 name, description, personality, avatar 等字段。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">chat_metadata</div>
                    <div class="api-ref-desc">当前聊天的元数据对象，可存储自定义数据。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">saveMetadata()</div>
                    <div class="api-ref-desc">保存 chat_metadata 到存储。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">getRequestHeaders()</div>
                    <div class="api-ref-desc">获取 API 请求头信息。</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">UI 工具</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">renderExtensionTemplate(extName, templateName, data)</div>
                    <div class="api-ref-desc">渲染扩展的 HTML 模板。模板文件放在扩展目录的 templates/ 子目录下。</div>
                    <pre class="api-ref-code">import { renderExtensionTemplate } from '../../../extensions.js';
const html = renderExtensionTemplate('my_ext', 'settings', { name: 'test' });</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">callPopup(text, type)</div>
                    <div class="api-ref-desc">显示弹出提示。type 可选 'text', 'warning', 'error', 'confirm'。</div>
                    <pre class="api-ref-code">import { callPopup } from '../../../popup.js';
callPopup('操作成功!', 'text');</pre>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">sendSystemMessage(type, message)</div>
                    <div class="api-ref-desc">发送系统消息到聊天中。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">substituteParams(content)</div>
                    <div class="api-ref-desc">替换文本中的 {{char}}, {{user}} 等宏变量为实际值。</div>
                    <pre class="api-ref-code">import { substituteParams } from '../../../../../script.js';
const output = substituteParams('你好，{{user}}，我是{{char}}');</pre>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">消息操作</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">sendMessageAs(username, text)</div>
                    <div class="api-ref-desc">以指定用户名发送消息。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">generateRaw(prompt, api, quiet)</div>
                    <div class="api-ref-desc">直接调用 AI 生成文本，不使用聊天上下文。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">getCurrentChatId()</div>
                    <div class="api-ref-desc">获取当前聊天 ID。</div>
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">扩展文件结构</h3>
                <div class="api-ref-item">
                    <div class="api-ref-name">安装路径</div>
                    <div class="api-ref-desc">扩展放在 <code>public/scripts/extensions/third-party/扩展名/</code> 目录下，然后在酒馆 Extensions 面板中启用。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">必需文件</div>
                    <div class="api-ref-desc">manifest.json (扩展清单) 和 index.js (入口脚本) 是必需的。</div>
                </div>
                <div class="api-ref-item">
                    <div class="api-ref-name">可选文件</div>
                    <div class="api-ref-desc">style.css, README.md, LICENSE, templates/ (HTML模板目录), src/ (源代码目录)</div>
                </div>
            </div>
        `;
    }
};
