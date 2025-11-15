from django.contrib import admin
from django.urls import path, include
from repoetry import views  # ✅ Import your app’s views properly
from repoetry.views import transform_page, transform_poem


urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth routes
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Main app routes
    path('', views.home, name='home'),
    path('repoetry/', include('repoetry.urls')),  # include the app-level urls
    path("transform/", transform_page, name="transform_page"),
    path("transform/run/", transform_poem, name="transform_poem"),
    

]
