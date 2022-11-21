from django.urls import path


from .views import StudiosListView, StudioDetailView
from classes.views import ClassInstancesListView


app_name = 'Studios'

urlpatterns = [
    path('all/', StudiosListView.as_view()),
    path('<int:studio_id>/', StudioDetailView.as_view()),
    # studio future class instances
    path('<int:studio_id>/all', ClassInstancesListView.as_view()),
]
