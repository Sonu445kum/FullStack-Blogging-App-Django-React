# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user = self.scope["user"]

#         # ✅ Only allow authenticated users
#         if not self.user.is_authenticated:
#             await self.close()
#             return

#         # Group name based on authenticated user's ID
#         self.room_group_name = f"user_{self.user.id}"

#         # Add user to their group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()
#         print(f"✅ WebSocket connected for user {self.user.username} (ID: {self.user.id})")

#     async def disconnect(self, close_code):
#         # Remove from group on disconnect
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
#         print(f"❌ WebSocket disconnected for user {self.user.username} (ID: {self.user.id})")

#     async def send_notification(self, event):
#         # Send structured JSON message to frontend
#         await self.send(text_data=json.dumps({
#             "type": event.get("type"),
#             "data": event.get("content", event.get("data", {}))
#         }))

# blog_app/consumers.py
# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.contrib.auth import get_user_model
# from .models import  Reaction

# User = get_user_model()

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user = self.scope["user"]

#         if self.user.is_anonymous:
#             await self.close()
#         else:
#             self.group_name = f"user_{self.user.id}"
#             await self.channel_layer.group_add(self.group_name, self.channel_name)
#             await self.accept()
#             print(f"✅ Connected to WebSocket for {self.user.username}")

#     async def disconnect(self, close_code):
#         if hasattr(self, "group_name"):
#             await self.channel_layer.group_discard(self.group_name, self.channel_name)
#             print(f"❌ Disconnected: {self.user.username}")

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data.get("message", None)
#         if message:
#             await self.send(text_data=json.dumps({"data": {"message": message}}))

#     async def send_notification(self, event):
#         """Send actual notification"""
#         await self.send(text_data=json.dumps({"data": event["data"]}))


# # BlogConsumer
# class BlogConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         """When user connects to a specific blog"""
#         self.blog_id = self.scope["url_route"]["kwargs"]["blog_id"]
#         self.group_name = f"blog_{self.blog_id}"

#         await self.channel_layer.group_add(self.group_name, self.channel_name)
#         await self.accept()
#         print(f"✅ WebSocket connected for Blog {self.blog_id}")

#     async def disconnect(self, close_code):
#         """Disconnect blog group"""
#         await self.channel_layer.group_discard(self.group_name, self.channel_name)
#         print(f"❌ WebSocket disconnected for Blog {self.blog_id}")

#     async def receive(self, text_data):
#         """Handle messages from frontend"""
#         data = json.loads(text_data)
#         action = data.get("action")

#         if action == "reaction_update":
#             await self.broadcast_reaction_update()
#         elif action == "comment_update":
#             await self.broadcast_comment_update()

#     @database_sync_to_async
#     def get_reaction_summary(self):
#         """Fetch current reaction counts"""
#         reactions = Reaction.objects.filter(blog_id=self.blog_id)
#         summary = {"like": 0, "love": 0, "laugh": 0, "angry": 0}
#         for r in reactions:
#             summary[r.reaction_type] = summary.get(r.reaction_type, 0) + 1
#         return summary

#     @database_sync_to_async
#     def get_comments(self):
#         """Fetch latest comments"""
#         comments = Comment.objects.filter(blog_id=self.blog_id).select_related("user")
#         return [
#             {
#                 "id": c.id,
#                 "content": c.content,
#                 "user": {"id": c.user.id, "username": c.user.username},
#                 "created_at": c.created_at.isoformat(),
#             }
#             for c in comments
#         ]

#     async def broadcast_reaction_update(self):
#         """Broadcast new reaction summary to all connected clients"""
#         summary = await self.get_reaction_summary()
#         await self.channel_layer.group_send(
#             self.group_name,
#             {"type": "reaction_update", "reaction_summary": summary},
#         )

#     async def broadcast_comment_update(self):
#         """Broadcast new comments to all clients"""
#         comments = await self.get_comments()
#         await self.channel_layer.group_send(
#             self.group_name,
#             {"type": "comment_update", "comments": comments},
#         )

#     # These methods are automatically called by group_send
#     async def reaction_update(self, event):
#         await self.send(text_data=json.dumps({
#             "type": "reaction_update",
#             "reaction_summary": event["reaction_summary"],
#         }))

#     async def comment_update(self, event):
#         await self.send(text_data=json.dumps({
#             "type": "comment_update",
#             "comments": event["comments"],
#         }))

# class ReactionConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print("✅ Connected to Reaction WebSocket")

