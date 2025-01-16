from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import redirect
from django.views.generic import TemplateView

def redirect_to_home(request):
    return redirect("admin/")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("", redirect_to_home, name="home_page"),
    path("attendance/", include("tracker.urls")),
    path("auth/", include("rest_framework.urls"))
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]