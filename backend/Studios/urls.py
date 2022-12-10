from django.urls import path


from .views import StudiosListView, StudioDetailView, AllStudioListView
from classes.views import ClassInstancesListView


app_name = 'Studios'

urlpatterns = [
    path('all1/', AllStudioListView.as_view()),
    path('all/', StudiosListView.as_view()),
    path('<int:studio_id>/', StudioDetailView.as_view()),
    # studio future class instances
    path('<int:studio_id>/all', ClassInstancesListView.as_view()),
]
