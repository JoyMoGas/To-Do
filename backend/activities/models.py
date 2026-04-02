from django.db import models
from django.contrib.auth.models import User

class TaskList(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_lists")
    shared_with = models.ManyToManyField(User, related_name="shared_lists", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Lista de Tareas"
        verbose_name_plural = "Listas de Tareas"

    def __str__(self):
        return self.name

class TaskSection(models.Model):
    name = models.CharField(max_length=255)
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name="sections")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Sección"
        verbose_name_plural = "Secciones"

    def __str__(self):
        return self.name

class Activity(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
    section = models.ForeignKey(TaskSection, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Actividad"
        verbose_name_plural = "Actividades"

    def __str__(self):
        return self.title
