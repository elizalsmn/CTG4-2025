from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
import csv, io
from typing import Tuple, Dict, Any
from app.models import User, ClassRoom, Child, ParentProfile
import logging
import pandas as pd
from datetime import date

def _safe_parse_grade(class_name: str) -> int | None:
    """Parse a grade from a class name like '3A' or '3-A' → 3, else None."""
    if not class_name:
        return None
    left = class_name.split("-", 1)[0]
    digits = "".join(ch for ch in left if ch.isdigit())
    return int(digits) if digits else None

def user_to_db(role: str, data: dict) -> tuple[bool, str | None]:
    try:
        role = (role or "").lower()
        
        # Normalize field names - handle both "class" and "class_name" cases
        if "class" in data and not data.get("class_name"):
            data["class_name"] = data["class"]

        # Extract common fields
        username = data.get("username")
        password = data.get("password", "000000")  # Default if not provided
        full_name = data.get("full_name", "")
        email = data.get("email", "")
        phone_number = data.get("phone_number", "")

        if not username:
            # Use email if available
            if email:
                username = email.split('@')[0]
            # Use full name if available
            elif full_name:
                username = full_name.lower().replace(' ', '_')
            else:
                # Generate a random username
                import uuid
                username = f"user_{uuid.uuid4().hex[:8]}"
            
            # Make sure it's unique
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}_{counter}"
                counter += 1

        if role == "teacher":
            teacher = User.objects.create_user(
                username=username,
                password=password,
                full_name=full_name,
                email=email,
                phone_number=phone_number,
                role="teacher",
            )

            class_name = data.get("class_name")
            if class_name:
                grade = _safe_parse_grade(class_name)
                classroom, _ = ClassRoom.objects.get_or_create(
                    name=class_name,
                    defaults={"grade": grade},
                )
                if classroom.homeroom_teacher and classroom.homeroom_teacher != teacher:
                    return False, f"Class {class_name} already has a homeroom teacher."
                classroom.homeroom_teacher = teacher
                if grade is not None:
                    classroom.grade = grade
                classroom.save()

            return True, None

        elif role == "parent":
            # Get child info first
            child_data = data.get("child")
            if not isinstance(child_data, dict):
                return False, "Child information is required for parent"
            
            child_name = child_data.get("name")
            if not child_name:
                return False, "Child name is required"
            
            child_dob = child_data.get("date_of_birth")
            if not child_dob:
                return False, "Child date of birth is required"
            
            # Use child's name for parent full_name if not provided
            if not full_name:
                full_name = f"{child_name}'s Parent"
            
            # Use child's date of birth as the password
            password = child_dob.replace("-", "")  # Remove dashes for simpler password
            
            # Create parent user
            parent = User.objects.create_user(
                username=username,
                password=password,  # Use child's DOB as password
                full_name=full_name,
                email=email,
                phone_number=phone_number,
                role="parent",
            )
            ParentProfile.objects.get_or_create(user=parent)
            
            # Now create the child
            classroom = None
            class_name = child_data.get("class_name") or child_data.get("class")
            
            if class_name:
                classroom, _ = ClassRoom.objects.get_or_create(
                    name=class_name,
                    defaults={"grade": _safe_parse_grade(class_name)},
                )
            
            Child.objects.get_or_create(
                parent=parent,
                name=child_name,
                dob=date.fromisoformat(child_dob),
                defaults={"class_room": classroom},
            )
            
            return True, None

        elif role == "admin":
            User.objects.create_user(
                username=username,
                password=password,
                full_name=full_name,
                email=email,
                phone_number=phone_number,
                role="admin",
            )
            return True, None

        return False, f"Unsupported role: {role}"

    except Exception as e:
        logging.error(f"user_to_db error: {e}")
        return False, str(e)
    

def add_batch_user(df: pd.DataFrame) -> Tuple[bool, Dict[str, Any]]:
    REQUIRED_HEADERS = {"child_name", "child_date_of_birth", "child_class_name"}
    """
    Partial-success batch: processes all rows and reports successes/failures.
    Expected columns (case-insensitive):
      - child_name (required)
      - child_date_of_birth (required, YYYY-MM-DD)
      - child_class_name (required)
    Optional:
      - parent_full_name
      - parent_email
      - parent_phone_number
      - password
    Returns (ok, report) where:
      ok = (failed == 0)
      report = { total, created, failed, errors: [ {row_index, child_name, error} ] }
    """
    total = 0
    created = 0
    errors = []

    # Normalize headers
    df = df.copy()
    df.columns = [str(c).strip().lower() for c in df.columns]

    missing = [h for h in REQUIRED_HEADERS if h not in df.columns]
    if missing:
        return False, {
            "total": 0,
            "created": 0,
            "failed": 0,
            "errors": [{"row_index": -1, "error": f"Missing required columns: {', '.join(missing)}"}],
        }

    for i, row in df.iterrows():
        total += 1
        child_name = str(row.get("child_name", "")).strip()
        child_dob = str(row.get("child_date_of_birth", "")).strip()
        class_name = str(row.get("child_class_name", "")).strip()

        if not child_name or not child_dob or not class_name:
            errors.append({
                "row_index": int(i),
                "child_name": child_name,
                "error": "child_name, child_date_of_birth and child_class_name are required"
            })
            continue

        payload = {
            "role": "parent",
            "child": {
                "name": child_name,
                "date_of_birth": child_dob,
                "class_name": class_name,
            }
        }

        # optional parent fields
        full_name = str(row.get("parent_full_name", "") or "").strip()
        email = str(row.get("parent_email", "") or "").strip()
        phone = str(row.get("parent_phone_number", "") or "").strip()
        password = str(row.get("password", "") or "").strip()

        if full_name:
            payload["full_name"] = full_name
        if email:
            payload["email"] = email
        if phone:
            payload["phone_number"] = phone
        if password:
            payload["password"] = password

        ok, err = user_to_db("parent", payload)
        if ok:
            created += 1
        else:
            errors.append({
                "row_index": int(i),
                "child_name": child_name,
                "error": err or "Unknown error"
            })

    report = {
        "total": total,
        "created": created,
        "failed": len(errors),
        "errors": errors,
    }
    return (len(errors) == 0), report