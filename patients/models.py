import uuid

from django.conf import settings
from django.db import models


class Patient(models.Model):
    class Gender(models.TextChoices):
        MALE = "Male", "Male"
        FEMALE = "Female", "Female"
        OTHER = "Other", "Other"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        ADMITTED = "Admitted", "Admitted"
        UNDER_REVIEW = "Under Review", "Under Review"
        DISCHARGED = "Discharged", "Discharged"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    phone = models.CharField(max_length=32)
    email = models.EmailField(blank=True)
    blood_group = models.CharField(max_length=3, choices=[
        ("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"),
        ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-"),
    ])
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="patients")

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.pk})"
