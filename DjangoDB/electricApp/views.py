from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings 
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework import status
from reportlab.lib.pagesizes import A6,A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from django.http import HttpResponse
from reportlab.graphics.barcode import code128
from reportlab.lib.utils import ImageReader
import qrcode
import csv
import io
import json
import random
from django.utils.text import slugify
from datetime import timedelta
from django.db.models import Sum
from django.utils.timezone import now
from decimal import Decimal
from .models import *


# =============== HERE IS CODE SEQUENCE ===============
# AUTH & USER
# loginUser                → Admin login (JWT + refresh cookie)
# signupUser               → User registration
# refresh_token_view       → Access token refresh
# set_internal_cookie      → Internal cookie for client-side access
# get_users                → Admin: list all non-admin users

# CATEGORY / SUBCATEGORY / BRAND
# add_category             → Admin: add category
# categories               → Admin / internal client: list categories
# add_subcategory           → GET: list subcategory | POST: add subcategory
# delete_category           → Admin: delete category
# delete_subcategory        → Admin: delete subcategory
# add_brands                → Admin: add brand
# get_brands                → Admin / internal client: list brands
# delete_brand              → Admin: delete brand

# PRODUCTS
# add_product               → Admin: create product with images & specs
# products_list             → List all products
# product_detail            → Single product details
# product_update            → Admin: update product
# delete_product            → Admin: delete product

# ORDERS
# create_order              → Create new order
# admin_orders              → Admin: list all orders
# update_order_status       → Admin: update order status
# admin_order_detail        → Admin: order details
# download_parcel_label     → Generate parcel label PDF

# ACCOUNTING
# accounting_dashboard      → Sales & profit dashboard
# accounting_export_csv     → Export accounting CSV
# accounting_export_pdf     → Export accounting PDF

# ORDERS ANALYTICS
# orders_dashboard          → Orders KPIs & charts
# orders_export_csv         → Orders CSV export
# orders_export_pdf         → Orders PDF export

# MAIN DASHBOARD
# dashboard_overview        → Complete admin dashboard overview
# ================================================


@api_view(['POST'])
@permission_classes([AllowAny])
def loginUser(request):
    username = request.data.get("username")
    password = request.data.get("password")
    role = request.data.get('role')
    
    if not role:
        return Response({"error":"Role is missing "}, status=400)
    
    if role != 'admin':
        return Response({'error':"role argument error "}, status=401)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password, role=role)
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = Response({
        'message':"login successfully",
        "access": access,
        "user": {
            "id": user.id,
            "username": user.username,
            "is_staff": user.is_staff
        }
    })

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False,  # True on HTTPS
        samesite="Lax",
        path="/",
        max_age=7 * 24 * 60 * 60
    )

    return response

@api_view(["POST"])
@permission_classes([AllowAny])
def signupUser(request):
    
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Required fields missing"}, status=400)

    if CustomUser.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = CustomUser.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response({"message": "User created successfully"})

# ---------- REFRESH ----------
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return Response({"error": "No refresh token"}, status=401)

    try:
        token = RefreshToken(refresh_token)
        return Response({"access": str(token.access_token)})
    except Exception:
        return Response({"error": "Invalid refresh token"}, status=401)

@api_view(["GET"])
@permission_classes([AllowAny])
def set_internal_cookie(request):
    response = Response({"message": "cookie set"})

    response.set_cookie(
        key=settings.COOKIE_NAME_KEY,
        value=settings.INTERNAL_SECRET_VALUE,
        httponly=True,     # JS se hidden
        secure=not settings.DEBUG,   # LOCAL: False | PROD: True
        samesite="Lax", 
        # secure=True,       # HTTPS only
        # samesite="Strict", # external sites blocked
        max_age=60 * 60 * 24  # 1 day
    )

    return response

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
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        })

    return Response({
        "status": True,
        "count": users.count(),
        "users": data
    })

