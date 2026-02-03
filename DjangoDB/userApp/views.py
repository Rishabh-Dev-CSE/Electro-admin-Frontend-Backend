from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework import status
import json
import random
from django.utils.text import slugify
from electricApp.models import *
from django.conf import settings
from django.core.mail import send_mail
from smtplib import SMTPException

# =============== HERE IS CODE SEQUENCE ===============

# AUTH / LOGIN
# customerUserLogin        → Customer login (JWT + refresh cookie)
# auth_user                → Get authenticated user (admin / client)

# USER MANAGEMENT (ADMIN)
# add_user                 → Admin: create new user
# get_users                → Admin: list all users (except admin)
# user_update              → Admin: update user details
# user_delete              → Admin: delete user

# ===================== END USER SECTION =====================

# REVIEWS (PRODUCT)
# submit_review            → Client: submit product review (pending)
# admin_reviews             → Admin: view all reviews (approve / reject)
# client_reviews            → Client: view approved reviews only
# update_review_status      → Admin: update review status

# ===================== END REVIEWS =====================

# EMAIL / ENQUIRY
# mail_data                → Send enquiry email to admin

# ==========================================================


# login custmer ...........
@api_view(['POST'])
@permission_classes([AllowAny])
def customerUserLogin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    role = request.data.get("role")

    #  Basic validation
    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=400
        )

    if not role:
        return Response(
            {"error": "Role is required"},
            status=400
        )

    #  User existence check (SAFE)
    user = CustomUser.objects.filter(username=username).first()
    if not user:
        return Response(
            {"error": "Invalid username or password"},
            status=401
        )

    #  Active user check (IMPORTANT)
    if not user.is_active:
        return Response(
            {"error": "Your account is blocked. Contact support."},
            status=403
        )

    #  Authentication
    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {"error": "Invalid username or password"},
            status=401
        )

    #  Role validation (OPTIONAL but recommended)
    if hasattr(user, "role") and user.role != role:
        return Response(
            {"error": "Invalid role for this user"},
            status=403
        )

    # JWT Tokens
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = Response({
        "message": "Login successful",
        "access": access,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": getattr(user, "role", None),
            "is_staff": user.is_staff,
            "is_active": user.is_active
        }
    })

    # 7 Secure HttpOnly cookie (Refresh token)
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False,      
        samesite="Lax",
        max_age=7 * 24 * 60 * 60
    )

    return response

# get autherized admin and client side also........
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def auth_user(request):
    user = request.user
    return Response({
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "image": user.image.url if user.image else None,
            "is_active": user.is_active,
        }
    })

# add user admin site .............
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_user(request): 

    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    username = request.POST.get("username")
    email = request.POST.get("email")
    password = request.POST.get("password")
    role = request.POST.get("role", "customer")
    image = request.FILES.get("image")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if CustomUser.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = CustomUser(
        username=username,
        email=email,
        role=role
    )

    if image:
        user.image = image

    user.set_password(password)
    user.save()

    return Response({"status": True, "message": "User created"}, status=201)

# get all user and render to admin site..........
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    
    if request.user.role != 'admin':
        return Response(
            {"error": "You are not authorized"},
            status=403
        )

   #exclude admin role users 
    users = CustomUser.objects.exclude(role='admin')

    data = []
    for user in users: 
        print(user.image)
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "image": "https://www.lab.arthkarya.com"+user.image.url if user.image else None,
            "role": user.role,
            "is_active": user.is_active
        })

    return Response({
        "status": True,
        "count": users.count(),
        "users": data
    })

# update user .........
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def user_update(request, pk):

    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    data = request.data  # ✅ PUT + FormData ke liye mandatory

    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)

    # ✅ FIX: is_active update
    if "is_active" in data:
        user.is_active = data.get("is_active") in ["1", "true", "True", True]

    password = data.get("password")
    if password:
        user.set_password(password)

    image = data.get("image")
    if image:
        user.image = image

    user.save()
    return Response({
        "status": True,
        "message": "User updated successfully"
    })

# delete user .......
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def user_delete(request, pk):

    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    user.delete()
    return Response({"status": True, "message": "User deleted"})

# =====================End here===================

# ==================Reviews=======================

# create from client side reviews 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_review(request):
    product_id = request.data.get("product")
    rating = request.data.get("rating")
    comment = request.data.get("comment")

    if not rating or not comment:
        return Response({"error": "Rating & comment required"}, status=400)

    ProductReview.objects.create(
        product_id=product_id,
        user=request.user,
        rating=rating,
        comment=comment,
        status="pending"
    )

    return Response({
        "message": "Review submitted, waiting for approval"
    })

