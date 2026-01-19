from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework import status
from reportlab.lib.pagesizes import A6
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from django.http import HttpResponse
from reportlab.graphics.barcode import code128
from reportlab.lib.utils import ImageReader
import qrcode
import io
import json
import random
from django.utils.text import slugify
from datetime import timedelta
from django.db.models import Sum
from django.utils.timezone import now
from decimal import Decimal
from .models import *


@api_view(['POST'])
@permission_classes([AllowAny])
def loginUser(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = Response({
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


# ---------- TEST ----------
@api_view(['GET'])
def testApi(request):
    return Response({"status": "Backend OK"})

# ---------------get users----------------


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
def add_category(request):
    name = request.data.get("name")
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
    data = []

    for cat in Category.objects.all():
        data.append({
            "id": cat.id,
            "name": cat.name,
        })

    return Response({'data':data})



@api_view(['GET', 'POST'])
def add_subcategory(request):

    # ---------- GET : list subcategories ----------
    if request.method == 'GET':
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
def delete_category(request, pk):
    try:
        Category.objects.get(id=pk).delete()
        return Response({"message": "Category deleted"})
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)


@api_view(["DELETE"])
def delete_subcategory(request, pk):
    try:
        Subcategory.objects.get(id=pk).delete()
        return Response({"message": "SubCategory deleted"})
    except Subcategory.DoesNotExist:
        return Response({"error": "SubCategory not found"}, status=404)



@api_view(["POST"])
def add_product(request):
    data = request.data
    images = request.FILES.getlist("images")

    try:
        # ---------- REQUIRED RELATIONS ----------
        category = Category.objects.get(id=data.get("category"))
        subcategory = Subcategory.objects.get(id=data.get("subcategory"))

        brand = None
        if data.get("brand"):
            brand = Brand.objects.get(id=data.get("brand"))

        # ---------- PRODUCT ----------
        product = Product.objects.create(
            name=data.get("name"),
            slug=slugify(data.get("name")),
            sku=data.get("sku"),
            category=category,
            subcategory=subcategory,
            brand=brand,
            price=data.get("price"),
            stock=data.get("stock"),
            is_in_stock=int(data.get("stock", 0)) > 0,
            description=data.get("description", ""),
            is_active=data.get("status", "Active") == "Active",
        )

        # ---------- SPECIFICATIONS (OPTIONAL) ----------
        specs_raw = data.get("specifications")
        if specs_raw:
            specs = json.loads(specs_raw)
            for spec in specs:
                ProductSpecification.objects.create(
                    product=product,
                    key=spec.get("key"),
                    value=spec.get("value")
                )

        # ---------- IMAGES (OPTIONAL MULTIPLE) ----------

        for i, img in enumerate(images):
            # 👇 FIRST image = main product image
            if i == 0:
                product.image = img
                product.save(update_fields=["image"])

            ProductImage.objects.create(
                product=product,
                image=img,
                is_primary=(i == 0)
            )


        return Response(
            {
                "message": "Product created successfully",
                "product_id": product.id
            },
            status=status.HTTP_201_CREATED
        )

    except Category.DoesNotExist:
        return Response({"error": "Invalid category"}, status=400)

    except Subcategory.DoesNotExist:
        return Response({"error": "Invalid subcategory"}, status=400)

    except Brand.DoesNotExist:
        return Response({"error": "Invalid brand"}, status=400)

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
            "image": p.image.url if p.image else None,
        })

    return Response({"data": data})

@api_view(["GET"])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)

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
        "images": images,
    }

    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def product_update(request, pk):
    if request.user.role != "admin":
        return Response({"message": "Only admin can update"})
    product = get_object_or_404(Product, pk = pk )
    

@api_view(["DELETE"])
def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.delete()

    return Response({"message": "Product deleted successfully"})


def generate_order_id():
    return f"ORD{random.randint(100000000, 9999999999)}"


