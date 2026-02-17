from django.contrib import admin
from django.utils.html import format_html
from .models import (
    CustomUser,
    Profile,
    Category,
    Blog,
    BlogMedia,
    Comment,
    Reaction,
    Notification,
    Bookmark,
    UserActivity
)

# ----------------------------
# SIMPLE REGISTRATIONS
# ----------------------------
admin.site.register(CustomUser)
admin.site.register(Profile)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Reaction)
admin.site.register(BlogMedia)
admin.site.register(Bookmark)
admin.site.register(UserActivity)


# ----------------------------
# BLOG ADMIN ENHANCEMENT
# ----------------------------
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'author', 'status', 'category',
        'views', 'likes', 'comments_count',
        'is_featured', 'publish_at', 'published_at',
        'created_at', 'updated_at', 'featured_image_preview'
    )
    list_filter = (
        'status', 'category', 'author',
        'is_featured', 'created_at', 'tags'
    )
    search_fields = (
        'title', 'content',
        'author__username', 'category__name',
        'tags__name'
    )
    ordering = ('-published_at',)
    readonly_fields = (
        'views', 'likes', 'comments_count',
        'published_at', 'created_at', 'updated_at'
    )

    #  Thumbnail preview for featured image
    def featured_image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="height:50px;width:80px;object-fit:cover;border-radius:4px;" />',
                obj.featured_image.url
            )
        return "—"
    featured_image_preview.short_description = 'Featured Image'


# ----------------------------
# NOTIFICATION ADMIN ENHANCEMENT
# ----------------------------
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'notification_type',
        'user',
        'sender_display',
        'blog',
        'short_message',
        'is_read',
        'created_at'
    )
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = (
        'user__username',
        'sender__username',
        'message',
        'blog__title'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    list_per_page = 20

    def sender_display(self, obj):
        if obj.sender:
            return obj.sender.username
        return "System"
    sender_display.short_description = 'Sender'

    def short_message(self, obj):
        return (obj.message[:60] + '...') if len(obj.message) > 60 else obj.message
    short_message.short_description = 'Message'

