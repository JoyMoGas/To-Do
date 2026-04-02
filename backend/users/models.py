from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    THEME_CHOICES = (
        ('light', 'Claro'),
        ('dark', 'Oscuro'),
        ('cream', 'Crema'),
        ('pink', 'Rosita'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='light')

    def __str__(self):
        return f"Perfil de {self.user.username}"
