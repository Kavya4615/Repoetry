# Repoetry – AI Powered Poetry Platform

Repoetry is a modern poetry-sharing platform with AI-powered poem transformation, poem posting, likes, comments, and audio generation.

---

## 🚀 Features

- ✨ Transform Telugu poems into:
  - Dwipada
  - Kanda Padyam
  - Satakam
  - Utpalamala
- 🌓 Light & Dark Mode with premium UI
- ❤️ Like poems
- 💬 Comment on poems
- ➕ Add your own poems
- 🔐 User authentication (Login/Logout)
- 🎤 AI Audio generation (optional)
- 📤 Share poems on WhatsApp
- 📥 Download or Copy transformed poems
- 🎨 Glassmorphic & 3D-hover UI
- 📱 Fully responsive

---

## Project link(Deployed)

https://repoetry.onrender.com/

## 🛠 Technologies Used

- **Django** (Backend)
- **HTML, CSS, JS** (Frontend)
- **SQLite3** (Database)
- **OpenAI / Gemini** (AI Transformer)
- **ElevenLabs** (for Telugu audio)
- **Python 3.10+**

---

## 📦 Installation

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

Windows:
```sh
venv\Scripts\activate
```

macOS/Linux:
```sh
source venv/bin/activate
```

### 3. Install dependencies
```sh
pip install -r requirements.txt
```

### 4. Create a `.env` file
Add:
```
OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here   # optional
DJANGO_SECRET_KEY=your_key_here
```

### 5. Run migrations
```sh
python manage.py migrate
```

### 6. Create admin user
```sh
python manage.py createsuperuser
```

### 7. Run the server
```sh
python manage.py runserver
```

The project will start at:  
👉 http://127.0.0.1:8000/

---

## 📝 How to Use

### Home Page
- View poems  
- Like poems  
- Read comments  
- Share on WhatsApp  

### AI Transformer Page
- Enter a Telugu poem  
- Select poem style  
- Transform & download/copy  

### Add Poem Page
- Write your poem  
- Select language  
- Publish  

---

## 📁 Folder Structure

```
repoetry/
│── poems/
│── transformer/
│── templates/
│── static/
│── manage.py
│── requirements.txt
│── README.md
```

---

## 📸 Screenshots

> Replace with your own image URLs.

### Home Page  
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20012331.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20012356.png

### AI Transformer  
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20012522.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20012534.png

### Add Poem Page  
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20012428.png

### Discription of project
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013357.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013409.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013425.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013438.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013454.png
https://github.com/Kavya4615/Repoetry/blob/maij/images/Screenshot%202025-11-28%20013506.png

---


## 🤝 Contributing
Pull requests are welcome. Please open an issue for major changes.
