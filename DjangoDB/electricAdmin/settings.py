from pathlib import Path
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-h!=aksdg)+aqfy(ze45a^3ykmr+&p@nwli6up%42u+ly*yc7@s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# =======================
# CORS CONFIG (FINAL)
# =======================

CORS_ALLOW_CREDENTIALS = False  # JWT use ho raha hai

CORS_ALLOWED_ORIGINS = [
    "https://arthkarya.netlify.app",
    "http://localhost:5173",
    "https://electro-admin-frontend-backend.onrender.com",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
]
CSRF_TRUSTED_ORIGINS = [
    "https://arthkarya.netlify.app",
    "https://electro-admin-frontend-backend.onrender.com",
    "http://localhost:5173",
]



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'electricApp',
    'userApp',
    'clientSide',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # 'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'electricAdmin.urls'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


AUTH_USER_MODEL = "electricApp.CustomUser"

ALLOWED_HOSTS = [
    "lab.arthkarya.com",
    "www.lab.arthkarya.com",
    "127.0.0.1",
    "localhost",
    "localhost:5173",
    "arthkarya.netlify.app",
    "electro-admin-frontend-backend.onrender.com" #testing for 
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'electricAdmin.wsgi.application'
ASGI_APPLICATION = 'electricAdmin.asgi.application'

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

LOGIN_URL = 'loginuser'

# =======================
# STATIC FILES (CSS, JS)
# =======================
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",   # project-level static folder
]
STATIC_ROOT = BASE_DIR / "staticfiles"  # for production collectstatic
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# =======================
# MEDIA FILES (Uploads)
# =======================
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# Simple JWT Tocken
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=3),
    'REFRESH_TOKEN_LIFETIME':timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ROTATE_REFRESH_TOKENS':True,
    'BLACKLIST_AFTER_ROTATION':True,
}


EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = "designeasyeda@gmail.com"
EMAIL_HOST_PASSWORD = "wzbv axtw khyq gxyz"  

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
ADMIN_EMAIL = "arthKarya@gmail.com"


AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend', 
]

# api secret key
INTERNAL_SECRET_VALUE = "ejw1 rju@ kGf& &%we"
COOKIE_NAME_KEY = "cookies-client"


