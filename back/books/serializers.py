from rest_framework import serializers
from .models import *

class BookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ['id', 'title', 'file', 'created_at']

class BookmarkSerializer(serializers.ModelSerializer):
  class Meta:
    model = Bookmark
    fields = ['id', 'book', 'user', 'cfi', 'updated_at']