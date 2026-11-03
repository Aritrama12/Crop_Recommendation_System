

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import RegisterSerializer , RegisterRequestSerializer
# from django.contrib.auth.hashers import make_password
# from django.conf import settings

# import random
# from django.core.mail import send_mail
# from django.contrib.auth.models import User
# from .models import PasswordResetOTP, PendingRegistration


# from django.contrib.auth.password_validation import validate_password
# from django.utils import timezone
# from datetime import timedelta

# from django.shortcuts import redirect
# from django.core.mail import EmailMultiAlternatives
# from django.utils.crypto import get_random_string


# from .permissions import IsStaffUser

# class RegisterView(APIView):
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



# class RegisterRequestView(APIView):

#     def post(self, request):
#         serializer = RegisterRequestSerializer(data=request.data)

#         if not serializer.is_valid():
#             return Response(
#                 serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         data = serializer.validated_data
#         email_address = data["email"].strip().lower()

#         # Do not create a pending registration for an existing user.
#         if User.objects.filter(email__iexact=email_address).exists():
#             return Response(
#                 {"error": "This email is already registered. Please log in."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Generate a fresh verification token.
#         token = get_random_string(64)

#         # Hash the password before storing it.
#         hashed_password = make_password(data["password"])

#         # Update an existing pending registration or create a new one.
#         record, created = PendingRegistration.objects.update_or_create(
#             email=email_address,
#             defaults={
#                 "username": data["username"],
#                 "password": hashed_password,
#                 "token": token,
#             }
#         )

#         # Production backend verification URL.
#         verification_url = (
#             f"https://cropwise-backend1.onrender.com"
#             f"/api/auth/verify-email/{token}/"
#         )

#         subject = "Verify Your CropWise Email"

#         text_content = f"""
# Hello {data['username']},

# Please verify your email using this link:

# {verification_url}

# This link expires in 1 hour.
# """

#         html_content = f"""
#         <html>
#         <body>
#             <h2>CropWise Email Verification</h2>

#             <p>Hello {data['username']},</p>

#             <p>Please click the button below to verify your email.</p>

#             <a href="{verification_url}"
#                style="
#                    display:inline-block;
#                    padding:12px 24px;
#                    background-color:#28a745;
#                    color:white;
#                    text-decoration:none;
#                    border-radius:6px;
#                    font-weight:bold;">
#                 Verify Email
#             </a>

#             <p style="margin-top:20px;">
#                 This link expires in 1 hour.
#             </p>
#         </body>
#         </html>
#         """

#         email_message = EmailMultiAlternatives(
#             subject,
#             text_content,
#             settings.EMAIL_HOST_USER,
#             [email_address]
#         )

#         email_message.attach_alternative(
#             html_content,
#             "text/html"
#         )

#         try:
#             email_message.send(fail_silently=False)

#         except Exception:
#             # Keep the pending record so the user can request
#             # another verification email.
#             return Response(
#                 {
#                     "error": (
#                         "Registration was saved, but the verification "
#                         "email could not be sent. Please try again."
#                     )
#                 },
#                 status=status.HTTP_503_SERVICE_UNAVAILABLE
#             )

#         return Response(
#             {
#                 "message": "Verification email sent successfully. Please check your inbox."
#             },
#             status=status.HTTP_200_OK
#         )



# class VerifyEmailView(APIView):

#     def get(self, request, token):

#         record = PendingRegistration.objects.filter(
#             token=token
#         ).first()

#         if not record:
#             return Response(
#                 {"error": "Invalid verification link"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if timezone.now() - record.created_at > timedelta(hours=1):
#             record.delete()

#             return Response(
#                 {"error": "Verification link expired"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if User.objects.filter(email__iexact=record.email).exists():
#             record.delete()

#             return Response(
#                 {"error": "Email already registered"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = User.objects.create(
#             username=record.username,
#             email=record.email
#         )

#         # Preserve the already-hashed password.
#         user.password = record.password
#         user.save(update_fields=["password"])

#         record.delete()

#         # Redirect to the deployed React frontend.
#         return redirect(
#             "https://crop-wisef.netlify.app/?verified=true"
#         )



# class LoginView(APIView):

#     def post(self, request):

#         username = request.data.get("username")
#         password = request.data.get("password")

#         user = authenticate(
#             username=username,
#             password=password
#         )

#         if user is None:
#             return Response(
#                 {"error": "Invalid credentials"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         refresh = RefreshToken.for_user(user)

#         return Response({

#             "refresh": str(refresh),
#             "access": str(refresh.access_token),

#             "user": {

#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,

#                 "is_staff": user.is_staff,
#                 "is_superuser": user.is_superuser,

