from django.db import models
from users.models import User

class BloodRequest(models.Model):
    URGENCY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('critical', 'Critical'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending AI Match'),
        ('matching', 'Finding Donors'),
        ('fulfilled', 'Fulfilled'),
        ('expired', 'Expired'),
    )

    hospital = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_requests')
    patient_name = models.CharField(max_length=200)
    blood_group = models.CharField(max_length=3)
    urgency_level = models.CharField(max_length=10, choices=URGENCY_CHOICES)
    location = models.TextField()
    required_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"REQ-{self.id}: {self.blood_group} for {self.patient_name} ({self.urgency_level})"

class DonationLog(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=(('completed', 'Completed'), ('missed', 'Missed')))
    trust_points_awarded = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log: {self.donor.username} -> {self.status}"

class AIAuditLog(models.Model):
    blood_request = models.OneToOneField(BloodRequest, on_delete=models.CASCADE)
    ai_decision_data = models.JSONField(help_text="Stores the AI matching logic/scores")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Audit for REQ-{self.blood_request.id}"