from django.db import models
from users.models import User

class DonationCamp(models.Model):
    organization = models.ForeignKey(User, on_delete=models.CASCADE, related_name='camps')
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.TextField()
    expected_donors = models.IntegerField(help_text="AI Predicted Turnout")
    status = models.CharField(max_length=20, choices=(('upcoming', 'Upcoming'), ('active', 'Active'), ('completed', 'Completed')), default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Camp: {self.name} ({self.date})"

class CampRegistration(models.Model):
    camp = models.ForeignKey(DonationCamp, on_delete=models.CASCADE, related_name='registrations')
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.donor.username} -> {self.camp.name}"