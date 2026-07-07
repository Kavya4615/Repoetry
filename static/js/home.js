// home.js — Dynamic rendering for Home page with dynamic styles and AJAX integrations

injectStyles(`
    /* Hero Banner styles */
    .hero-banner {
        background: linear-gradient(135deg, var(--accent) 0%, #ff7347 50%, #f97316 100%);
        color: white;
        padding: 70px 24px;
        text-align: center;
        border-radius: 32px;
        margin-bottom: 40px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(255, 91, 45, 0.15);
    }

    .hero-banner::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15), transparent 40%);
        pointer-events: none;
    }

    .hero-title {
        font-size: clamp(32px, 5vw, 48px);
        font-weight: 800;
        margin: 0 0 12px 0;
        letter-spacing: -1px;
        line-height: 1.1;
    }

    .hero-desc {
        font-size: 16px;
        opacity: 0.9;
        max-width: 520px;
        margin: 0 auto 28px;
        font-weight: 300;
        line-height: 1.5;
    }

    .hero-btn {
        background: white;
        color: var(--accent);
        border: none;
        padding: 12px 28px;
        font-size: 15px;
        font-weight: 700;
        border-radius: 99px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .hero-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    /* Poem Card list */
    .feed-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .poem-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 24px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
    }

    .poem-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    }

    html.dark .poem-card:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .author-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff8a5a, var(--accent));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 14px;
    }

    .username {
        font-weight: 600;
        font-size: 15px;
    }

    .poet-badge {
        font-size: 12px;
        background-color: rgba(255, 91, 45, 0.1);
        color: var(--accent);
        padding: 4px 10px;
        border-radius: 99px;
        font-weight: 500;
    }

    .poem-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 10px 0;
        letter-spacing: -0.3px;
    }

    .poem-body {
        font-size: 15px;
        line-height: 1.7;
        white-space: pre-line;
        margin-bottom: 20px;
        color: var(--text);
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px dashed var(--border);
    }

    .card-actions {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--muted);
        font-size: 14px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 8px;
        transition: background-color 0.2s, color 0.2s;
    }

    .action-btn:hover {
        background-color: rgba(0, 0, 0, 0.04);
        color: var(--text);
    }

    html.dark .action-btn:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }

    .action-btn.active-like {
        color: #ef4444;
    }

    .action-btn.active-like:hover {
        background-color: rgba(239, 68, 68, 0.08);
    }

    /* Comments Section */
    .comments-wrapper {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
        max-height: 240px;
        overflow-y: auto;
    }

    .comment-item {
        background-color: rgba(0, 0, 0, 0.02);
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.4;
    }

    html.dark .comment-item {
        background-color: rgba(255, 255, 255, 0.02);
    }

    .comment-item strong {
        color: var(--text);
        margin-right: 6px;
    }

    .comment-form {
        display: flex;
        gap: 8px;
    }

    .comment-input {
        flex: 1;
        background-color: var(--input-bg);
        border: 1px solid var(--border);
        padding: 10px 14px;
        border-radius: 12px;
        color: var(--text);
        font-size: 13px;
        outline: none;
    }

    .comment-input:focus {
        border-color: var(--accent);
    }

    .comment-btn {
        background-color: var(--accent);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
    }

    .comment-btn:hover {
        background-color: var(--accent-hover);
    }

    .empty-msg {
        text-align: center;
        padding: 40px;
        color: var(--muted);
        font-weight: 400;
    }
`);

// Build HTML Structure inside target container
function initHomeView(containerId, user) {
    const root = document.getElementById(containerId);
    if (!root) return;

    // Render Hero Banner
    const hero = document.createElement('section');
    hero.className = 'hero-banner';
    hero.innerHTML = `
        <h1 class="hero-title">Stay updated with the latest repoems.</h1>
        <p class="hero-desc">Follow developers, share verses born from compile failures & git commits, and leverage AI schemas to perfect Telugu metrics.</p>
        <a href="${user.isAuthenticated ? '/add/' : '/login/'}" class="hero-btn">
            <span>✍️</span> ${user.isAuthenticated ? 'Post a Poem' : 'Start Writing Now'}
        </a>
    `;
    root.appendChild(hero);

    // Render Feed Shell
    const feed = document.createElement('div');
    feed.className = 'feed-container';
    feed.id = 'poems-feed';
    feed.innerHTML = `<div class="empty-msg">Loading verses...</div>`;
    root.appendChild(feed);

    // Fetch and Populate Poems
    fetchPoems(feed, user);
}

