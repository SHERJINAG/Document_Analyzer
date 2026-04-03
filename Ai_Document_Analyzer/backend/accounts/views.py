from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils.timezone import localtime
from .models import Document, User
from .document_ai import process_document
import json
import base64
import os
from django.http import JsonResponse
from dotenv import load_dotenv

# Load environment variables

from django.core.files.base import ContentFile
load_dotenv()

# -------------------------------
# USER REGISTRATION
# -------------------------------
@csrf_exempt
def register_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        User.objects.create_user(username=username, email=email, password=password)

        return JsonResponse({"message": "User created successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# -------------------------------
# USER LOGIN
# -------------------------------
@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user_obj = User.objects.filter(email=email).first()
        if not user_obj:
            return JsonResponse({"error": "User not found"}, status=400)

        user = authenticate(request, username=user_obj.username, password=password)
        if not user:
            return JsonResponse({"error": "Invalid password"}, status=400)

        login(request, user)
        return JsonResponse({
            "message": "Login successful",
            "user": {"username": user.username, "email": user.email}
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# -------------------------------
# UPLOAD DOCUMENT
# -------------------------------




API_KEY = os.getenv("API_KEY")  # Your secret API key

@csrf_exempt
def upload_document(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)

    # Check API key
    key = request.headers.get("x-api-key")
    if key != API_KEY:
        return JsonResponse({"status": "error", "message": "Unauthorized"}, status=401)

    try:
        import json
        data = json.loads(request.body)

        email = data.get("email")
        if not email:
            return JsonResponse({"status": "error", "message": "Email required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        file_name = data.get("fileName")
        file_type = data.get("fileType")
        file_base64 = data.get("fileBase64")

        if not file_name or not file_base64 or not file_type:
            return JsonResponse({"status": "error", "message": "File data missing"}, status=400)

        # Decode Base64 and save using Django FileField
        file_content = ContentFile(base64.b64decode(file_base64), name=file_name)
        doc = Document.objects.create(
            user=user,
            file=file_content,
            file_name=file_name,
            file_type=file_type,
            status="Processing"
        )

        # Process document with AI
        result = process_document(doc.file.path)  # process_document should return dynamic keys

        if result.get("status") != "success":
            doc.status = "Failed"
            doc.save()
            return JsonResponse({"status": "error", "message": result.get("message", "Processing failed")}, status=500)

        # Save processed data
        doc.text_length = result.get("text_length", 0)
        doc.summary = result.get("summary", "")
        doc.entities = result.get("entities", {})  # dynamic keys
        doc.sentiment = result.get("sentiment", "Neutral")
        doc.processing_time = result.get("processing_time_seconds", 0)
        doc.status = "Completed"
        doc.save()

        # Return dynamic entity response
        response_data = {
            "status": "success",
            "fileName": doc.file_name,
            "summary": doc.summary,
            "entities": doc.entities,  # dynamic keys
            "sentiment": doc.sentiment
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
# -------------------------------
# VIEW DOCUMENTS
# -------------------------------
@csrf_exempt
def my_documents(request):
    if request.method != "GET":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)

    try:
        email = request.GET.get("email")
        if not email:
            return JsonResponse({"status": "error", "message": "Email required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        documents = Document.objects.filter(user=user).order_by("-uploaded_at")
        data = [
            {
                "id": doc.id,
                "file_name": doc.file_name,
                "file_type": doc.file_type,
                "status": doc.status,
                "uploaded_at": localtime(doc.uploaded_at).strftime("%Y-%m-%d %H:%M"),
                "summary": doc.summary or "-",
                "sentiment": doc.sentiment or "-",
                "entities": doc.entities or {},
                "text_length": doc.text_length,
                "processing_time": doc.processing_time,
                "file": doc.file.url
            }
            for doc in documents
        ]

        return JsonResponse({"status": "success", "documents": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
import subprocess

def check_tesseract():
    try:
        result = subprocess.check_output(["tesseract", "--version"])
        print("Tesseract OK:", result.decode())
    except Exception as e:
        print("Tesseract NOT installed:", e)
