from django.db import models
from django.conf import settings

class Book(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='books/', default='')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_file')
    created_at = models.DateTimeField(auto_now_add=True)

class Bookmark(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cfi = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
