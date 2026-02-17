print("✅ blog.signals module loaded successfully")

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Reaction, Comment, Notification


# ==========================================================
# 🔹 Helper function for WebSocket broadcasting
# ==========================================================
def broadcast_to_blog(blog_id, event_type, data=None):
    """Send real-time update to a specific blog group."""
    try:
        channel_layer = get_channel_layer()
        if not channel_layer:
            print("⚠️ Channel layer not available for broadcasting.")
            return
        async_to_sync(channel_layer.group_send)(
            f"blog_{blog_id}",
            {
                "type": event_type,
                "data": data or {},
            },
        )
    except Exception as e:
        print(f"❌ Error broadcasting to blog group: {e}")


# ==========================================================
# 🔹 Reaction: Created / Deleted → Update + Notify
# ==========================================================
@receiver([post_save, post_delete], sender=Reaction)
def handle_reaction_events(sender, instance, **kwargs):
    blog = instance.blog
    user = instance.user

    # 🟣 Updated Reaction Summary (using related_name='reactions')
    summary = {
        "like": blog.reactions.filter(reaction_type="like").count(),
        "love": blog.reactions.filter(reaction_type="love").count(),
        "laugh": blog.reactions.filter(reaction_type="laugh").count(),
        "angry": blog.reactions.filter(reaction_type="angry").count(),
    }

    # 🟢 Broadcast reaction change to all blog viewers
    broadcast_to_blog(blog.id, "reaction_update", {
        "type": "reaction_update",
        "blog_id": blog.id,
        "reaction_summary": summary,
        "reacted_by": user.username,
    })

    # 🔔 Notify blog author (if not same user)
    if blog.author != user:
        try:
            Notification.objects.create(
                user=blog.author,
                sender=user,
                blog=blog,
                notification_type="reaction",
                message=f"{user.username} reacted to your post '{blog.title}'."
            )

            # 🟣 Real-time author WebSocket push
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f"user_{blog.author.id}",
                    {
                        "type": "send_notification",
                        "data": {
                            "title": "❤️ New Reaction",
                            "message": f"{user.username} reacted to your post '{blog.title}'.",
                            "blog_id": blog.id,
                        },
                    },
                )
        except Exception as e:
            print(f"⚠️ Notification creation failed: {e}")


# ==========================================================
# 🔹 Comment: Created / Deleted → Update + Notify
# ==========================================================
@receiver([post_save, post_delete], sender=Comment)
def handle_comment_events(sender, instance, **kwargs):
    blog = instance.blog
    user = instance.user

    # 🟢 Broadcast new/removed comment to blog viewers
    broadcast_to_blog(blog.id, "comment_update", {
        "type": "comment_update",
        "blog_id": blog.id,
        "comment_id": instance.id,
        "user": user.username,
        "content": instance.content,
    })

    # 🔔 Notify author (only for creation, not deletion)
    created = kwargs.get("created", True)
    if created and blog.author != user:
        try:
            Notification.objects.create(
                user=blog.author,
                sender=user,
                blog=blog,
                notification_type="comment",
                message=f"{user.username} commented on your post '{blog.title}'."
            )

            # 🟣 Real-time WebSocket push to blog author
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f"user_{blog.author.id}",
                    {
                        "type": "send_notification",
                        "data": {
                            "title": "💬 New Comment",
                            "message": f"{user.username} commented: '{instance.content}'",
                            "blog_id": blog.id,
                            "comment_id": instance.id,
                        },
                    },
                )
        except Exception as e:
            print(f"⚠️ Comment notification failed: {e}")




def send_notification(user, message, notification_type="general"):
    notification = Notification.objects.create(
        user=user, message=message, notification_type=notification_type
    )
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}_notifications",
        {
            "type": "send_notification",
            "value": {
                "id": notification.id,
                "message": notification.message,
                "type": notification.notification_type,
                "is_read": notification.is_read,
                "created_at": notification.created_at.strftime("%Y-%m-%d %H:%M"),
            }
        }
    )
