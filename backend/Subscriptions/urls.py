from django.db import router
from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView
from .views import PlansView, CreateSubView, CancelSubView, PastPaymentView, FuturePaymentView, UpdateSubView, RetriveSubView
# from .views import ProfileAPI

app_name = 'subscriptions'

urlpatterns = [
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('plans/', PlansView.as_view()),
    path('users/<user_id>/details/', RetriveSubView.as_view()),
    path('users/<user_id>/add/', CreateSubView.as_view()),
    path('users/<user_id>/cancel/', CancelSubView.as_view()),
    path('users/<user_id>/update/', UpdateSubView.as_view()),
    path('users/<user_id>/payments/past/', PastPaymentView.as_view()),
    path('users/<user_id>/payments/future/', FuturePaymentView.as_view())
]
