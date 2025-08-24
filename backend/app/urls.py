from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.say_hello),
    # path('qrcode/', views.qrcode, name="qrcode"),
    path('create_user/', views.create_user, name="create_user"),
    path('delete_user/', views.delete_user, name='delete_user'),
    
    # AI Grading endpoints
    # path('assignments/submit/', views.submit_written_assignment, name='submit_assignment'),
    # path('assignments/<int:assignment_id>/grade/', views.get_assignment_grade, name='get_assignment_grade'),
    path('create_batch_user/', views.create_batch_user, name='create_batch_user'),
    path('accept_picture/', views.accept_picture, name='accept_picture'),
    path('add_to_leaderboard/', views.add_to_leaderboard_view, name='add_to_leaderboard'),
    path('top_leaderboard/', views.top_leaderboard, name='top_leaderboard'),
    path('adjust_point/', views.adjust_leaderboard_point, name='adjust_point'),
    path('delete_leaderboard/', views.delete_leaderboard, name='delete_leaderboard'),
]