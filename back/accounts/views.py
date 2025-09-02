from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

@api_view(["POST"])
def register(request):
  serializer = RegisterSerializer(data=request.data)
  if serializer.is_valid(raise_exception=True):
    user = serializer.save()
    return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
  else:
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)