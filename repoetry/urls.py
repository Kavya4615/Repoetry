from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('like/<int:poem_id>/', views.like_poem, name='like_poem'),
    path('comment/<int:poem_id>/', views.add_comment, name='add_comment'),

    # ⭐ NEW AI ROUTES
    path('transform/', views.transform_page, name='transform_page'),
    path('transform/submit/', views.transform_poem, name='transform_poem'),
    path("add/", views.add_poem, name="add_poem"),



]
