from django.urls import path
from electricApp.views import *
from userApp.views import *

# client side API's POST AND GET (get auth form userApp ulrs)

urlpatterns = [
        # ------ all  GET API key-------------
        path('get/categories/', categories),
        path('get/subcategories/', add_subcategory), # add and get api function are same 
        path('get/brands/', get_brands),
        path('get/product-list/', products_list),
        path('get/product-details/<int:id>/', product_detail),
        path('get/product-reviews/', client_reviews),
        path("get/wishlist/", wishlist_items),
        path("get/cart/", cart_items),
        path("get/orders/", client_order_detail),

        # --------------- POST and PUT and DELETE API---------------------------
        path("wishlist/remove/<int:wishlist_id>/", remove_from_wishlist), #DELETE
        path("cart/update/<int:cart_id>/", update_cart_qty),
        path("cart/remove/<int:cart_id>/", remove_from_cart),

        path("wishlist/add/", add_to_wishlist),
        path("cart/add/", add_to_cart),
        path("reviews/submit/", submit_review), #client side api
        path("create/order/", create_order),# create order
        path('contact/', mail_data), #send email admin   
]
