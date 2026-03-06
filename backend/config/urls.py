from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("air.auth_urls")),
    path('api/v1/', include('air.urls')),
]