
from django.urls import path
from .views import StoryDetailview,StoryView,listen_story,LoginView,RegisterView,Bookmarkview,Likeview,Add_storyView,EditStoryview,TrendingStoryView,RecommendationView

urlpatterns = [
path('',StoryView.as_view(),name="story"),
path('story/<int:id>/',StoryDetailview.as_view()),
path('listen/<int:id>/', listen_story),
path('login/',LoginView.as_view(),name="login"),
path('register/',RegisterView.as_view(),name="register"),
path('bookmark/<int:id>/',Bookmarkview.as_view()),
path('bookmark/',Bookmarkview.as_view()),

path('like/<int:id>/',Likeview.as_view()),
path('like/',Likeview.as_view()),

path('upload/',Add_storyView.as_view()),
path('edit/<int:id>/',EditStoryview.as_view()),
path('trending/',TrendingStoryView.as_view()),
path('rec/',RecommendationView.as_view())
]
