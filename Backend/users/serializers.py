
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "password2"
        )

    def validate_username(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username is required."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def validate_email(self, value):

        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate(self, attrs):

        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })

        return attrs

    def create(self, validated_data):

        validated_data.pop("password2")

        password = validated_data.pop("password")

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user
