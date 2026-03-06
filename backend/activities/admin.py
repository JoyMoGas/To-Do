from django.contrib import admin
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "completed")
    list_filter = ("completed", "user")
    search_fields = ("title", "user__username")
