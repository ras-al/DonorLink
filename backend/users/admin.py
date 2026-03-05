from django.contrib import admin
from .models import User, DonorProfile, InstitutionalProfile, Penalty, Blacklist

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'phone')
    list_filter = ('role',)

admin.site.register(DonorProfile)
admin.site.register(InstitutionalProfile)
admin.site.register(Penalty)
admin.site.register(Blacklist)