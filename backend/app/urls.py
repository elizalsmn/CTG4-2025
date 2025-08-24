from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.say_hello),
    # path('qrcode/', views.qrcode, name="qrcode"),
    path('create_user/', views.create_user, name="create_user"),
    path('delete_user/', views.delete_user, name='delete_user'),
    path('create_batch_user/', views.create_batch_user, name='create_batch_user'),
    path('accept_picture/', views.accept_picture, name='accept_picture'),
    path('add_to_leaderboard/', views.add_to_leaderboard_view, name='add_to_leaderboard'),
    path('top_leaderboard/', views.top_leaderboard, name='top_leaderboard'),
    path('adjust_point/', views.adjust_leaderboard_point, name='adjust_point'),
    path('delete_leaderboard/', views.delete_leaderboard, name='delete_leaderboard'),
]