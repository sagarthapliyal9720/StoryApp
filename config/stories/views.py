from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Story, Bookmark, Like
from .serailizers import StorySerializer, RegisterSerializer, BookmarkSerializer, LikeSerializer
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from gtts import gTTS
import cloudinary.uploader
import tempfile
from dotenv import load_dotenv
from collections import Counter
load_dotenv()


@api_view(["GET"])
def listen_story(request, id):
    story = get_object_or_404(Story, id=id)

    if not story.audio_url:
        return Response({"error": "Audio not available"}, status=404)

    return Response({"audio_url": story.audio_url})


class StoryView(GenericAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['language', 'genre']
    search_fields = ['title']

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class StoryDetailview(APIView):
    def get(self, request, id):
        story = get_object_or_404(Story, id=id)
        serializer = StorySerializer(story, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "user created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "user": {"email": user.email}
        })


class Bookmarkview(GenericAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]
    queryset = Story.objects.all()

    def post(self, request, id):
        story = get_object_or_404(Story, id=id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(story=story, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Likeview(GenericAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    queryset = Story.objects.all()

    def post(self, request, id):
        story = get_object_or_404(Story, id=id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(story=story, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        like = Like.objects.filter(user=request.user)
        serializer = LikeSerializer(like, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Add_storyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stories = Story.objects.filter(author=request.user)
        serializer = StorySerializer(stories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StorySerializer(data=request.data)

        if serializer.is_valid():
            story = serializer.save(author=request.user)

            try:
                # Select language
                lang = "hi" if story.language == "hindi" else "en"

                # Generate audio with gTTS
                tts = gTTS(text=story.content, lang=lang)

                # Save to temp file
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
                    tts.save(temp_audio.name)
                    temp_audio_path = temp_audio.name

                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    temp_audio_path,
                    resource_type="video"  # required for audio
                )

                # Clean up temp file
                os.remove(temp_audio_path)

                # Save Cloudinary URL to story
                story.audio_url = upload_result.get("secure_url")
                story.save()

            except Exception as e:
                print("Audio generation failed:", str(e))

            return Response(
                {
                    "message": "Story created successfully",
                    "audio_url": story.audio_url
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditStoryview(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        story = get_object_or_404(Story, id=id, author=request.user)
        serializer = StorySerializer(story, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        story = get_object_or_404(Story, id=id, author=request.user)
        story.delete()
        return Response({'message': "deleted"}, status=status.HTTP_200_OK)


class TrendingStoryView(APIView):
    def get(self, request):
        stories = Story.objects.annotate(
            total_likes=Count("like")
        ).order_by("-total_likes")[:4]

        serializer = StorySerializer(stories, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        liked_stories = Like.objects.filter(user=user).select_related("story")
        bookmarked_stories = Bookmark.objects.filter(user=user).select_related("story")

        genres = []
        languages = []

        for item in liked_stories:
            genres.append(item.story.genre)
            languages.append(item.story.language)

        for item in bookmarked_stories:
            genres.append(item.story.genre)
            languages.append(item.story.language)

        if not genres or not languages:
            return Response(
                {"message": "No recommendations yet. Please like or bookmark stories first."},
                status=200
            )

        favorite_genre = Counter(genres).most_common(1)[0][0]
        favorite_language = Counter(languages).most_common(1)[0][0]

        liked_ids = Like.objects.filter(user=user).values_list("story_id", flat=True)
        bookmarked_ids = Bookmark.objects.filter(user=user).values_list("story_id", flat=True)
        exclude_ids = list(liked_ids) + list(bookmarked_ids)

        recommendations = Story.objects.filter(
            genre=favorite_genre,
            language=favorite_language
        ).exclude(id__in=exclude_ids).order_by("-created_at")[:10]

        serializer = StorySerializer(recommendations, many=True, context={"request": request})

        return Response(
            {
                "favorite_genre": favorite_genre,
                "favorite_language": favorite_language,
                "recommended_stories": serializer.data
            },
            status=200
        )