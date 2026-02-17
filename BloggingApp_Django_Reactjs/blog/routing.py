from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/reactions/$", consumers.ReactionConsumer.as_asgi()),
    re_path(r"ws/blog/(?P<blog_id>\d+)/$", consumers.BlogConsumer.as_asgi()),
    re_path(r"ws/notifications/$", consumers.NotificationConsumer.as_asgi()),
]
