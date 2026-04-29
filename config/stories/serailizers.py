from rest_framework import serializers
from .models import Story,Bookmark,Like
from django.contrib.auth.models import User

class StorySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = "__all__"
        read_only_fields = ['created_at', 'author']

    def get_like_count(self, obj):
        return Like.objects.filter(story=obj).count()

    def get_is_liked(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                story=obj
            ).exists()

        return False


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']

        user = User.objects.create_user(
            username=email,   
            email=email,
            password=password,
            
        )

        return user
    

class BookmarkSerializer(serializers.ModelSerializer):
    story = StorySerializer(read_only=True) 
    class Meta:
        model=Bookmark
        fields="__all__"
        read_only_fields=['created_at','user','story']
    

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Like
        fields="__all__"
        read_only_fields=['created_at','user','story']
        