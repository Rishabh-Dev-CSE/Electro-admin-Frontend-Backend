from django.urls import path
from . import views

urlpatterns = [
    path("token/refresh/", views.refresh_token_view),
    path("login/", views.loginUser),
    path("signup/", views.signupUser),

    path('categories/', views.categories),
    path("add/category/", views.add_category),
    path('subcategories/', views.add_subcategory),
    path('add/subcategories/', views.add_subcategory),

    path("category/delete/<int:pk>/", views.delete_category),
    path("subcategory/delete/<int:pk>/", views.delete_subcategory),

    path("products/", views.products_list),
    path("products/add/", views.add_product),
    path("products/<int:pk>/", views.product_detail),
    path("products/delete/<int:pk>/", views.delete_product),
   
    path("orders/create/", views.create_order),
    path("orders/", views.admin_orders),
    path("orders/<int:id>/", views.admin_order_detail),
    path("orders/<int:id>/status/", views.update_order_status),
    path("orders/<int:id>/parcel-label/", views.download_parcel_label),

    path("dashboard/overview/", views.dashboard_overview),
    path("reports/accounting/dashboard/", views.accounting_dashboard),
    path("reports/accounting/export-csv/", views.accounting_export_csv),
    path("reports/accounting/export-pdf/", views.accounting_export_pdf),
    path("reports/orders/dashboard/", views.orders_dashboard),
    path("reports/orders/export-csv/", views.orders_export_csv),
    path("reports/orders/export-pdf/", views.orders_export_pdf),

]