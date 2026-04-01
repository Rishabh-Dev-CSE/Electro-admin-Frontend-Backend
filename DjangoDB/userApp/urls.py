from django.urls import path
from . import views

urlpatterns = [
    path('customer/login/', views.customerUserLogin), #user login
    path('auth/user/', views.auth_user),# GET DATA autherized user
    path('users/create/',views.add_user),#Admin side api
    path('users/list/', views.get_users), # Admin side api
    path("users/update/<int:pk>/", views.user_update),
    path("users/delete/<int:pk>/", views.user_delete),
    
    path('logout/', views.logoutUser, name='logout'),  # Add this line
]
