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
    path('add/', views.add_poem, name='add_poem'),

    

]

# Production static serving fallback for Gunicorn/Render
from django.views.static import serve
from django.urls import re_path
from django.conf import settings

urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATICFILES_DIRS[0]}),
]
