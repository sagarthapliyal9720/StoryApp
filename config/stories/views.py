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
from .models import Story,Bookmark,Like
from .serailizers import StorySerializer,RegisterSerializer,BookmarkSerializer,LikeSerializer
import os
from django.conf import settings
from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Story
from gtts import gTTS

@api_view(['GET'])
def listen_story(request, id):
    try:
        story = Story.objects.get(id=id)
    except Story.DoesNotExist:
        return Response({"error": "Story not found"}, status=404)

    # File path (media/audio/story_1.mp3)
    file_path = os.path.join(settings.MEDIA_ROOT, f"audio/story_{id}.mp3")

    # ✅ Ensure folder exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Decide language
    lang = "hi" if story.language == "hindi" else "en"

    # ✅ Generate audio only if not exists
    if not os.path.exists(file_path):
        tts = gTTS(text=story.content, lang=lang)
        tts.save(file_path)

    # ✅ Return audio file
    return FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')

class StoryView(GenericAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['language', 'genre']
    search_fields = ['title']

    def get(self, request):
        queryset = self.get_queryset()

        queryset = self.filter_queryset(queryset)

        serializer = self.get_serializer(
            queryset,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class StoryDetailview(APIView):
    def get(self, request, id):
        story = get_object_or_404(Story, id=id)

        serializer = StorySerializer(
            story,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)



class RegisterView(APIView):
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':"user created"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

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
            "user": {
                "email": user.email
            }
        })
    
class Bookmarkview(GenericAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]
    queryset = Story.objects.all()

    def post(self, request, id):
        story = get_object_or_404(Story, id=id)   
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():                  
            serializer.save(
                story=story,                       
                user=request.user                  
            )
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
            serializer.save(
                story=story,                       
                user=request.user                  
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):                    
        like = Like.objects.filter(user=request.user)
        serializer = LikeSerializer(like, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class Add_storyView(APIView):
     permission_classes=[IsAuthenticated]
     def post(self,request):
         serailizer=StorySerializer(data=request.data)
         if serailizer.is_valid():
             serailizer.save(author=request.user)
             return Response(serailizer.data,status=status.HTTP_201_CREATED)
         return Response(serailizer.errors,status=status.HTTP_400_BAD_REQUEST)
     def get(self,request):
         story=Story.objects.filter(author=request.user)

         serializer=StorySerializer(story,many=True)
         return Response(serializer.data,status=status.HTTP_200_OK)
     

class EditStoryview(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,id):
        story=get_object_or_404(Story,id=id,author=request.user)
        serailizer=StorySerializer(story,data=request.data,partial=True)
        if serailizer.is_valid():
            serailizer.save(author=request.user)
            return Response(serailizer.data,status=status.HTTP_200_OK)
        return Response(serailizer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,id):
        story=get_object_or_404(Story,id=id,author=request.user)
        story.delete()
        return Response({'message':"deleted"},status=status.HTTP_200_OK)
    

class TrendingStoryView(APIView):
    def get(self, request):
        stories = Story.objects.annotate(
            total_likes=Count("like")
        ).order_by("-total_likes")[:4]

        serializer = StorySerializer(
            stories,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

        
    
from collections import Counter





class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Step 1:
        # Get all liked stories of current user
        liked_stories = Like.objects.filter(
            user=user
        ).select_related("story")

        # Step 2:
        # Get all bookmarked stories of current user
        bookmarked_stories = Bookmark.objects.filter(
            user=user
        ).select_related("story")

        # Step 3:
        # Store all genres and languages here
        genres = []
        languages = []

        # Step 4:
        # Extract genre + language from liked stories
        for item in liked_stories:
            genres.append(item.story.genre)
            languages.append(item.story.language)

        # Step 5:
        # Extract genre + language from bookmarked stories
        for item in bookmarked_stories:
            genres.append(item.story.genre)
            languages.append(item.story.language)

        # Step 6:
        # If no likes/bookmarks yet
        if not genres or not languages:
            return Response(
                {
                    "message": "No recommendations yet. Please like or bookmark stories first."
                },
                status=200
            )

        # Step 7:
        # Find most common genre + language
        favorite_genre = Counter(genres).most_common(1)[0][0]
        favorite_language = Counter(languages).most_common(1)[0][0]

        # Step 8:
        # Get IDs of already liked stories
        liked_ids = Like.objects.filter(
            user=user
        ).values_list("story_id", flat=True)

        # Step 9:
        # Get IDs of already bookmarked stories
        bookmarked_ids = Bookmark.objects.filter(
            user=user
        ).values_list("story_id", flat=True)

        # Step 10:
        # Combine both IDs
        exclude_ids = list(liked_ids) + list(bookmarked_ids)

        # Step 11:
        # Fetch recommended stories
        recommendations = Story.objects.filter(
            genre=favorite_genre,
            language=favorite_language
        ).exclude(
            id__in=exclude_ids
        ).order_by("-created_at")[:10]

        # Step 12:
        # Serialize response
        serializer = StorySerializer(
            recommendations,
            many=True,
            context={"request": request}
        )

        # Step 13:
        # Return final response
        return Response(
            {
                "favorite_genre": favorite_genre,
                "favorite_language": favorite_language,
                "recommended_stories": serializer.data
            },
            status=200
        )