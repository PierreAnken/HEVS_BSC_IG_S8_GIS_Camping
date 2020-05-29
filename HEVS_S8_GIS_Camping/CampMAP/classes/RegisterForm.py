from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms


class RegisterForm(UserCreationForm):
    first_name = forms.CharField(max_length=32)
    last_name = forms.CharField(max_length=32)
    email = forms.EmailField(max_length=64, help_text="Enter a valid email address")
    adults = forms.IntegerField(help_text="Indicate the number of adults")
    kids = forms.IntegerField(help_text="Indicate the number of children")
    pets = forms.BooleanField(required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name', 'email', 'adults', 'kids', 'pets')
