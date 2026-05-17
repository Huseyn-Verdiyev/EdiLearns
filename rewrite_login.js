const fs = require('fs');

try {
    const data = fs.readFileSync('index.html', 'utf8');
    const lines = data.split(/\r?\n/);

    // Identify start/end of login section
    let startIdx = -1;
    let endIdx = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('id="login-section" class="login-shell"')) {
            startIdx = i;
        }
        if (lines[i].includes('id="panel-wrapper"') && startIdx !== -1) {
            endIdx = i - 1; // The line before panel-wrapper start
            break;
        }
    }

    if (startIdx !== -1 && endIdx !== -1) {
        // Construct clean login section
        const cleanLogin = [
            '    <div id="login-section" class="login-shell">',
            '        <div class="login-ambient">',
            '            <span class="ambient-blob blob-1"></span>',
            '            <span class="ambient-blob blob-2"></span>',
            '            <span class="ambient-blob blob-3"></span>',
            '        </div>',
            '',
            '        <div class="login-card">',
            '            <div class="login-brand">',
            '                <div class="brand-chip">EduTask</div>',
            '                <h2 class="brand-title">Təhsil mərkəziniz</h2>',
            '                <p class="brand-subtitle">Dərsləri planlaşdırın, irəliləyişi izləyin və birlikdə öyrənin.</p>',
            '                <div class="brand-metrics">',
            '                    <div class="metric-card">',
            '                        <span class="metric-value">Təhlükəsiz</span>',
            '                        <span class="metric-label">Giriş</span>',
            '                    </div>',
            '                    <div class="metric-card">',
            '                        <span class="metric-value">Sürətli</span>',
            '                        <span class="metric-label">Giriş</span>',
            '                    </div>',
            '                    <div class="metric-card">',
            '                        <span class="metric-value">Ağıllı</span>',
            '                        <span class="metric-label">Alətlər</span>',
            '                    </div>',
            '                </div>',
            '                <div class="brand-quote">',
            '                    <span class="quote-icon">✨</span>',
            '                    <span>Hər gün kiçik addım, böyük irəliləyişdir.</span>',
            '                </div>',
            '            </div>',
            '',
            '            <div class="login-panel">',
            '                <div class="login-panel-head">',
            '                    <div class="brand-mark">',
            '                        <svg width="46" height="46" viewBox="0 0 50 50" fill="none">',
            '                            <rect width="50" height="50" rx="14" fill="url(#loginLogoGrad)" />',
            '                            <path d="M15 17h20v4H15zM15 25h15v4H15zM15 33h10v4H15z" fill="white" />',
            '                            <defs>',
            '                                <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="50" y2="50">',
            '                                    <stop offset="0%" stop-color="#8fd3f4" />',
            '                                    <stop offset="100%" stop-color="#c7f0e4" />',
            '                                </linearGradient>',
            '                            </defs>',
            '                        </svg>',
            '                    </div>',
            '                    <div>',
            '                        <div class="brand-name">EduTask</div>',
            '                        <div class="brand-tagline">Təhsil platforması</div>',
            '                    </div>',
            '                </div>',
            '',
            '                <div id="role-selection-screen" class="login-screen">',
            '                    <h1 class="login-title">Xoş gəlmisiniz! 👋</h1>',
            '                    <p class="login-subtitle">Təhsilin gələcəyinə qoşulun</p>',
            '',
            '                    <div class="login-role-grid">',
            '                        <button class="login-role-card is-student" onclick="showLogin(\'student\')">',
            '                            <div class="role-icon">🎓</div>',
            '                            <div class="role-copy">',
            '                                <span class="role-title">Şagird</span>',
            '                                <span class="role-desc">Öyrən, inkişaf et, uğur qazan</span>',
            '                            </div>',
            '                            <span class="role-arrow">→</span>',
            '                        </button>',
            '                        <button class="login-role-card is-teacher" onclick="showLogin(\'teacher\')">',
            '                            <div class="role-icon">👨‍🏫</div>',
            '                            <div class="role-copy">',
            '                                <span class="role-title">Müəllim</span>',
            '                                <span class="role-desc">Öyrət, ilhamlandır, rəhbərlik et</span>',
            '                            </div>',
            '                            <span class="role-arrow">→</span>',
            '                        </button>',
            '                    </div>',
            '',
            '                    <div class="login-badges">',
            '                    </div>',
            '                </div>',
            '',
            '                <div id="login-screen" class="login-screen hidden">',
            '                    <h1 class="login-title" id="login-title">Daxil olun</h1>',
            '                    <p class="login-subtitle">Hesabınıza giriş edin</p>',
            '',
            '                    <form id="login-form" onsubmit="handleLogin(event)">',
            '                        <input type="hidden" id="role" name="role" value="">',
            '',
            '                        <div class="login-field-group">',
            '                            <label class="login-label" for="username">İstifadəçi adı</label>',
            '                            <div class="login-field">',
            '                                <span class="field-icon">👤</span>',
            '                                <input type="text" id="username" name="username" class="login-input"',
            '                                    placeholder="istifadeci_adi" required>',
            '                            </div>',
            '                        </div>',
            '',
            '                        <div class="login-field-group">',
            '                            <label class="login-label" for="password">Şifrə</label>',
            '                            <div class="login-field">',
            '                                <span class="field-icon">🔒</span>',
            '                                <input type="password" id="password" name="password" class="login-input"',
            '                                    placeholder="••••••••" required onkeyup="checkCapsLock(event)">',
            '                                <span class="password-toggle" onclick="togglePassword()">👁️</span>',
            '                            </div>',
            '                            <div id="caps-warning" class="login-caps-warning hidden">⚠️ Caps Lock açıqdır!</div>',
            '                        </div>',
            '',
            '                        <button type="submit" class="hero-submit-btn login-submit-btn">',
            '                            <span class="btn-text">Daxil Ol</span>',
            '                            <span class="btn-spinner hidden">⏳</span>',
            '                            <span class="btn-arrow">→</span>',
            '                        </button>',
            '',
            '                        <p id="error-message" class="login-error hidden"></p>',
            '',
            '                        <a href="#" onclick="showRoleSelection()" class="login-back-link">',
            '                            ← Geri qayıt',
            '                        </a>',
            '                    </form>',
            '                </div>',
            '            </div>',
            '        </div>',
            '    </div>',
            ''
        ];

        lines.splice(startIdx, endIdx - startIdx, ...cleanLogin);

        fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
        console.log('Successfully rewrote login section.');
    } else {
        console.error('Could not find login section bounds.');
    }

} catch (err) {
    console.error('Error:', err);
}
