# -------------------------
# Django & DRF Imports
# -------------------------
from .views_helpers import get_tokens_for_user, clean_user_data
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.db.models import Count, Sum
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status,permissions
from .permissions import IsAdmin, IsAdminOrOwner
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
# import here channel-layer for the web-socket




# -------------------------
# JWT Tokens
# -------------------------
from rest_framework_simplejwt.tokens import RefreshToken

# -------------------------
# Channels / WebSockets
# -------------------------
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# trnasactions from the db
from django.db import transaction

# -------------------------
# Tags & Notifications
# -------------------------
from taggit.models import Tag
from webpush import send_user_notification
from .pagination import BlogPagination

# -------------------------
# Models & Serializers
# -------------------------
from .models import (
    CustomUser, Profile, Category, Blog, BlogMedia, Comment,
    Reaction, Notification, UserActivity, Bookmark
)
from .serializers import (
    CustomUserSerializer, ProfileSerializer, CategorySerializer, BlogSerializer,
    BlogMediaSerializer, CommentSerializer, ReactionSerializer,
    NotificationSerializer, RegisterSerializer, LoginSerializer
)
from .utils import profile_completion
from .tokens import account_activation_token
from django.contrib.auth import get_user_model


# -------------------------
# BLOG ACTIONS
# -------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def flag_blog(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    if request.user in blog.flagged_by.all():
        return Response({'message': 'You have already flagged this blog'}, status=status.HTTP_200_OK)
    blog.flagged_by.add(request.user)
    blog.save()
    return Response({'message': 'Blog flagged successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_blog(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    if blog.is_approved:
        return Response({'message': 'Blog is already approved'}, status=status.HTTP_200_OK)
    blog.is_approved = True
    blog.approved_by = request.user
    blog.approved_at = timezone.now()
    blog.save()
    return Response({'message': 'Blog approved successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_blogs_api(request):
    top_blogs = Blog.objects.annotate(reactions_count=Count(
        'reaction')).order_by('-reactions_count')[:5]
    data = [{
        'id': blog.id,
        'title': blog.title,
        'author': blog.author.username,
        'reactions_count': blog.reactions_count,
        'created_at': blog.created_at,
    } for blog in top_blogs]
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def tag_suggestions(request):
    q = request.query_params.get('q', '').strip()
    if not q:
        return Response([])
    tags = Tag.objects.filter(name__istartswith=q).values_list(
        'name', flat=True)[:10]
    return Response(list(tags))

# -------------------------
# PROFILE & ACTIVITY
# -------------------------


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    completion = profile_completion(user)
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": getattr(user, 'role', 'reader'),
        "email_verified": getattr(user, 'email_verified', False),
        "profile_completion": completion
    }, status=status.HTTP_200_OK)


# Contact Views
@api_view(['POST'])
def contact_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    if not name or not email or not message:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Send email to your site email
        send_mail(
            subject=f"New Contact Message from {name}",
            message=f"From: {name} <{email}>\n\nMessage:\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,  # your configured sender
            recipient_list=[settings.CONTACT_EMAIL],  # your personal email
            fail_silently=False,
        )
        return Response({"success": "Message sent successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -----------------------------
# Update Profile
# -----------------------------
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def profile_update_view(request):
    # This ensures a profile exists for the user
    profile, created = Profile.objects.get_or_create(user=request.user)

    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Activity Logs
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_logs(request):
    logs = UserActivity.objects.filter(
        user=request.user).order_by('-timestamp')[:20]
    data = [{
        "activity_type": log.activity_type,
        "description": log.description,
        "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
    } for log in logs]
    return Response({
        "user": request.user.username,
        "total_logs": len(data),
        "recent_activities": data
    })


# -------------------------
# AUTH VIEWS
# -------------------------

User = get_user_model()

# --------------------- REGISTER ---------------------


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username, email=email, password=password, is_active=False)

    # Send verification email
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    frontend_url = getattr(settings, "FRONTEND_URL", None)
    if not frontend_url:
        return Response({"error": "FRONTEND_URL not set in settings."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    verification_link = f"{frontend_url}/verify-email/?uid={uid}&token={token}"

    send_mail(
        "Verify your email",
        f"Hi {user.username}, click the link to verify your email: {verification_link}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False
    )

    return Response({"message": "Registered successfully. Check email to activate account."}, status=status.HTTP_201_CREATED)


# ------------------- VERIFY EMAIL -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')

    if not uidb64 or not token:
        return Response({"error": "Missing UID or token"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        return Response({"error": "Invalid UID"}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        if user.is_active:
            return Response({"message": "Email already verified!"}, status=status.HTTP_200_OK)
        user.is_active = True
        user.save()
        return Response({"message": "Email verified successfully! You can now log in."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# CURRENT USER VIEW
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    return Response(clean_user_data(request.user))


# -----------------------------
# Helper: Send Activation Email
# -----------------------------
def send_activation_email(user, request=None):
    """
    Sends an email verification link to the user.
    """
    try:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)

        frontend_url = getattr(settings, "FRONTEND_URL", None)
        if not frontend_url and request:
            frontend_url = f"{request.scheme}://{request.get_host()}"

        verification_link = f"{frontend_url}/verify-email/?uid={uid}&token={token}"

        subject = "Activate your account"
        message = f"Hi {user.username},\n\nClick the link to verify your email:\n{verification_link}\n\nIf you didn't sign up, ignore this email."

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f"Error sending activation email: {e}")
        return False


# --------------------- LOGIN ---------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Allows login using either username or email along with password.
    Returns JWT tokens and user data if successful.
    """
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        "message": "You are logged in successfully!",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_admin": getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False),
        },
        "tokens": {
            "refresh": str(refresh),
            "access": access_token,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'No user found with this email'}, status=status.HTTP_404_NOT_FOUND)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = PasswordResetTokenGenerator().make_token(user)
    reset_url = f"{settings.FRONTEND_URL}/reset-password/?uid={uid}&token={token}"

    send_mail(
        'Password Reset Request',
        f'Hi {user.username}, click the link to reset your password: {reset_url}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
    return Response({'message': 'Password reset link sent to email'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')  # add

    if not uidb64 or not token or not new_password or not confirm_password:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid UID'}, status=status.HTTP_400_BAD_REQUEST)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    if not current_password or not new_password:
        return Response({'error': 'Both current and new passwords are required'}, status=status.HTTP_400_BAD_REQUEST)
    user = request.user
    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


# -------------------------------
# ADD TO NEW BLOG (COPY)
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_blog_view(request, pk):
    """
    Creates a copy of an existing blog as a draft for the logged-in user.
    """
    try:
        original_blog = Blog.objects.get(id=pk)

        # Create new blog, handling required fields
        new_blog = Blog.objects.create(
            title=f"Copy of {original_blog.title}",
            content=original_blog.content,
            author=request.user,
            status="draft",
            category=original_blog.category if original_blog.category else None
        )

        # Copy tags if exist
        if original_blog.tags.exists():
            new_blog.tags.set(original_blog.tags.all())

        return Response(
            {"message": "New blog created successfully!", "id": new_blog.id},
            status=status.HTTP_201_CREATED
        )

    except Blog.DoesNotExist:
        return Response({"error": "Original blog not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# CREATE BLOG
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def blog_create_view(request):
    """
    Create a new blog (Draft or Published) with optional media upload.
    """
    data = request.data.copy()

    # Use serializer for main blog data
    serializer = BlogSerializer(data=data, context={'request': request})

    if serializer.is_valid():
        blog = serializer.save(author=request.user)

        # Handle single/multiple media files
        files = request.FILES.getlist('file')  # match frontend key
        for f in files:
            BlogMedia.objects.create(blog=blog, file=f)

        # Default status = draft if not provided
        if not blog.status:
            blog.status = 'draft'
            blog.save()

        return Response({
            "message": "Blog created successfully",
            "blog": BlogSerializer(blog, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

    # If serializer invalid, return errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# UPDATE BLOG
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def blog_update_view(request, pk):
    """
    Update a blog. Only the author can update.
    """
    blog = get_object_or_404(Blog, pk=pk)

    # Check if current user is author
    if blog.author != request.user:
        return Response({'error': "You cannot edit someone else's blog"}, status=status.HTTP_403_FORBIDDEN)

    serializer = BlogSerializer(
        blog, data=request.data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Blog updated successfully",
            "blog": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_blog_admin(request, pk):
    try:
        blog = Blog.objects.get(pk=pk)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)

    # Author or admin/superuser override
    if blog.author != request.user and not (request.user.is_staff or request.user.is_superuser):
     return Response({"error": "You cannot edit someone else's blog"}, status=403)

    serializer = BlogSerializer(blog, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_blog_admin(request, pk):
    try:
        blog = Blog.objects.get(pk=pk)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)

    # Author or admin/superuser override
    if blog.author != request.user and not (request.user.is_staff or request.user.is_superuser):
        return Response({"error": "You cannot delete someone else's blog"}, status=403)

    blog.delete()
    return Response({"message": "Blog deleted successfully"})

# -------------------------------
# DELETE BLOG
# -------------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def blog_delete_view(request, pk):
    """
    Delete a blog. Only the author can delete.
    """
    blog = get_object_or_404(Blog, pk=pk)

    if blog.author != request.user:
        return Response({"error": "You are not allowed to delete this blog"}, status=status.HTTP_403_FORBIDDEN)

    blog.delete()
    return Response({"message": "Blog deleted successfully"}, status=status.HTTP_200_OK)


# -------------------------------
# BLOG LIST (FILTERS + SEARCH)
# -------------------------------
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def blog_list_view(request):
    """
    ✅ Blog List API with Full Filters + Pagination Support
    Supports: search, category (name or slug), tag, author
    """

    # --- Get query params ---
    search = request.query_params.get("search", "").strip()
    category_param = request.query_params.get("category", "").strip()
    tag_param = request.query_params.get("tag", "").strip()
    author_param = request.query_params.get("author", "").strip()

    # --- Base queryset (only published blogs) ---
    blogs = Blog.objects.filter(status="published").select_related("category", "author").prefetch_related("tags").order_by("-published_at")

    # --- Search Filter ---
    if search:
        blogs = blogs.filter(
            Q(title__icontains=search) |
            Q(content__icontains=search) |
            Q(author__username__icontains=search)
        )

    # --- Category Filter (matches by name or slug, case-insensitive) ---
    if category_param and category_param.lower() not in ["all", ""]:
        blogs = blogs.filter(
            Q(category__name__iexact=category_param) |
            Q(category__slug__iexact=category_param)
        )

    # --- Tag Filter ---
    if tag_param:
        blogs = blogs.filter(tags__name__iexact=tag_param)

    # --- Author Filter ---
    if author_param:
        blogs = blogs.filter(author__username__iexact=author_param)

    # --- Remove Duplicates ---
    blogs = blogs.distinct()

    # --- Pagination ---
    paginator = BlogPagination()
    paginated_blogs = paginator.paginate_queryset(blogs, request)

    # --- Serialization ---
    serializer = BlogSerializer(paginated_blogs, many=True, context={"request": request})

    # --- Return Paginated Response ---
    return paginator.get_paginated_response(serializer.data)

# -------------------------------
# BLOG DETAILS
# -------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def blog_detail_view(request, pk):
    """
    Fetch details of a specific blog and increment view count.
    """
    blog = get_object_or_404(Blog, pk=pk)

    # Increase view count
    blog.views += 1
    blog.save(update_fields=['views'])

    serializer = BlogSerializer(blog, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# myblogs list views
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_blogs_list_view(request):
    """
     Returns all blogs created by the logged-in user (published or drafts).
    """
    user = request.user
    blogs = Blog.objects.filter(author=user).order_by("-created_at")

    serializer = BlogSerializer(blogs, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)



# myBlogs update views
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def myblogs_update_blog_view(request, pk):
    """
     Update a blog created by the logged-in user.
    """
    try:
        blog = Blog.objects.get(pk=pk, author=request.user)
    except Blog.DoesNotExist:
        return Response({"detail": "Blog not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

    serializer = BlogSerializer(blog, data=request.data, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# myBlogs Deleted 
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def myblogs_delete_blog_view(request, pk):
    """
     Delete a blog created by the logged-in user.
    """
    try:
        blog = Blog.objects.get(pk=pk, author=request.user)
    except Blog.DoesNotExist:
        return Response({"detail": "Blog not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

    blog.delete()
    return Response({"message": "Blog deleted successfully."}, status=status.HTTP_204_NO_CONTENT)



# -------------------------------
# DRAFT BLOGS (USER SPECIFIC)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def draft_blogs_view(request):
    """
    Get all draft blogs of logged-in user.
    """
    drafts = Blog.objects.filter(
        author=request.user, status='draft').order_by('-created_at')
    serializer = BlogSerializer(
        drafts, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# -------------------------------
# TRENDING BLOGS
# -------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def trending_blogs_view(request):
    """
    Fetch top 10 trending blogs by view count.
    """
    blogs = Blog.objects.filter(status='published').order_by('-views')[:10]
    serializer = BlogSerializer(blogs, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# -------------------------------
# MEDIA UPLOAD (BLOG IMAGES/VIDEOS)
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def blog_media_upload_view(request):
    """
    Upload media (images/videos) to a specific blog. Only author can upload.
    """
    try:
        # ✅ Accept both keys
        blog_id = request.data.get('blog') or request.data.get('blog_id')
        files = request.FILES.getlist('file')

        if not blog_id:
            return Response({"error": "blog_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not files:
            return Response({"error": "No file(s) uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        blog = get_object_or_404(Blog, pk=blog_id)

        if blog.author != request.user:
            return Response({"error": "You are not allowed to upload media to this blog"}, status=status.HTTP_403_FORBIDDEN)

        uploaded_media = []
        for f in files:
            try:
                media = BlogMedia.objects.create(blog=blog, file=f)
                uploaded_media.append({
                    "id": media.id,
                    # ✅ Full URL return
                    "file": request.build_absolute_uri(media.file.url)
                })
            except Exception as e:
                continue

        if not uploaded_media:
            return Response({"error": "Failed to upload any media"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Media uploaded successfully",
            "media": uploaded_media
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": "Internal server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -----------------------------
# List All Categories
@api_view(['GET'])
@permission_classes([AllowAny])
def category_list_view(request):
    categories = Category.objects.all().order_by("name")
    serializer = CategorySerializer(categories, many=True)
    return Response({"categories": serializer.data}, status=status.HTTP_200_OK)

# -----------------------------
# Create New Category
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def category_create_view(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Category created successfully",
                "category": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Update / Delete Category
# -----------------------------
@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_update_delete_view(request, pk):
    category = get_object_or_404(Category, pk=pk)

    # -----------------
    # Update Category
    # -----------------
    if request.method in ['PUT', 'PATCH']:
        serializer = CategorySerializer(
            category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Category updated successfully",
                    "category": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # -----------------
    # Delete Category
    # -----------------
    elif request.method == 'DELETE':
        category.delete()
        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_200_OK
        )

# -----------------------------
# REACTIONS
# -----------------------------


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def toggle_reaction_view(request, blog_id):
#     """
#     Toggle reaction types (like, love, laugh, angry)
#     - Ek user ek hi reaction de sakta hai ek blog pe.
#     - Same reaction dobara click kare → reaction remove ho jaye.
#     - Alag reaction click kare → purana replace ho jaye.
#     """
#     try:
#         # ✅ Accept both 'reaction_type' and 'reactionType' (for safety)
#         reaction_type = request.data.get('reaction_type') or request.data.get('reactionType')

#         # 🛑 Validate Reaction Type
#         if reaction_type not in ['like', 'love', 'laugh', 'angry']:
#             return Response(
#                 {"error": "Invalid reaction type"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # 🔍 Find blog and user reaction
#         blog = get_object_or_404(Blog, pk=blog_id)
#         reaction, created = Reaction.objects.get_or_create(blog=blog, user=request.user)

#         # ⚡ Toggle logic (like Instagram/Facebook)
#         if not created and reaction.reaction_type == reaction_type:
#             # ✅ Same reaction click again → remove
#             reaction.delete()
#         else:
#             # ✅ Different reaction → update / create new
#             reaction.reaction_type = reaction_type
#             reaction.save()

#         # 🟣 Reaction Summary (Counts)
#         summary = {
#             "like": Reaction.objects.filter(blog=blog, reaction_type="like").count(),
#             "love": Reaction.objects.filter(blog=blog, reaction_type="love").count(),
#             "laugh": Reaction.objects.filter(blog=blog, reaction_type="laugh").count(),
#             "angry": Reaction.objects.filter(blog=blog, reaction_type="angry").count(),
#         }

#         # 🧠 Current user’s reaction (for UI highlight)
#         user_reaction = (
#             Reaction.objects.filter(blog=blog, user=request.user)
#             .values_list("reaction_type", flat=True)
#             .first()
#         )

#         return Response({
#             "message": "Reaction updated successfully",
#             "reaction_summary": summary,
#             "user_reaction": user_reaction,
#         }, status=status.HTTP_200_OK)

#     except Exception as e:
#         print("❌ Reaction Error:", str(e))
#         return Response(
#             {"error": str(e)},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )


# new toggle_reactions_view with web-socket
# -----------------------------
# REACTIONS
# -----------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_reaction_view(request, blog_id):
    """
    Toggle reaction (like/love/laugh/angry)
    Real-time update handled automatically via signals.
    """
    try:
        # 🟣 Step 1: Validate Input
        reaction_type = request.data.get('reaction_type') or request.data.get('reactionType')
        if reaction_type not in ['like', 'love', 'laugh', 'angry']:
            return Response({"error": "Invalid reaction type"}, status=status.HTTP_400_BAD_REQUEST)

        # 🟣 Step 2: Get Blog + User
        blog = get_object_or_404(Blog, pk=blog_id)
        user = request.user

        # 🟣 Step 3: Create or Toggle Reaction
        reaction, created = Reaction.objects.get_or_create(blog=blog, user=user)

        if not created and reaction.reaction_type == reaction_type:
            # Same reaction → remove
            reaction.delete()
            user_reaction = None
        else:
            # Different or new reaction → update
            reaction.reaction_type = reaction_type
            reaction.save()
            user_reaction = reaction_type

        # 🟣 Step 4: Reaction Summary (use blog.reactions instead of reaction_set)
        summary = {
            "like": blog.reactions.filter(reaction_type="like").count(),
            "love": blog.reactions.filter(reaction_type="love").count(),
            "laugh": blog.reactions.filter(reaction_type="laugh").count(),
            "angry": blog.reactions.filter(reaction_type="angry").count(),
        }

        # ✅ Step 5: Return Response
        return Response({
            "message": "Reaction updated successfully",
            "reaction_summary": summary,
            "user_reaction": user_reaction,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("❌ Reaction Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Reactions List
@api_view(['GET'])
@permission_classes([AllowAny])
def reaction_list_view(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    reactions = Reaction.objects.filter(blog=blog)
    serializer = ReactionSerializer(reactions, many=True)
    return Response(serializer.data)

# -----------------------------
# COMMENTS
# -----------------------------


@api_view(['GET'])
@permission_classes([AllowAny])
def comment_list_view(request, blog_id):
    blog = get_object_or_404(Blog, pk=blog_id)
    comments = Comment.objects.filter(blog=blog, parent=None)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_comment(request, blog_id):
#     blog = get_object_or_404(Blog, id=blog_id)
#     content = request.data.get('content')
#     if not content:
#         return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

#     comment = Comment.objects.create(
#         user=request.user, blog=blog, content=content)

#     if blog.author != request.user:
#         Notification.objects.create(
#             user=blog.author,
#             sender=request.user,
#             notification_type='comment',
#             blog=blog,
#             message=f"{request.user.username} commented on your blog"
#         )

#         # Optional: real-time channels notification
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f"user_{blog.author.id}",
#             {
#                 "type": "send_notification",
#                 "content": {
#                     "message": f"{request.user.username} commented on your blog",
#                     "blog_id": blog.id,
#                     "notification_type": "comment",
#                 }
#             }
#         )

#     return Response({"detail": "Comment created successfully."})


# new Add Comment logic for the Websocket
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, blog_id):
    """
    Add a new comment or reply to a blog.
    Real-time WebSocket notifications + DB notifications handled automatically via signals.
    """
    try:
        user = request.user
        blog = get_object_or_404(Blog, id=blog_id)

        # 🟣 Accept 'content' or fallback to 'text'
        content = request.data.get('content') or request.data.get('text')
        parent_id = request.data.get('parent_id')

        # 🛑 Validate
        if not content or not str(content).strip():
            return Response(
                {"error": "Content is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # 🟣 Optional threaded comment support
            parent_comment = None
            if parent_id:
                parent_comment = Comment.objects.filter(id=parent_id, blog=blog).first()
                if not parent_comment:
                    return Response(
                        {"error": "Parent comment not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )

            # 🟣 Create the comment
            comment = Comment.objects.create(
                user=user,
                blog=blog,
                content=content.strip(),
                parent=parent_comment
            )

        # ✅ Signals (in signals.py) handle:
        # - Real-time WebSocket updates
        # - Sending notification to the blog author
        # So we don’t manually call Channels here.

        return Response(
            {
                "detail": "Comment created successfully.",
                "comment": {
                    "id": comment.id,
                    "user": user.username,
                    "content": comment.content,
                    "parent_id": comment.parent.id if comment.parent else None,
                    "blog_id": blog.id,
                    "created_at": comment.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print("❌ Comment Error:", str(e))
        return Response(
            {"error": "Failed to add comment."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )



# Comment Delete Views
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete_view(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    if comment.user != request.user:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    return Response({'message': 'Comment deleted'}, status=status.HTTP_204_NO_CONTENT)


# -----------------------------
# BOOKMARKS
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, blog_id):
    user = request.user
    blog = get_object_or_404(Blog, id=blog_id)
    bookmark, created = Bookmark.objects.get_or_create(user=user, blog=blog)
    if not created:
        bookmark.delete()
        return Response({'message': 'Bookmark removed'})
    return Response({'message': 'Bookmark added'})


# User BookMarks
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookmarks(request):
    bookmarks = Bookmark.objects.filter(
        user=request.user).select_related('blog')
    data = [
        {
            'id': b.blog.id,
            'title': b.blog.title,
            'created_at': b.blog.created_at
        } for b in bookmarks
    ]
    return Response(data)


# -----------------------------
# NOTIFICATIONS
# -----------------------------
# ----------------------------------------------------------
# 1️ List all notifications for the logged-in user
# ----------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_notifications_view(request):
    notifications = Notification.objects.filter(
        user=request.user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


# ----------------------------------------------------------
# 2️ Mark a single notification as read
# ----------------------------------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_notification_read_view(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.is_read = True
    notification.save()
    return Response({'message': ' Notification marked as read successfully'})


# ----------------------------------------------------------
# 3️ Mark all notifications as read
# ----------------------------------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read_view(request):
    notifications = Notification.objects.filter(
        user=request.user, is_read=False)
    count = notifications.count()
    notifications.update(is_read=True)
    return Response({'message': f' {count} notifications marked as read'})


# ----------------------------------------------------------
# 4️ Delete a single notification
# ----------------------------------------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification_view(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.delete()
    return Response({'message': ' Notification deleted successfully'})


# -----------------------------
# GENERAL STATS
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_view(request):
    return Response({
        'total_users': CustomUser.objects.count(),
        'total_blogs': Blog.objects.count(),
        'total_comments': Comment.objects.count(),
        'total_reactions': Reaction.objects.count(),
        'total_notifications': Notification.objects.count(),
    })


# # -----------------------------
# # ADMIN DASHBOARD
# # -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard(request):
    data = {
        "users": CustomUser.objects.count(),
        "blogs": Blog.objects.count(),
        "comments": Comment.objects.count(),
        "reactions": Reaction.objects.count(),
        "categories": Category.objects.count()
    }
    return Response(data)


# All Users
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def all_users(request):
    users = CustomUser.objects.all()
    data = [clean_user_data(u) for u in users]
    return Response(data)


# Update User Role
@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_user_role(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    new_role = request.data.get('role')

    # Validate role
    valid_roles = ['Admin', 'Editor', 'Author', 'Reader']
    if new_role not in valid_roles:
        return Response({'error': 'Invalid role'}, status=400)

    # Save updated role
    user.role = new_role
    user.save()

    return Response({'status': 'Role updated successfully', 'new_role': user.role})


# Most active Users
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def most_active_users(request):
    users = CustomUser.objects.annotate(activity_count=Count(
        'useractivity')).order_by('-activity_count')[:10]
    data = [clean_user_data(u) for u in users]
    return Response(data)


# Trending Blogs Admin
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def trending_blogs_admin(request):
    blogs = Blog.objects.order_by('-views')[:10]
    serializer = BlogSerializer(blogs, many=True, context={'request': request})
    return Response(serializer.data)




#  admin_blog_list_view
@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def admin_blog_list_view(request):
    """
    ✅ Admin Blog List API
    Shows all blogs regardless of status, with search, filter & sorting
    """
    blogs = Blog.objects.all().select_related("category", "author").prefetch_related("tags").order_by("-created_at")

    search = request.query_params.get("search", "")
    status = request.query_params.get("status", "")
    sort = request.query_params.get("sort", "")  # ✅ New

    if search:
        blogs = blogs.filter(Q(title__icontains=search) | Q(author__username__icontains=search))

    if status:
        blogs = blogs.filter(status=status)

    # ✅ Sorting Logic
    if sort == "asc":
        blogs = blogs.order_by("created_at")
    elif sort == "desc":
        blogs = blogs.order_by("-created_at")
    elif sort == "a-z":
        blogs = blogs.order_by("title")
    elif sort == "z-a":
        blogs = blogs.order_by("-title")

    paginator = BlogPagination()
    paginated_blogs = paginator.paginate_queryset(blogs, request)
    serializer = BlogSerializer(paginated_blogs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)




# Approved Blogs
@api_view(['POST'])
@permission_classes([IsAdminUser])  # only admin/editor
def approve_blog(request, blog_id):
    try:
        blog = Blog.objects.get(pk=blog_id)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

    blog.status = 'published'  # approve
    blog.save()
    return Response({"message": "Blog approved successfully", "blog_id": blog.id}, status=status.HTTP_200_OK)

# Flag Blog


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # logged-in users can flag
def flag_blog(request, blog_id):
    try:
        blog = Blog.objects.get(pk=blog_id)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

    blog.is_flagged = True  # example flag field
    blog.save()
    return Response({"message": "Blog flagged successfully", "blog_id": blog.id}, status=status.HTTP_200_OK)

# Admin Comments
#  Admin can see all comments
from rest_framework.pagination import PageNumberPagination

class CommentPagination(PageNumberPagination):
    page_size = 10  # 👈 ek page me 10 comments dikhe
    page_size_query_param = "page_size"  # optional: user decide kar sake kitne chahiye
    max_page_size = 100  # limit to avoid heavy loads


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_comments_view(request):
    """
    ✅ Paginated Admin Comment List
    - Only accessible by Admin users
    - Supports ?page=1, ?page=2 etc.
    """
    comments = Comment.objects.all().order_by('-created_at')

    # 🔹 Apply pagination
    paginator = CommentPagination()
    paginated_comments = paginator.paginate_queryset(comments, request)

    # 🔹 Serialize the paginated data
    serializer = CommentSerializer(paginated_comments, many=True, context={'request': request})

    # 🔹 Return paginated response (includes next/prev URLs)
    return paginator.get_paginated_response(serializer.data)

#  Admin can approve a comment


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def approve_comment_view(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    comment.is_approved = True
    comment.save()
    return Response({'message': 'Comment approved successfully'}, status=status.HTTP_200_OK)

#  Admin or Comment Owner can delete


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete_view(request, pk):
    comment = get_object_or_404(Comment, pk=pk)

    # Allow both: comment owner or admin
    if comment.user != request.user and not request.user.is_staff and not getattr(request.user, 'is_admin', False):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    comment.delete()
    return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_admin_notifications(request):
    notifications = Notification.objects.all().order_by('-created_at')

    # ✅ Custom Pagination
    paginator = PageNumberPagination()
    paginator.page_size = 9  # 9 per page
    paginated_notifications = paginator.paginate_queryset(notifications, request)

    serializer = NotificationSerializer(paginated_notifications, many=True)

    # ✅ Return response with pagination meta info
    return Response({
        "results": serializer.data,
        "total_pages": paginator.page.paginator.num_pages,
        "current_page": paginator.page.number,
        "total_notifications": paginator.page.paginator.count,
        "has_next": paginator.page.has_next(),
        "has_previous": paginator.page.has_previous(),
    })

# -------------------------------
# PATCH: Mark notification as read
# -------------------------------


@api_view(['PATCH'])
def mark_notification_read(request, pk):
    try:
        notification = Notification.objects.get(pk=pk)
        notification.mark_as_read()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

# -------------------------------
# DELETE notification
# -------------------------------


@api_view(['DELETE'])
def delete_notification(request, pk):
    try:
        notification = Notification.objects.get(pk=pk)
        notification.delete()
        return Response({"message": "Notification deleted successfully"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def reactions_list(request):
    """
    GET /api/admin/reactions/?page=1
    Returns paginated list of all reactions for the admin dashboard.
    """
    reactions = Reaction.objects.select_related('user', 'blog').all().order_by('-id')
    
    # ✅ Pagination logic
    paginator = PageNumberPagination()
    paginator.page_size = 9  # one page me 9 reactions dikhayenge
    paginated_reactions = paginator.paginate_queryset(reactions, request)
    
    serializer = ReactionSerializer(paginated_reactions, many=True)
    
    # ✅ Return paginated response
    return paginator.get_paginated_response(serializer.data)


# ------------------------------
# Delete a Reaction (Admin)
# ------------------------------
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def reaction_delete(request, pk):
    """
    DELETE /api/admin/reactions/<pk>/delete/
    Deletes a reaction by its ID (pk).
    """
    try:
        reaction = Reaction.objects.get(pk=pk)
        reaction.delete()
        return Response({"detail": "Reaction deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Reaction.DoesNotExist:
        return Response({"detail": "Reaction not found"}, status=status.HTTP_404_NOT_FOUND)


# dashboard stats
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    stats = {
        'users': CustomUser.objects.count(),
        'blogs': Blog.objects.count(),
        'categories': Category.objects.count(),
        'comments': Comment.objects.count(),
        'notifications': Notification.objects.count(),
        'reactions': Reaction.objects.count(),
    }
    return Response(stats)


# Delete User
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    

# ====================================
# UPDATE USER
# ====================================
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CustomUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Add new User by admin
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_user(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)






# paginations views
from django.db.models.functions import TruncDate, TruncMonth
@api_view(['GET'])
@permission_classes([IsAdminUser])
def stats(request):
    # ---------- Base counts ----------
    total_blogs = Blog.objects.count()
    total_likes = sum(blog.likes.count() for blog in Blog.objects.all())
    total_comments = Comment.objects.count()
    total_views = Blog.objects.aggregate(total=Sum('views'))['total'] or 0
    total_categories = Category.objects.count()
    total_users = User.objects.count()

    # ---------- Blog per Category ----------
    blogs_per_category = (
        Blog.objects.values('category__name')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # ---------- Views per Category ----------
    views_per_category = (
        Blog.objects.values('category__name')
        .annotate(total_views=Sum('views'))
        .order_by('-total_views')
    )

    # ---------- Most Active Blogs (by reactions + comments + views) ----------
    most_active_blogs = (
        Blog.objects.annotate(
            activity_score=Count('reactions') + Count('comments') + Sum('views')
        )
        .order_by('-activity_score')[:5]
        .values('id', 'title', 'activity_score', 'views')
    )

    # ---------- Trending Blogs (by views only) ----------
    trending_blogs = (
        Blog.objects.order_by('-views')[:5]
        .values('id', 'title', 'views', 'created_at')
    )

    # ---------- Daily / Monthly Trends ----------
    daily_blogs = (
        Blog.objects.annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )
    monthly_blogs = (
        Blog.objects.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    daily_users = (
        User.objects.annotate(date=TruncDate('date_joined'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )
    monthly_users = (
        User.objects.annotate(month=TruncMonth('date_joined'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    return Response({
        'total_blogs': total_blogs,
        'total_users': total_users,
        'total_views': total_views,
        'total_likes': total_likes,
        'total_comments': total_comments,
        'total_categories': total_categories,

        'blogs_per_category': blogs_per_category,
        'views_per_category': views_per_category,
        'most_active_blogs': most_active_blogs,
        'trending_blogs': trending_blogs,

        'daily_blogs': daily_blogs,
        'monthly_blogs': monthly_blogs,
        'daily_users': daily_users,
        'monthly_users': monthly_users,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_dashboard_stats(request):
    """
    GET /api/admin/dashboard/stats/
    Returns overall dashboard statistics for admin panel.
    """
    data = {
        "users": User.objects.count(),
        "blogs": Blog.objects.count(),
        "categories": Category.objects.count(),
        "comments": Comment.objects.count(),
        "notifications": Notification.objects.count(),
        "reactions": Reaction.objects.count(),
    }
    return Response(data)










