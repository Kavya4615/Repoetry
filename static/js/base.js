// base.js — Shared utilities, CSRF parsing, theme switching, and Navbar rendering

// CSRF cookie helper for Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Dynamically inject styling
function injectStyles(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
}

// Global Variables
const accentColor = '#ff5b2d';
const accentHoverColor = '#e04318';

// Inject modern typography and root styling
injectStyles(`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=NTR&display=swap');
    
    :root {
        --bg: #f9fafb;
        --text: #111827;
        --muted: #4b5563;
        --card-bg: rgba(255, 255, 255, 0.85);
        --border: rgba(0, 0, 0, 0.08);
        --input-bg: #ffffff;
        --accent: ${accentColor};
        --accent-hover: ${accentHoverColor};
        --shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        --nav-bg: rgba(255, 255, 255, 0.8);
    }
    
    html.dark {
        --bg: #09090b;
        --text: #f9fafb;
        --muted: #a1a1aa;
        --card-bg: rgba(18, 18, 22, 0.85);
        --border: rgba(255, 255, 255, 0.08);
        --input-bg: #18181b;
        --shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        --nav-bg: rgba(9, 9, 11, 0.8);
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        background-color: var(--bg);
        color: var(--text);
        font-family: 'Outfit', sans-serif;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Premium Glassmorphic Navbar */
    .app-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--nav-bg);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--border);
        padding: 14px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .nav-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        font-size: 22px;
        text-decoration: none;
        color: var(--text);
        letter-spacing: -0.5px;
    }

    .brand-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #ff8a5a, var(--accent));
        color: white;
        border-radius: 10px;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(255, 91, 45, 0.3);
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .nav-btn {
        text-decoration: none;
        color: var(--text);
        font-weight: 500;
        font-size: 15px;
        padding: 8px 16px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .nav-btn:hover {
        background-color: rgba(255, 91, 45, 0.08);
        color: var(--accent);
    }

    .nav-btn-primary {
        background: linear-gradient(135deg, var(--accent), #ff7347);
        color: white !important;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(255, 91, 45, 0.2);
    }

    .nav-btn-primary:hover {
        background: linear-gradient(135deg, #e04318, #ff5b2d);
        transform: translateY(-1px);
    }

    /* Dark Mode Toggle */
    .theme-switch {
        width: 48px;
        height: 26px;
        background-color: rgba(0,0,0,0.08);
        border: 1px solid var(--border);
        border-radius: 99px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    html.dark .theme-switch {
        background-color: rgba(255,255,255,0.08);
    }

    .theme-switch-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: var(--accent);
        position: absolute;
        top: 2px;
        left: 2px;
        transition: left 0.2s, background-color 0.2s;
    }

    html.dark .theme-switch-thumb {
        left: 24px;
        background-color: #ffd644;
    }

    /* Global layout wrap */
    .app-main {
        max-width: 900px;
        margin: 40px auto;
        padding: 0 20px;
    }

    /* Global Card Base */
    .glass-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        border-radius: 24px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 30px;
    }
`);

// Sync theme class based on localStorage value
function syncTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Restore immediately
syncTheme();

// Listen to pageshow to catch bfcache/navigation changes and sync theme state globally
window.addEventListener('pageshow', syncTheme);

// Toggle theme logic
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Render dynamic navbar
function renderHeader(user) {
    const header = document.createElement('header');
    header.className = 'app-header';

    const container = document.createElement('div');
    container.className = 'nav-container';

    // Brand Logo
    const brand = document.createElement('a');
    brand.href = '/';
    brand.className = 'brand';
    brand.innerHTML = `
        <span class="brand-icon">✍️</span>
        <span>Repoetry</span>
    `;
    container.appendChild(brand);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'nav-actions';

    // AI Studio Link (Always visible)
    const aiBtn = document.createElement('a');
    aiBtn.href = '/transform/';
    aiBtn.className = 'nav-btn';
    aiBtn.innerHTML = `<span>✨</span> AI Studio`;
    actions.appendChild(aiBtn);

    if (user.isAuthenticated) {
        const postBtn = document.createElement('a');
        postBtn.href = '/add/';
        postBtn.className = 'nav-btn nav-btn-primary';
        postBtn.innerHTML = `<span>＋</span> Post`;
        actions.appendChild(postBtn);

        const logoutBtn = document.createElement('a');
        logoutBtn.href = '/logout/';
        logoutBtn.className = 'nav-btn';
        logoutBtn.innerText = 'Logout';
        actions.appendChild(logoutBtn);
    } else {
        const loginBtn = document.createElement('a');
        loginBtn.href = '/login/';
        loginBtn.className = 'nav-btn nav-btn-primary';
        loginBtn.innerText = 'Login';
        actions.appendChild(loginBtn);

        const signupBtn = document.createElement('a');
        signupBtn.href = '/signup/';
        signupBtn.className = 'nav-btn';
        signupBtn.innerText = 'Sign Up';
        actions.appendChild(signupBtn);
    }

    // Theme Toggle
    const themeBtn = document.createElement('div');
    themeBtn.className = 'theme-switch';
    themeBtn.onclick = toggleTheme;
    themeBtn.innerHTML = `<div class="theme-switch-thumb"></div>`;
    actions.appendChild(themeBtn);

    container.appendChild(actions);
    header.appendChild(container);
    document.body.insertBefore(header, document.body.firstChild);
}

// Expose to window
window.getCookie = getCookie;
window.injectStyles = injectStyles;
window.renderHeader = renderHeader;
window.toggleTheme = toggleTheme;
