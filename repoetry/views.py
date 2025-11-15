from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils.translation import gettext as _
from .models import Poem, Like, Comment

from google import genai
import requests
import os
import base64


# ------------------------------------------------------
# HOME PAGE
# ------------------------------------------------------
def home(request):
    poems = (
        Poem.objects.all()
        .order_by('-id')
        .prefetch_related('likes', 'comments', 'author')
    )

    for poem in poems:
        poem.total_likes = poem.likes.count()
        poem.comments_list = poem.comments.all().order_by('-id')
        poem.is_liked = (
            request.user.is_authenticated
            and poem.likes.filter(user=request.user).exists()
        )

    return render(request, 'repoetry/home.html', {'poems': poems})


# ------------------------------------------------------
# SIGNUP
# ------------------------------------------------------
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        pw1 = request.POST['password1']
        pw2 = request.POST['password2']

        if pw1 != pw2:
            messages.error(request, _("Passwords do not match."))
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, _("Username already exists."))
            return redirect('signup')

        User.objects.create_user(username=username, password=pw1)
        messages.success(request, _("Account created successfully! Please login."))
        return redirect('login')

    return render(request, 'repoetry/signup.html')


# ------------------------------------------------------
# LOGIN
# ------------------------------------------------------
def login_view(request):
    list(messages.get_messages(request))

    if request.method == 'POST':
        username = request.POST.get('username')
        pw = request.POST.get('password')

        user = authenticate(request, username=username, password=pw)

        if user:
            login(request, user)
            messages.success(request, _("Welcome back, %(username)s!") % {'username': user.username})
            return redirect('home')

        messages.error(request, _("Invalid username or password."))
        return redirect('login')

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
        text = request.POST.get('comment', '').strip()

        if text:
            Comment.objects.create(user=request.user, poem=poem, text=text)
            messages.success(request, _("Comment added successfully!"))

    return redirect('home')


# ------------------------------------------------------
# TRANSFORM PAGE
# ------------------------------------------------------
@login_required(login_url='login')
def transform_page(request):
    return render(request, 'repoetry/transformer.html')


# ------------------------------------------------------
# ELEVENLABS TTS FUNCTION
# ------------------------------------------------------
def generate_telugu_voice(text):
    ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
    print("🔑 ELEVEN_API_KEY:", ELEVEN_API_KEY)
    if not ELEVEN_API_KEY:
        print("⚠️ ELEVENLABS ERROR: No API key found.")
        return None

    VOICE_ID = "pNInz6obpgDQGcFmaJgB"

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "Accept": "audio/mpeg",
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "text": text,
        "voice_settings": {
            "stability": 0.50,
            "similarity_boost": 0.65
        }
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        print("🔍 Eleven Response Code:", response.status_code)

        if response.status_code != 200:
            print("🔴 ELEVENLABS ERROR:", response.text)
            return None

        return response.content

    except Exception as e:
        print("🚨 ELEVENLABS EXCEPTION:", e)
        return None


# ------------------------------------------------------
# TRANSFORM POEM
# ------------------------------------------------------
@login_required(login_url='login')
def transform_poem(request):
    if request.method == "POST":
        poem_text = request.POST.get("poem", "").strip()
        form_type = request.POST.get("form", "").strip()

        if not poem_text:
            messages.error(request, _("Please enter a poem."))
            return redirect("transform_page")

        client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

        prompt = f"""
        Convert the following Telugu poem into {form_type}.
        Maintain meaning, rhyme, meter, and classical structure.
        Keep the text simple. Do not bold anything.
        Also give the explanation of the poem in English.

        Original Poem:
        {poem_text}
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            output = response.text

        except Exception as e:
            output = f"⚠️ Error: {str(e)}"

        audio_bytes = generate_telugu_voice(output)
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8") if audio_bytes else None
        print("audio_b64 length:", len(audio_b64) if audio_b64 else "None")

        return render(
            request,
            "repoetry/transformer.html",
            {
                "original": poem_text,
                "result": output,
                "form_type": form_type,
                "audio_b64": audio_b64,
            }
        )

    return redirect("transform_page")


# ------------------------------------------------------
# ADD POEM (NEW FEATURE)
# ------------------------------------------------------
@login_required(login_url='login')
def add_poem(request):
    if request.method == "POST":
        title = request.POST.get("title", "").strip()
        text = request.POST.get("text", "").strip()
        language = request.POST.get("language", "te")

        if not text:
            messages.error(request, "Poem text cannot be empty.")
            return redirect("add_poem")

        Poem.objects.create(
            author=request.user,
            title=title,
            poet_name=request.user.username,
            language=language,
            text=text
        )

        messages.success(request, "Your poem has been posted successfully!")
        return redirect("home")

    return render(request, "repoetry/add_poem.html")
