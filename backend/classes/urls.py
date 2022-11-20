from django.urls import path

from classes.views import ClassInstancesListView, DropClassView, EnrollClassView, \
    UserEnrollmentHistoryListView

app_name = 'classes'

urlpatterns = [
    # get all class in a specific studio
    path('<int:studio_id>/all', ClassInstancesListView.as_view()),
    path('enroll/', EnrollClassView.as_view()),
    path('drop/', DropClassView.as_view()),
    # see user class schedule and history
    path('enrollments/', UserEnrollmentHistoryListView.as_view()),

    # not required stuff
    # path('categories/all/', CategoriesListView.as_view()),
    # path('categories/<int:category_id>/', CategoryView.as_view()),

    # path('<int:class_id>/', ClassView.as_view()),
    # path('all/', ClassesListView.as_view()),
]
