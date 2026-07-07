// transformer.js — AI Studio Poem Transformer Page Logic and Layout

injectStyles(`
    .transformer-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .form-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 32px;
        box-shadow: var(--shadow);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
    }

    .form-label {
        font-weight: 600;
        font-size: 14px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .text-area {
        width: 100%;
        min-height: 160px;
        background-color: var(--input-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 16px;
        color: var(--text);
        font-family: inherit;
        font-size: 15px;
        resize: vertical;
        outline: none;
    }

    .text-area:focus {
        border-color: var(--accent);
    }

    .select-input {
        width: 100%;
        background-color: var(--input-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 14px 16px;
        color: var(--text);
        font-family: inherit;
        font-size: 15px;
        outline: none;
        cursor: pointer;
    }

    .select-input:focus {
        border-color: var(--accent);
    }

    .submit-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--accent), #ff7347);
        color: white;
        border: none;
        border-radius: 16px;
        padding: 16px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(255, 91, 45, 0.2);
    }

    .submit-btn:hover {
        background: linear-gradient(135deg, #e04318, #ff5b2d);
        transform: translateY(-1px);
    }

    /* Results Layout */
    .result-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 28px;
        margin-top: 10px;
    }

    @media (min-width: 768px) {
        .result-grid {
            grid-template-columns: 1.2fr 1.8fr;
        }
    }

    /* Telugu Poem Card */
    .poem-display-card {
        background: linear-gradient(145deg, #fffcf8, #fff4e8);
        border: 1px solid rgba(255, 91, 45, 0.15);
        border-radius: 24px;
        padding: 30px;
        text-align: center;
        box-shadow: var(--shadow);
    }

    html.dark .poem-display-card {
        background: linear-gradient(145deg, #120e0a, #0b0704);
        border: 1px solid rgba(255, 91, 45, 0.1);
    }

    .poem-meta {
        font-size: 13px;
        color: var(--accent);
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 14px;
        letter-spacing: 1px;
    }

    .telugu-text {
        font-family: 'NTR', 'Gautami', 'Outfit', sans-serif;
        font-size: 26px;
        line-height: 2.1;
        white-space: pre-line;
        color: var(--text);
        margin: 20px 0;
    }

    /* TTS Controls styling */
    .tts-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 20px;
    }

    .tts-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }

    .play-btn {
        background-color: var(--accent);
        color: white;
    }

    .play-btn:hover {
        background-color: var(--accent-hover);
        transform: scale(1.05);
    }

    .stop-btn {
        background-color: rgba(0,0,0,0.05);
        color: var(--text);
    }

    html.dark .stop-btn {
        background-color: rgba(255,255,255,0.05);
    }

    .stop-btn:hover {
        background-color: rgba(0,0,0,0.1);
    }

    /* Content Breakdown Card */
    .explanation-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 30px;
        box-shadow: var(--shadow);
    }

    .section-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 12px 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .explanation-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--muted);
        margin-bottom: 24px;
    }

    /* Vocabulary Grid */
    .vocab-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
        margin-top: 14px;
    }

    .vocab-chip {
        background-color: rgba(255, 91, 45, 0.05);
        border: 1px solid rgba(255, 91, 45, 0.08);
        border-radius: 14px;
        padding: 12px 14px;
        text-align: left;
    }

    html.dark .vocab-chip {
        background-color: rgba(255, 255, 255, 0.02);
        border-color: rgba(255, 255, 255, 0.04);
    }

    .vocab-word {
        font-family: 'NTR', 'Gautami', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 4px;
    }

    .vocab-meaning {
        font-size: 13px;
        color: var(--muted);
        line-height: 1.3;
    }

    /* Loader */
    .loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 0;
        gap: 16px;
    }

    .spinner {
        width: 42px;
        height: 42px;
        border: 3px solid rgba(255, 91, 45, 0.1);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Utility action row for result details */
    .result-action-row {
        display: flex;
        gap: 10px;
        margin-top: 16px;
        justify-content: center;
    }

    .utility-btn {
        background: none;
        border: 1px solid var(--border);
        color: var(--text);
        padding: 8px 14px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .utility-btn:hover {
        background-color: rgba(0,0,0,0.03);
    }

    html.dark .utility-btn:hover {
        background-color: rgba(255,255,255,0.03);
    }
`);

