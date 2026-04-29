from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
class Story(models.Model):
    LANGUAGE_CHOICES = (
        ('hindi', 'Hindi'),
        ('english', 'English'),
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    genre = models.CharField(max_length=50)
    author=models.ForeignKey(to=User,on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.title


# user (ForeignKey)
# story (ForeignKey)
# created_at

class Bookmark(models.Model):
    user=models.ForeignKey(to=User,on_delete=models.CASCADE)
    story=models.ForeignKey(to=Story,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ['user', 'story']
    def __str__(self):
        return f"{self.user.username}--{self.story.title}"
    

class Like(models.Model):
    user=models.ForeignKey(to=User,on_delete=models.CASCADE)
    story=models.ForeignKey(to=Story,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ['user', 'story']
    def __str__(self):
        return f"{self.user.username}--{self.story.title}"
