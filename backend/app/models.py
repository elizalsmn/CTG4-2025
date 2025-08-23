from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


# Create your models here.

class User(AbstractUser):
    """Single user object with a role and shared fields."""
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("parent", "Parent"),
    ]

    # You can keep AbstractUser.username as your "userid", or add a separate one:
    userid = models.CharField(
        max_length=30, unique=True, help_text="External/user-facing ID"
    )

    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    # email is on AbstractUser; we’ll make it optional for parents via clean()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="parent")

    # Built-ins that already satisfy your requirements:
    # - date_joined (AbstractUser)
    # - last_login (AbstractUser)  ← this is effectively "last access date"

    def clean(self):
        super().clean()
        # Require email for Admin/Teacher, allow empty for Parent
        if self.role in {"admin", "teacher"} and not self.email:
            raise ValidationError({"email": "Email is required for admins and teachers."})

    def __str__(self):
        return f"{self.username} ({self.role})"


class ClassRoom(models.Model):
    """A school class (e.g., 3A, 5B)."""
    name = models.CharField(max_length=50, unique=True)  # e.g., "3A"
    grade = models.PositiveSmallIntegerField(null=True, blank=True)  # optional
    homeroom_teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="homerooms",
        limit_choices_to={"role": "teacher"},
    )

    def __str__(self):
        return self.name


class Lesson(models.Model):
    """Individual lesson (period) delivered by a teacher to a class."""
    SUBJECT_CHOICES = [
        ("math", "Math"),
        ("english", "English"),
        ("science", "Science"),
        ("other", "Other"),
    ]

    class_room = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name="lessons")
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="lessons",
        limit_choices_to={"role": "teacher"},
    )
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default="other")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    def clean(self):
        super().clean()
        if self.end_time and self.start_time and self.end_time <= self.start_time:
            raise ValidationError({"end_time": "End time must be after start time."})

    def __str__(self):
        return f"{self.class_room} - {self.subject} ({self.start_time:%Y-%m-%d %H:%M})"


class ParentProfile(models.Model):
    """Extra fields/relations for parents."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="parent_profile",
        limit_choices_to={"role": "parent"},
    )
    # Friends list: other users they are connected to (you can restrict to parents if you want)
    friends = models.ManyToManyField(
        User,
        related_name="friend_of_parents",
        blank=True,
    )

    def __str__(self):
        return f"ParentProfile({self.user.username})"


class Child(models.Model):
    """A child record linked to a parent; optionally assigned to a class."""
    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="children",
        limit_choices_to={"role": "parent"},
    )
    name = models.CharField(max_length=120)
    dob = models.DateField()
    class_room = models.ForeignKey(
        ClassRoom, on_delete=models.SET_NULL, null=True, blank=True, related_name="students"
    )

    # Optional: quick helper property for age
    @property
    def age_years(self):
        today = timezone.now().date()
        return today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))

    def __str__(self):
        return f"{self.name} ({self.parent.username})"