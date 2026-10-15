from django.contrib.auth import authenticate, get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Patient

User = get_user_model()


class RegistrationSerializer(serializers.Serializer):
    fullName = serializers.CharField(source="full_name", max_length=150)
    email = serializers.EmailField()
    username = serializers.RegexField(r"^[\w.@+-]+$", max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False, min_length=10)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def create(self, validated_data):
        if User.objects.exists():
            raise serializers.ValidationError({"detail": "Administrator registration is closed."})
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["full_name"],
            is_staff=True,
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs["username"].strip()
        user = authenticate(username=username, password=attrs["password"])
        if user is None:
            candidate = User.objects.filter(email__iexact=username).first()
            if candidate:
                user = authenticate(username=candidate.username, password=attrs["password"])
        if user is None or not user.is_active or not user.is_staff:
            raise serializers.ValidationError({"detail": "Invalid username/email or password."})
        attrs["user"] = user
        return attrs


class PatientSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    fullName = serializers.CharField(source="name", max_length=150)
    bloodGroup = serializers.ChoiceField(source="blood_group", choices=Patient._meta.get_field("blood_group").choices)
    emergencyContact = serializers.CharField(source="emergency_contact", required=False, allow_blank=True, max_length=160)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id", "fullName", "age", "gender", "phone", "email", "bloodGroup",
            "status", "address", "emergencyContact", "createdAt", "updatedAt",
        ]

    def validate_age(self, value):
        if value < 0 or value > 150:
            raise serializers.ValidationError("Age must be between 0 and 150.")
        return value

    def validate_phone(self, value):
        cleaned = value.strip()
        if len(cleaned) < 5:
            raise serializers.ValidationError("Enter a valid phone number.")
        return cleaned

    def create(self, validated_data):
        return Patient.objects.create(created_by=self.context["request"].user, **validated_data)
