from django.urls import path
from accounts.views import GetCSRFToken, CheckAuthenticatedView, LoginView, LogoutView

urlpatterns = [
    path('authenticated/', CheckAuthenticatedView.as_view()),
    path('csrf_cookie/', GetCSRFToken.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
]