# ---------- CATEGORY ----------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_category(request):
    name = request.data.get("name")
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not name:
        return Response(
            {"error": "Name required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    Category.objects.create(name=name)
    return Response({"message": f"{name} Category added"})
 
@api_view(["GET"])
@permission_classes([AllowAny])
def categories(request):

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

    data = []
    for cat in Category.objects.all():
        data.append({
            "id": cat.id,
            "name": cat.name,
        })

    return Response({"data": data})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def add_subcategory(request):
    
    # ---------- GET : list subcategories ----------
    if request.method == 'GET':
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

        data = []
        for sub in Subcategory.objects.select_related('category').all():
            data.append({
                "id": sub.id,
                "name": sub.name,
                "category": {
                    "id": sub.category.id,
                    "name": sub.category.name
                }
            })
        return Response({'data':data})


    # ---------- POST : add subcategory ----------
    if request.method == 'POST':
        if request.user.role != "admin":
          return Response(
            {"error": " Admin allow Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

        name = request.data.get('name')
        category_id = request.data.get('category')

        if not name:
            return Response(
                {'error': 'Subcategory name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not category_id:
            return Response(
                {'error': 'Category is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Invalid category'},
                status=status.HTTP_404_NOT_FOUND
            )

        Subcategory.objects.create(
            name=name,
            category=category
        )

        return Response(
            {'message': f'{name} subcategory added successfully'},
            status=status.HTTP_201_CREATED
        )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_category(request, pk):
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        Category.objects.get(id=pk).delete()
        return Response({"message": "Category deleted"})
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_subcategory(request, pk):
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        Subcategory.objects.get(id=pk).delete()
        return Response({"message": "SubCategory deleted"})
    except Subcategory.DoesNotExist:
        return Response({"error": "SubCategory not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_brands(request):
    # ---------- POST : add subcategory ----------
    if request.method == 'POST':
        if request.user.role != "admin":
          return Response(
            {"error": " Admin allow Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

        name = request.data.get('name')
        category_id = request.data.get('category')

        if not name:
            return Response(
                {'error': 'Brands name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not category_id:
            return Response(
                {'error': 'Category is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Invalid category'},
                status=status.HTTP_404_NOT_FOUND
            )

        Brand.objects.create(
            name=name,
            category=category
        )

        return Response(
            {'message': f'{name} brands added successfully'},
            status=status.HTTP_201_CREATED
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_brands(request):
       # ---------- GET : list subcategories ---------- 
    if request.method == 'GET':
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
        data = []
        for brd in Brand.objects.select_related('category').all():
            data.append({
                "id": brd.id,
                "name": brd.name,
                "category": {
                    "id": brd.category.id,
                    "name": brd.category.name
                }
            })
        return Response({'data':data})
    
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_brand(request, pk):
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        Brand.objects.get(id=pk).delete() 
        return Response({"message": "Brand deleted"})
    except Brand.DoesNotExist:
        return Response({"error": "Brand not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_product(request):
    if request.user.role != "admin":
        return Response(
            {"error": "Admin role required"},
            status=status.HTTP_403_FORBIDDEN
        )

    data = request.data
    images = request.FILES.getlist("images")

    try:
        # ---------- RELATIONS ----------
        category = Category.objects.get(id=data.get("category"))
        subcategory = Subcategory.objects.get(id=data.get("subcategory"))

        # ---------- SAFE VALUES ----------
        name = data.get("name")
        stock = int(data.get("stock", 0))
        price = float(data.get("price", 0))
        is_active = str(data.get("is_active")).lower() == "true"

        # ---------- PRODUCT ----------
        product = Product.objects.create(
            name=name,
            slug=slugify(name),
            sku=data.get("sku"),
            part_number=data.get("part_number"),
            category=category,
            subcategory=subcategory,
            price=price,
            stock=stock,
            is_in_stock=stock > 0,
            short_description=data.get("short_description", ""),
            description=data.get("description", ""),
            datasheet_url=data.get("datasheet_url", ""),
            is_active=is_active,
        )

        # ---------- SPECIFICATIONS ----------
        specs_raw = data.get("specifications")
        if specs_raw:
            specs = json.loads(specs_raw)
            for spec in specs:
                if spec.get("key") and spec.get("value"):
                    ProductSpecification.objects.create(
                        product=product,
                        key=spec.get("key"),
                        value=spec.get("value"),
                    )

        # ---------- IMAGES ----------
        for i, img in enumerate(images):
            if i == 0:
                product.image = img
                product.save(update_fields=["image"])

            ProductImage.objects.create(
                product=product,
                image=img,
                is_primary=(i == 0),
            )

        return Response(
            {
                "message": "Product created successfully",
                "product_id": product.id,
            },
            status=status.HTTP_201_CREATED,
        )

    except Category.DoesNotExist:
        return Response({"error": "Invalid category"}, status=400)

    except Subcategory.DoesNotExist:
        return Response({"error": "Invalid subcategory"}, status=400)

    except ValueError:
        return Response({"error": "Invalid price or stock"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def products_list(request):

    products = Product.objects.select_related("category").all().order_by("-id")
    data = []
    for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "stock": p.stock,
                "is_active": p.is_active,
                "category": {
                    "id": p.category.id,
                    "name": p.category.name
                },
                 "subcategory": {
                    "id": p.subcategory.id,
                    "name": p.subcategory.name
                },
                "image": p.image.url if p.image else None,
            })

    return Response({"data": data})

@api_view(["GET"])
def product_detail(request, id):
    product = get_object_or_404(Product, id=id)

    specs = [
        {"key": s.key, "value": s.value}
        for s in product.specifications.all()
    ]

    images = [
        {
            "id": img.id,
            "url": img.image.url,
            "is_primary": img.is_primary
        }
        for img in product.images.all()
    ]

    data = {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "sku":product.sku,
        "part_number": product.part_number,
        "is_active": product.is_active,
        "category": {
            "id": product.category.id,
            "name": product.category.name
        },
        "subcategory": {
            "id": product.subcategory.id,
            "name": product.subcategory.name
        },
        "description": product.description,
        "specifications": specs,
        "short_description":product.short_description,
        "datasheet_url": product.datasheet_url,
        "images": images,
    }

    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def product_update(request, pk):
    if request.user.role != "admin":
        return Response({"message": "Only admin can update"})
    
    name = request.data.get('name')
    price = request.data.get('price')
    stock = request.data.get('stock')
    status = request.data.get('is_active')

    product = Product.objects.get(id = pk)
    product.name = name
    product.price = price 
    product.stock = stock
    product.is_active = status
    product.save()
    return Response({'message':"product updated "})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.delete()

    return Response({"message": "Product deleted successfully"})

def generate_order_id():
    return f"ORD{random.randint(100000000, 9999999999)}"

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user

    customer_name = request.data.get("customer_name")
    customer_email = request.data.get("customer_email")
    contact_number = request.data.get('contact_number')
    payment_status = request.data.get("payment_status", "Pending")
    address = request.data.get("address", "-")
    items = request.data.get("items")

    # ---------- BASIC VALIDATION ----------
    if not customer_name:
        return Response(
            {"error": "Customer name is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not items or not isinstance(items, list):
        return Response(
            {"error": "Items must be a non-empty list"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------- MERGE SAME PRODUCT IDS ----------
    merged_items = {}
    for item in items:
        product_id = item.get("product_id")
        quantity = item.get("quantity")

        if not product_id or not quantity:
            return Response(
                {"error": "Each item must have product_id and quantity"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
            if quantity <= 0:
                raise ValueError
        except ValueError:
            return Response(
                {"error": "Quantity must be a positive number"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # merge quantity if same product_id
        merged_items[product_id] = merged_items.get(product_id, 0) + quantity

    total_amount = 0
    total_qty = 0
    order_items_data = []

    # ---------- VALIDATE PRODUCTS + STOCK ----------
    for product_id, quantity in merged_items.items():
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {"error": f"Product with id {product_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if product.stock < quantity:
            return Response(
                {"error": f"Insufficient stock for {product.name}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item_total = product.price * quantity
        total_amount += item_total
        total_qty += quantity

        order_items_data.append({
            "product": product,
            "price": product.price,
            "quantity": quantity
        })

    # ---------- CREATE ORDER ----------
    order = Order.objects.create(
        user=user,
        order_id=generate_order_id(),
        customer_name=customer_name,
        customer_email=customer_email,
        total_amount=total_amount,
        contact_number = contact_number,
        qty=total_qty,
        payment_status=payment_status,
        order_status="Pending",
        address=address
    )

    # ---------- CREATE ORDER ITEMS ----------
    for data in order_items_data:
        OrderItem.objects.create(
            order=order,
            product=data["product"],
            price=data["price"],
            quantity=data["quantity"]
        )

        # reduce stock
        product = data["product"]
        product.stock -= data["quantity"]
        product.save(update_fields=["stock"])

    return Response(
        {
            "message": "Order created successfully",
            "order_id": order.order_id,
            "total_amount": float(total_amount),
            "total_qty": total_qty
        },
        status=status.HTTP_201_CREATED
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_orders(request):
    if request.user.role != "admin":
        return Response(
            {"error": "Admin role required"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Prefetch items + products (PERFORMANCE FIX)
    orders = (
        Order.objects
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    data = []

    for o in orders:
        items_data = []
        total_qty = 0
        product_image = None

        for item in o.items.all():
            total_qty += item.quantity

            # first product image for preview
            if not product_image and item.product.image:
                product_image = request.build_absolute_uri(item.product.image.url)

            items_data.append({
                "product_id": item.product.id,
                "product_name": item.product.name,
                "price": float(item.price),
                "quantity": item.quantity,
                "image": (
                    request.build_absolute_uri(item.product.image.url)
                    if item.product.image else None
                )
            })

        data.append({
            "id": o.id,
            "order_id": o.order_id,

            "customer": o.customer_name,
            "customer_email": o.customer_email,
            "address": o.address,

            "total": float(o.total_amount),
            "total_qty": total_qty,

            "payment_status": o.payment_status,
            "status": o.order_status,

            "product_image": product_image,  # order thumbnail
            "date": o.created_at.strftime("%d %b %Y"),

            "items": items_data
        })

    return Response({
        "count": len(data),
        "data": data
    })

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_order_status(request, id):
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    status = request.data.get("status")
    order = Order.objects.get(id=id)
    order.order_status = status
    order.save()

    return Response({"message": "Order status updated"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def client_order_detail(request):
    orders = (
        Order.objects
        .filter(user=request.user)
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    data = []

    for order in orders:
        items = []
        for i in order.items.all():
            items.append({
                "product_id": i.product.id,
                "product": i.product.name,
                "price": float(i.price),
                "quantity": i.quantity,
                "image": (
                    request.build_absolute_uri(i.product.image.url)
                    if i.product.image else None
                )
            })

        data.append({
            "id": order.id,
            "order_id": order.order_id,
            "customer": order.customer_name,
            "email": order.customer_email,
            "total": float(order.total_amount),
            "payment": order.payment_status,
            "status": order.order_status,
            "created_at": order.created_at.strftime("%d %b %Y"),
            "items": items
        })

    return Response({
        "count": len(data),
        "data": data
    })

@api_view(["GET"])
@permission_classes([AllowAny])   # because PDF is public for now
def download_parcel_label(request, id):
    try:
        order = Order.objects.prefetch_related("items__product").get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = (
        f'attachment; filename="parcel_{order.order_id}.pdf"'
    )

    c = canvas.Canvas(response, pagesize=A6)
    width, height = A6

    x_margin = 6 * mm
    y = height - 10 * mm

    def text(txt, size=9, bold=False):
        nonlocal y
        font = "Helvetica-Bold" if bold else "Helvetica"
        c.setFont(font, size)
        c.drawString(x_margin, y, txt)
        y -= 4.5 * mm

    # ================= HEADER =================
    c.setFillColorRGB(0.1, 0.1, 0.1)
    c.rect(0, height - 18 * mm, width, 18 * mm, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width / 2, height - 12 * mm, "PARCEL SHIPPING LABEL")
    c.setFillColorRGB(0, 0, 0)

    y = height - 24 * mm

    # ================= DATA TO ENCODE =================
    # 👇 VERY IMPORTANT: URL so scanner shows data
    order_url = f"https://www.lab.arthkarya.com/admin/orders/{order.id}"

    # ================= BARCODE =================
    barcode = code128.Code128(
        order_url,
        barHeight=12 * mm,
        barWidth=0.4
    )
    barcode.drawOn(c, x_margin, y - 12 * mm)
    y -= 16 * mm

    # ================= ORDER INFO =================
    text(f"Order ID : {order.order_id}", bold=True)
    text(f"Date     : {order.created_at.strftime('%d %b %Y')}")
    text(f"Payment  : {order.payment_status}")
    y -= 2 * mm

    # ================= CUSTOMER =================
    text("Customer Details", 10, True)
    text(f"Name  : {order.customer_name}")
    text(f"Email : {order.customer_email or '-'}")
    y -= 2 * mm

    # ================= ADDRESS =================
    text("Shipping Address", 10, True)
    for line in order.address.split(","):
        text(line.strip(), 8)
    y -= 2 * mm

    # ================= ITEMS =================
    text("Items", 10, True)
    for item in order.items.all():
        text(f"- {item.product.name} x{item.quantity}", 8)

    y -= 2 * mm
    text(f"Total Qty : {order.qty}", bold=True)
    text(f"Amount    : ₹{order.total_amount}", bold=True)

    # ================= QR CODE =================
    qr = qrcode.make(order_url)
    qr_buf = io.BytesIO()
    qr.save(qr_buf)
    qr_buf.seek(0)

    c.drawImage(
        ImageReader(qr_buf),
        width - 32 * mm,
        6 * mm,
        26 * mm,
        26 * mm
    )

    c.showPage()
    c.save()
    return response

@api_view(["GET"])
def accounting_dashboard(request):
    if request.user.role != "admin":
          return Response(
            {"error": " Admin Role error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    month = request.GET.get("month")
    year = request.GET.get("year")

    orders = Order.objects.filter(order_status="Delivered")

    if month and year:
        orders = orders.filter(
            created_at__month=int(month),
            created_at__year=int(year),
        )

    gross_sales = orders.aggregate(
        total=Sum("total_amount")
    )["total"] or Decimal("0")

    discount = gross_sales * Decimal("0.05")
    tax = gross_sales * Decimal("0.12")
    net_profit = gross_sales - discount - tax

    # ===== Monthly Profit (last 6 months) =====
    labels, data = [], []
    today = now().date()

    for i in range(5, -1, -1):
        month_date = today.replace(day=1) - timedelta(days=i * 30)
        total = Order.objects.filter(
            order_status="Delivered",
            created_at__year=month_date.year,
            created_at__month=month_date.month,
        ).aggregate(Sum("total_amount"))["total_amount__sum"] or Decimal("0")

        labels.append(month_date.strftime("%b"))
        data.append(float(total))

    return Response({
        "kpis": {
            "gross_sales": float(gross_sales),
            "discount": float(discount),
            "tax": float(tax),
            "net_profit": float(net_profit),
        },
        "monthly_profit": {
            "labels": labels,
            "data": data,
        }
    })

@api_view(["GET"])
def accounting_export_csv(request):
    month = request.GET.get("month")
    year = request.GET.get("year")

    orders = Order.objects.filter(order_status="Delivered")

    if month and year:
        orders = orders.filter(
            created_at__month=int(month),
            created_at__year=int(year),
        )

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="accounting_report.csv"'

    writer = csv.writer(response)
    writer.writerow([
        "Order ID",
        "Date",
        "Customer",
        "Gross Amount",
        "Discount (5%)",
        "Tax (12%)",
        "Net Amount",
        "Payment Status",
    ])

    for o in orders:
        discount = o.total_amount * Decimal("0.05")
        tax = o.total_amount * Decimal("0.12")
        net = o.total_amount - discount - tax

        writer.writerow([
            o.order_id,
            o.created_at.strftime("%d-%m-%Y"),
            o.customer_name,
            float(o.total_amount),
            float(discount),
            float(tax),
            float(net),
            o.payment_status,
        ])

    return response

@api_view(["GET"])
def accounting_export_pdf(request):
    orders = Order.objects.filter(order_status="Delivered")

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="accounting_report.pdf"'

    c = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Accounting Report")

    y -= 40
    c.setFont("Helvetica", 11)

    total = orders.aggregate(Sum("total_amount"))["total_amount__sum"] or Decimal("0")
    discount = total * Decimal("0.05")
    tax = total * Decimal("0.12")
    net = total - discount - tax

    lines = [
        f"Gross Sales: ₹{float(total)}",
        f"Discount (5%): ₹{float(discount)}",
        f"Tax (12%): ₹{float(tax)}",
        f"Net Profit: ₹{float(net)}",
    ]

    for line in lines:
        c.drawString(50, y, line)
        y -= 20

    c.showPage()
    c.save()
    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def orders_dashboard(request):
    if getattr(request.user, "role", None) != "admin":
        return Response({"error": "Admin only"}, status=403)

    month = request.GET.get("month")
    year = request.GET.get("year")

    orders = Order.objects.all()

    if month and year:
        orders = orders.filter(
            created_at__month=int(month),
            created_at__year=int(year),
        )

    # ================= KPIs =================
    kpis = {
        "total_orders": orders.count(),
        "pending": orders.filter(order_status="Pending").count(),
        "delivered": orders.filter(order_status="Delivered").count(),
        "cancelled": orders.filter(order_status="Cancelled").count(),
    }

    # ================= DAILY SALES =================
    daily = (
        orders
        .filter(order_status="Delivered")
        .values("created_at__date")
        .annotate(total=Sum("total_amount"))
        .order_by("created_at__date")
    )

    # ================= TOP PRODUCTS =================
    top_products = (
        OrderItem.objects
        .filter(order__in=orders)
        .values("product__name")
        .annotate(qty=Sum("quantity"))
        .order_by("-qty")[:5]
    )

    return Response({"data":{
        "kpis": kpis,
        "daily_sales": {
            "labels": [d["created_at__date"].strftime("%d %b") for d in daily],
            "data": [float(d["total"]) for d in daily],
        },
        "top_products": [
            {
                "product_name": p["product__name"],
                "qty": p["qty"]
            }
            for p in top_products
        ],
    }})


@api_view(["GET"])
def orders_export_csv(request):
    month = request.GET.get("month")
    year = request.GET.get("year")

    orders = Order.objects.prefetch_related("items__product")

    if month and year:
        orders = orders.filter(
            created_at__month=int(month),
            created_at__year=int(year),
        )

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="orders_report.csv"'

    writer = csv.writer(response)
    writer.writerow([
        "Order ID",
        "Date",
        "Customer",
        "Product",
        "Quantity",
        "Order Status",
        "Amount",
    ])

    for order in orders:
        for item in order.items.all():
            writer.writerow([
                order.order_id,
                order.created_at.strftime("%d-%m-%Y"),
                order.customer_name,
                item.product.name,      # ✅ FIX HERE
                item.quantity,
                order.order_status,
                float(order.total_amount),
            ])

    return response

@api_view(["GET"])
def orders_export_pdf(request):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="orders_report.pdf"'

    c = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    y = height - 40
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Orders Report")

    y -= 30
    c.setFont("Helvetica", 11)

    statuses = ["Pending", "Delivered", "Cancelled"]

    for s in statuses:
        count = Order.objects.filter(order_status=s).count()
        c.drawString(50, y, f"{s} Orders: {count}")
        y -= 20

    c.showPage()
    c.save()
    return response

@api_view(["GET"])
def dashboard_overview(request):
    today = now().date()
    start_of_week = today - timedelta(days=6)

    # ================= TOTAL COUNTS =================
    total_orders = Order.objects.count()

    total_sales = (
        Order.objects
        .filter(order_status="Delivered")
        .aggregate(total=Sum("total_amount"))["total"]
        or Decimal("0.00")
    )

    total_customers = CustomUser.objects.filter(role="customer").count()
    total_products = Product.objects.count()

    low_stock_count = Product.objects.filter(stock__lte=10).count()

    # ================= RECENT ORDERS =================
    recent_orders_qs = Order.objects.order_by("-created_at")[:5]

    recent_orders = []
    for o in recent_orders_qs:
        recent_orders.append({
            "order_id": o.order_id,
            "customer": o.customer_name,
            "amount": float(o.total_amount),
            "status": o.order_status,
        })

    # ================= LOW STOCK PRODUCTS =================
    low_stock_products = []
    for p in Product.objects.filter(stock__lte=10)[:5]:
        low_stock_products.append({
            "name": p.name,
            "stock": p.stock,
        })

    # ================= WEEKLY SALES CHART =================
    chart_labels = []
    chart_data = []

    for i in range(7):
        day = start_of_week + timedelta(days=i)

        total = (
            Order.objects
            .filter(
                order_status="Delivered",
                created_at__date=day
            )
            .aggregate(total=Sum("total_amount"))["total"]
            or Decimal("0.00")
        )

        chart_labels.append(day.strftime("%a"))  # Mon Tue Wed
        chart_data.append(float(total))

    # ================= RESPONSE =================
    return Response({
        "stats": {
            "total_orders": total_orders,
            "total_sales": float(total_sales),
            "customers": total_customers,
            "products": total_products,
            "low_stock": low_stock_count,
        },

        "chart": {
            "labels": chart_labels,
            "data": chart_data,
        },

        "recent_orders": recent_orders,
        "low_stock_products": low_stock_products,
    })
