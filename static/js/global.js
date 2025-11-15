// global.js — theme control, TTS (female), copy & download

// Immediately restore saved theme (prevents flicker)
(function () {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
  } catch (e) { /* ignore in older browsers */ }
})();

/* Toggle theme and persist */
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  } catch (e) {}
}

/* Text-to-speech: try to pick a female Telugu voice, fall back gracefully */
let synth = window.speechSynthesis;
let voices = [];

/* populate voices: browsers may load them asynchronously */
function populateVoices() {
  voices = synth.getVoices() || [];
}

/* If voices not loaded yet, listen for event */
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

/* pick a female voice with Telugu (te) if possible */
function pickFemaleVoice() {
  if (!voices.length) populateVoices();

  // 1. Telugu female
  let v = voices.find(v => v.lang && v.lang.toLowerCase().includes('te') && /female|woman|female/i.test(v.name));
  if (v) return v;

  // 2. Any Telugu
  v = voices.find(v => v.lang && v.lang.toLowerCase().includes('te'));
  if (v) return v;

  // 3. Female English
  v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en') && /female|woman/i.test(v.name));
  if (v) return v;

  // 4. fallback first voice
  return voices[0] || null;
}

/* Speak the text in the #transformed element */
let currentUtterance = null;
function speakTransformedText() {
  const el = document.getElementById('transformed');
  if (!el) return;
  const text = el.innerText.trim();
  if (!text) return;

  if (synth.speaking) {
    // toggle pause/resume
    if (synth.paused) synth.resume();
    else synth.pause();
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  const voice = pickFemaleVoice();
  if (voice) currentUtterance.voice = voice;

  currentUtterance.rate = 1;
  currentUtterance.pitch = 1;
  synth.speak(currentUtterance);
}

/* copy and download helpers */
function copyTransformed() {
  const el = document.getElementById('transformed');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText || '').then(() => {
    alert('Copied to clipboard!');
  }).catch(() => alert('Copy failed'));
}

function downloadTransformed() {
  const el = document.getElementById('transformed');
  if (!el) return;
  const text = el.innerText || '';
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transformed_poem.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* expose functions as globals so templates can call them */
window.toggleTheme = toggleTheme;
window.speakTransformedText = speakTransformedText;
window.copyTransformed = copyTransformed;
window.downloadTransformed = downloadTransformed;
