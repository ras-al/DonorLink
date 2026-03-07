from django.contrib import admin
from .models import User, DonorProfile, InstitutionalProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # What columns show up in the audit table
    list_display = ('email', 'role', 'phone', 'is_staff', 'is_active')
    # Add a search bar to search by email or phone
    search_fields = ('email', 'phone')
    # Add a sidebar to filter by role (e.g., "Show me all Hospitals")
    list_filter = ('role', 'is_active', 'is_staff')

@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'blood_group', 'trust_score', 'is_available')
    search_fields = ('user__email', 'blood_group')
    list_filter = ('blood_group', 'is_available')

@admin.register(InstitutionalProfile)
class InstitutionalProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'organization_name', 'registration_id')
    search_fields = ('organization_name', 'registration_id')