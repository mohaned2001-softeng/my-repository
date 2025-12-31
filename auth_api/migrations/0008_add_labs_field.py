"""
Generated manually to add `labs` ForeignKey to Custom_user.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0007_alter_custom_user_role'),
        ('lab_api', '0002_remove_lab_tags_lab_image_lab_writeup_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='custom_user',
            name='labs',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.CASCADE, to='lab_api.lab'),
        ),
    ]
