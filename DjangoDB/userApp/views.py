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

# Create your views here.
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
            "image": "http://localhost:8000"+user.image.url if user.image else None,
            "role": user.role,
            "is_active": user.is_active
        })

    return Response({
        "status": True,
        "count": users.count(),
        "users": data
    })


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

# ==================Reviews=======================

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_reviews(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    reviews = ProductReview.objects.select_related("product", "user")

    data = [{
        "id": r.id,
        "product": r.product.name,
        "user": r.user.username,
        "rating": r.rating,
        "comment": r.comment,
        "status": r.status
    } for r in reviews]

    return Response({"data": data})


@api_view(["GET"])
def product_reviews(request, product_id):
    reviews = ProductReview.objects.filter(
        product_id=product_id,
        status="approved"
    ).select_related("user")

    data = [{
        "user": r.user.username,
        "rating": r.rating,
        "comment": r.comment,
        "date": r.created_at.strftime("%d %b %Y")
    } for r in reviews]

    return Response({
        "count": len(data),
        "reviews": data
    })

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

from smtplib import SMTPException


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