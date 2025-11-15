from django.conf import settings
from django.db import models

# Use the configured User model from settings (default: auth.User)
User = settings.AUTH_USER_MODEL


# ---------------- PROFILE ----------------
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.user}'s Profile"


# ---------------- POEM ----------------
class Poem(models.Model):
    LANGUAGE_CHOICES = [
        ('te', 'Telugu'),
        ('en', 'English'),
        ('hi', 'Hindi'),
        # Add more if needed
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poems')
    title = models.CharField(max_length=200, blank=True)
    poet_name = models.CharField(max_length=200, help_text="Kavi (poet) name")
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    transformed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title or '(Untitled)'} by {self.poet_name}"


# ---------------- LIKE ----------------
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'poem')  # Prevent duplicate likes

    def __str__(self):
        return f"{self.user} likes {self.poem}"


# ---------------- COMMENT ----------------
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.poem}"
