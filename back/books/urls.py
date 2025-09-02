from django.urls import path
from . import views

app_name = 'books'

urlpatterns = [
  path('', views.book_list),
  path('upload/', views.upload_book),
  path('<int:book_id>/', views.book_detail),
  path('<int:book_id>/bookmark/', views.bookmark)
]
