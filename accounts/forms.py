from django import forms


class LoginForm(forms.Form):
    email = forms.CharField(max_length=15)
    password = forms.CharField(max_length=15, widget=forms.PasswordInput)
