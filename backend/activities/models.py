from django.db import models
from django.conf import settings


class Activity(models.Model):
    title = models.CharField("Nombre de la actividad", max_length=255)
    completed = models.BooleanField("¿Actividad hecha?", default=False)

    class Meta:
        verbose_name = "Actividad"
        verbose_name_plural = "Actividades"

    def __str__(self):
        return self.title
