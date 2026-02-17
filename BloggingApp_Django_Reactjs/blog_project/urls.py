from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Root API view
def root_view(request):
    return JsonResponse({"message": "Welcome to the Blogging Platform API"})

urlpatterns = [
    # Root URL
    path('', root_view, name='root'),

    # Django admin
    path('admin/', admin.site.urls),

    # Social auth via allauth
    path('accounts/', include('allauth.urls')),

    # -----------------------
    # Blog app APIs
    # -----------------------
    path('api/', include('blog.urls')),  # Include all blog app endpoints under /api/
    path('api/admin/', include('blog.urls')),

    # JWT auth (if you want token endpoints separate)
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
