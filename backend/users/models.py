from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('donor', 'Donor'),
        ('hospital', 'Hospital'),
        ('organization', 'Organization'),
        ('admin', 'Admin'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='donor')
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    
    groups = models.ManyToManyField('auth.Group', related_name='donorlink_users', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='donorlink_users', blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class DonorProfile(models.Model):
    BLOOD_GROUPS = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'), ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS)
    date_of_birth = models.DateField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    gender = models.CharField(max_length=10)
    trust_score = models.IntegerField(default=50)
    last_donation_date = models.DateField(null=True, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Donor: {self.user.username} ({self.blood_group})"

class InstitutionalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='institutional_profile')
    registration_id = models.CharField(max_length=100, unique=True)
    organization_name = models.CharField(max_length=200, null=True, blank=True)
    
    def __str__(self):
        return f"{self.organization_name or self.user.username} ({self.registration_id})"

class Penalty(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='penalties')
    reason = models.CharField(max_length=255)
    points_deducted = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Penalty: {self.user.username} (-{self.points_deducted})"

class Blacklist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blacklist_record')
    reason = models.TextField()
    blacklisted_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BLACKLISTED: {self.user.username}"