#             }

#         })

    



# class LogoutView(APIView):
#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response(
#                 {"message": "Logged out successfully"},
#                 status=status.HTTP_200_OK
#             )
#         except Exception:
#             return Response(status=status.HTTP_400_BAD_REQUEST)



# class ForgotPasswordView(APIView):
#     def post(self, request):

#         email = request.data.get("email")

#         if not User.objects.filter(email=email).exists():
#             return Response(
#                 {"error": "Email not registered"},
#                 status=400
#             )

#         otp = str(random.randint(100000, 999999))

#         PasswordResetOTP.objects.filter(email=email).delete()

#         PasswordResetOTP.objects.create(
#             email=email,
#             otp=otp
#         )

#         send_mail(
#             "Password Reset OTP",
#             f"Your OTP is {otp}",
#             settings.EMAIL_HOST_USER,
#             [email],
#             fail_silently=False
#         )

#         return Response({"message": "OTP sent"})
    



# class ResetPasswordView(APIView):

#     def post(self, request):

#         email = request.data.get("email")
#         otp = request.data.get("otp")
#         password = request.data.get("password")

#         record = PasswordResetOTP.objects.filter(
#             email=email,
#             otp=otp
#         ).first()

#         if not record:
#             return Response(
#                 {"error": "Invalid OTP"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if timezone.now() - record.created_at > timedelta(minutes=5):
#             record.delete()

#             return Response(
#                 {"error": "OTP expired"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = User.objects.get(email=email)

#         try:
#             validate_password(password, user)
#         except Exception as e:
#             return Response(
#                 {"error": e.messages},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user.set_password(password)
#         user.save()

#         record.delete()

#         return Response(
#             {"message": "Password reset successful"},
#             status=status.HTTP_200_OK
#         )


import os
import random
import logging

import requests

from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import redirect
from django.utils import timezone
from django.utils.crypto import get_random_string

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, RegisterRequestSerializer
from .models import PasswordResetOTP, PendingRegistration
from .permissions import IsStaffUser


logger = logging.getLogger(__name__)


# =========================================================
# RESEND EMAIL CONFIGURATION
# =========================================================

def send_resend_email(to_email, subject, text_content, html_content):

    api_key = os.getenv("RESEND_API_KEY")

    from_email = os.getenv(
        "RESEND_FROM_EMAIL",
        "onboarding@resend.dev"
    )

    if not api_key:
        raise ValueError("RESEND_API_KEY is missing.")

    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "text": text_content,
        "html": html_content,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://api.resend.com/emails",
        headers=headers,
        json=payload,
        timeout=20
    )

    if not response.ok:
        raise RuntimeError(
            f"Resend API error: {response.status_code} - {response.text}"
        )

    return response.json()


# =========================================================
# NORMAL REGISTRATION
# =========================================================

class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# REGISTRATION REQUEST + EMAIL VERIFICATION
# =========================================================

