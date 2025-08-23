from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.say_hello),
    # path('qrcode/', views.qrcode, name="qrcode"),
    path('create_user/', views.create_user, name="create_user"),
    path('delete_user/', views.delete_user, name='delete_user'),
]