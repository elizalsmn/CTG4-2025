from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("parent", "Parent"),
    ]
    # id is auto-added by Django as primary key
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="parent")

    def clean(self):
        super().clean()
        if self.role in {"admin", "teacher"} and not self.email:
            raise ValidationError({"email": "Email is required for admins and teachers."})
        if self.role in {"admin", "teacher"} and not self.phone_number:
            raise ValidationError({"phone_number": "Phone is required for admins and teachers."})

    def __str__(self):
        return f"{self.full_name} ({self.role})"
    
class LoginLog(models.Model):
    """Tracks user login events."""
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='login_logs'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.user.username} - {self.timestamp}"


class ClassRoom(models.Model):
    """A school class (e.g., 3A), owned by exactly one teacher."""
    name = models.CharField(max_length=50, unique=True)          # e.g., "3A"
    grade = models.PositiveSmallIntegerField(null=True, blank=True)

    # Each teacher can be a homeroom teacher of at most one classroom.
    homeroom_teacher = models.OneToOneField(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='homeroom_of',          # access via teacher.homeroom_of
        limit_choices_to={"role": "teacher"},
        help_text="The teacher who owns this classroom."
    )

    def __str__(self):
        return self.name


class Child(models.Model):
    """A child linked to a parent; optionally assigned to a classroom."""
    parent = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='children',
        limit_choices_to={'role': 'parent'},
    )
    name = models.CharField(max_length=120)
    dob = models.DateField()

    # Use a string ref so order doesn’t matter
    class_room = models.ForeignKey(
        'ClassRoom', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='students'
    )

    @property
    def age_years(self):
        today = timezone.now().date()
        return today.year - self.dob.year - (
            (today.month, today.day) < (self.dob.month, self.dob.day)
        )

    def __str__(self):
        return f"{self.name} ({self.parent.username})"


class ParentProfile(models.Model):
    """Extra fields/relations for parents."""
    user = models.OneToOneField(
        'User',
        on_delete=models.CASCADE,
        related_name='parent_profile',
        limit_choices_to={'role': 'parent'},
    )
    # Friends list: other users they are connected to (could be parents/teachers)
    friends = models.ManyToManyField(
        'User',
        related_name='friend_of_parents',
        blank=True,
    )

    def __str__(self):
        return f"ParentProfile({self.user.username})"


class Lesson(models.Model):
    """Individual lesson delivered by a teacher to a classroom."""
    SUBJECT_CHOICES = [
        ("math", "Math"),
        ("english", "English"),
        ("science", "Science"),
        ("other", "Other"),
    ]

    class_room = models.ForeignKey('ClassRoom', on_delete=models.CASCADE, related_name='lessons')
    teacher = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='lessons',
        limit_choices_to={'role': 'teacher'},
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


# Add to the bottom of models.py
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """Create a login log entry when a user logs in."""
    if request:
        LoginLog.objects.create(
            user=user,
            ip_address=request.META.get('REMOTE_ADDR', None),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
    else:
        # For logins without a request object
        LoginLog.objects.create(user=user)