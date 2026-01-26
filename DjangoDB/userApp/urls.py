from django.urls import path
from . import views

urlpatterns = [
    path('customer/user/login', views.customerUserLogin), 
    path('auth/user/', views.auth_user),
    path('users/create/',views.add_user),
    path('users/list/', views.get_users),
    path("users/update/<int:pk>/", views.user_update),
    path("users/delete/<int:pk>/", views.user_delete),

    path("reviews/submit/", views.submit_review),
    path("reviews/product/<int:product_id>/", views.product_reviews),

    path("admin/reviews/", views.admin_reviews),
    path("admin/reviews/<int:id>/status/",views.update_review_status),

    path('contact/', views.mail_data),
]
