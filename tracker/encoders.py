from datetime import datetime
from .models import (
    Dog,
    Client,
    WeeklyClass,
    Group,
    OutingInstance,
    ClassInstance,
    Notes,
    PvtInstance,
    PvtPackage,
)
from .common.json import ModelEncoder, ExtraModelEncoder


class GroupListEncoder(ModelEncoder):
    model = Group
    properties = ["name", "id"]


class ClientListEncoder(ModelEncoder):
    model = Client
    properties = ["name", "id"]


class NotesListEncoder(ModelEncoder):
    model = Notes
    properties = ["note", "date_added", "is_completed", "id"]


class WeeklyListEncoder(ModelEncoder):
    model = WeeklyClass
    properties = ["day_and_time", "id"]


class ClassListEncoder(ModelEncoder):
    model = ClassInstance
    properties = [
        "occurred_on",
        "weekly_class",
        "weekly_class",
        "id",
    ]

    def get_extra_data(self, obj):
        dogs = []
        for dog in obj.class_attendance.all():
            print("printing a dogs name...")
            dogs.append(dog.name)
        return {
            "class_attendance": dogs,
            "weekly_class": obj.weekly_class.day_and_time,
        }


class PackageEncoder(ModelEncoder):
    model = PvtPackage
    properties = ["dog", "sessions", "is_complete", "id"]

    def get_extra_data(self, obj):
        return {
            "dog": obj.dog.name,
        }


class PrivateEncoder(ModelEncoder):
    model = PvtInstance
    properties = ["occurred_on", "package", "id"]

    def get_extra_data(self, obj):
        return {
            "package": obj.package.dog.name + ", " + str(obj.package.sessions),
        }


class OutingListEncoder(ModelEncoder):
    model = OutingInstance
    properties = [
        "location",
        "starts",
        "ends",
        "groups_invited",
        "attendance_taken",
        "address",
        "id",
    ]

    def get_extra_data(self, obj):
        grps = []
        for group in obj.groups_invited.all():
            grps.append(group.name)
        return {"groups_invited": grps}


class CalendarListEncoder(ExtraModelEncoder):
    model = OutingInstance
    properties = ["location", "starts", "ends", "groups_invited", "address", "id"]

    def get_extra_data(self, obj):
        grps = []
        for group in obj.groups_invited.all():
            grps.append(group.name)
        return {"groups_invited": grps}


class OutingDetailEncoder(ModelEncoder):
    model = OutingInstance
    properties = [
        "location",
        "starts",
        "ends",
        "groups_invited",
        "outing_attendance",
        "address",
        "attendance_taken",
        "id",
    ]

    def get_extra_data(self, obj):
        grps = []
        dogs = []
        for group in obj.groups_invited.all():
            grps.append(group.name)
        for dog in obj.outing_attendance.all():
            dogs.append(dog.name)
        return {"groups_invited": grps, "outing_attendance": dogs}


class DogDetailEncoder(ModelEncoder):
    model = Dog
    properties = [
        "name",
        "client",
        "group",
        "w_class",
        "started_on",
        "class_available",
        "outing_available",
        "archived",
        "id",
    ]

    def get_extra_data(self, obj):
        outings = []
        classes = []
        privates = []
        for outing in obj.outinginstance_set.all():
            outings.append(
                {
                    "location": outing.location,
                    "date": datetime.strftime(outing.starts, "%a %B %d %Y"),
                    "hours": outing.get_hours(),
                }
            )
        for class_instance in obj.classinstance_set.all():
            classes.append(class_instance.occurred_on)
        for private_package in obj.pvtpackage_set.all():
            for private_instance in private_package.package.all():
                privates.append(private_instance.occurred_on)
        return {
            "client": obj.client.name,
            "group": obj.group.name,
            "w_class": obj.w_class.day_and_time,
            "outings": outings,
            "classes": classes,
            "pvt_log": privates,
        }
