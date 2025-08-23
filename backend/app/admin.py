from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ClassRoom, Lesson, ParentProfile, Child


class ChildInline(admin.TabularInline):
    model = Child
    extra = 0


@admin.register(User)
class UserAdmin(UserAdmin):
    list_display = ("username", "id", "full_name", "role", "email", "phone_number", "is_active", "last_login")
    list_filter = ("role", "is_active", "is_staff", "is_superuser", "groups")
    search_fields = ("username", "id", "full_name", "email")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Identity", {"fields": ("id", "full_name", "email", "phone_number", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "id", "full_name", "email", "phone_number", "role", "password1", "password2"),
        }),
    )


@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ("name", "grade", "homeroom_teacher")
    list_filter = ("grade",)
    search_fields = ("name", "homeroom_teacher__username", "homeroom_teacher__full_name")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("class_room", "subject", "teacher", "start_time", "end_time", "location")
    list_filter = ("subject", "class_room", "teacher")
    search_fields = ("class_room__name", "teacher__username", "location")


@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user__username", "user__full_name")
    filter_horizontal = ("friends",)


@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "class_room", "dob", "age_years")
    list_filter = ("class_room",)
    search_fields = ("name", "parent__username", "parent__full_name")