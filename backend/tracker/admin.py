from django.contrib import admin
from tracker.models import (
    Dog,
    Client,
    WeeklyClass,
    ClassInstance,
    Group,
    OutingInstance,
    Notes,
    PvtInstance,
    PvtPackage
)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )


@admin.register(WeeklyClass)
class WeeklyClassAdmin(admin.ModelAdmin):
    list_display = (
        "day_and_time",
    )


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )


@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "started_on",
        "group",
        "w_class",
        "client",
        "class_available",
        "outing_available",
        "archived",
        "id"
    )


@admin.register(ClassInstance)
class ClassInstanceAdmin(admin.ModelAdmin):
    model = ClassInstance
    list_display = (
        "occurred_on",
        "id"
    )


@admin.register(OutingInstance)
class OutingInstanceAdmin(admin.ModelAdmin):
    model = OutingInstance
    list_display = (
        "location",
        "starts",
        "ends",
        "address",
        "id"
    )


@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    model = Notes
    list_display = (
        "note",
        "date_added",
        "is_completed",
        "id"
    )


@admin.register(PvtPackage)
class PackageAdmin(admin.ModelAdmin):
    model = PvtPackage
    list_display = (
        "dog",
        "sessions",
        "is_complete",
        "id"
    )


@admin.register(PvtInstance)
class PvtInstanceAdmin(admin.ModelAdmin):
    model = PvtInstance
    list_display = (
        "occurred_on",
        "package",
        "id"
    )
