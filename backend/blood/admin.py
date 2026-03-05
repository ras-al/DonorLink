from django.contrib import admin
from .models import BloodRequest, DonationLog, AIAuditLog

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'blood_group', 'urgency_level', 'status', 'hospital')
    list_filter = ('status', 'urgency_level', 'blood_group')

admin.site.register(DonationLog)
admin.site.register(AIAuditLog)