#     async def disconnect(self, close_code):
#         print("❌ Reaction WebSocket Disconnected")

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         await self.send(text_data=json.dumps({
#             "message": f"Reaction received: {data}"
#         }))

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Reaction, Comment ,Notification


# ==============================================
# 🔹 BLOG CONSUMER (For real-time blog updates)
# ==============================================
class BlogConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.blog_id = self.scope["url_route"]["kwargs"]["blog_id"]
        self.group_name = f"blog_{self.blog_id}"

        # Join WebSocket group for this blog
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        print(f"✅ WebSocket connected → Blog ID: {self.blog_id}")

        # Send initial data
        summary = await self.get_reaction_summary()
        comments = await self.get_comments()
        await self.send_json({
            "type": "initial_data",
            "reaction_summary": summary,
            "comments": comments,
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"❌ WebSocket disconnected → Blog ID: {self.blog_id}")

    # ===================================================
    # 🔸 Handle incoming messages from React frontend
    # ===================================================
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "reaction":
                await self.save_reaction(data)
                await self.broadcast_reaction_update()

            elif action == "comment":
                await self.save_comment(data)
                await self.broadcast_comment_update()

        except Exception as e:
            print(f"⚠️ Error processing WebSocket message: {e}")

    # ===================================================
    # 🔸 Database operations (run in sync context)
    # ===================================================
    @database_sync_to_async
    def get_reaction_summary(self):
        summary = {"like": 0, "love": 0, "laugh": 0, "angry": 0}
        for r in Reaction.objects.filter(blog_id=self.blog_id):
            if r.reaction_type in summary:
                summary[r.reaction_type] += 1
        return summary

    @database_sync_to_async
    def get_comments(self):
        comments = Comment.objects.filter(blog_id=self.blog_id).select_related("user").order_by("-created_at")[:10]
        return [
            {
                "id": c.id,
                "content": c.content,
                "user": c.user.username,
                "created_at": c.created_at.strftime("%Y-%m-%d %H:%M"),
            }
            for c in comments
        ]

    @database_sync_to_async
    def save_reaction(self, data):
        user_id = data.get("user_id")
        reaction_type = data.get("reaction_type")
        Reaction.objects.update_or_create(
            user_id=user_id, blog_id=self.blog_id, defaults={"reaction_type": reaction_type}
        )

    @database_sync_to_async
    def save_comment(self, data):
        user_id = data.get("user_id")
        content = data.get("content")
        Comment.objects.create(user_id=user_id, blog_id=self.blog_id, content=content)

    # ===================================================
    # 🔸 Broadcast updates to all WebSocket clients
    # ===================================================
    async def broadcast_reaction_update(self):
        summary = await self.get_reaction_summary()
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "reaction_update",
                "reaction_summary": summary,
            },
        )

    async def broadcast_comment_update(self):
        comments = await self.get_comments()
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "comment_update",
                "comments": comments,
            },
        )

    # ===================================================
    # 🔸 Event Handlers → Receive broadcast from group
    # ===================================================
    async def reaction_update(self, event):
        await self.send_json({
            "type": "reaction_update",
            "reaction_summary": event["reaction_summary"],
        })

    async def comment_update(self, event):
        await self.send_json({
            "type": "comment_update",
            "comments": event["comments"],
        })

    # ===================================================
    # 🔸 Utility method to send JSON
    # ===================================================
    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))


# ==============================================
# 🔹 REACTION CONSUMER (Global reaction updates)
# ==============================================


class ReactionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join global group for reactions
        await self.channel_layer.group_add("reactions_group", self.channel_name)
        await self.accept()
        print("✅ WebSocket connected → Global Reaction Channel")

        # Notify client on connect
        await self.send_json({
            "type": "connection",
            "message": "Connected to Reaction WebSocket ✅",
        })

    async def disconnect(self, close_code):
        # Leave group on disconnect
        await self.channel_layer.group_discard("reactions_group", self.channel_name)
        print("❌ WebSocket disconnected → Global Reaction Channel")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("message", "")

            # Broadcast message to all clients (optional — for testing)
            await self.channel_layer.group_send(
                "reactions_group",
                {
                    "type": "send_reaction_update",
                    "value": {"message": message}
                }
            )
        except Exception as e:
            print(f"⚠️ Error in ReactionConsumer.receive: {e}")

    async def send_reaction_update(self, event):
        """Receive broadcast (from signals.py or receive) and send to WebSocket"""
        await self.send_json({
            "type": "reaction_update",
            "data": event.get("value", {}),
        })

    async def send_json(self, data):
        """Utility to send JSON data safely"""
        await self.send(text_data=json.dumps(data))



class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Connect user to their own private notification channel.
        Example: ws://127.0.0.1:8000/ws/notifications/
        """
        user = self.scope["user"]

        if user.is_anonymous:
            await self.close()
            print("❌ Unauthorized WebSocket connection attempt.")
            return

        self.group_name = f"user_{user.id}_notifications"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        print(f"✅ Notification WebSocket connected → User {user.username}")

        # Send initial notifications (last 10)
        notifications = await self.get_recent_notifications(user.id)
        await self.send_json({
            "type": "initial_notifications",
            "notifications": notifications
        })

    async def disconnect(self, close_code):
        user = self.scope["user"]
        if not isinstance(user, AnonymousUser):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            print(f"❌ Notification WebSocket disconnected → User {user.username}")

    async def receive(self, text_data):
        """
        Optional: client can mark notifications as read from WebSocket directly.
        """
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "mark_read":
                notification_id = data.get("notification_id")
                await self.mark_as_read(notification_id)
                await self.send_json({
                    "type": "notification_read",
                    "notification_id": notification_id,
                })

        except Exception as e:
            print(f"⚠️ NotificationConsumer receive() error: {e}")

    # ===============================
    # DATABASE HELPERS
    # ===============================
    @database_sync_to_async
    def get_recent_notifications(self, user_id):
        notifications = Notification.objects.filter(user_id=user_id).order_by("-created_at")[:10]
        return [
            {
                "id": n.id,
                "message": n.message,
                "type": n.notification_type,
                "is_read": n.is_read,
                "created_at": n.created_at.strftime("%Y-%m-%d %H:%M"),
            }
            for n in notifications
        ]

    @database_sync_to_async
    def mark_as_read(self, notification_id):
        Notification.objects.filter(id=notification_id).update(is_read=True)

    # ===============================
    # BROADCAST EVENT HANDLER
    # ===============================
    async def send_notification(self, event):
        """
        Called by Django signals (via channel layer group_send)
        """
        await self.send_json({
            "type": "new_notification",
            "notification": event["value"],
        })

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

