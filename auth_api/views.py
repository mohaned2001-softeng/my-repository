import random
from django.shortcuts import render
from smtplib import SMTPException

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .models import Custom_user, OTP
from .serializers import (
	CustomUserSerializer,
	ForgotPasswordOTPSerializer,
	LoginSerializer,
	RegisterSerializer,
	SendOTPSerializer,
	SetPasswordSerializer,
	VerifyOTPSerializer,
)
# Create your views here.
def _generate_jwt_tokens(user):
	refresh = RefreshToken.for_user(user)
	return {
		"refresh_token": str(refresh),
		"access_token": str(refresh.access_token),
	}


# Endpoint to refresh access_token using refresh_token
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

class TokenRefreshView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []  # لا نحتاج JWT هنا

	def post(self, request):
		refresh_token = request.data.get("refresh_token")
		if not refresh_token:
			return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
		try:
			refresh = RefreshToken(refresh_token)
			access_token = str(refresh.access_token)
			return Response({"access_token": access_token}, status=status.HTTP_200_OK)
		except TokenError as e:
			return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []  # تسجيل بدون توكن

	def post(self, request):
		# نتوقع أن البيانات تحتوي على username و email و password
		serializer = RegisterSerializer(data={
			'username': request.data.get('fullName'),
			'email': request.data.get('email'),
			'password': request.data.get('password'),
		})
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(
			{
				"message": "Account created successfully.",
				"user": CustomUserSerializer(user).data,
			},
			status=status.HTTP_201_CREATED,
		)


class LoginView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []  # تسجيل دخول بدون توكن
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		if not serializer.is_valid():
			return Response({"detail": "Invalid identifier or password."}, status=status.HTTP_400_BAD_REQUEST)
		user = serializer.validated_data["user"]
		if not getattr(user, "is_verified", False):
			return Response({"detail": "Email is not verified."}, status=status.HTTP_400_BAD_REQUEST)
		tokens = _generate_jwt_tokens(user)
		return Response(
			{
				"message": "Logged in successfully.",
				"user": CustomUserSerializer(user).data,
				**tokens,
			},
			status=status.HTTP_200_OK,
		)


class LogoutView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		refresh_token = request.data.get("refresh_token")
		if not refresh_token:
			return Response(
				{"detail": "Refresh token is required."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		try:
			token = RefreshToken(refresh_token)
		except TokenError:
			return Response(
				{"detail": "Invalid refresh token."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		if token["user_id"] != request.user.pk:
			return Response(
				{"detail": "Token does not belong to the authenticated user."},
				status=status.HTTP_403_FORBIDDEN,
			)
		try:
			token.blacklist()
		except AttributeError:
			return Response(
				{"detail": "Token blacklisting not enabled."},
				status=status.HTTP_501_NOT_IMPLEMENTED,
			)
		return Response(
			{"message": "Logged out successfully."},
			status=status.HTTP_200_OK,
		)


class SendOTPView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []

	def post(self, request):
		serializer = SendOTPSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		email = serializer.validated_data["email"]
		user = Custom_user.objects.get(email=email)
		OTP.objects.filter(user=user).delete()
		otp_code = f"{random.randint(0, 999999):06d}"
		OTP.objects.create(user=user, code=otp_code)
		try:
			send_mail(
				"Verification Code",
				f"Your verification code is {otp_code}. It expires in 5 minutes.",
				settings.DEFAULT_FROM_EMAIL,
				[user.email],
				fail_silently=False,
			)
		except SMTPException as e:
			# Return the exception message to help debugging SMTP errors locally.
			return Response(
				{"detail": f"Unable to send OTP email at this time. {str(e)}"},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		return Response(
			{"message": "OTP sent successfully."},
			status=status.HTTP_200_OK,
		)

																								
class ForgotPasswordSendOTPView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []

	def post(self, request):
		serializer = ForgotPasswordOTPSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		email = serializer.validated_data["email"]
		try:
			user = Custom_user.objects.get(email__iexact=email)
		except Custom_user.DoesNotExist:
			return Response(
				{"detail": "User not found in the system."},
				status=status.HTTP_404_NOT_FOUND,
			)
		OTP.objects.filter(user=user).delete()
		otp_code = f"{random.randint(0, 999999):06d}"
		OTP.objects.create(user=user, code=otp_code)
		try:
			send_mail(
				"Password Reset Code",
				f"Use this code to reset your password: {otp_code}. It expires in 5 minutes.",
				settings.DEFAULT_FROM_EMAIL,
				[user.email],
				fail_silently=False,
			)
		except SMTPException as e:
			# Return the exception message to help debugging SMTP errors locally.
			return Response(
				{"detail": f"Unable to send OTP email at this time. {str(e)}"},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		return Response(
			{"message": "Password reset OTP sent successfully."},
			status=status.HTTP_200_OK,
		)


class VerifyOTPView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []

	def post(self, request):
		serializer = VerifyOTPSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data["user"]
		otp_code = serializer.validated_data["otp"]
		try:
			otp_entry = OTP.objects.filter(user=user).latest("created_at")
		except OTP.DoesNotExist:
			return Response(
				{"detail": "OTP was not requested."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		if otp_entry.is_expired() or otp_entry.code != otp_code:
			return Response(
				{"detail": "Invalid or expired OTP provided."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		user.is_verified = True
		user.save(update_fields=["is_verified"])
		otp_entry.delete()
		tokens = _generate_jwt_tokens(user)
		return Response(
			{
				"message": "Account verified successfully.",
				"user": CustomUserSerializer(user).data,
				**tokens,
			},
			status=status.HTTP_200_OK,
		)


class SetPasswordView(APIView):
	permission_classes = [AllowAny]
	authentication_classes = []

	def post(self, request):
		serializer = SetPasswordSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data["user"]
		new_password = serializer.validated_data["password"]
		user.password = make_password(new_password)
		user.save(update_fields=["password"])
		tokens = _generate_jwt_tokens(user)
		return Response(
			{
				"message": "Password set successfully.",
				"user": CustomUserSerializer(user).data,
				**tokens,
			},
			status=status.HTTP_200_OK,
		)
class GetUserView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		return Response(
			{
				"user": CustomUserSerializer(user).data,
			},
			status=status.HTTP_200_OK,
		)
from .serializers import EditUserSerializer

class EditUserView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		serializer = EditUserSerializer(user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(
			{
				"message": "User updated successfully.",
				"user": serializer.data,
			},
			status=status.HTTP_200_OK,
		)
  
class AddOTPWithAdminView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		user_id = request.data.get("user_id")
		try:
			user = Custom_user.objects.get(id=user_id)
		except Custom_user.DoesNotExist:
			return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
		OTP.objects.filter(user=user).delete()
		otp_code = f"{random.randint(0, 999999):06d}"
		OTP.objects.create(user=user, code=otp_code)
		return Response(
			{"message": f"OTP {otp_code} created successfully for user {user.username}."},
			status=status.HTTP_201_CREATED,
		)