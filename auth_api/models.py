from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta 
from django.utils import timezone
from lab_api.models import Lab
from django.contrib.auth.models import Group, Permission
# Create your models here.



class Custom_user(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups"
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions"
    )
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('TEACHER', 'Teacher'),
    )

    full_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar_url = models.URLField(blank=True, null=True)
    role = models.CharField(max_length=50,choices=ROLE_CHOICES, default='STUDENT')
    is_verified = models.BooleanField(default=False)
 
class OTP(models.Model):
    user = models.ForeignKey(Custom_user, on_delete=models.CASCADE, related_name="otps")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

