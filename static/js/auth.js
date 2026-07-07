// auth.js — Dynamic Login & Signup page rendering with AJAX form submission

injectStyles(`
    .auth-wrapper {
        min-height: calc(100vh - 70px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }

    .auth-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 40px 36px;
        width: 100%;
        max-width: 400px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        animation: authFadeIn 0.4s ease;
    }

    @keyframes authFadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .auth-title {
        font-size: 24px;
        font-weight: 800;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
        text-align: center;
    }

    .auth-subtitle {
        font-size: 14px;
        color: var(--muted);
        margin: 0 0 28px 0;
        text-align: center;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .auth-input {
        width: 100%;
        padding: 14px 16px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background-color: var(--input-bg);
        color: var(--text);
        font-family: inherit;
        font-size: 15px;
        outline: none;
    }

    .auth-input:focus {
        border-color: var(--accent);
    }

    .auth-input::placeholder {
        color: var(--muted);
    }

    .auth-submit {
        width: 100%;
        padding: 14px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, var(--accent), #ff7347);
        color: white;
        font-family: inherit;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 4px;
        box-shadow: 0 4px 15px rgba(255, 91, 45, 0.2);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .auth-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255, 91, 45, 0.3);
    }

    .auth-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .auth-footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: var(--muted);
    }

    .auth-footer a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 600;
    }

    .auth-footer a:hover {
        text-decoration: underline;
    }

    .auth-error {
        background-color: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.15);
        color: #ef4444;
        font-size: 13px;
        font-weight: 500;
        padding: 10px 14px;
        border-radius: 12px;
        text-align: center;
        display: none;
    }

    .auth-error.visible {
        display: block;
    }

    .auth-success {
        background-color: rgba(34, 197, 94, 0.08);
        border: 1px solid rgba(34, 197, 94, 0.15);
        color: #22c55e;
        font-size: 13px;
        font-weight: 500;
        padding: 10px 14px;
        border-radius: 12px;
        text-align: center;
        display: none;
    }

    .auth-success.visible {
        display: block;
    }
`);

function initLogin(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'auth-wrapper';
    wrapper.innerHTML = `
        <div class="auth-card">
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Sign in to continue reading and writing poetry.</p>
            
            <div class="auth-error" id="auth-error"></div>
            
            <form class="auth-form" id="login-form">
                <input type="text" class="auth-input" id="login-username" placeholder="Username" required autocomplete="username" />
                <input type="password" class="auth-input" id="login-password" placeholder="Password" required autocomplete="current-password" />
                <button type="submit" class="auth-submit" id="login-btn">Sign In</button>
            </form>
            
            <div class="auth-footer">
                Don't have an account? <a href="/signup/">Create one</a>
            </div>
        </div>
    `;
    root.appendChild(wrapper);

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const errBox = document.getElementById('auth-error');
        errBox.classList.remove('visible');
        btn.disabled = true;
        btn.textContent = 'Signing in...';

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (ok && data.success) {
                window.location.href = '/';
            } else {
                errBox.textContent = data.error || 'Login failed.';
                errBox.classList.add('visible');
                btn.disabled = false;
                btn.textContent = 'Sign In';
            }
        })
        .catch(() => {
            errBox.textContent = 'Network error. Please try again.';
            errBox.classList.add('visible');
            btn.disabled = false;
            btn.textContent = 'Sign In';
        });
    });
}

function initSignup(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'auth-wrapper';
    wrapper.innerHTML = `
        <div class="auth-card">
            <h2 class="auth-title">Create your account</h2>
            <p class="auth-subtitle">Join Repoetry and start sharing your verses.</p>
            
            <div class="auth-error" id="auth-error"></div>
            <div class="auth-success" id="auth-success"></div>
            
            <form class="auth-form" id="signup-form">
                <input type="text" class="auth-input" id="signup-username" placeholder="Choose a username" required autocomplete="username" />
                <input type="password" class="auth-input" id="signup-password1" placeholder="Password" required autocomplete="new-password" />
                <input type="password" class="auth-input" id="signup-password2" placeholder="Confirm password" required autocomplete="new-password" />
                <button type="submit" class="auth-submit" id="signup-btn">Create Account</button>
            </form>
            
            <div class="auth-footer">
                Already have an account? <a href="/login/">Sign in</a>
            </div>
        </div>
    `;
    root.appendChild(wrapper);

    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('signup-btn');
        const errBox = document.getElementById('auth-error');
        const successBox = document.getElementById('auth-success');
        errBox.classList.remove('visible');
        successBox.classList.remove('visible');
        btn.disabled = true;
        btn.textContent = 'Creating account...';

        const username = document.getElementById('signup-username').value;
        const password1 = document.getElementById('signup-password1').value;
        const password2 = document.getElementById('signup-password2').value;

        fetch('/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ username, password1, password2 })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (ok && data.success) {
                successBox.textContent = data.message || 'Account created! Redirecting...';
                successBox.classList.add('visible');
                setTimeout(() => { window.location.href = '/login/'; }, 1500);
            } else {
                errBox.textContent = data.error || 'Signup failed.';
                errBox.classList.add('visible');
                btn.disabled = false;
                btn.textContent = 'Create Account';
            }
        })
        .catch(() => {
            errBox.textContent = 'Network error. Please try again.';
            errBox.classList.add('visible');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        });
    });
}

window.initLogin = initLogin;
window.initSignup = initSignup;
