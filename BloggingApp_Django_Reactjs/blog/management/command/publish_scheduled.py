from django.core.management.base import BaseCommand
from django.utils import timezone
from blog.models import Blog

class Command(BaseCommand):
    help = 'Publish scheduled blogs'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        scheduled_blogs = Blog.objects.filter(is_draft=True, scheduled_publish__lte=now)
        for blog in scheduled_blogs:
            blog.publish()
            self.stdout.write(f'Published: {blog.title}')
