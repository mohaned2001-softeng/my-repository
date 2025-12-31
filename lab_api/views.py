from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken

from auth_api.models import Custom_user

from .models import Lab
from .serializers import LabSerializer


def _get_user_from_token(access_token: str):
    if not access_token:
        return None
    try:
        token = AccessToken(access_token)
    except (InvalidToken, TokenError):
        return None

    user_id = token.payload.get("user_id")
    if not user_id:
        return None

    try:
        return Custom_user.objects.get(id=user_id)
    except Custom_user.DoesNotExist:
        return None


# Create your views here.
class AddLabView(APIView):
    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header with Bearer token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = auth_header.split(' ')[1]
        
        user = _get_user_from_token(access_token)
        if not user:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'TEACHER':
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = LabSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditLabView(APIView):
    def put(self, request, lab_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header with Bearer token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = auth_header.split(' ')[1]

        user = _get_user_from_token(access_token)
        if not user:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'TEACHER':
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        lab = Lab.objects.get(id=lab_id)
        serializer = LabSerializer(lab, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteLabView(APIView):
    def delete(self, request, lab_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header with Bearer token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = auth_header.split(' ')[1]

        user = _get_user_from_token(access_token)
        if not user:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'TEACHER':
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        lab = Lab.objects.get(id=lab_id)
        lab.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListLabsView(APIView):
    def get(self, request):
        labs = Lab.objects.all()
        serializer = LabSerializer(labs, many=True)
        return Response(serializer.data)


class TeacherLabsView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header with Bearer token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = auth_header.split(' ')[1]

        user = _get_user_from_token(access_token)
        if not user:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'TEACHER':
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        labs = Lab.objects.filter(author__id=user.id).distinct()
        serializer = LabSerializer(labs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteAllLabsView(APIView):
    def delete(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Authorization header with Bearer token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = auth_header.split(' ')[1]

        user = _get_user_from_token(access_token)
        if not user:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'TEACHER':
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        labs = Lab.objects.filter(author__id=user.id)
        labs.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)