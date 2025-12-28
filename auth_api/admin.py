from django.contrib import admin
from .models import Custom_user


@admin.register(Custom_user)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'full_name', 'role', 'is_active', 'is_staff', 'is_verified')
    list_filter = ('role', 'is_active', 'is_verified')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'full_name', 'bio', 'avatar_url')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'is_verified')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'full_name', 'password', 'is_verified', 'role'),
        }),
    )
    actions = ['make_teacher', 'make_student']

    def make_teacher(self, request, queryset):
        queryset.update(role='TEACHER')
        self.message_user(request, "تم إعطاء صلاحية TEACHER للمستخدمين المحددين.")

    make_teacher.short_description = "⟶ جعل المستخدمين المختارين TEACHER"
  
    def make_student(self, request, queryset):
        queryset.update(role='STUDENT')
        self.message_user(request, "تم إعطاء صلاحية STUDENT للمستخدمين المحددين.")

    make_student.short_description = "⟶ جعل المستخدمين المختارين STUDENT"

    def save_model(self, request, obj, form, change):
        # If creating a new user through admin, ensure the raw password
        # entered in the admin form is hashed before saving the model.
        from .models import OTP
        if not change:
            # form.cleaned_data is available on admin forms
            raw_password = None
            try:
                raw_password = form.cleaned_data.get('password')
            except Exception:
                raw_password = None

            if raw_password:
                obj.set_password(raw_password)

        super().save_model(request, obj, form, change)

        # Create initial OTP for newly created users
        if not change and obj.pk:  # تأكد أن المستخدم له مفتاح أساسي
            OTP.objects.create(user=obj, code="000000")