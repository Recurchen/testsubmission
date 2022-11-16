from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, LogInView

app_name = 'accounts'

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path("accounts/", include("django.contrib.auth.urls")),  # ADDITION: include the default auth urls
    # path("accounts/signup/", accounts_views.SingUpFormView.as_view(), name="signup")
    path('register', RegisterView.as_view()),
    path('login', LogInView.as_view())
]
