from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.files.base import ContentFile
from .models import *
from .serializers import *
from .utils import txt_to_epub_bytes_smart
import os
import tempfile

# 파일 업로드
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_book(request):
  txt_file = request.FILES.get("file")
  if not txt_file:
    return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
  title = request.data.get("title", txt_file.name).split('.')[0]

  # txt 파일 → epub bytes 변환
  epub_bytes = txt_to_epub_bytes_smart(txt_file.read(), book_title=title)
  epub_name = f"{os.path.splitext(txt_file.name)[0]}.epub"

  # 모델에 저장
  book = Book(title=title, owner=request.user)
  book.file.save(epub_name, ContentFile(epub_bytes), save=True)

  serializer = BookSerializer(book)
  return Response(serializer.data, status=status.HTTP_201_CREATED)

# 파일 목록
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def book_list(request):
  books = Book.objects.filter(owner=request.user).order_by("-created_at")
  serializer = BookSerializer(books, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

# 파일 상세
@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def book_detail(request, book_id):
  book = get_object_or_404(Book, pk=book_id, owner=request.user)
  if request.method == "GET":
    serializer = BookSerializer(book)
    bookmark = Bookmark.objects.filter(book=book, user=request.user).first()
    data = serializer.data
    data["bookmark_cfi"] = bookmark.cfi if bookmark else None
    return Response(data, status=status.HTTP_200_OK)
  elif request.method == "DELETE":
    book.file.delete(save=False)
    book.delete()
    return Response({}, status=status.HTTP_204_NO_CONTENT)

# 북마크 조회 / 저장 / 삭제
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def bookmark(request, book_id):
  book = get_object_or_404(Book, pk=book_id, owner=request.user)
  if request.method == "GET":
    bookmark = Bookmark.objects.filter(book=book, user=request.user).first()
    return Response({"cfi": bookmark.cfi if bookmark else None}, status=status.HTTP_200_OK)
  elif request.method == "POST":
    cfi = request.data.get("cfi")
    bookmark, _ = Bookmark.objects.update_or_create(
      book=book,
      user=request.user,
      defaults={"cfi": cfi}
    )
    serializer = BookmarkSerializer(bookmark)
    return Response(serializer.data, status=status.HTTP_200_OK)