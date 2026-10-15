from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "age", "gender", "status", "created_at")
    list_filter = ("status", "gender", "blood_group")
    search_fields = ("name", "phone", "email", "id")
    readonly_fields = ("id", "created_at", "updated_at")
