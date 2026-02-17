# from django.urls import path
# from . import views

# urlpatterns = [
#     # ---------------- Auth
#     path('auth/register/', views.register_view, name='register'),
#     path('auth/login/', views.login_view, name='login'),
#     path('auth/current-user/', views.current_user_view,  name='current-user'),
#     path('auth/verify-email/', views.verify_email, name='verify-email'),
#     path('auth/request-password-reset/', views.request_password_reset, name='request-password-reset'),
#     path('auth/reset-password/', views.reset_password, name='reset-password'),
#     path('auth/change-password/', views.change_password, name='change-password'),

#     # Profile And Activity
#     path('profile/', views.profile, name='profile'),
#     path('profile/update/', views.profile_update_view, name='profile-update'),

#     # Contact
#     path('contact/', views.contact_view, name='contact'),

#     # ---------------- Blogs CRUD
#     path('blogs/', views.blog_list_view, name='blog-list'),
#     path('blogs/trending/', views.trending_blogs_view, name='trending-blogs'),
#     path('blogs/<int:pk>/', views.blog_detail_view, name='blog-detail'),
#     path('blogs/create/', views.blog_create_view, name='blog-create'),
#     path('blogs/<int:pk>/update/', views.blog_update_view, name='blog-update'),
#     path('blogs/<int:pk>/delete/', views.blog_delete_view, name='blog-delete'),
#     path('blogs/drafts/', views.draft_blogs_view, name='draft-blogs'),
#     path('blogs/<int:pk>/add-to-blog/', views.add_to_blog_view, name='add-to-blog'),

#     # Blog media upload
#     path('blogs/media/upload/', views.blog_media_upload_view, name='blog-media-upload'),

#     # ---------------- Categories
#     path('categories/', views.category_list_view, name='category-list'),
#     path('categories/create/', views.category_create_view, name='category-create'),
#     path('categories/<int:pk>/update-delete/', views.category_update_delete_view, name='category-update-delete'),

#     # ---------------- Comments
#     path('blogs/<int:blog_id>/comments/', views.comment_list_view, name='comment-list'),
#     path('blogs/<int:blog_id>/comments/add/', views.add_comment, name='add-comment'),
#     path('comments/<int:pk>/delete/', views.comment_delete_view, name='comment-delete'),

#     # ---------------- Reactions
#     path('blogs/<int:blog_id>/reactions/toggle/', views.toggle_reaction, name='toggle-reaction'),
#     path('blogs/<int:blog_id>/reactions/', views.reaction_list_view, name='reaction-list'),

#     # ---------------- Bookmarks
#     path('blogs/<int:blog_id>/bookmark/', views.toggle_bookmark, name='toggle-bookmark'),
#     path('user/bookmarks/', views.user_bookmarks, name='user-bookmarks'),

#     # ---------------- Notifications
#     path('user/notifications/', views.user_notifications_view, name='user-notifications'),
#     path('notifications/<int:pk>/mark-read/', views.mark_notification_read_view, name='notification-mark-read'),
#     path('notifications/mark-all-read/', views.mark_all_notifications_read_view, name='notification-mark-all-read'),
#     path('notifications/<int:pk>/delete/', views.delete_notification_view, name='notification-delete'),

#     # ---------------- Admin Dashboard
#     path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
#     path('admin/users/', views.all_users, name='all-users'),
#     path('admin/users/<int:user_id>/update-role/', views.update_user_role, name='update-user-role'),
#     path('admin/most-active-users/', views.most_active_users, name='most-active-users'),
#     path('admin/trending-blogs/', views.trending_blogs_admin, name='trending-blogs-admin'),

#     # ---------------- Blog Approval / Flag
#     path('blogs/<int:blog_id>/approve/', views.approve_blog, name='approve-blog'),
#     path('blogs/<int:blog_id>/flag/', views.flag_blog, name='flag-blog'),

#     # ---------------- Stats
#     path('stats/', views.stats_view, name='stats'),
# ]


# new urls.py

# urls.py
from django.urls import path
from django.urls import re_path
from . import views

