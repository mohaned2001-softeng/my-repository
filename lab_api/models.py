from django.db import models
from uuid import uuid4
# Create your models here.
# FIELDS FOR LAB : id , title , description , category , difficulty , skills , author , created_at , updated_at , content , tags, estimatedTime
class Lab(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    author = models.ForeignKey('auth_api.Custom_user', on_delete=models.CASCADE, related_name='labs', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='images/%Y/%m/%d/', blank=True, null=True)
    difficulty = models.CharField(max_length=50)
    writeup_url = models.URLField(max_length=500, blank=True, null=True)
    skills = models.JSONField()  # يمكن استخدام JSONField إذا كانت المهارات معقدة
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    estimated_time = models.IntegerField(help_text="Estimated time to complete the lab in minutes")

    def __str__(self):
        return self.title