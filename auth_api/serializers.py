from rest_framework import serializers
from .models import Custom_user , OTP
from django.contrib.auth.hashers import check_password, is_password_usable
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q


class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = Custom_user
		fields = ['id', 'email', 'full_name', 'bio', 'role' , 'avatar_url', 'created_at']

# Serializer خاص لتعديل بيانات المستخدم
class EditUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = Custom_user
		fields = ['full_name', 'bio', 'avatar_url']  # فقط الحقول المسموح تعديلها

	def validate_full_name(self, value):
		if not value or not value.strip():
			raise serializers.ValidationError("الاسم لا يمكن أن يكون فارغًا.")
		return value

class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class RegisterSerializer(serializers.ModelSerializer):

	class Meta:
		model = Custom_user
		fields = ("username", "email" ,'password')

	def validate_username(self, value):
		if Custom_user.objects.filter(username__iexact=value).exists():
			raise serializers.ValidationError("Username already exists.")
		return value

	def validate_email(self, value):
		if Custom_user.objects.filter(email__iexact=value).exists():
			raise serializers.ValidationError("Email already exists.")
		return value
 
	def create(self, validated_data):
		password = validated_data.pop("password")
		# أي مستخدم يسجّل عبر هذا الـ API يكون طالب بشكل افتراضي
		user = Custom_user.objects.create(
			**validated_data,
			role="STUDENT",
		)
		user.set_password(password)
		user.save(update_fields=["password", "role"])
		return user


class LoginSerializer(serializers.Serializer):
	identifier = serializers.CharField()
	password = serializers.CharField(write_only=True)

	def validate(self, attrs):
		identifier = attrs.get("identifier")
		password = attrs.get("password")
		try:
			user = Custom_user.objects.get(
				Q(email__iexact=identifier) | Q(username__iexact=identifier)
			)
		except Custom_user.DoesNotExist:
			raise serializers.ValidationError("Invalid credentials.")

		if not user.is_verified:
			raise serializers.ValidationError("Account is not verified yet.")

		if not is_password_usable(user.password):
			raise serializers.ValidationError("No password set for this account.")

		if not check_password(password, user.password):
			raise serializers.ValidationError("Invalid credentials.")

		attrs["user"] = user
		return attrs


class SendOTPSerializer(serializers.Serializer):
	email = serializers.EmailField()

	def validate(self, attrs):
		email = attrs.get("email")
		try:
			user = Custom_user.objects.get(email__iexact=email)
		except Custom_user.DoesNotExist:
			raise serializers.ValidationError({"email": "User with this email does not exist."})

		if user.is_verified:
			raise serializers.ValidationError({"email": "Account already verified."})

		attrs["user"] = user
		return attrs


class ForgotPasswordOTPSerializer(serializers.Serializer):
	email = serializers.EmailField()


class VerifyOTPSerializer(serializers.Serializer):
	email = serializers.EmailField()
	otp = serializers.CharField(min_length=6, max_length=6)

	def validate(self, attrs):
		email = attrs.get("email")
		try:
			user = Custom_user.objects.get(email__iexact=email)
		except Custom_user.DoesNotExist:
			raise serializers.ValidationError({"email": "User with this email does not exist."})
		attrs["user"] = user
		return attrs


class SetPasswordSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField(write_only=True)
	confirm_password = serializers.CharField(write_only=True)

	def validate(self, attrs):
		email = attrs.get("email")
		password = attrs.get("password")
		confirm_password = attrs.get("confirm_password")

		if password != confirm_password:
			raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

		try:
			user = Custom_user.objects.get(email__iexact=email)
		except Custom_user.DoesNotExist:
			raise serializers.ValidationError({"email": "User with this email does not exist."})

		if not user.is_verified:
			raise serializers.ValidationError({"email": "Account is not verified."})

		try:
			validate_password(password)
		except DjangoValidationError as exc:
			raise serializers.ValidationError({"password": list(exc.messages)})

		attrs["user"] = user
		return attrs
