from rest_framework import serializers
from .models import Poem, Comment

class PoemSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Poem
        fields = ['id','title','poet_name','language','text','author_name','created_at','transformed']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id','user_name','text','created_at']
