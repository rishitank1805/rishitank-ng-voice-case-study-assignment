import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Submission


@require_http_methods(["GET"])
def health(request):
    return JsonResponse({"status": "ok"})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def submissions(request):
    if request.method == "GET":
        data = [
            {
                "id": item.id,
                "name": item.name,
                "email": item.email,
                "message": item.message,
                "created_at": item.created_at.isoformat(),
            }
            for item in Submission.objects.all()[:50]
        ]
        return JsonResponse({"items": data})

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    message = str(payload.get("message", "")).strip()

    if not name or not email or not message:
        return JsonResponse(
            {"error": "name, email, and message are required"},
            status=400,
        )

    item = Submission.objects.create(name=name, email=email, message=message)
    return JsonResponse(
        {
            "id": item.id,
            "name": item.name,
            "email": item.email,
            "message": item.message,
            "created_at": item.created_at.isoformat(),
        },
        status=201,
    )
