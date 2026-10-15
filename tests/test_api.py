from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()


class PatientApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_endpoint_is_public(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "ok")

    def test_registration_bootstraps_first_admin(self):
        response = self.client.post("/api/auth/register/", {
            "fullName": "Portal Admin",
            "email": "admin@example.com",
            "username": "admin",
            "password": "Better-Unique-Password-458!",
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.get(username="admin").check_password("Better-Unique-Password-458!"))

    def test_registration_closes_after_first_user(self):
        User.objects.create_user(username="admin", email="admin@example.com", password="Better-Unique-Password-458!", is_staff=True)
        response = self.client.post("/api/auth/register/", {
            "fullName": "Second Admin", "email": "second@example.com",
            "username": "second", "password": "Another-Unique-Password-789!",
        }, format="json")
        self.assertEqual(response.status_code, 403)

    def test_patient_api_requires_authentication(self):
        response = self.client.get("/api/patients/")
        self.assertEqual(response.status_code, 401)

    def test_patient_crud_and_search(self):
        user = User.objects.create_user(username="admin", password="Better-Unique-Password-458!", is_staff=True)
        self.client.force_authenticate(user)
        payload = {
            "fullName": "Demo Patient", "age": 32, "gender": "Other",
            "phone": "+91 98765 43210", "email": "patient@example.com",
            "bloodGroup": "O+", "status": "Admitted", "address": "Demo address",
            "emergencyContact": "Emergency Contact - +91 90000 00000",
        }
        created = self.client.post("/api/patients/", payload, format="json")
        self.assertEqual(created.status_code, 201, created.data)
        patient_id = created.data["id"]
        found = self.client.get("/api/patients/", {"search": "Demo"})
        self.assertEqual(found.status_code, 200)
        self.assertEqual(found.data["count"], 1)
        self.assertEqual(found.data["results"][0]["id"], patient_id)
        updated = self.client.patch(f"/api/patients/{patient_id}/", {"status": "Discharged"}, format="json")
        self.assertEqual(updated.status_code, 200)
        deleted = self.client.delete(f"/api/patients/{patient_id}/")
        self.assertEqual(deleted.status_code, 204)
