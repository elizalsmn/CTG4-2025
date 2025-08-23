from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
import csv
import io
from .models import User, ClassRoom, Child, ParentProfile
import logging
from .utils.db_utils import user_to_db, create_user_batch
import polar as pl
import pandas as pd
from django.views.decorators.csrf import csrf_exempt


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

def load_csv(request):
    if request.method == "POST":
        csv_file = request.FILES.get('csv_file')
        
        if not csv_file:
            messages.error(request, "Please select a CSV file")
            return redirect(request.path)
            
        if not csv_file.name.endswith('.csv'):
            messages.error(request, "File must be a CSV")
            return redirect(request.path)
            
        try:
            # Read CSV into DataFrame
            df = pd.read_csv(csv_file)
            role = request.POST.get('role', None)
            
            # Call your batch upload function
            create_user_batch(df, role)
            
            messages.success(request, "CSV uploaded and processed successfully.")
            return redirect(request.path)
        except Exception as e:
            messages.error(request, f"Error processing CSV: {str(e)}")
            return redirect(request.path)