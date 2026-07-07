from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.translation import gettext as _
from .models import Poem, Like, Comment

from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List
import json
import requests
import os
import base64

from io import BytesIO
from gtts import gTTS

# ------------------------------------------------------
# PYDANTIC STRUCTURED OUTPUT SCHEMAS
# ------------------------------------------------------
class WordMeaning(BaseModel):
    word: str = Field(description="The Telugu word or short phrase from the transformed poem.")
    meaning: str = Field(description="The English translation or contextual meaning of the word.")

class PoemTransformation(BaseModel):
    transformed_poem: str = Field(description="The transformed poem written strictly in the requested Telugu poetic form (Dwipada, Kanda Padyam, Satakam, or Utpalamala).")
    english_translation: str = Field(description="Line-by-line translation of the transformed Telugu poem in English.")
    explanation: str = Field(description="Detailed explanation of the poem's theme, meter structure, and literary context in English.")
    word_meanings: List[WordMeaning] = Field(description="A vocabulary mapping of key or complex Telugu words from the poem to their English meanings.")

# ------------------------------------------------------
# HOME PAGE
# ------------------------------------------------------
@ensure_csrf_cookie
def home(request):
    # Renders the minimal home page shell which is loaded by home.js
    return render(request, 'repoetry/home.html')

# ------------------------------------------------------
# API: LIST POEMS
# ------------------------------------------------------
def api_poems(request):
    poems = (
        Poem.objects.all()
        .order_by('-id')
        .prefetch_related('likes', 'comments', 'author')
    )
    poems_data = []
    for poem in poems:
        poems_data.append({
            "id": poem.id,
            "title": poem.title or "(Untitled)",
            "poet_name": poem.poet_name or "Anonymous",
            "text": poem.text,
            "language": poem.language,
            "author": poem.author.username,
            "total_likes": poem.likes.count(),
            "is_liked": request.user.is_authenticated and poem.likes.filter(user=request.user).exists(),
            "comments": [
                {
                    "username": c.user.username,
                    "text": c.text,
                }
                for c in poem.comments.all().order_by('-id')
            ]
        })
    return JsonResponse({"poems": poems_data})

# ------------------------------------------------------
# SIGNUP
# ------------------------------------------------------
@ensure_csrf_cookie
def signup(request):
    if request.method == 'POST':
        username = ""
        pw1 = ""
        pw2 = ""
        try:
            payload = json.loads(request.body)
            username = payload.get('username', '').strip()
            pw1 = payload.get('password1', '')
            pw2 = payload.get('password2', '')
        except Exception:
            pass

        if not username:
            username = request.POST.get('username', '').strip()
            pw1 = request.POST.get('password1', '')
            pw2 = request.POST.get('password2', '')

        if not username or not pw1:
            return JsonResponse({'success': False, 'error': _("Missing fields.")}, status=400)

        if pw1 != pw2:
            return JsonResponse({'success': False, 'error': _("Passwords do not match.")}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'error': _("Username already exists.")}, status=400)

        User.objects.create_user(username=username, password=pw1)
        return JsonResponse({'success': True, 'message': _("Account created successfully! Please login.")})

    return render(request, 'repoetry/signup.html')

# ------------------------------------------------------
# LOGIN
# ------------------------------------------------------
@ensure_csrf_cookie
def login_view(request):
    if request.method == 'POST':
        username = ""
        pw = ""
        try:
            payload = json.loads(request.body)
            username = payload.get('username', '').strip()
            pw = payload.get('password', '')
        except Exception:
            pass

        if not username:
            username = request.POST.get('username', '').strip()
            pw = request.POST.get('password', '')

        user = authenticate(request, username=username, password=pw)
        if user:
            login(request, user)
            return JsonResponse({'success': True, 'username': user.username})

        return JsonResponse({'success': False, 'error': _("Invalid username or password.")}, status=400)

    return render(request, 'repoetry/login.html')

# ------------------------------------------------------
# LOGOUT
# ------------------------------------------------------
def logout_view(request):
    logout(request)
    return redirect('home')

# ------------------------------------------------------
# LIKE
# ------------------------------------------------------
@login_required(login_url='login')
def like_poem(request, poem_id):
    poem = get_object_or_404(Poem, id=poem_id)
    like, created = Like.objects.get_or_create(poem=poem, user=request.user)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    return JsonResponse({'liked': liked, 'likes': poem.likes.count()})

