import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User, DonorProfile, InstitutionalProfile
from blood.models import BloodRequest, BloodInventory
from camps.models import DonationCamp

class Command(BaseCommand):
    help = 'Populates the database with realistic dummy data for DBMS presentation'

    def handle(self, *args, **kwargs):
        self.stdout.write("Wiping old dummy data (Keeping Admins)...")
        # Clear old data to prevent duplicates (keeps superusers)
        User.objects.filter(is_superuser=False).delete()

        blood_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
        kerala_cities = ['Kollam, Kerala', 'Trivandrum, Kerala', 'Ernakulam, Kerala', 'Kottayam, Kerala', 'Thrissur, Kerala']

        self.stdout.write("Creating Hospitals...")
        hospitals = []
        for i in range(1, 6):
            h_user = User.objects.create(
                email=f'hospital{i}@test.com',
                username=f'Hospital {i}',
                password=make_password('password123'),
                role='hospital',
                address=random.choice(kerala_cities),
                phone=f'987654321{i}'
            )
            InstitutionalProfile.objects.create(
                user=h_user, 
                organization_name=f'City Care Hospital {i}',
                registration_id=f'REG9988{i}'
            )
            hospitals.append(h_user)
            
            # Add some inventory to each hospital
            for bg in random.sample(blood_groups, 4):
                BloodInventory.objects.create(hospital=h_user, blood_group=bg, units_available=random.randint(5, 20))

        self.stdout.write("Creating NGOs & Organizations...")
        ngos = []
        for i in range(1, 4):
            ngo_user = User.objects.create(
                email=f'ngo{i}@test.com',
                username=f'NGO {i}',
                password=make_password('password123'),
                role='organization',
                address=random.choice(kerala_cities),
                phone=f'776655443{i}'
            )
            InstitutionalProfile.objects.create(
                user=ngo_user,
                organization_name=f'Kerala Blood Society {i}',
                registration_id=f'NGO4455{i}'
            )
            ngos.append(ngo_user)

        self.stdout.write("Creating 50 Donors...")
        for i in range(1, 51):
            d_user = User.objects.create(
                email=f'donor{i}@test.com',
                username=f'Donor {i}',
                password=make_password('password123'),
                role='donor',
                address=random.choice(kerala_cities),
                phone=f'887766554{i}'
            )
            DonorProfile.objects.create(
                user=d_user,
                blood_group=random.choice(blood_groups),
                trust_score=random.randint(40, 100),
                is_available=True,
                date_of_birth=f'{random.randint(1980, 2004)}-01-01',
                weight=random.randint(55, 90),
                gender=random.choice(['Male', 'Female'])
            )

        self.stdout.write("Creating Past & Active Blood Requests...")
        for i in range(1, 16):
            BloodRequest.objects.create(
                hospital=random.choice(hospitals),
                patient_name=f'Patient {i}',
                blood_group=random.choice(blood_groups),
                urgency_level=random.choice(['normal', 'urgent', 'critical']),
                location=random.choice(kerala_cities),
                status=random.choice(['pending', 'fulfilled', 'expired']),
                required_date=date.today() + timedelta(days=random.randint(0, 5))
            )

        self.stdout.write("Creating Active Blood Camps...")
        for i in range(1, 8):
            camp_date = date.today() + timedelta(days=random.randint(-2, 10))
            # If the date is near, make it active, otherwise upcoming
            status = 'active' if camp_date <= date.today() + timedelta(days=2) else 'upcoming'
            
            DonationCamp.objects.create(
                name=f'Mega Blood Drive {i}',
                organization=random.choice(ngos),
                date=camp_date,
                location=random.choice(kerala_cities),
                status=status,
                expected_donors=random.randint(50, 200)
            )

        self.stdout.write(self.style.SUCCESS("Database successfully populated with Donors, Hospitals, NGOs, Requests, and Camps!"))