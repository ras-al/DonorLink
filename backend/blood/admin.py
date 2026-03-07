from django.contrib import admin
from .models import BloodRequest, BloodInventory, DonationLog

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'blood_group', 'hospital', 'urgency_level', 'status', 'created_at')
    search_fields = ('patient_name', 'hospital__email')
    # Filter to easily find "Critical" requests or "Pending" requests
    list_filter = ('status', 'urgency_level', 'blood_group')
    
@admin.register(BloodInventory)
class BloodInventoryAdmin(admin.ModelAdmin):
    list_display = ('hospital', 'blood_group', 'units_available', 'last_updated')
    list_filter = ('blood_group',)

@admin.register(DonationLog)
class DonationLogAdmin(admin.ModelAdmin):
    list_display = ('donor', 'blood_request', 'status', 'trust_points_awarded', 'date')
    list_filter = ('status',)