@api_view(["POST"])
def create_order(request):
    user = request.user  

    customer_name = request.data.get("customer_name")
    customer_email = request.data.get("customer_email")
    payment_status = request.data.get("payment_status", "Pending")
    items = request.data.get("items", [])

    if not customer_name or not items:
        return Response(
            {"error": "Customer name and items are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 🔹 Calculate total
    total_amount = 0
    for i in items:
        total_amount += float(i["price"]) * int(i["quantity"])

    # 🔹 Create Order
    order = Order.objects.create(
        user=user,
        order_id=generate_order_id(),
        customer_name=customer_name,
        customer_email=customer_email,
        total_amount=total_amount,
        payment_status=payment_status,
        order_status="Pending"
    )

    # 🔹 Create Order Items
    for i in items:
        OrderItem.objects.create(
            order=order,
            product_name=i["product_name"],
            price=i["price"],
            quantity=i["quantity"]
        )

    return Response(
        {
            "message": "Order created successfully",
            "order_id": order.order_id
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
def admin_orders(request):
    orders = Order.objects.all().order_by("-created_at")

    data = []

    for o in orders:
        items = OrderItem.objects.filter(order=o)

        total_qty = sum(i.quantity for i in items) 

        product_list = []
        for i in items:
            product_list.append({
                "product_name": i.product_name,
                "price": float(i.price),
                "quantity": i.quantity,
            })

        data.append({
            "id": o.id,
            "product_image":"http://localhost:8000"+o.product.image.url if o.product.image else None,
            "customer": o.customer_name,
            "customer_email": o.customer_email,
            "order_id":o.order_id,
            "total": float(o.total_amount),
            "total_qty": total_qty,

            "payment_status": o.payment_status,
            "status": o.order_status,

            "address": o.address,
            "date": o.created_at.strftime("%d %b %Y"),

            # ORDER ITEMS
            "items": product_list,
        })

    return Response({"data": data})

@api_view(["PUT"])
def update_order_status(request, id):
    status = request.data.get("status")
    print(status)
    order = Order.objects.get(id=id)
    print(order.order_status)
    order.order_status = status
    order.save()

    return Response({"message": "Order status updated"})


@api_view(["GET"])
def admin_order_detail(request, id):
    order = Order.objects.get(id=id)

    return Response({
        "order_id": order.order_id,
        "customer": order.customer_name,
        "email": order.customer_email,
        "total": float(order.total_amount),
        "payment": order.payment_status,
        "status": order.order_status,
        "created_at": order.created_at.strftime("%d %b %Y"),
        "items": [
            {
                "product": i.product_name,
                "price": float(i.price),
                "quantity": i.quantity,
            }
            for i in order.items.all()
        ]
    })

    
    

@api_view(["GET"])
def download_parcel_label(request, id):
    order = Order.objects.get(id=id)
    items = OrderItem.objects.filter(order=order)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="parcel_{order.order_id}.pdf"'

    c = canvas.Canvas(response, pagesize=A6)
    width, height = A6

    y = height - 8 * mm

    def draw(text, size=9, bold=False):
        nonlocal y
        font = "Helvetica-Bold" if bold else "Helvetica"
        c.setFont(font, size)
        c.drawString(6 * mm, y, text)
        y -= 5 * mm

    # ===== LOGO =====
    try:
        logo = ImageReader("media/logo.png")  # apna logo path
        c.drawImage(logo, width - 40 * mm, height - 25 * mm, 30 * mm, 15 * mm)
    except:
        pass

    # ===== TITLE =====
    draw("PARCEL SHIPPING LABEL", 11, True)
    y -= 2 * mm

    # ===== BARCODE =====
    barcode = code128.Code128(order.order_id, barHeight=10 * mm)
    barcode.drawOn(c, 6 * mm, y - 12 * mm)
    y -= 18 * mm

    # ===== ORDER INFO =====
    draw(f"Order ID: {order.order_id}", bold=True)
    draw(f"Order Date: {order.created_at.strftime('%d %b %Y')}")
    draw(f"Payment: {order.payment_status}")
    y -= 2 * mm

    # ===== CUSTOMER =====
    draw("Customer Details", 10, True)
    draw(f"Name: {order.customer_name}")
    draw(f"Email: {order.customer_email or '-'}")
    y -= 2 * mm

    # ===== ADDRESS =====
    draw("Shipping Address", 10, True)
    for line in order.address.split(","):
        draw(line.strip())
    y -= 2 * mm

    # ===== ITEMS =====
    draw("Items", 10, True)
    for item in items:
        draw(f"{item.product_name}  x{item.quantity}")
    y -= 2 * mm

    draw(f"Total Qty: {order.qty}", bold=True)
    draw(f"Amount: ₹{order.total_amount}", bold=True)

    # ===== QR CODE =====
    qr_data = f"ORDER:{order.order_id}"
    qr = qrcode.make(qr_data)
    qr_buffer = io.BytesIO()
    qr.save(qr_buffer)
    qr_buffer.seek(0)

    c.drawImage(
        ImageReader(qr_buffer),
        width - 35 * mm,
        6 * mm,
        28 * mm,
        28 * mm
    )

    c.showPage()
    c.save()

    return response





@api_view(["GET"])
def reports_dashboard(request):
    today = now().date()
    start_of_week = today - timedelta(days=today.weekday())

    delivered = Order.objects.filter(order_status="Delivered")

    gross_sales = delivered.aggregate(
        total=Sum("total_amount")
    )["total"] or Decimal("0.00")

    # ✅ Decimal math (NO float)
    discount = gross_sales * Decimal("0.05")
    tax = gross_sales * Decimal("0.12")
    net_profit = gross_sales - discount - tax

    # ===== MONTHLY SALES =====
    monthly_labels = []
    monthly_data = []

    for i in range(5, -1, -1):
        month = today.replace(day=1) - timedelta(days=i * 30)

        total = Order.objects.filter(
            order_status="Delivered",
            created_at__year=month.year,
            created_at__month=month.month,
        ).aggregate(Sum("total_amount"))["total_amount__sum"] or Decimal("0")

        monthly_labels.append(month.strftime("%b"))
        monthly_data.append(float(total))  # frontend ke liye float

    # ===== WEEKLY REVENUE =====
    weekly_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_data = []

    for i in range(7):
        day = start_of_week + timedelta(days=i)
        total = Order.objects.filter(
            order_status="Delivered",
            created_at__date=day,
        ).aggregate(Sum("total_amount"))["total_amount__sum"] or Decimal("0")

        weekly_data.append(float(total))

    return Response({
        "kpis": {
            "gross_sales": float(gross_sales),
            "net_profit": float(net_profit),
            "discount": float(discount),
            "tax": float(tax),
        },
        "monthly_sales": {
            "labels": monthly_labels,
            "data": monthly_data,
        },
        "weekly_revenue": {
            "labels": weekly_labels,
            "data": weekly_data,
        },
    })


import csv

@api_view(["GET"])
def export_sales_csv(request):
    """
    /api/reports/export-csv/?month=1&year=2026
    """
    month = request.GET.get("month")
    year = request.GET.get("year")

    orders = Order.objects.filter(order_status="Delivered")

    if month and year:
        orders = orders.filter(
            created_at__month=int(month),
            created_at__year=int(year),
        )

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = (
        f'attachment; filename="sales_report_{month or "all"}_{year or ""}.csv"'
    )

    writer = csv.writer(response)
    writer.writerow([
        "Order ID",
        "Customer",
        "Email",
        "Total Amount",
        "Payment Status",
        "Date",
    ])

    for o in orders:
        writer.writerow([
            o.order_id,
            o.customer_name,
            o.customer_email,
            float(o.total_amount),
            o.payment_status,
            o.created_at.strftime("%d-%m-%Y"),
        ])

    return response