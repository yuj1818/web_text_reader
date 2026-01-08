from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

@api_view(["POST"])
def register(request):
  serializer = RegisterSerializer(data=request.data)
  if serializer.is_valid(raise_exception=True):
    user = serializer.save()
    return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
  else:
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
  refresh_token = request.data.get('refreshToken')

  if not refresh_token:
    return Response(
      {"detail": "refreshToken이 필요합니다."}, 
      status=status.HTTP_400_BAD_REQUEST
    )
  
  try:
    token = RefreshToken(refresh_token)
    token.blacklist()
    return Response(status=status.HTTP_204_NO_CONTENT)
  except Exception:
    return Response(
      {"detail": "유효하지 않은 토큰입니다."},
      status=status.HTTP_400_BAD_REQUEST
    )