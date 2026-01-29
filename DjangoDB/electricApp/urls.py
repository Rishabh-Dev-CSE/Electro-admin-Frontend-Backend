from django.urls import path
from . import views
from userApp.views import *

#  Admin site API'S GET and POST
urlpatterns = [
    path("secret/init/", views.set_internal_cookie), # GET DATA
    path("token/refresh/", views.refresh_token_view),
    path("login/", views.loginUser),
    path("signup/", views.signupUser),

    path('categories/', views.categories),# GET DATA
    path("add/category/", views.add_category),
    path('subcategories/', views.add_subcategory), # GET DATA 
    path('add/subcategories/', views.add_subcategory), 
    path('add/brand/', views.add_brands),
    path('brands/', views.get_brands),# GET DATA

    path("category/delete/<int:pk>/", views.delete_category),
    path("subcategory/delete/<int:pk>/", views.delete_subcategory),
    path('delete/brand/<int:pk>/', views.delete_brand),

    path("products/", views.products_list),# GET DATA
    path("products/add/", views.add_product),
    path("products/<int:pk>/", views.product_detail),
    path("products/update/<int:pk>/", views.product_update),
    path("products/delete/<int:pk>/", views.delete_product), 
   
 
    path("orders/", views.admin_orders),# GET DATA
    path("orders/<int:id>/status/", views.update_order_status),
    path("orders/<int:id>/parcel-label/", views.download_parcel_label),

    path("admin/reviews/", admin_reviews),
    path("admin/reviews/<int:id>/status/", update_review_status),
 

    path("dashboard/overview/", views.dashboard_overview),
    path("reports/accounting/dashboard/", views.accounting_dashboard),
    path("reports/accounting/export-csv/", views.accounting_export_csv),
    path("reports/accounting/export-pdf/", views.accounting_export_pdf),
    path("reports/orders/dashboard/", views.orders_dashboard),
    path("reports/orders/export-csv/", views.orders_export_csv),
    path("reports/orders/export-pdf/", views.orders_export_pdf),

]