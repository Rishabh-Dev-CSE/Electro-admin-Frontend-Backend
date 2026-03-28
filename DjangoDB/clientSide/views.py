from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from electricApp.models import Category, Subcategory


# =========================
# Categories (Public API)
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def categories(request):

    #  (Optional) Secret Key verification yaha laga sakte ho agar future me private karna ho
    # Example:
    # if request.headers.get("X-API-KEY") != "YOUR_SECRET_KEY":
    #     return Response({"error": "Unauthorized"}, status=403)

    data = []
    for cat in Category.objects.all():
        data.append({
            "id": cat.id,
            "name": cat.name,
        })

    return Response({"data": data})


# =========================
# Subcategories (Public API)
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def subcategories(request):

    #  (Optional) Secret Key verification yaha bhi laga sakte ho

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

    return Response({"data": data})