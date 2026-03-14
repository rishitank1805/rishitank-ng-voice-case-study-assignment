from django.urls import path

from .views import health, submissions

urlpatterns = [
    path("health", health),
    path("health/", health),
    path("submissions", submissions),
    path("submissions/", submissions),
]
