from django.urls import path

from classes.views import CategoriesListView, CategoryView, ClassesListView, ClassView

app_name = 'classes'

urlpatterns = [
    path('<int:class_id>/', ClassView.as_view()),
    path('all/', ClassesListView.as_view()),
    path('categories/all/', CategoriesListView.as_view()),
    path('categories/<int:category_id>/', CategoryView.as_view()),
    # path('add/', CreateClassView.as_view())
]
