import os
import django
import asyncio
from channels.layers import get_channel_layer

# ✅ Tell Django where your settings file is
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')
django.setup()

async def test_redis():
    layer = get_channel_layer()
    try:
        await layer.send("test_channel", {"type": "test.message", "text": "Hello Redis!"})
        print("✅ Redis connection successful — message sent to channel layer!")
    except Exception as e:
        print("❌ Redis connection failed:", e)

asyncio.run(test_redis())
