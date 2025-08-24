from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.files.storage import default_storage
import csv, io, json, os, uuid
import json
import logging
from .utils.db_utils import user_to_db, add_batch_user
from .utils.image_utils import start_ocr
from .utils.leaderboard_utils import add_to_leaderboard,adjust_point, get_5_top_user
import pandas as pd
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.conf import settings
from django.utils.text import get_valid_filename
from app.models import LeaderBoardEntry



# Create your views here.

def say_hello(request):
    return HttpResponse('Hello World')

def qrcode(request):
    # Placeholder for QR code generation logic
    return HttpResponse('QR Code Placeholder')

def _payload(request):
    """Extract payload from request - handles both JSON and form data."""
    if request.content_type == 'application/json':
        import json
        return json.loads(request.body)
    else:
        # For form data
        payload = request.POST.dict()
        # Handle nested child data if present
        child_name = request.POST.get('child_name')
        child_dob = request.POST.get('child_dob')
        if child_name and child_dob:
            payload['child'] = {
                'name': child_name,
                'date_of_birth': child_dob,
                'class_name': request.POST.get('child_class')
            }
        return payload

@csrf_exempt
def create_user(request):
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)

    try:
        payload = _payload(request)
        role = (payload.get("role") or "").lower()
        logging.info(f"create_user called with role={role} payload={payload}")

        # Basic validation based on role
        if role == "teacher" or role == "admin":
            required_fields = ["username", "full_name", "email", "phone_number", "password"]
            for field in required_fields:
                if not payload.get(field):
                    messages.error(request, f"{role.capitalize()}s must have {', '.join(required_fields)}.")
                    return redirect(request.path)
        elif role == "parent":
            child_obj = payload.get("child")
            if not isinstance(child_obj, dict):
                messages.error(request, "Child info required for parent.")
                return redirect(request.path)
            
            if not (child_obj.get("name") and child_obj.get("date_of_birth")):
                messages.error(request, "Child name and DOB required for parent.")
                return redirect(request.path)
        else:
            messages.error(request, "Invalid role.")
            return redirect(request.path)
            
        # Let user_to_db handle the actual database operations
        success, error_msg = user_to_db(role, payload)
        
        if success:
            return HttpResponse(f"{role.capitalize()} created", status=201)
        else:
            messages.error(request, f"Error creating {role}: {error_msg}")
            return redirect(request.path)

    except Exception as e:
        logging.exception("create_user failed")
        messages.error(request, f"An error occurred: {e}")
        return redirect(request.path)
    
@csrf_exempt
def delete_user(request):
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)
        
    try:
        payload = _payload(request)
        userid = payload.get("id")
        
        if not userid:
            return HttpResponse("User ID is required", status=400)
            
        # Try to find the user
        try:
            user = User.objects.get(id=userid)
            username = user.username
            role = user.role
            
            # Prevent deletion of admin users
            if role == "admin":
                return HttpResponse("Admin users cannot be deleted", status=403)
            
            # Delete the user
            user.delete()
            
            logging.info(f"Deleted user: {username} (ID: {userid}, Role: {role})")
            return HttpResponse(f"User {username} deleted successfully", status=200)
            
        except User.DoesNotExist:
            return HttpResponse(f"User with ID {userid} not found", status=404)
            
    except Exception as e:
        logging.exception("delete_user failed")
        return HttpResponse(f"Error deleting user: {str(e)}", status=500)
  
