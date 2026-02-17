from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

def send_verification_email(user, request):
    token = RefreshToken.for_user(user).access_token
    current_site = get_current_site(request).domain
    relative_link = reverse('email-verify')  # we will create this route
    absurl = f"http://{current_site}{relative_link}?token={str(token)}"
    email_body = f"Hi {user.username}, Use the link below to verify your email:\n{absurl}"
    send_mail(
        'Verify your email',
        email_body,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False
    )


# utils.py

def profile_completion(user):
    """
    Calculate profile completion percentage for a user.
    Only counts fields that actually exist in the user model.
    """
    fields = ['first_name', 'last_name', 'email', 'bio', 'profile_picture', 'phone_number']

    existing_fields = [f for f in fields if hasattr(user, f)]
    if not existing_fields:
        return 0

    filled_fields = sum(
        1 for field in existing_fields
        if getattr(user, field)
    )
    return int((filled_fields / len(existing_fields)) * 100)
