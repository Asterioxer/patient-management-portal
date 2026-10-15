# Initial patient-management schema.
import uuid

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="Patient",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=150)),
                ("age", models.PositiveSmallIntegerField()),
                ("gender", models.CharField(choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")], max_length=10)),
                ("phone", models.CharField(max_length=32)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("blood_group", models.CharField(choices=[("A+", "A+"), ("A-", "A-"), ("B+", "B-"), ("B-", "B-"), ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-")], max_length=3)),
                ("status", models.CharField(choices=[("Pending", "Pending"), ("Admitted", "Admitted"), ("Under Review", "Under Review"), ("Discharged", "Discharged")], default="Pending", max_length=20)),
                ("address", models.TextField(blank=True)),
                ("emergency_contact", models.CharField(blank=True, max_length=160)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="patients", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-created_at",)},
        ),
        migrations.AddIndex(model_name="patient", index=models.Index(fields=["name"], name="patients_pa_name_72a0bd_idx")),
        migrations.AddIndex(model_name="patient", index=models.Index(fields=["status"], name="patients_pa_status_65e77d_idx")),
        migrations.AddIndex(model_name="patient", index=models.Index(fields=["created_at"], name="patients_pa_created_94f8c2_idx")),
    ]
