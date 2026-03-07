from django.contrib import admin
from .models import DonationCamp, CampRegistration

@admin.register(DonationCamp)
class DonationCampAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'date', 'status', 'expected_donors')
    search_fields = ('name', 'organization__email')
    list_filter = ('status', 'date')