from django.db import models
from django.contrib.auth.models import User


class Activity(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Actividad"
        verbose_name_plural = "Actividades"

    def __str__(self):
        return self.title
