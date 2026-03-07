import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG') == 'True'
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# 1. ADD YOUR APPS AND LIBRARIES
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Local DonorLink apps
    'users',
    'blood',
    'camps',
]

# 2. ADD CORS MIDDLEWARE (Must be high in the list)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # <--- REQUIRED FOR REACT
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# 3. CONFIGURE POSTGRESQL DATABASE (Using Neon URL)
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# 4. SET THE CUSTOM USER MODEL
AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 5. CONFIGURE REACT COMMUNICATION (CORS)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Default Vite React port
]

# 6. CONFIGURE JWT FOR SECURE LOGIN
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'USER_ID_FIELD': 'email',
    'USER_ID_CLAIM': 'email',
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

import logging
import sqlparse

class PrettySQLFormatter(logging.Formatter):
    def format(self, record):
        sql = record.getMessage()
        
        # 1. Ignore annoying background Django queries (noise reduction)
        if 'django_session' in sql or 'SAVEPOINT' in sql or 'django_admin' in sql:
            return ""
            
        # 2. Make the SQL beautiful and indented
        formatted_sql = sqlparse.format(sql, reindent=True, keyword_case='upper')
        
        # 3. Print with dashed lines and Cyan color for easy reading!
        return f"\n{'-'*60}\n\033[96m{formatted_sql}\033[0m\n{'-'*60}\n"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_true': {'()': 'django.utils.log.RequireDebugTrue'}
    },
    'formatters': {
        'pretty_sql': {'()': PrettySQLFormatter}
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'pretty_sql',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        }
    }
}