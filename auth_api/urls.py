from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    SendOTPView,
    ForgotPasswordSendOTPView,
    VerifyOTPView,
    SetPasswordView,
    GetUserView,
    EditUserView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('forgot-password/send-otp/', ForgotPasswordSendOTPView.as_view(), name='forgot_password_send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('set-password/', SetPasswordView.as_view(), name='set_password'),
    path('user/', GetUserView.as_view(), name='get_user'),
    path('edit-user/', EditUserView.as_view(), name='edit_user'),
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh_token'),
]
