from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import Patient
from .serializers import LoginSerializer, PatientSerializer, RegistrationSerializer

User = get_user_model()


class BootstrapStatusView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"registration_open": not User.objects.exists()})


class RegisterView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if User.objects.exists():
            return Response({"detail": "Administrator registration is closed."}, status=status.HTTP_403_FORBIDDEN)
        user = serializer.save()
        return Response({
            "id": user.pk, "username": user.username, "email": user.email,
            "fullName": user.first_name, "detail": "Administrator account created.",
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key, "user": {
                "id": user.pk, "username": user.username,
                "email": user.email, "fullName": user.first_name,
            },
        })


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserView(generics.GenericAPIView):
    def get(self, request):
        user = request.user
        return Response({"id": user.pk, "username": user.username, "email": user.email, "fullName": user.first_name})


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        queryset = Patient.objects.all()
        query = self.request.query_params.get("search", "").strip()
        if query:
            filters = Q(name__icontains=query) | Q(phone__icontains=query) | Q(email__icontains=query) | Q(status__icontains=query)
            try:
                import uuid
                filters |= Q(id=uuid.UUID(query))
            except (ValueError, AttributeError):
                pass
            queryset = queryset.filter(filters)
        status_filter = self.request.query_params.get("status", "").strip()
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = "id"
    lookup_url_kwarg = "patient_id"
