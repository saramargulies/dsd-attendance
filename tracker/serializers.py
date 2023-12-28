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
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["name", "id"]


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["name", "id"]


class NotesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ["note", "date_added", "is_completed", "id"]


class WeeklyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyClass
        fields = ["day_and_time", "id"]


class DogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dog
        depth = 1
        fields = '__all__'



class ClassListSerializer(serializers.ModelSerializer):

    class Meta:
        # order_by = ['-id']
        model = ClassInstance
        depth = 1
        fields = '__all__'

    # def create(self, validated_data):
    #     ClassInstance.objects.create(**validated_data)


class LastTenClassListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClassInstance
        depth = 1

        fields = '__all__'


# class ClassListEncoder(ModelEncoder):
#     model = ClassInstance
#     properties = [
#         "occurred_on",
#         "weekly_class",
#         "weekly_class",
#         "id",
#     ]

#     def get_extra_data(self, obj):
#         dogs = []
#         for dog in obj.class_attendance.all():
#             print("printing a dogs name...")
#             dogs.append(dog.name)
#         return {
#             "class_attendance": dogs,
#             "weekly_class": obj.weekly_class.day_and_time,
#         }


# class PackageEncoder(ModelEncoder):
#     model = PvtPackage
#     properties = ["dog", "sessions", "is_complete", "id"]

#     def get_extra_data(self, obj):
#         return {
#             "dog": obj.dog.name,
#         }


# class PrivateEncoder(ModelEncoder):
#     model = PvtInstance
#     properties = ["occurred_on", "package", "id"]

#     def get_extra_data(self, obj):
#         return {
#             "package": obj.package.dog.name + ", " + str(obj.package.sessions),
#         }


# class OutingListEncoder(ModelEncoder):
#     model = OutingInstance
#     properties = [
#         "location",
#         "starts",
#         "ends",
#         "groups_invited",
#         "attendance_taken",
#         "address",
#         "id",
#     ]

#     def get_extra_data(self, obj):
#         grps = []
#         for group in obj.groups_invited.all():
#             grps.append(group.name)
#         return {"groups_invited": grps}


# class CalendarListEncoder(ExtraModelEncoder):
#     model = OutingInstance
#     properties = ["location", "starts", "ends", "groups_invited", "address", "id"]

#     def get_extra_data(self, obj):
#         grps = []
#         for group in obj.groups_invited.all():
#             grps.append(group.name)
#         return {"groups_invited": grps}


# class OutingDetailEncoder(ModelEncoder):
#     model = OutingInstance
#     properties = [
#         "location",
#         "starts",
#         "ends",
#         "groups_invited",
#         "outing_attendance",
#         "address",
#         "attendance_taken",
#         "id",
#     ]

#     def get_extra_data(self, obj):
#         grps = []
#         dogs = []
#         for group in obj.groups_invited.all():
#             grps.append(group.name)
#         for dog in obj.outing_attendance.all():
#             dogs.append(dog.name)
#         return {"groups_invited": grps, "outing_attendance": dogs}



