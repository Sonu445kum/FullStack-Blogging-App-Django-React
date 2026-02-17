import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from blog.routing import websocket_urlpatterns  # 👈 import your websocket routes

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')

# Django setup must happen before importing anything using ORM
django.setup()

# ✅ ASGI application definition
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(   #  prevents cross-origin issues
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