class RegisterRequestView(APIView):

    def post(self, request):

        serializer = RegisterRequestSerializer(data=request.data)

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        email_address = data["email"].strip().lower()

        # Check existing user.
        if User.objects.filter(
            email__iexact=email_address
        ).exists():

            return Response(
                {
                    "error": (
                        "This email is already registered. "
                        "Please log in."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate verification token.
        token = get_random_string(64)

        # Hash password before storing it.
        hashed_password = make_password(data["password"])

        # Create or update pending registration.
        record, created = PendingRegistration.objects.update_or_create(
            email=email_address,
            defaults={
                "username": data["username"],
                "password": hashed_password,
                "token": token,
            }
        )

        # Reset expiration time for an updated registration.
        if not created:

            record.created_at = timezone.now()

            record.save(
                update_fields=["created_at"]
            )

        # Verification URL.
        verification_url = (
            "https://cropwise-backend1.onrender.com"
            f"/api/auth/verify-email/{token}/"
        )

        subject = "Verify Your CropWise Email"

        text_content = f"""
Hello {data['username']},

Welcome to CropWise!

Please verify your email using the link below:

{verification_url}

This verification link expires in 1 hour.

Thank you,
CropWise Team
"""

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">

            <h2 style="color: #28a745;">
                CropWise Email Verification
            </h2>

            <p>Hello {data['username']},</p>

            <p>
                Welcome to CropWise!
                Please verify your email address.
            </p>

            <a href="{verification_url}"
               style="
                   display: inline-block;
                   padding: 12px 24px;
                   background-color: #28a745;
                   color: white;
                   text-decoration: none;
                   border-radius: 6px;
                   font-weight: bold;
               ">
                Verify Email
            </a>

            <p style="margin-top: 20px;">
                This verification link expires in 1 hour.
            </p>

            <p>Thank you,<br>CropWise Team</p>

        </body>
        </html>
        """

        # Send email using Resend API.
        try:

            result = send_resend_email(
                to_email=email_address,
                subject=subject,
                text_content=text_content,
                html_content=html_content
            )

            logger.info(
                "Registration email sent successfully. Resend ID: %s",
                result.get("id")
            )

        except Exception:

            logger.exception(
                "CropWise registration email delivery failed."
            )

            return Response(
                {
                    "error": (
                        "Registration was saved, but the verification "
                        "email could not be sent. Please try again."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {
                "message": (
                    "Verification email sent successfully. "
                    "Please check your inbox."
                )
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# VERIFY EMAIL
# =========================================================

class VerifyEmailView(APIView):

    def get(self, request, token):

        record = PendingRegistration.objects.filter(
            token=token
        ).first()

        if not record:

            return Response(
                {"error": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check verification link expiration.
        if timezone.now() - record.created_at > timedelta(hours=1):

            record.delete()

            return Response(
                {"error": "Verification link expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether email already exists.
        if User.objects.filter(
            email__iexact=record.email
        ).exists():

            record.delete()

            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create verified user.
        user = User.objects.create(
            username=record.username,
            email=record.email
        )

        # Preserve hashed password.
        user.password = record.password

        user.save(
            update_fields=["password"]
        )

        # Delete pending registration.
        record.delete()

        # Redirect to React frontend.
        return redirect(
            "https://crop-wisef.netlify.app/?verified=true"
        )


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    def post(self, request):

        username = request.data.get("username")

        password = request.data.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:

            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({

            "refresh": str(refresh),

            "access": str(refresh.access_token),

            "user": {

                "id": user.id,

                "username": user.username,

                "email": user.email,

                "is_staff": user.is_staff,

                "is_superuser": user.is_superuser,

            }

        })


# =========================================================
# LOGOUT
# =========================================================

class LogoutView(APIView):

    def post(self, request):

        try:

            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK
            )

        except Exception:

            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )


# =========================================================
# FORGOT PASSWORD - SEND OTP
# =========================================================

class ForgotPasswordView(APIView):

    def post(self, request):

        email_address = request.data.get("email", "").strip().lower()

        if not email_address:

            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(
            email__iexact=email_address
        ).first()

        if not user:

            return Response(
                {"error": "Email not registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate OTP.
        otp = str(random.randint(100000, 999999))

        # Remove previous OTP.
        PasswordResetOTP.objects.filter(
            email__iexact=email_address
        ).delete()

        # Create new OTP.
        otp_record = PasswordResetOTP.objects.create(
            email=email_address,
            otp=otp
        )

        subject = "CropWise Password Reset OTP"

        text_content = f"""
Hello {user.username},

Your CropWise password reset OTP is:

{otp}

This OTP expires in 5 minutes.

If you did not request this password reset, please ignore this email.

CropWise Team
"""

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">

            <h2 style="color: #28a745;">
                CropWise Password Reset
            </h2>

            <p>Hello {user.username},</p>

            <p>Your password reset OTP is:</p>

            <h1 style="letter-spacing: 8px;">
                {otp}
            </h1>

            <p>This OTP expires in 5 minutes.</p>

            <p>CropWise Team</p>

        </body>
        </html>
        """

        try:

            result = send_resend_email(
                to_email=email_address,
                subject=subject,
                text_content=text_content,
                html_content=html_content
            )

            logger.info(
                "Password reset email sent. Resend ID: %s",
                result.get("id")
            )

        except Exception:

            logger.exception(
                "CropWise password reset email delivery failed."
            )

            otp_record.delete()

            return Response(
                {
                    "error": "Unable to send OTP email. Please try again."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {"message": "OTP sent successfully"},
            status=status.HTTP_200_OK
        )


# =========================================================
# RESET PASSWORD
# =========================================================

class ResetPasswordView(APIView):

    def post(self, request):

        email_address = request.data.get(
            "email", ""
        ).strip().lower()

        otp = request.data.get("otp")

        password = request.data.get("password")

        record = PasswordResetOTP.objects.filter(
            email__iexact=email_address,
            otp=otp
        ).first()

        if not record:

            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check OTP expiration.
        if timezone.now() - record.created_at > timedelta(minutes=5):

            record.delete()

            return Response(
                {"error": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(
            email__iexact=email_address
        ).first()

        if not user:

            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate new password.
        try:

            validate_password(password, user)

        except Exception as e:

            return Response(
                {"error": e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save new password.
        user.set_password(password)

        user.save()

        # Delete used OTP.
        record.delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
