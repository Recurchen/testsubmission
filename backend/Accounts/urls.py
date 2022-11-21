from django.db import router
from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, LogInView, UserRetrieveUpdateAPIView
from .views import CreatePaymentMethodView, RetriveUpdatePaymentMethodView, DeletePaymentMethodView
# from .views import ProfileAPI


app_name = 'accounts'

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register', RegisterView.as_view()),
    path('login', LogInView.as_view()),
    # path('users/<user_id>/profile/', ProfileAPI.as_view()),
    path('users/<user_id>/detail', UserRetrieveUpdateAPIView.as_view()),
    path('users/<user_id>/payment_method/add', CreatePaymentMethodView.as_view()),
    path('users/<user_id>/payment_method', RetriveUpdatePaymentMethodView.as_view()),
    path('users/<user_id>/payment_method/remove', DeletePaymentMethodView.as_view())
]
