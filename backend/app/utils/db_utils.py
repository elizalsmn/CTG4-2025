from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
import csv
import io
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
    

def create_user_batch(df: pd.DataFrame):
    for index, row in df.iterrows():
        role = row.get('role', '').lower()
        if role in ['teacher', 'parent']:
            success = user_to_db(role, row)
            if not success:
                logging.error(f"Failed to create user for row {index}: {row.to_dict()}")
        else:
            logging.warning(f"Invalid role '{role}' for row {index}: {row.to_dict()}")