function fetchPoems(feedElement, user) {
    fetch('/repoetry/api/poems/')
        .then(res => res.json())
        .then(data => {
            feedElement.innerHTML = '';
            const poems = data.poems || [];
            if (poems.length === 0) {
                feedElement.innerHTML = `<div class="empty-msg">No poems shared yet. Be the first!</div>`;
                return;
            }

            poems.forEach(poem => {
                const card = createPoemCard(poem, user);
                feedElement.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error loading poems:", err);
            feedElement.innerHTML = `<div class="empty-msg">Failed to load feed. Please try again.</div>`;
        });
}

function createPoemCard(poem, user) {
    const card = document.createElement('article');
    card.className = 'poem-card';

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
        <div class="author-info">
            <div class="avatar">${poem.author[0].toUpperCase()}</div>
            <span class="username">@${poem.author}</span>
        </div>
        <div class="poet-badge">${poem.poet_name}</div>
    `;
    card.appendChild(header);

    // Title
    if (poem.title && poem.title !== '(Untitled)') {
        const titleEl = document.createElement('h3');
        titleEl.className = 'poem-title';
        titleEl.innerText = poem.title;
        card.appendChild(titleEl);
    }

    // Body
    const body = document.createElement('div');
    body.className = 'poem-body';
    body.innerText = poem.text;
    card.appendChild(body);

    // Footer actions
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    // Likes & comments counts
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Like Button
    const likeBtn = document.createElement('button');
    likeBtn.className = `action-btn ${poem.is_liked ? 'active-like' : ''}`;
    likeBtn.innerHTML = `👍 <span>${poem.total_likes}</span>`;
    likeBtn.onclick = () => handleLike(poem.id, likeBtn, user);
    actions.appendChild(likeBtn);

    // Comments Toggle Button
    const commentToggleBtn = document.createElement('button');
    commentToggleBtn.className = 'action-btn';
    commentToggleBtn.innerHTML = `💬 <span>Comments (${poem.comments.length})</span>`;
    actions.appendChild(commentToggleBtn);

    footer.appendChild(actions);

    // Share link
    const shareLink = document.createElement('a');
    shareLink.className = 'action-btn';
    shareLink.href = `https://wa.me/?text=${encodeURIComponent(poem.text)}`;
    shareLink.target = '_blank';
    shareLink.innerHTML = `↗️ Share`;
    footer.appendChild(shareLink);

    card.appendChild(footer);

    // Comments container (hidden by default)
    const commentsSec = document.createElement('div');
    commentsSec.className = 'comments-wrapper';
    commentsSec.style.display = 'none';

    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    poem.comments.forEach(comment => {
        const cEl = document.createElement('div');
        cEl.className = 'comment-item';
        cEl.innerHTML = `<strong>${comment.username}</strong> ${comment.text}`;
        commentsList.appendChild(cEl);
    });

    if (poem.comments.length === 0) {
        commentsList.innerHTML = `<p style="margin: 0; font-size: 13px; color: var(--muted)">No comments yet.</p>`;
    }

    commentsSec.appendChild(commentsList);

    // Add comment form if user authenticated
    if (user.isAuthenticated) {
        const cForm = document.createElement('form');
        cForm.className = 'comment-form';
        cForm.innerHTML = `
            <input type="text" placeholder="Write a comment..." class="comment-input" required />
            <button type="submit" class="comment-btn">Post</button>
        `;
        cForm.onsubmit = (e) => {
            e.preventDefault();
            const input = cForm.querySelector('.comment-input');
            handleComment(poem.id, input.value, commentsList, commentToggleBtn, input, poem.comments.length);
        };
        commentsSec.appendChild(cForm);
    } else {
        const prompt = document.createElement('p');
        prompt.style = 'font-size: 12px; margin: 8px 0 0 0; color: var(--muted)';
        prompt.innerHTML = `<a href="/login/" style="color: var(--accent); text-decoration: none;">Log in</a> to write comments.`;
        commentsSec.appendChild(prompt);
    }

    card.appendChild(commentsSec);

    // Toggle behavior
    commentToggleBtn.onclick = () => {
        commentsSec.style.display = commentsSec.style.display === 'none' ? 'block' : 'none';
    };

    return card;
}

// AJAX Like Action
function handleLike(poemId, buttonEl, user) {
    if (!user.isAuthenticated) {
        window.location.href = '/login/';
        return;
    }

    fetch(`/repoetry/like/${poemId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.liked) {
            buttonEl.classList.add('active-like');
        } else {
            buttonEl.classList.remove('active-like');
        }
        buttonEl.querySelector('span').innerText = data.likes;
    })
    .catch(err => console.error("Error liking poem:", err));
}

// AJAX Comment Action
function handleComment(poemId, text, commentsListEl, toggleBtnEl, inputEl, initialCommentsCount) {
    fetch(`/repoetry/comment/${poemId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ comment: text })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Remove "no comments" placeholder if any
            if (commentsListEl.innerText.includes('No comments yet.')) {
                commentsListEl.innerHTML = '';
            }

            const cEl = document.createElement('div');
            cEl.className = 'comment-item';
            cEl.innerHTML = `<strong>${data.comment.username}</strong> ${data.comment.text}`;
            commentsListEl.appendChild(cEl);
            
            // Clear input
            inputEl.value = '';

            // Update comments count in toggle button
            const updatedCount = commentsListEl.querySelectorAll('.comment-item').length;
            toggleBtnEl.querySelector('span').innerText = `Comments (${updatedCount})`;
        }
    })
    .catch(err => console.error("Error posting comment:", err));
}

// Expose dynamic view initializer
window.initHomeView = initHomeView;
