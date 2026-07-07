# Repoetry – AI Powered Poetry Platform

Repoetry is a modern poetry-sharing platform combining a robust Django backend with a dynamic, JavaScript-first frontend and advanced Gemini-powered AI poem analysis, translation, and on-demand vocal synthesis.

---

## 🚀 Key Features

### 🧠 Gemini 2.5 Structured AI outputs
- **Meter Transformation**: Convert Telugu verses into classical meters (*Dwipada*, *Kanda Padyam*, *Satakam*, or *Utpalamala*) with a dedicated literary scholar prompt persona.
- **Pydantic Schemas**: Structured schema outputs enforce a guaranteed formatting structure including:
  - Transformed Telugu verse
  - Line-by-line English translation
  - Deep literary & metric analysis
  - Detailed vocabulary mapping list of key Telugu terms to English meanings
- **Asynchronous TTS Loading**: Backend transformations load **instantly** (under 3 seconds). Audio synthesis is isolated and generated on-demand when the user clicks the "Listen" button, keeping response latency to a minimum.
- **Telugu-Only Audio Voiceover**: Isolate synthesized audio to the Telugu poem only, preventing English translation content from glitching the voiceover's accent.

### 🎨 Premium Dynamic UI/UX
- **JS-First Architecture**: Django templates reduced by **95%** to skeletal wrappers. Interface layouts, cards, inputs, transitions, and states are rendered dynamically in JavaScript.
- **Interactive Feed**: Like verses and post comments instantly without page refreshes using AJAX.
- **Global Theme Sync**: Light & dark variables sync seamlessly across navigation actions and history states (including bfcache) using pageshow event bindings.
- **Sharing Tools**: Easily copy Telugu text to your clipboard or share verses instantly on WhatsApp.

### ☁️ Production Deploy Ready
- **Gunicorn Static Serving**: Included built-in Django static file serve route fallbacks, making the project deploy-ready to Render or Heroku without requiring extra Nginx or static file setup.

---

## 🛠 Technologies Used

- **Django 5.2.7** (Backend & REST API)
- **Vanilla ES6+ JavaScript** (Dynamic view rendering & DOM compilation)
- **google-genai 1.50.0** (Structured JSON API outputs)
- **gTTS** (Google Text-to-Speech isolated Telugu audio stream)
- **SQLite3** (Database storage)
- **CSS3 Variables** (Dynamic theme switcher)

---

## 📦 Installation & Setup

### 1. Clone this repository
```sh
git clone https://github.com/your-username/repoetry.git
cd repoetry
```

### 2. Create a virtual environment
```sh
python -m venv venv
```

Activate it:
- **Windows**:
  ```sh
  venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```sh
  source venv/bin/activate
  ```

### 3. Install dependencies
```sh
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Set the following environment variables in your terminal or configure them in Render:
```sh
export GOOGLE_API_KEY="your-gemini-api-key"
export ELEVEN_API_KEY="optional-elevenlabs-key"
```

### 5. Run Migrations & Server
```sh
python manage.py migrate
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser.

---

## 📝 Usage

- **Home Feed**: View recent poetry posts, toggle comments, like poems, or share to WhatsApp.
- **AI Studio**: Input your Telugu poetry, choose a meter form, and hit **Transform**. Read the breakdown and click the **🔊 Listen** button to generate and hear the Telugu voiceover on-demand.
- **Publish**: Log in to your account and click **Post** in the header to share your own verses with the feed.

---

## 📁 restyled Folder Structure

```
repoetry/
│── core/               # Settings & root routing configurations
│── repoetry/           # Models, JSON API views, & template skeletons
│── static/             
│   └── js/             # Core dynamic rendering logic
│       ├── base.js     # Shared navbar, global variables & theme sync
│       ├── home.js     # Feed loading, likes, & comment submissions
│       ├── transformer.js # Form validation, structured output parser & TTS loader
│       ├── auth.js     # AJAX-based Login/Signup controllers
│       └── add_poem.js # Async poem publisher
│── manage.py
│── requirements.txt
│── README.md
```
