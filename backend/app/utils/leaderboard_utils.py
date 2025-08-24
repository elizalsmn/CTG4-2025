from typing import Tuple, Any, Dict, List
from django.db import transaction
from django.db.models import OuterRef, Subquery, F
from app.models import ParentProfile, LeaderBoardEntry, Child


def _get_or_create_entry_for_user(user_id: int) -> Tuple[LeaderBoardEntry, bool]:
    entry, created = LeaderBoardEntry.objects.get_or_create(parent_id=user_id)
    return entry, created


def add_to_leaderboard(user_id: int, points: int = 0) -> Tuple[bool, str | None, Dict[str, Any] | None]:
    try:
        entry, created = _get_or_create_entry_for_user(user_id)
        if points is not None:
            entry.points = int(points)
            entry.full_clean()
            entry.save(update_fields=["points"])

        child = entry.parent.user.children.order_by("pk").first()
        return True, None, {
            "parent_user_id": entry.parent.user_id,
            "points": entry.points,
            "child_name": child.name if child else "(no child)",
            "created": created,
        }
    except Exception as e:
        return False, str(e), None


def get_5_top_user() -> List[Dict[str, Any]]:
    """
    Get top 5 leaderboard entries.
    No annotations to avoid property setter issues.
    """
    # Get top entries first
    top_entries = LeaderBoardEntry.objects.select_related("parent").order_by(
        F("points").desc(), "pk"
    )[:5]
    
    # Process results without annotation
    out: List[Dict[str, Any]] = []
    for entry in top_entries:
        # Look up child separately
        child = Child.objects.filter(parent_id=entry.parent_id).order_by("pk").first()
        
        out.append({
            "parent_user_id": entry.parent_id,
            "child_name": child.name if child else "(no child)",
            "points": entry.points,
        })
    return out


def adjust_point(user_id: int, adjust: int) -> Tuple[bool, str | None, Dict[str, Any] | None]:
    """
    Add (or subtract) points for the given parent's leaderboard row.
    Points will not go below 0.
    Returns (ok, err, payload)
    """
    try:
        entry, _ = _get_or_create_entry_for_user(user_id)
        new_points = max(0, int(entry.points) + int(adjust))
        entry.points = new_points
        entry.full_clean()
        entry.save(update_fields=["points"])

        # Get child information if needed
        child = Child.objects.filter(parent_id=user_id).order_by("pk").first()
        return True, None, {
            "parent_user_id": user_id,
            "child_name": child.name if child else "(no child)",
            "points": new_points,
        }
    except Exception as e:
        return False, str(e), None