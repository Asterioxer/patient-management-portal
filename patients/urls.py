from django.urls import path
from .views import BootstrapStatusView, CurrentUserView, LoginView, LogoutView, PatientDetailView, PatientListCreateView, RegisterView

urlpatterns = [
    path("auth/bootstrap/", BootstrapStatusView.as_view(), name="auth-bootstrap"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
    path("patients/", PatientListCreateView.as_view(), name="patient-list-create"),
    path("patients/<uuid:patient_id>/", PatientDetailView.as_view(), name="patient-detail"),
]