# get all product reviews to admin site for (aproved and reject) 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_reviews(request):
    is_admin = (
        request.user.is_authenticated
        and getattr(request.user, "role", None) == "admin"
    )

    has_internal_cookie = (
        request.COOKIES.get(settings.COOKIE_NAME_KEY)
        == settings.INTERNAL_SECRET_VALUE
    )

    if not (is_admin or has_internal_cookie):
        return Response(
            {"error": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN
        )

    reviews = ProductReview.objects.select_related(
        "product", "user"
    ).order_by("-created_at")

    data = [{
        "id": r.id,
        "product_id": r.product.id,
        "product": r.product.name,
        "user": r.user.username if r.user else "Guest",
        "rating": r.rating,
        "comment": r.comment,
        "status": r.status,
        "date": r.created_at.strftime("%d %b %Y")
    } for r in reviews]

    return Response({
        "count": len(data),
        "reviews": data
    })

# get all product and render to client side 
@api_view(["GET"])
@permission_classes([AllowAny])
def client_reviews(request):
    is_admin = (
            request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )

    has_internal_cookie = (
            request.COOKIES.get(settings.COOKIE_NAME_KEY)
            == settings.INTERNAL_SECRET_VALUE
        )

    if not (is_admin or has_internal_cookie):
            return Response(
                {"error": "Unauthorized"},
                status=status.HTTP_403_FORBIDDEN
            )
    reviews = ProductReview.objects.filter(
        status="approved"
    ).select_related("product", "user").order_by("-created_at")

    data = [{
        "id": r.id,
        "product_id": r.product.id,
        "product": r.product.name,
        "user": r.user.username if r.user else "Guest",
        "rating": r.rating,
        "comment": r.comment,
        "date": r.created_at.strftime("%d %b %Y")
    } for r in reviews]

    return Response({
        "count": len(data),
        "reviews": data
    })

# admin update product reviews status (pending to aproved and rejected)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_review_status(request, id):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    status_val = request.data.get("status")
    review = ProductReview.objects.get(id=id)
    review.status = status_val
    review.save()

    return Response({"message": "Review status updated"})

# ===============Reviews EDN ========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get("product_id")
    if not product_id:
        return Response({"error": "product_id required"}, status=400)

    product = get_object_or_404(Product, id=product_id)

    wishlist, created = WishList.objects.get_or_create(
        user=request.user,
        product=product,
    )

    if not created:
        return Response({"message": "Already in wishlist"})

    return Response({"message": "Added to wishlist"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wishlist_items(request):
    items = WishList.objects.filter(user=request.user).select_related("product")

    data = []
    for i in items:
        data.append({
            "id": i.id,
            "product_id": i.product.id,
            "name": i.product.name,
            "price": i.product.price,
            "image": i.product.image.url if i.product.image else None,
        })

    return Response({"data": data})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):
    qs = WishList.objects.filter(
        user=request.user,
        id = product_id
    )

    if not qs.exists():
        return Response(
            {"error": "Product not found in wishlist"},
            status=status.HTTP_404_NOT_FOUND
        )

    qs.delete()

    return Response(
        {"message": "Removed from wishlist"},
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    qty = int(request.data.get("quantity", 1))

    if qty < 1:
        return Response({"error": "Invalid quantity"}, status=400)

    product = get_object_or_404(Product, id=product_id)

    cart, created = Cart.objects.get_or_create(
        user=request.user,
        product=product
    )

    if not created:
        cart.quantity += qty
        cart.save()
    else:
        cart.quantity = qty
        cart.save()

    return Response({"message": "Added to cart"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_items(request):
    items = Cart.objects.filter(user=request.user).select_related("product")

    data = []
    total = 0

    for i in items:
        subtotal = i.quantity * i.product.price
        total += subtotal

        data.append({
            "id": i.id,
            "product_id": i.product.id,
            "name": i.product.name,
            "price": float(i.product.price),
            "quantity": i.quantity,
            "subtotal": float(subtotal),
            "image": i.product.image.url if i.product.image else None,
        })

    return Response({
        "items": data,
        "total": float(total)
    })

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_qty(request, cart_id):
    qty = int(request.data.get("quantity"))

    if qty < 1:
        return Response({"error": "Quantity must be >= 1"}, status=400)

    cart = get_object_or_404(
        Cart,
        user=request.user,
        id=cart_id
    )

    cart.quantity = qty
    cart.save()

    return Response({"message": "Quantity updated"})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cart_id):
    qs = Cart.objects.filter(
        user=request.user,
        id=cart_id
    )

    if not qs.exists():
        return Response(
            {"error": "Product not found in cart"},
            status=status.HTTP_404_NOT_FOUND
        )

    qs.delete()

    return Response(
        {"message": "Removed from cart"},
        status=status.HTTP_200_OK
    )

#==================== Send Email ====================
@api_view(['POST'])
@permission_classes([AllowAny])
def mail_data(request):
    # Required fields
    required_fields = ["name", "email", "mobile"]

    for field in required_fields:
        if not request.data.get(field):
            return Response(
                {"error": f"{field} is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Extract fields safely
    name = request.data.get("name", "")
    email = request.data.get("email", "")
    mobile = request.data.get("mobile", "")
    course = request.data.get("course_interestfor", "")
    degree = request.data.get("degree", "")
    specialization = request.data.get("specialization", "")
    yop = request.data.get("yop", "")
    marks = request.data.get("marks", "")
    college_state = request.data.get("college_state", "")
    college_name = request.data.get("college_name", "")
    location = request.data.get("trng_centre", "")
    enquiry = request.data.get("enquiry", "")

    # Email body (Plain Text)
    email_body = f"""
New Enquiry Received

Name: {name}
Email: {email}
Mobile: {mobile}

Course Applied: {course}
Degree: {degree}
Specialization: {specialization}
Year of Passing: {yop}
Marks: {marks}

College State: {college_state}
College Name: {college_name}
Preferred Location: {location}

Enquiry:
{enquiry}
    """

    try:
        send_mail(
            subject="New Enquiry Form Submission",
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],  # ✅ use real email
            fail_silently=False,
        )
    except SMTPException:
        return Response(
            {"error": "Email service unavailable"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    return Response(
        {"success": "Enquiry submitted successfully"},
        status=status.HTTP_200_OK
    )