// add_poem.js — Dynamic "Post a Poem" page rendering with AJAX submission

injectStyles(`
    .addpoem-wrapper {
        max-width: 640px;
        margin: 0 auto;
    }

    .addpoem-header {
        margin-bottom: 28px;
    }

    .addpoem-title {
        font-size: 28px;
        font-weight: 800;
        margin: 0 0 6px 0;
        letter-spacing: -0.5px;
    }

    .addpoem-desc {
        font-size: 14px;
        color: var(--muted);
        margin: 0;
    }

    .addpoem-form-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 32px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    .addpoem-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 20px;
    }

    .addpoem-label {
        font-weight: 600;
        font-size: 13px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .addpoem-input {
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

    .addpoem-input:focus {
        border-color: var(--accent);
    }

    .addpoem-input::placeholder {
        color: var(--muted);
    }

    .addpoem-textarea {
        width: 100%;
        min-height: 180px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background-color: var(--input-bg);
        color: var(--text);
        font-family: 'NTR', 'Outfit', sans-serif;
        font-size: 16px;
        line-height: 1.8;
        resize: vertical;
        outline: none;
    }

    .addpoem-textarea:focus {
        border-color: var(--accent);
    }

    .addpoem-textarea::placeholder {
        color: var(--muted);
    }

    .addpoem-select {
        width: 100%;
        padding: 14px 16px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background-color: var(--input-bg);
        color: var(--text);
        font-family: inherit;
        font-size: 15px;
        outline: none;
        cursor: pointer;
    }

    .addpoem-select:focus {
        border-color: var(--accent);
    }

    .addpoem-submit {
        width: 100%;
        padding: 15px;
        border-radius: 16px;
        border: none;
        background: linear-gradient(135deg, var(--accent), #ff7347);
        color: white;
        font-family: inherit;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(255, 91, 45, 0.2);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .addpoem-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255, 91, 45, 0.3);
    }

    .addpoem-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .addpoem-error {
        background-color: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.15);
        color: #ef4444;
        font-size: 13px;
        font-weight: 500;
        padding: 10px 14px;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 16px;
        display: none;
    }

    .addpoem-error.visible {
        display: block;
    }
`);

function initAddPoem(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'addpoem-wrapper';

    wrapper.innerHTML = `
        <div class="addpoem-header">
            <h1 class="addpoem-title">Post a New Poem</h1>
            <p class="addpoem-desc">Craft a verse and share it with the Repoetry community.</p>
        </div>

        <div class="addpoem-form-card">
            <div class="addpoem-error" id="addpoem-error"></div>

            <form id="addpoem-form">
                <div class="addpoem-group">
                    <label class="addpoem-label">Title (optional)</label>
                    <input type="text" class="addpoem-input" id="poem-title" placeholder="Give your poem a name..." />
                </div>

                <div class="addpoem-group">
                    <label class="addpoem-label">Language</label>
                    <select class="addpoem-select" id="poem-language">
                        <option value="te">Telugu</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                    </select>
                </div>

                <div class="addpoem-group">
                    <label class="addpoem-label">Your Poem</label>
                    <textarea class="addpoem-textarea" id="poem-text" placeholder="Let the words flow..." required></textarea>
                </div>

                <button type="submit" class="addpoem-submit" id="addpoem-btn">
                    <span>✍️</span> Publish Poem
                </button>
            </form>
        </div>
    `;
    root.appendChild(wrapper);

    document.getElementById('addpoem-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('addpoem-btn');
        const errBox = document.getElementById('addpoem-error');
        errBox.classList.remove('visible');
        btn.disabled = true;
        btn.innerHTML = '<span>⏳</span> Publishing...';

        const title = document.getElementById('poem-title').value;
        const language = document.getElementById('poem-language').value;
        const text = document.getElementById('poem-text').value;

        fetch('/repoetry/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ title, language, text })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (ok && data.success) {
                window.location.href = '/';
            } else {
                errBox.textContent = data.error || 'Failed to post poem.';
                errBox.classList.add('visible');
                btn.disabled = false;
                btn.innerHTML = '<span>✍️</span> Publish Poem';
            }
        })
        .catch(() => {
            errBox.textContent = 'Network error. Please try again.';
            errBox.classList.add('visible');
            btn.disabled = false;
            btn.innerHTML = '<span>✍️</span> Publish Poem';
        });
    });
}

window.initAddPoem = initAddPoem;
