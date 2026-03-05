from django.contrib import admin
from .models import DonationCamp, CampRegistration

@admin.register(DonationCamp)
class DonationCampAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'date', 'status')
    list_filter = ('status',)

admin.site.register(CampRegistration)