# ------------------------------------------------------
# COMMENT
# ------------------------------------------------------
@login_required(login_url='login')
def add_comment(request, poem_id):
    poem = get_object_or_404(Poem, id=poem_id)

    if request.method == 'POST':
        text = ""
        try:
            payload = json.loads(request.body)
            text = payload.get('comment', '').strip()
        except Exception:
            pass

        if not text:
            text = request.POST.get('comment', '').strip()

        if text:
            comment = Comment.objects.create(user=request.user, poem=poem, text=text)
            return JsonResponse({
                'success': True,
                'comment': {
                    'username': request.user.username,
                    'text': comment.text
                }
            })
    return JsonResponse({'success': False, 'error': 'Invalid comment text'}, status=400)

# ------------------------------------------------------
# TRANSFORM PAGE
# ------------------------------------------------------
@login_required(login_url='login')
@ensure_csrf_cookie
def transform_page(request):
    return render(request, 'repoetry/transformer.html')

# ------------------------------------------------------
# TRANSFORM POEM (STRUCTURED AI OUTPUT)
# ------------------------------------------------------
@login_required(login_url='login')
def transform_poem(request):
    if request.method == "POST":
        poem_text = ""
        form_type = ""
        try:
            payload = json.loads(request.body)
            poem_text = payload.get("poem", "").strip()
            form_type = payload.get("form", "").strip()
        except Exception:
            pass

        if not poem_text:
            poem_text = request.POST.get("poem", "").strip()
            form_type = request.POST.get("form", "").strip()

        if not poem_text:
            return JsonResponse({"success": False, "error": _("Please enter a poem.")}, status=400)

        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            return JsonResponse({"success": False, "error": "Google API key is not configured in the server environment. Please set GOOGLE_API_KEY or GEMINI_API_KEY environment variable."}, status=500)

        client = genai.Client(api_key=api_key)

        prompt = f"""
        Convert the following Telugu poem into {form_type}.
        Maintain meaning, rhyme, meter, and classical structure.
        Keep the text simple. Do not provide bold letters or markdown in the JSON values.
        
        Original Poem:
        {poem_text}
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PoemTransformation,
                    system_instruction=(
                        "You are an expert Telugu scholar, classical poet, and translator specializing in traditional poetic meters. "
                        "Transform the input Telugu poem into the requested form while strictly respecting Telugu grammar, meter, and classical structure. "
                        "Generate accurate translations and explanations. Return JSON matching the schema."
                    ),
                    temperature=0.75,
                ),
            )
            data = json.loads(response.text)
        except Exception as e:
            return JsonResponse({"success": False, "error": f"AI Error: {str(e)}"}, status=500)

        # 🔊 TEXT → SPEECH (Moved to asynchronous load on click to improve response times)
        transformed_poem = data.get("transformed_poem", "")
        return JsonResponse({
            "success": True,
            "transformed_poem": transformed_poem,
            "english_translation": data.get("english_translation", ""),
            "explanation": data.get("explanation", ""),
            "word_meanings": data.get("word_meanings", []),
            "audio_b64": None
        })

    return redirect("transform_page")

# ------------------------------------------------------
# API: TEXT TO SPEECH (ASYNC GENERATION)
# ------------------------------------------------------
@login_required(login_url='login')
def api_tts(request):
    if request.method == "POST":
        text = ""
        try:
            payload = json.loads(request.body)
            text = payload.get("text", "").strip()
        except Exception:
            pass

        if not text:
            text = request.POST.get("text", "").strip()

        if not text:
            return JsonResponse({"success": False, "error": "No text provided for TTS."}, status=400)

        try:
            tts = gTTS(text=text, lang="te")
            buf = BytesIO()
            tts.write_to_fp(buf)
            audio_bytes = buf.getvalue()
            audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
            return JsonResponse({"success": True, "audio_b64": audio_b64})
        except Exception as e:
            return JsonResponse({"success": False, "error": f"TTS synthesis failed: {str(e)}"}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed."}, status=405)

# ------------------------------------------------------
# ADD POEM
# ------------------------------------------------------
@login_required(login_url='login')
@ensure_csrf_cookie
def add_poem(request):
    if request.method == "POST":
        title = ""
        text = ""
        language = "te"
        try:
            payload = json.loads(request.body)
            title = payload.get("title", "").strip()
            text = payload.get("text", "").strip()
            language = payload.get("language", "te")
        except Exception:
            pass

        if not text:
            title = request.POST.get("title", "").strip()
            text = request.POST.get("text", "").strip()
            language = request.POST.get("language", "te")

        if not text:
            return JsonResponse({"success": False, "error": "Poem text cannot be empty."}, status=400)

        Poem.objects.create(
            author=request.user,
            title=title,
            poet_name=request.user.username,
            language=language,
            text=text
        )
        return JsonResponse({"success": True})

    return render(request, "repoetry/add_poem.html")
