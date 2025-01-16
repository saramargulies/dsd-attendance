from django.urls import path, include
from rest_framework import routers
from .views import (
    ClassListViewSet,
    api_list_dogs,
    api_show_dog,
    list_outings,
    show_outing,
    list_classes,
    list_weeklies,
    list_groups,
    take_attendance,
    list_clients,
    outings_calendar,
    list_notes,
    dismiss_note,
    list_packages,
    list_privates,
)

# class_list = ClassListViewSet.as_view({
#     'get': 'list',
#     'post': 'create'
# })

router = routers.DefaultRouter()
router.register("", ClassListViewSet, basename="classes")

urlpatterns = [
    path("dogs/", api_list_dogs, name="api_list_dogs"),
    path("dogs/<int:id>/", api_show_dog, name="api_show_dogs"),
    path("calendar/", outings_calendar, name="outings_calendar"),
    path("outings/", list_outings, name="list_outings"),
    path("outings/<int:id>/", show_outing, name="show_outing"),
    path("outings/<int:id>/take_attendance", take_attendance, name="take_attendance"),
    path("classes/", include(router.urls)),
    # path("classes/", ClassListViewSet.as_view({'get': 'list'}), name="list_classes"),
    # path("classes/", list_classes, name="list_classes"),
    path("weekly/", list_weeklies, name="list_weeklies"),
    path("groups/", list_groups, name="list_groups"),
    path("clients/", list_clients, name="list_clients"),
    path("notes/", list_notes, name="list_notes"),
    path("notes/<int:id>/", dismiss_note, name="dismiss_note"),
    path("packages/", list_packages, name="list_packages"),
    path("privates/", list_privates, name="list_privates"),
]

urlpatterns += router.urls