from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/blood/', include('blood.urls')),
    path('api/camps/', include('camps.urls')),
]