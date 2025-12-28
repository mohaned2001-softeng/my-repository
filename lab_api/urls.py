from django.urls import path 

from .views import AddLabView , EditLabView , DeleteLabView ,DeleteAllLabsView, ListLabsView , TeacherLabsView

urlpatterns = [
    path("add-lab/",AddLabView.as_view(), name="add-lab"),
    path("edit-lab/<uuid:lab_id>/",EditLabView.as_view() ,name="edit-lab"),
    path("delete-lab/<uuid:lab_id>/",DeleteLabView.as_view(), name="delete-lab"),
    path("delete-all-labs/",DeleteAllLabsView.as_view(), name="delete-all-labs"),
    path("fetch-labs/",ListLabsView.as_view() , name="fetch-labs"),
    path("fetch-teacher-labs/",TeacherLabsView.as_view() , name="fetch-teacher-labs"),
    path("test-endpoint/",ListLabsView.as_view() , name="test-endpoint"),
]