let audioPlayer = null;

function initTransformer(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'transformer-container';

    // 1. Form Card
    const formCard = document.createElement('div');
    formCard.className = 'form-card';
    formCard.innerHTML = `
        <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AI Poetic Transformation</h2>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: var(--muted);">Input a Telugu poem to refactor it into classical Telugu meters, synthesize vocal recordings, and study its grammatical insights.</p>
        
        <form id="transform-form">
            <div class="form-group">
                <label class="form-label">Original Telugu Verse</label>
                <textarea class="text-area" id="poem-input" placeholder="ఎంటర్ చేయండి (Enter your Telugu poem here)..." required></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Target Poetic Form (Meter)</label>
                <select class="select-input" id="form-select">
                    <option value="Dwipada">Dwipada (ద్విపద - Couplet)</option>
                    <option value="Kanda Padyam">Kanda Padyam (కంద పద్యం)</option>
                    <option value="Satakam">Satakam (శతకం)</option>
                    <option value="Utpalamala">Utpalamala (ఉత్పలమాల)</option>
                </select>
            </div>
            
            <button type="submit" class="submit-btn" id="submit-btn">
                <span>✨</span> Transform Poem
            </button>
        </form>
    `;
    wrapper.appendChild(formCard);

    // 2. Results Container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'transform-results';
    wrapper.appendChild(resultsContainer);

    root.appendChild(wrapper);

    // Form submission event
    const form = document.getElementById('transform-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const poem = document.getElementById('poem-input').value;
        const formType = document.getElementById('form-select').value;
        runTransformation(poem, formType, resultsContainer);
    });
}

