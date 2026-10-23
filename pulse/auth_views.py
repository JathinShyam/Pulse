"""Authentication endpoints for the operator console.

Registration is disabled unless ALLOW_REGISTRATION=True. Accounts should be
created by an administrator. Login accepts either a username or an email
address and returns a normal SimpleJWT access/refresh pair; the Next.js proxy
stores those tokens in httpOnly cookies so browser JavaScript never sees them.
"""

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from notifications.authentication import APIClient


class RegisterRequestSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class UserResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BooleanField()
    auth = serializers.ChoiceField(choices=["jwt", "api_key"])
    version = serializers.CharField()


class RegisterView(APIView):
    """Create an account when self-service registration is explicitly enabled."""

    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"
    serializer_class = RegisterRequestSerializer

    def post(self, request):
        if not settings.ALLOW_REGISTRATION:
            return Response(
                {
                    "error": "Registration is disabled. Ask an administrator to "
                    "create your account."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        raw_identity = (data.get("username") or data.get("email") or "").strip()
        raw_email = (data.get("email") or "").strip()
        if not raw_identity:
            return Response(
                {"error": "A username or email address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not raw_email and "@" in raw_identity:
            raw_email = raw_identity
        if not raw_email:
            return Response(
                {"error": "An email address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        username = raw_identity.lower() if "@" in raw_identity else raw_identity
        email = raw_email.lower()
        if User.objects.filter(username__iexact=username).exists():
            return Response(
                {"error": "That username is already in use."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"error": "That email address is already in use."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        candidate = User(username=username, email=email)
        try:
            candidate.full_clean(exclude=["password"])
            validate_password(data["password"], user=candidate)
        except DjangoValidationError as exc:
            messages = (
                exc.messages
                if hasattr(exc, "messages")
                else ["Invalid account details."]
            )
            return Response(
                {"error": " ".join(messages)}, status=status.HTTP_400_BAD_REQUEST
            )

        candidate.set_password(data["password"])
        candidate.save()
        return Response(
            {
                "id": candidate.id,
                "username": candidate.get_username(),
                "email": candidate.email,
            },
            status=status.HTTP_201_CREATED,
        )


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow the console's "email" field while preserving username login."""

    def validate(self, attrs):
        identity = (attrs.get(self.username_field) or "").strip()
        if identity and "@" in identity:
            user = User.objects.filter(email__iexact=identity).order_by("id").first()
            if user is not None:
                attrs[self.username_field] = user.get_username()
        return super().validate(attrs)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"


class MeView(APIView):
    """Describe the authenticated principal for the console shell."""

    serializer_class = UserResponseSerializer

    def get(self, request):
        user = request.user
        if isinstance(user, APIClient):
            return Response(
                {
                    "id": None,
                    "username": f"api-key:{user.key_fingerprint}",
                    "email": "",
                    "is_staff": False,
                    "is_superuser": False,
                    "auth": "api_key",
                    "version": settings.PULSE_VERSION,
                }
            )
        return Response(
            {
                "id": user.id,
                "username": user.get_username(),
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "auth": "jwt",
                "version": settings.PULSE_VERSION,
            }
        )
