# accounts/models.py
from django.db import models
from django.contrib.auth.models import User

# Function to save files per user
def upload_to_user(instance, filename):
    # Saves the file under media/user_<id>/filename
    return f"user_{instance.user.id}/{filename}"

class Document(models.Model):
    STATUS_CHOICES = [
        ("Processing", "Processing"),
        ("Completed", "Completed"),
        ("Failed", "Failed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents"
    )
    file = models.FileField(upload_to=upload_to_user)  # use the function directly
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100, blank=True, null=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Processing")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # AI processing fields
    text_length = models.IntegerField(default=0)
    summary = models.TextField(blank=True, null=True)
    entities = models.JSONField(default=dict, blank=True)
    sentiment = models.CharField(max_length=50, blank=True, null=True)
    processing_time = models.FloatField(default=0)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    def __str__(self):
        return self.file_name