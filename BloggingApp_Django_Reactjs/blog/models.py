from django.db import models
from django.contrib.auth.models import AbstractUser
from taggit.managers import TaggableManager
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field
from markdownx.models import MarkdownxField
from django.conf import settings

# ====================================
# USER & PROFILE
# ====================================
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('author', 'Author'),
        ('reader', 'Reader'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='reader')
    email_verified = models.BooleanField(default=True)  # Added field for serializer
    is_active = models.BooleanField(default=True)

    # Add saved blogs
    saved_blogs = models.ManyToManyField(
        'Blog', blank=True, related_name='saved_by_users'
    )

    def __str__(self):
        return self.username


class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    bookmarks = models.ManyToManyField('Blog', related_name='bookmarked_users', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


# ====================================
# CATEGORY & BLOG
# ====================================
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def __str__(self):
        return self.name


class Blog(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )

    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=255)
    content = CKEditor5Field('Content', config_name='default')
    markdown_content = MarkdownxField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='blogs')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='blogs')
    tags = TaggableManager(blank=True)
    featured_image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    attachments = models.FileField(upload_to='blog_files/', blank=True, null=True)

    # Analytics / Metadata
    search_text = models.TextField(blank=True, null=True)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    # Moderation
    is_approved = models.BooleanField(default=False)
    is_flagged = models.BooleanField(default=False)

    publish_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def publish(self):
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()

    def is_scheduled(self):
        return self.publish_at and self.publish_at > timezone.now()

    def save(self, *args, **kwargs):
        if self.publish_at and self.publish_at <= timezone.now():
            self.status = 'published'
            self.published_at = timezone.now()

        # Update searchable text safely
        try:
            tag_names = ', '.join(self.tags.names()) if self.pk else ''
        except:
            tag_names = ''
        parts = [
            self.title or '',
            str(self.content) or '',
            str(self.category.name if self.category else ''),
            tag_names,
            str(self.author.username if self.author else '')
        ]
        self.search_text = ' '.join(parts)
        super().save(*args, **kwargs)


# ====================================
# BLOG MEDIA
# ====================================
class BlogMedia(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='blog_media/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media for {self.blog.title}"


# ====================================
# COMMENTS (Threaded)
# ====================================
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    # Moderation
    is_approved = models.BooleanField(default=True)
    is_flagged = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} commented on {self.blog.title}"

    @property
    def is_reply(self):
        return self.parent is not None


# ====================================
# REACTIONS (Rich Emojis)
# ====================================
class Reaction(models.Model):
    REACTION_CHOICES = [
        ('like', '👍 Like'),
        ('dislike', '👎 Dislike'),
        ('love', '❤️ Love'),
        ('laugh', '😂 Laugh'),
        ('angry', '😡 Angry'),
        ('wow', '😲 Wow'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'blog')

    def __str__(self):
        return f"{self.user.username} reacted {self.reaction_type} on {self.blog.title}"


# ====================================
# BOOKMARKS
# ====================================
class Bookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookmarks')
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'blog')

    def __str__(self):
        return f"{self.user.username} bookmarked {self.blog.title}"


# ====================================
# NOTIFICATIONS
# ====================================
class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('comment', 'Comment'),
        ('reaction', 'Reaction'),
        ('announcement', 'Announcement'),
    ]

    #  The user who will receive this notification
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    #  The user who triggered this notification (like/comment)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='sent_notifications'
    )

    #  Type of notification (comment, like, etc.)
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES
    )

    #  Optional: related blog (for comment/like)
    blog = models.ForeignKey(
        Blog,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    #  The actual message displayed to the user
    message = models.TextField()

    #  Whether the user has read this notification or not
    is_read = models.BooleanField(default=False)

    #  Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        sender_name = self.sender.username if self.sender else "System"
        return f"{self.notification_type.title()} from {sender_name} → {self.user.username}"

    #  Helper methods
    def mark_as_read(self):
        """Mark this notification as read"""
        self.is_read = True
        self.save()

    def mark_as_unread(self):
        """Mark this notification as unread"""
        self.is_read = False
        self.save()