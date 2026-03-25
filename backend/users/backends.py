# backend/users/backends.py
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # SimpleJWT passes the email inside the 'username' variable from React
            # We tell Django to search the database's 'email' field instead!
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None

        # If the user exists, check the password
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None