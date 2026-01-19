from django.urls import path
from . import views

urlpatterns = [
    path('auth/user/', views.auth_user),
    path('users/create/',views.add_user),
    path('users/list/', views.get_users),
    path("users/update/<int:pk>/", views.user_update),
    path("users/delete/<int:pk>/", views.user_delete),
]
