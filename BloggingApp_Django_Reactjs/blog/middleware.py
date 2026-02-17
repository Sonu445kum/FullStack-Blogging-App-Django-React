# blogApp/middleware.py
import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from channels.db import database_sync_to_async
from .models import UserActivity
from django.contrib.auth.models import AnonymousUser


class UserActivityMiddleware(MiddlewareMixin):
    """
    ✅ Tracks user activity for both HTTP and WebSocket requests.
    - Logs visited paths for authenticated users.
    - Handles JWT tokens for WebSocket connections.
    """

    def process_request(self, request):
        """Track normal HTTP requests."""
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            UserActivity.objects.create(
                user=user,
                action=f"Visited {request.path}"
            )
        return None


# ⚡ For Django Channels WebSocket connections
@database_sync_to_async
def log_user_activity(user, path):
    if user and not isinstance(user, AnonymousUser):
        UserActivity.objects.create(user=user, action=f"WebSocket accessed {path}")


@database_sync_to_async
def get_user_from_token(token):
    """
    Decode JWT token to get the user for WebSocket connections.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id:
            return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware:
    """
    ✅ Custom JWT Authentication Middleware for WebSocket.
    Extracts JWT token from query params or headers and attaches user to scope.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope.get("headers", []))
        query_string = scope.get("query_string", b"").decode()

        token = None

        # Try extracting token from headers
        if b"authorization" in headers:
            token = headers[b"authorization"].decode().split("Bearer ")[-1]

        # Try extracting token from query string
        elif "token=" in query_string:
            token = query_string.split("token=")[-1]

        # Attach user to scope
        user = await get_user_from_token(token) if token else AnonymousUser()
        scope["user"] = user

        # Log WebSocket activity
        await log_user_activity(user, scope.get("path", "unknown"))

        return await self.inner(scope, receive, send)
