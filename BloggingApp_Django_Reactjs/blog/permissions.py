
# from rest_framework.permissions import BasePermission

# class IsAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Admin'

# class IsEditor(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role in ['editor', 'admin']


from rest_framework.permissions import BasePermission, SAFE_METHODS

# ===============================================================
#  CUSTOM PERMISSIONS FOR BLOG MANAGEMENT SYSTEM
# ===============================================================
# Roles supported: Admin, Editor, Author, Reader
# ===============================================================


class IsAdmin(BasePermission):
    """
     Allows access only to Admin users.
    Used for:
    - Admin Dashboard
    - User Role Management
    - Blog Approval
    - Site Statistics
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            getattr(request.user, 'role', '').lower() == 'admin'
        )


class IsEditor(BasePermission):
    """
     Allows access to Editors and Admins.
    Used for:
    - Blog approval and flagging
    - Content moderation
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            getattr(request.user, 'role', '').lower() in ['editor', 'admin']
        )


class IsAdminOrOwner(BasePermission):
    """
     Allows full access to Admins and object owners.
    Used for:
    - Blog update/delete
    - Profile update
    - Comment deletion (if owner)
    """
    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', '').lower()
        return (
            request.user.is_authenticated and (
                user_role == 'admin' or 
                getattr(obj, 'author', None) == request.user
            )
        )


class IsAuthenticatedOrReadOnly(BasePermission):
    """
     Read-only access for unauthenticated users.
       Full access for logged-in users.
    Used for:
    - Blogs
    - Comments
    - Reactions
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated


class IsAnyAuthenticatedRole(BasePermission):
    """
     Allows access to ANY logged-in user (Admin, Editor, Author, Reader).
    Used for:
    - Allowing all roles to manage via Admin Dashboard if needed.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated
