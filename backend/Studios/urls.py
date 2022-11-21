from django.urls import path

from .views import StudiosListView, StudioDetailView

app_name = 'Studios'

urlpatterns = [
    path('all/', StudiosListView.as_view()),
    path('<int:studio_id>/', StudioDetailView.as_view()),
]
