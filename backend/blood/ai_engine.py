import math
import requests
from datetime import date
from dateutil.relativedelta import relativedelta
from users.models import DonorProfile, Penalty, Blacklist

class DonorMatchEngine:
    
    @staticmethod
    def get_coordinates(address):
        """
        Uses OpenStreetMap's free Nominatim API to convert a text address into GPS coordinates.
        """
        try:
            # Format the address for the URL
            url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1"
            headers = {'User-Agent': 'DonorLinkApp/1.0'} # Nominatim requires a user agent
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200 and len(response.json()) > 0:
                data = response.json()[0]
                return float(data['lat']), float(data['lon'])
        except Exception as e:
            print(f"Geocoding error for {address}: {e}")
        
        return None, None

    @staticmethod
    def calculate_distance(location1, location2):
        """
        Calculates the real distance in Kilometers between two addresses using the Haversine formula.
        Returns a score from 0 to 100 (100 being right next door, 0 being too far).
        """
        lat1, lon1 = DonorMatchEngine.get_coordinates(location1)
        lat2, lon2 = DonorMatchEngine.get_coordinates(location2)

        # If the API fails to find the location, fallback to basic string matching
        if not lat1 or not lat2:
            if location1 and location2 and location1.lower().strip() in location2.lower().strip():
                return 80
            return 30

        # Haversine formula to calculate exact distance across the Earth's surface
        R = 6371.0 # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) * math.sin(dlon / 2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_km = R * c

        # Convert distance into an AI Score (0 to 100)
        # If they are within 5km, score is 100. If they are 50km away, score drops to 0.
        max_acceptable_distance = 50.0 
        if distance_km <= 5:
            return 100
        elif distance_km >= max_acceptable_distance:
            return 0
        else:
            # Calculate a sliding scale score between 5km and 50km
            return 100 - ((distance_km - 5) / (max_acceptable_distance - 5) * 100)

    @staticmethod
    def get_best_matches(blood_group, hospital_location, urgency_level):
        """
        The core algorithm to find the best donors for an emergency.
        """
        # 1. Filter out unavailable donors and wrong blood types
        potential_donors = DonorProfile.objects.filter(
            blood_group=blood_group,
            is_available=True
        ).select_related('user')

        scored_donors = []
        three_months_ago = date.today() - relativedelta(months=3)

        for donor in potential_donors:
            # 2. Medical Rule: Cannot donate if they donated in the last 3 months
            if donor.last_donation_date and donor.last_donation_date > three_months_ago:
                continue

            # 3. Calculate Location Score
            donor_location = donor.user.address
            location_score = DonorMatchEngine.calculate_distance(hospital_location, donor_location)

            # 4. Calculate Final AI Match Score
            # Weighting: Trust Score is 70% important, Location is 30% important
            trust_weight = 0.7
            location_weight = 0.3
            
            # If it's a CRITICAL emergency, location becomes 60% important!
            if urgency_level == 'critical':
                trust_weight = 0.4
                location_weight = 0.6

            final_score = (donor.trust_score * trust_weight) + (location_score * location_weight)

            scored_donors.append({
                'donor_profile': donor,
                'match_score': round(final_score, 2)
            })

        # 5. Sort donors by the highest match score
        scored_donors.sort(key=lambda x: x['match_score'], reverse=True)

        # Return the top 10 best matches
        return scored_donors[:10]

class TrustScoreEngine:
    @staticmethod
    def penalize_donor(donor_profile, reason, points=20):
        """
        Deducts points, creates an audit trail, and auto-bans if necessary.
        """
        # 1. Deduct the points
        donor_profile.trust_score -= points
        donor_profile.save()

        # 2. Create the System Audit Record for the Admin
        Penalty.objects.create(
            user=donor_profile.user,
            reason=reason,
            points_deducted=points
        )

        # 3. AI AUTO-BAN LOGIC
        # If their trust score drops below 20, ban them from the network
        if donor_profile.trust_score < 20:
            donor_profile.is_available = False # Hide them from the map
            donor_profile.save()
            
            # Add to the permanent Blacklist
            Blacklist.objects.get_or_create(
                user=donor_profile.user,
                defaults={'reason': f"AI Auto-Ban: Trust score dropped to {donor_profile.trust_score} due to repeated offenses."}
            )
            
            print(f"🚫 AI ACTION: User {donor_profile.user.username} has been BLACKLISTED.")

        return donor_profile.trust_score

