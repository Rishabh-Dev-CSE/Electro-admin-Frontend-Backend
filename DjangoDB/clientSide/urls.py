from django.urls import path
from electricApp.views import *
from userApp import views
from .views import categories, subcategories

# client side API's POST AND GET (get auth form userApp ulrs)

urlpatterns = [
        # ------ all  GET API key-------------
        path('get/categories/', categories),
        path('get/subcategories/', subcategories), # add and get api function are same 
        path('get/brands/', get_brands),
        path('get/product-list/', products_list),
        path('get/product-details/<int:id>/', product_detail),
        path('get/product-reviews/', views.client_reviews),
        path("get/wishlist/", views.wishlist_items),
        path("get/cart/", views.cart_items),
        path("get/orders/", client_order_detail),

        # --------------- POST and PUT and DELETE API---------------------------
        path("wishlist/remove/<int:wishlist_id>/", views.remove_from_wishlist), #DELETE
        path("cart/update/<int:cart_id>/", views.update_cart_qty),
        path("cart/remove/<int:cart_id>/", views.remove_from_cart),

        path("wishlist/add/", views.add_to_wishlist),
        path("cart/add/", views.add_to_cart),
        path("reviews/submit/", views.submit_review), #client side api
        path("create/order/", create_order),# create order
        path('contact/', views.mail_data), #send email admin   
]
