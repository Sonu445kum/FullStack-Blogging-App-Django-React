# from pathlib import Path
# import os
# from datetime import timedelta
# from decouple import config
# from corsheaders.defaults import default_headers  # for CORS headers
# from decouple import config


# # Base dir
# BASE_DIR = Path(__file__).resolve().parent.parent

# # Security
# SECRET_KEY = config('SECRET_KEY')
# DEBUG = config('DEBUG', cast=bool)
# ALLOWED_HOSTS = ['*']  # Update in production

# # Applications
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'rest_framework',
#     'corsheaders',
#     'channels',
#     'taggit',
#     'django_otp',
#     'django_otp.plugins.otp_email',
#     'django_otp.plugins.otp_static',
#     'two_factor',
#     'django.contrib.sites',
#     'allauth',
#     'allauth.account',
#     'allauth.socialaccount',
#     'allauth.socialaccount.providers.google',
#     'allauth.socialaccount.providers.facebook',
#     'allauth.socialaccount.providers.github',
#     'django_ckeditor_5',
#     'blog',

# ]

# SITE_ID = 1

# # Middleware
# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',  #  must be top
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'allauth.account.middleware.AccountMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'blog.middleware.UserActivityMiddleware',  #  Add this line
# ]




# # URLs
# ROOT_URLCONF = 'blog_project.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [os.path.join(BASE_DIR, 'templates')],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'blog_project.wsgi.application'
# ASGI_APPLICATION = "blog_project.asgi.application"
# FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")
# # Optional
# SITE_URL = FRONTEND_URL


# # # Channels (WebSocket Layer Config)
# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels_redis.core.RedisChannelLayer",
#         "CONFIG": {
#             "hosts": [
#                 (config("REDIS_HOST", default="127.0.0.1"), config("REDIS_PORT", cast=int, default=6379))
#             ],
#         },
#     },
# }

# # CHANNEL_LAYERS = {
# #     "default": {
# #         "BACKEND": "channels_redis.core.RedisChannelLayer",
# #         "CONFIG": {
# #             "hosts": [("127.0.0.1", 6379)],
# #         },
# #     },
# # }

# # Database
# DATABASES = {
#     'default': {
#         'ENGINE':'django.db.backends.mysql',
#         'NAME': config('DB_NAME'),
#         'USER': config('DB_USER'),
#         'PASSWORD': config('DB_PASSWORD'),
#         'HOST': config('DB_HOST'),
#         'PORT': config('DB_PORT', cast=int),
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
#         },
#     }
# }

# # Password Validators
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
# ]

# # Custom user model
# AUTH_USER_MODEL = 'blog.CustomUser'

# # Internationalization
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # Static & Media
# STATIC_URL = '/static/'
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # DRF + JWT
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
#     ),
#     'DEFAULT_PAGINATION_CLASS': 'blog.pagination.BlogPagination',
#     'PAGE_SIZE': 9,
# }


# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
# }

# # Email
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = config('EMAIL_HOST')
# EMAIL_PORT = config('EMAIL_PORT', cast=int)
# EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool)
# EMAIL_HOST_USER = config('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
# DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')

# # Authentication Backends
# AUTHENTICATION_BACKENDS = [
#     'django.contrib.auth.backends.ModelBackend',
#     'allauth.account.auth_backends.AuthenticationBackend',
# ]

# # allauth settings
# ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
# ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
# LOGIN_REDIRECT_URL = '/'
# LOGOUT_REDIRECT_URL = '/'

# # CKEditor & warnings ignore
# import warnings
# warnings.filterwarnings("ignore", category=UserWarning, message=".*CKEditor 4.*")
# warnings.filterwarnings("ignore", category=UserWarning, message=".*MySQL does not support unique constraints with conditions.*")

# # -------------------- CORS Config --------------------
# # Allow frontend React/Vite to access backend
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",  # React dev server
# ]
# CORS_ALLOW_CREDENTIALS = True



# # Allow Authorization header (JWT)
# CORS_ALLOW_HEADERS = list(default_headers) + [
#     "Authorization",
# ]
# PASSWORD_RESET_TIMEOUT = 60 * 60 * 24 * 3  # 3 days

# # Optional: if you want to allow all origins in dev
# # CORS_ALLOW_ALL_ORIGINS = True
# APPEND_SLASH = True


# new code
from pathlib import Path
import os
from datetime import timedelta
from decouple import config
from corsheaders.defaults import default_headers
import dj_database_url
import warnings

# ===============================
# Base Directory
# ===============================
BASE_DIR = Path(__file__).resolve().parent.parent

# ===============================
# Security
# ===============================
SECRET_KEY = config("SECRET_KEY")

DEBUG = config('DEBUG', cast=bool, default=False)

ALLOWED_HOSTS = [
    "fullstack-blogging-app-django-react.onrender.com",
    "localhost",
    "127.0.0.1",
]

# ===============================
# Applications
# ===============================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "channels",
    "taggit",
    "django_otp",
    "django_otp.plugins.otp_email",
    "django_otp.plugins.otp_static",
    "two_factor",
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.facebook",
    "allauth.socialaccount.providers.github",
    "django_ckeditor_5",
    "blog",
]

SITE_ID = 1

# ===============================
# Middleware
# ===============================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "blog.middleware.UserActivityMiddleware",
]

# ===============================
# URLs
# ===============================
ROOT_URLCONF = "blog_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "blog_project.wsgi.application"
ASGI_APPLICATION = "blog_project.asgi.application"

# ===============================
# Database (Render PostgreSQL)
# ===============================
DATABASES = {
    "default": dj_database_url.config(
        default=config("DATABASE_URL")
    )
}

# ===============================
# Channels (WebSocket)
# ===============================
if DEBUG:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [
                    (
                        config("REDIS_HOST", default="127.0.0.1"),
                        config("REDIS_PORT", default=6379, cast=int),
                    )
                ],
            },
        },
    }
else:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        },
    }

# ===============================
# Custom User
# ===============================
AUTH_USER_MODEL = "blog.CustomUser"

# ===============================
# Internationalization
# ===============================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ===============================
# Static & Media
# ===============================
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ===============================
# DRF + JWT
# ===============================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "blog.pagination.BlogPagination",
    "PAGE_SIZE": 9,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# ===============================
# Email
# ===============================
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default="")

# ===============================
# Authentication
# ===============================
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# ===============================
# CORS
# ===============================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://fullstack-blogging-app-frontend.onrender.com",  # <-- frontend URL
]
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "Authorization",
]

# ===============================
# Misc
# ===============================
PASSWORD_RESET_TIMEOUT = 60 * 60 * 24 * 3
APPEND_SLASH = True

warnings.filterwarnings("ignore", category=UserWarning)