urlpatterns = [
    # ---------------- Auth
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/current-user/', views.current_user_view,  name='current-user'),
    path('auth/verify-email/', views.verify_email, name='verify-email'),
    path('auth/request-password-reset/',
         views.request_password_reset, name='request-password-reset'),
    path('auth/reset-password/', views.reset_password, name='reset-password'),
    path('auth/change-password/', views.change_password, name='change-password'),

    # Profile And Activity
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.profile_update_view, name='profile-update'),

    # Contact
    path('contact/', views.contact_view, name='contact'),

    # ---------------- Blogs CRUD
    path('blogs/', views.blog_list_view, name='blog-list'),
    path('blogs/trending/', views.trending_blogs_view, name='trending-blogs'),
    path('blogs/<int:pk>/', views.blog_detail_view, name='blog-detail'),
    path('blogs/create/', views.blog_create_view, name='blog-create'),
    path('blogs/<int:pk>/update/', views.blog_update_view, name='blog-update'),
    path('blogs/<int:pk>/delete/', views.blog_delete_view, name='blog-delete'),
    path('blogs/drafts/', views.draft_blogs_view, name='draft-blogs'),
    path('blogs/<int:pk>/add-to-blog/',
         views.add_to_blog_view, name='add-to-blog'),


    # MyBlogs
    path("blogs/myblogs/", views.my_blogs_list_view, name="myblogs-list"),
    path("blogs/myblogs/<int:pk>/update/",
         views.myblogs_update_blog_view, name="blog-update"),
    path("blogs/myblogs/<int:pk>/delete/",
         views.myblogs_delete_blog_view, name="blog-delete"),

    # Blog media upload
    path('blogs/media/upload/', views.blog_media_upload_view,
         name='blog-media-upload'),

    # ---------------- Categories
    path('categories/', views.category_list_view, name='category-list'),
    path('categories/create/', views.category_create_view, name='category-create'),
    path('categories/<int:pk>/update-delete/',
         views.category_update_delete_view, name='category-update-delete'),

    # ---------------- Comments
    path('blogs/<int:blog_id>/comments/',
         views.comment_list_view, name='comment-list'),
    path('blogs/<int:blog_id>/comments/add/',
         views.add_comment, name='add-comment'),
    path('comments/<int:pk>/delete/',
         views.comment_delete_view, name='comment-delete'),

    # ---------------- Reactions
    path('blogs/<int:blog_id>/reactions/toggle/',
         views.toggle_reaction_view, name='toggle-reaction'),
    
    path('blogs/<int:blog_id>/reactions/',
         views.reaction_list_view, name='reaction-list'),

    # ---------------- Bookmarks
    path('blogs/<int:blog_id>/bookmark/',
         views.toggle_bookmark, name='toggle-bookmark'),
    path('user/bookmarks/', views.user_bookmarks, name='user-bookmarks'),

    # ---------------- Notifications
    path('user/notifications/', views.user_notifications_view,
         name='user-notifications'),
    path('notifications/<int:pk>/mark-read/',
         views.mark_notification_read_view, name='notification-mark-read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read_view,
         name='notification-mark-all-read'),
    path('notifications/<int:pk>/delete/',
         views.delete_notification_view, name='notification-delete'),

    # ---------------- Admin Dashboard
    path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
    path('admin/users/', views.all_users, name='all-users'),
    path('admin/users/<int:user_id>/update-user-role/',
         views.update_user_role, name='update-user-role'),
    path('admin/most-active-users/',
         views.most_active_users, name='most-active-users'),
    path('admin/trending-blogs/', views.trending_blogs_admin,
         name='trending-blogs-admin'),


     path("admin/blogs/", views.admin_blog_list_view, name="admin-blog-list"),

    # ---------------- Blog Approval / Flag
    path('blogs/<int:blog_id>/approve/',
         views.approve_blog, name='approve-blog'),
    path('blogs/<int:blog_id>/flag/', views.flag_blog, name='flag-blog'),

    # ---------------- Stats
    path('stats/', views.stats_view, name='stats'),

    # ---------------- Tags Suggestions
    path('tags/suggestions/', views.tag_suggestions, name='tag-suggestions'),

    # ---------------- Top Blogs
    path('blogs/top/', views.top_blogs_api, name='top-blogs'),

    # ---------------- Admin Comments Management
    path('admin/comments/', views.get_all_comments_view, name='admin-comments'),
    path('admin/comments/<int:pk>/approve/',
         views.approve_comment_view, name='approve-comment'),
    #  Delete comment (admin or comment owner)
    path('comments/<int:pk>/delete/',
         views.comment_delete_view, name='delete_comment'),



    #  Notifications
    # List all notifications
    path('admin/notifications/', views.get_admin_notifications,
         name='get_admin_notifications'),
    path('admin/notifications/<int:pk>/mark-read/',
         views.mark_notification_read, name='mark_notification_read'),
    path('admin/notifications/<int:pk>/',
         views.delete_notification, name='delete_notification'),


    # Reactions
    # List all reactions
    path('api/admin/reactions/', views.reactions_list, name='admin-reactions'),

    # Delete a reaction by ID
    path('api/admin/reactions/<int:pk>/delete/',
         views.reaction_delete, name='delete-reaction'),

    # Dashboard stats endpoint (admin only)
    path('api/admin/dashboard-stats/',
         views.dashboard_stats, name='dashboard-stats'),

    # Delete User
    path("api/users/<int:pk>/delete/", views.delete_user, name="delete_user"),
    path("users/<int:pk>/delete/", views.delete_user, name="delete_user"),
    path('users/<int:user_id>/update-role/', views.update_user_role, name='update_user_role'),

    path('users/<int:pk>/update/', views.update_user, name='update-user'),

    # Add new user by admin
    path("users/add/", views.add_user, name="add-user"),

    path('admin/blogs/<int:pk>/update/',
         views.update_blog_admin, name='update_blog'),
    path('admin/blogs/<int:pk>/delete/',
         views.delete_blog_admin, name='delete_blog'),


    # stats
    path("stats/", views.stats, name="stats"),


]
