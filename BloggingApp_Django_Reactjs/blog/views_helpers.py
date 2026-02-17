from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

def clean_user_data(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": getattr(user, "role", "reader"),
        "email_verified": user.is_active,
        
    }