@csrf_exempt
def create_batch_user(request):
    REQUIRED_HEADERS = {"child_name", "child_date_of_birth", "child_class_name"}
    """
    POST JSON: { "path": "<absolute-or-relative-csv-path>" }
      - If path missing/does not exist -> redirect back to request.path with error message.
      - Validates headers: child_name, child_date_of_birth, child_class_name
      - Calls utils.db_utils.add_batch_user(df)
    Returns JSON summary if OK or partial OK.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    payload = _payload(request)
    if not isinstance(payload, dict) or not payload.get("path"):
        # Return JSON error instead of redirecting
        return JsonResponse({"error": "CSV path is required."}, status=400)

    raw_path = payload["path"]
    # Allow absolute or relative to BASE_DIR
    path = raw_path if os.path.isabs(raw_path) else os.path.join(settings.BASE_DIR, raw_path)

    if not os.path.exists(path):
        # Return JSON error instead of redirecting
        return JsonResponse({"error": f"CSV file not found: {raw_path}"}, status=404)

    try:
        df = pd.read_csv(path)
    except Exception as e:
        # Return JSON error instead of redirecting
        return JsonResponse({"error": f"Failed to read CSV: {str(e)}"}, status=400)

    # Validate headers
    cols = {c.strip().lower() for c in df.columns}
    missing = REQUIRED_HEADERS - cols
    if missing:
        # Return JSON error instead of redirecting
        return JsonResponse({"error": f"CSV missing required columns: {', '.join(sorted(missing))}"}, status=400)

    ok, report = add_batch_user(df)
    status = 200 if ok else 207  # 207 for partial successes
    return JsonResponse(report, status=status)


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

ALLOWED_PIC_EXTS = {".png", ".jpg", ".jpeg"}
def _safe_filename(proposed: str, fallback_ext: str = ".png") -> str:
    name = (proposed or "").strip()
    name = get_valid_filename(name) or f"upload-{uuid.uuid4().hex}{fallback_ext}"
    base, ext = os.path.splitext(name)
    ext = ext.lower()
    if ext not in ALLOWED_PIC_EXTS:
        # force allowed extension if frontend sent something else / missing
        ext = fallback_ext if fallback_ext in ALLOWED_PIC_EXTS else ".png"
    return f"{base}-{uuid.uuid4().hex[:8]}{ext}"  # add short suffix to avoid collisions


@csrf_exempt
def accept_picture(request):
    MAX_BYTES = 15 * 1024 * 1024  # 15 MB cap
    SUBDIR = os.path.join("example_file", "assg")  # relative to BASE_DIR
    """
    Accepts an image (png/jpg/jpeg) and saves it to BASE_DIR/example_file/assg/.
    Supports:
      - multipart/form-data: file field named 'file' or 'image', optional 'filename'
      - raw body (application/octet-stream or image/*) with required 'filename' query or JSON body
    Returns JSON: { "saved": true, "path": "<relative_path>", "bytes": N }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
        
    # Create the directory if it doesn't exist
    full_dir = os.path.join(settings.BASE_DIR, SUBDIR)
    _ensure_dir(full_dir)
    
    # Check Content-Type to determine how to handle the request
    content_type = request.content_type or ""
    
    # Case 1: Multipart form data
    if "multipart/form-data" in content_type:
        # Handle form data upload
        img_file = request.FILES.get('files') or request.FILES.get('image')
        if not img_file:
            return JsonResponse({"error": "No file found in request"}, status=400)
            
        # Check file size
        if img_file.size > MAX_BYTES:
            return JsonResponse({"error": f"File too large (max {MAX_BYTES/1024/1024}MB)"}, status=413)
            
        # Get filename from form or use the original name
        filename = request.POST.get('filename') or img_file.name
        safe_name = _safe_filename(filename)
        
        # Save the file
        file_path = os.path.join(full_dir, safe_name)
        with open(file_path, 'wb+') as destination:
            for chunk in img_file.chunks():
                destination.write(chunk)
                
        rel_path = os.path.join(SUBDIR, safe_name)
        return JsonResponse({
            "saved": True,
            "path": rel_path,
            "bytes": img_file.size
        })
        
    # Case 2: Raw body upload
    else:
        # Get filename from query params or JSON body
        filename = request.GET.get('filename')
        
        # If no filename in query params, try to parse body as JSON
        if not filename and not content_type.startswith(('image/', 'application/octet-stream')):
            try:
                # Make a copy of the body since we can only read it once
                body_copy = request.body
                data = json.loads(body_copy)
                filename = data.get('filename')
            except (json.JSONDecodeError, ValueError):
                pass
                
        if not filename:
            return JsonResponse({"error": "Filename is required for raw uploads"}, status=400)
            
        # Read raw body
        content = request.body
        
        # Check size
        if len(content) > MAX_BYTES:
            return JsonResponse({"error": f"File too large (max {MAX_BYTES/1024/1024}MB)"}, status=413)
            
        # Save file
        safe_name = _safe_filename(filename)
        file_path = os.path.join(full_dir, safe_name)
        with open(file_path, 'wb') as f:
            f.write(content)
            
        rel_path = os.path.join(SUBDIR, safe_name)
        start_ocr(file_path)
        return JsonResponse({
            "saved": True,
            "path": rel_path,
            "bytes": len(content)
        })
    
def _json(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return None


@csrf_exempt
def add_to_leaderboard_view(request):  # Rename the view function
    """
    POST JSON: { "user_id": <int>, "points": <int optional> }
    Ensures the parent (by user_id) is present on the leaderboard. Optionally sets points.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    payload = _payload(request) or {}  # Also change _json to _payload
    user_id = payload.get("user_id")
    points = payload.get("points", 0)

    if not isinstance(user_id, int):
        return JsonResponse({"error": "user_id must be an integer"}, status=400)

    ok, err, data = add_to_leaderboard(user_id, points)  # This calls the utility function
    if not ok:
        return JsonResponse({"error": err or "Failed to add to leaderboard"}, status=400)
    return JsonResponse({"message": "ok", "data": data}, status=201 if data.get("created") else 200)

def top_leaderboard(request):
    """
    GET: returns the top 5 entries.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    results = get_5_top_user()
    return JsonResponse({"results": results}, status=200)


@csrf_exempt
def adjust_leaderboard_point(request):
    """
    POST JSON: { "user_id": <int>, "adjust": <int> }
    Adjusts the parent's points (min 0).
    """
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    payload = _payload(request) or {}
    user_id = payload.get("user_id")
    adjust = payload.get("adjust")
    user_id = payload.get("user_id")
    adjust = payload.get("adjust")

    if not isinstance(user_id, int):
        return JsonResponse({"error": "user_id must be an integer"}, status=400)
    if not isinstance(adjust, int):
        return JsonResponse({"error": "adjust must be an integer"}, status=400)

    ok, err, data = adjust_point(user_id, adjust)
    if not ok:
        return JsonResponse({"error": err or "Failed to adjust points"}, status=400)
    return JsonResponse({"message": "ok", "data": data}, status=200)

@csrf_exempt
def delete_leaderboard(request):
    """
    Delete a single leaderboard row by its id.

    POST/DELETE JSON:
      { "id": 123 }

    Returns: { "deleted": 1 } or { "deleted": 0 }
    """
    if request.method not in ("POST", "DELETE"):
        return JsonResponse({"error": "Method not allowed"}, status=405)

    payload = _payload(request)
    entry_id = payload.get("id")
    if entry_id is None:
        return JsonResponse({"error": "Provide 'id'."}, status=400)

    try:
        entry_id = int(entry_id)
    except (TypeError, ValueError):
        return JsonResponse({"error": "'id' must be an integer."}, status=400)

    deleted, _ = LeaderBoardEntry.objects.filter(pk=entry_id).delete()
    return JsonResponse({"deleted": deleted}, status=200)

        