function runTransformation(poem, formType, container) {
    // Show spinner
    container.innerHTML = `
        <div class="glass-card loader-container">
            <div class="spinner"></div>
            <p style="margin: 0; font-size: 14px; font-weight: 500; color: var(--muted);">Consulting Telugu literary scholar...</p>
        </div>
    `;

    fetch('/repoetry/transform/submit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ poem: poem, form: formType })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            container.innerHTML = `
                <div class="glass-card" style="border-color: rgba(239, 68, 68, 0.2); text-align: center; padding: 40px 20px;">
                    <span style="font-size: 32px;">⚠️</span>
                    <p style="margin: 12px 0 0 0; color: #ef4444; font-weight: 600;">${data.error || 'Failed to complete transformation.'}</p>
                </div>
            `;
            return;
        }

        renderResults(data, formType, container);
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = `
            <div class="glass-card" style="border-color: rgba(239, 68, 68, 0.2); text-align: center; padding: 40px 20px;">
                <span style="font-size: 32px;">🚨</span>
                <p style="margin: 12px 0 0 0; color: #ef4444; font-weight: 600;">A communication error occurred. Check backend console logs.</p>
            </div>
        `;
    });
}

function renderResults(data, formType, container) {
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'result-grid';

    // Left Column: Telugu Poem Card
    const poemCard = document.createElement('div');
    poemCard.className = 'poem-display-card';
    poemCard.innerHTML = `
        <div class="poem-meta">${formType} transformation</div>
        <div class="telugu-text">${data.transformed_poem}</div>
    `;

    // TTS Voiceover Controls (Telugu Isolated - Asynchronous Load)
    const audio = document.createElement('audio');
    audio.id = 'audio-player';
    poemCard.appendChild(audio);

    const controls = document.createElement('div');
    controls.className = 'tts-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'tts-btn play-btn';
    playBtn.innerHTML = '🔊'; // clean loudspeaker icon initially
    
    let isLoaded = false;
    let isLoading = false;

    playBtn.onclick = () => {
        if (isLoading) return;

        if (!isLoaded) {
            isLoading = true;
            playBtn.innerHTML = '⏳';
            
            fetch('/repoetry/api/tts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ text: data.transformed_poem })
            })
            .then(res => res.json())
            .then(ttsData => {
                isLoading = false;
                if (ttsData.success && ttsData.audio_b64) {
                    audio.src = `data:audio/mp3;base64,${ttsData.audio_b64}`;
                    isLoaded = true;
                    audio.play();
                    playBtn.innerHTML = '⏸';
                } else {
                    alert('Audio synthesis failed: ' + (ttsData.error || 'Unknown error'));
                    playBtn.innerHTML = '🔊';
                }
            })
            .catch(err => {
                isLoading = false;
                console.error(err);
                alert('Audio network request failed.');
                playBtn.innerHTML = '🔊';
            });
        } else {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '⏸';
            } else {
                audio.pause();
                playBtn.innerHTML = '▶';
            }
        }
    };

    const stopBtn = document.createElement('button');
    stopBtn.className = 'tts-btn stop-btn';
    stopBtn.innerHTML = '⏹';
    stopBtn.onclick = () => {
        if (isLoaded) {
            audio.pause();
            audio.currentTime = 0;
            playBtn.innerHTML = '▶';
        }
    };

    // Reset play icon when audio finishes
    audio.onended = () => {
        playBtn.innerHTML = '▶';
    };

    controls.appendChild(playBtn);
    controls.appendChild(stopBtn);
    poemCard.appendChild(controls);

    // Share and utility buttons
    const utilityRow = document.createElement('div');
    utilityRow.className = 'result-action-row';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'utility-btn';
    copyBtn.innerHTML = '📋 Copy';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(data.transformed_poem)
            .then(() => alert('Poem text copied to clipboard!'));
    };
    utilityRow.appendChild(copyBtn);

    const waBtn = document.createElement('a');
    waBtn.className = 'utility-btn';
    waBtn.style.textDecoration = 'none';
    waBtn.href = `https://wa.me/?text=${encodeURIComponent(data.transformed_poem)}`;
    waBtn.target = '_blank';
    waBtn.innerHTML = '↗️ WhatsApp';
    utilityRow.appendChild(waBtn);

    poemCard.appendChild(utilityRow);
    grid.appendChild(poemCard);

    // Right Column: Breakdown Cards
    const explanationCard = document.createElement('div');
    explanationCard.className = 'explanation-card';

    // English Translation
    const transTitle = document.createElement('h3');
    transTitle.className = 'section-title';
    transTitle.innerHTML = '<span>🇬🇧</span> English Translation';
    explanationCard.appendChild(transTitle);

    const transText = document.createElement('p');
    transText.className = 'explanation-text';
    transText.style.whiteSpace = 'pre-line';
    transText.innerText = data.english_translation;
    explanationCard.appendChild(transText);

    // Explanation
    const explTitle = document.createElement('h3');
    explTitle.className = 'section-title';
    explTitle.innerHTML = '<span>📖</span> Literary Analysis';
    explanationCard.appendChild(explTitle);

    const explText = document.createElement('p');
    explText.className = 'explanation-text';
    explText.innerText = data.explanation;
    explanationCard.appendChild(explText);

    // Vocabulary Chips
    if (data.word_meanings && data.word_meanings.length > 0) {
        const vocabTitle = document.createElement('h3');
        vocabTitle.className = 'section-title';
        vocabTitle.innerHTML = '<span>📚</span> Vocabulary meanings';
        explanationCard.appendChild(vocabTitle);

        const vocabGrid = document.createElement('div');
        vocabGrid.className = 'vocab-grid';

        data.word_meanings.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'vocab-chip';
            chip.innerHTML = `
                <div class="vocab-word">${item.word}</div>
                <div class="vocab-meaning">${item.meaning}</div>
            `;
            vocabGrid.appendChild(chip);
        });

        explanationCard.appendChild(vocabGrid);
    }

    grid.appendChild(explanationCard);
    container.appendChild(grid);
}

// Expose dynamic view initializer
window.initTransformer = initTransformer;
