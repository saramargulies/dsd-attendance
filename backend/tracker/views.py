from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .encoders import (
    GroupListEncoder,
    ClientListEncoder,
    NotesListEncoder,
    WeeklyListEncoder,
    PackageEncoder,
    ClassListEncoder,
    PrivateEncoder,
    OutingListEncoder,
    CalendarListEncoder,
    OutingDetailEncoder,
    DogDetailEncoder,
)
from .serializers import (ClassListSerializer)
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
from django.views.decorators.http import require_http_methods
import json
from django.db import IntegrityError


@require_http_methods(["GET", "POST"])
def api_list_dogs(request, group=None):
    if request.method == "GET":
        dogs = (
            Dog.objects.select_related("group", "w_class", "client")
            .prefetch_related("w_class", "outinginstance_set")
            .all()
        )
        return JsonResponse({"dogs": dogs}, encoder=DogDetailEncoder, safe=False)
    elif request.method == "POST":
        clients = []
        for person in Client.objects.all():
            clients.append(str(person))

        content = json.loads(request.body)

        try:
            client = Client.objects.get(name=content["client"])
            content["client"] = client
        except Client.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Client does not exist. Please create this client before creating this dog.",
                    "clients": clients,
                },
                status=400,
            )
        try:
            w_class = WeeklyClass.objects.get(day_and_time=content["w_class"])
            content["w_class"] = w_class
        except WeeklyClass.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Weekly Class name does not exist. Please choose a valid day and time."
                },
                status=400,
            )

        try:
            group = Group.objects.get(name=content["group"])
            content["group"] = group
        except Group.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Group does not exist. Please choose a valid group.",
                    "content": content,
                    "group": content["group"],
                },
                status=400,
            )

        dog = Dog.objects.create(**content)
        return JsonResponse(dog, encoder=DogDetailEncoder, safe=False)


@require_http_methods(["PUT", "GET"])
def api_show_dog(request, id):
    dog = Dog.objects.get(id=id)
    if request.method == "GET":
        return JsonResponse(dog, encoder=DogDetailEncoder, safe=False)
    elif request.method == "PUT":
        content = json.loads(request.body)
        try:
            client = Client.objects.get(name=content["client"])
            content["client"] = client
        except Client.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Client does not exist. Please create this client before creating this dog."
                },
                status=400,
            )
        try:
            group = Group.objects.get(name=content["group"])
            content["group"] = group
        except Group.DoesNotExist:
            return JsonResponse({"message": "Invalid group"}, status=400)
        try:
            w_class = WeeklyClass.objects.get(day_and_time=content["w_class"])
            content["w_class"] = w_class
        except WeeklyClass.DoesNotExist:
            return JsonResponse({"message": "Invalid weekly class"}, status=400)
        Dog.objects.filter(id=id).update(**content)
        dog = Dog.objects.get(id=id)
        return JsonResponse(dog, encoder=DogDetailEncoder, safe=False)


@require_http_methods(["GET", "POST"])
def outings_calendar(request):
    if request.method == "GET":
        outings = OutingInstance.objects.all()
        return JsonResponse(
            {"outings": outings}, encoder=CalendarListEncoder, safe=False
        )


@require_http_methods(["GET", "POST"])
def list_outings(request):
    if request.method == "GET":
        outings = OutingInstance.objects.all()
        return JsonResponse({"outings": outings}, encoder=OutingListEncoder, safe=False)

    elif request.method == "POST":
        content = json.loads(request.body)
        groups = []
        try:
            for group in content["groups_invited"]:
                grp = Group.objects.get(name=group)
                groups.append(grp)
            content.pop("groups_invited")
        except Group.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Group does not exist. Please choose a valid group.",
                    "content": content,
                    "group": content["group"],
                },
                status=400,
            )

        outing = OutingInstance.objects.create(**content)
        outing.groups_invited.add(*groups)
        return JsonResponse(outing, encoder=OutingListEncoder, safe=False)


@require_http_methods(["PUT"])
def take_attendance(request, id):
    outing = OutingInstance.objects.get(id=id)
    content = json.loads(request.body)

    dogs = []
    try:
        for entry in content["outing_attendance"]:
            dog = Dog.objects.get(id=entry)
            dogs.append(dog)
        content.pop("outing_attendance")
    except Dog.DoesNotExist:
        return JsonResponse(
            {"message": "Dog does not exist. Please choose an existing dog."},
            status=400,
        )
    outing.outing_attendance.add(*dogs)
    outing.update_avail_out()
    outing = OutingInstance.objects.filter(id=id).update(attendance_taken=True)
    print(outing)
    return JsonResponse(outing, encoder=OutingDetailEncoder, safe=False)


@require_http_methods(["PUT", "GET", "DELETE"])
def show_outing(request, id):
    try:
        outing = OutingInstance.objects.get(id=id)
    except OutingInstance.DoesNotExist:
        return JsonResponse({"message": "Outing does not exist"}, status=404)
    if request.method == "GET":
        return JsonResponse(outing, encoder=OutingDetailEncoder, safe=False)
    elif request.method == "PUT":
        content = json.loads(request.body)
        for group in outing.groups_invited.all():
            group = group.id
            outing.groups_invited.remove(group)
        groups = []
        try:
            for group in content["groups_invited"]:
                grp = Group.objects.get(name=group)
                groups.append(grp)
            content.pop("groups_invited")
        except Group.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Group does not exist. Please choose a valid group.",
                    "content": content,
                    "group": content["group"],
                },
                status=400,
            )
        outing.groups_invited.add(*groups)
        outing = OutingInstance.objects.filter(id=id).update(**content)
        return JsonResponse(outing, encoder=OutingListEncoder, safe=False)
    elif request.method == "DELETE":
        count, _ = OutingInstance.objects.filter(id=id).delete()
        return JsonResponse({"deleted": count > 0})


@require_http_methods(["GET"])
def list_weeklies(request):
    if request.method == "GET":
        weeklies = WeeklyClass.objects.all()
        return JsonResponse(
            {"weekly_classes": weeklies}, encoder=WeeklyListEncoder, safe=False
        )


@require_http_methods(["GET", "POST"])
def list_clients(request):
    if request.method == "GET":
        clients = Client.objects.all()
        return JsonResponse({"clients": clients}, encoder=ClientListEncoder, safe=False)
    elif request.method == "POST":
        content = json.loads(request.body)
        try:
            client = Client.objects.create(**content)
        except IntegrityError:
            return JsonResponse(
                {"Error": "This client already exists."},
                status=400,
            )
        return JsonResponse(client, encoder=ClientListEncoder, safe=False)


# @require_http_methods(["GET"])
class ClassListViewSet(viewsets.ModelViewSet):
    queryset = ClassInstance.objects.all()
    serializer_class = ClassListSerializer
    permission_classes = [permissions.IsAuthenticated]

@require_http_methods(["GET", "POST"])
def list_classes(request):
    if request.method == "GET":
        classes = ClassInstance.objects.all()
        return JsonResponse({"classes": classes}, encoder=ClassListEncoder, safe=False)

    elif request.method == "POST":
        content = json.loads(request.body)
        dogs = []
        try:
            for entry in content["class_attendance"]:
                dog = Dog.objects.get(id=entry)
                dogs.append(dog)
            content.pop("class_attendance")
        except Dog.DoesNotExist:
            return JsonResponse(
                {"message": "Dog does not exist. Please choose an existing dog."},
                status=400,
            )
        try:
            weekly_class = WeeklyClass.objects.get(id=content["weekly_class"])
            content["weekly_class"] = weekly_class
        except WeeklyClass.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Weekly Class name does not exist. Please choose a valid day and time."
                },
                status=400,
            )

        class_instance = ClassInstance.objects.create(**content)
        class_instance.class_attendance.add(*dogs)
        class_instance.update_avail_class()
        return JsonResponse(class_instance, encoder=ClassListEncoder, safe=False)


@require_http_methods(["GET"])
def list_groups(request):
    if request.method == "GET":
        groups = Group.objects.all()
        return JsonResponse({"groups": groups}, encoder=GroupListEncoder, safe=False)


@require_http_methods(["GET", "POST"])
def list_notes(request):
    if request.method == "GET":
        notes = Notes.objects.all()
        return JsonResponse({"notes": notes}, encoder=NotesListEncoder, safe=False)
    elif request.method == "POST":
        content = json.loads(request.body)

        note = Notes.objects.create(**content)
        return JsonResponse(note, encoder=NotesListEncoder, safe=False)


@require_http_methods(["PUT"])
def dismiss_note(request, id):
    if request.method == "PUT":
        try:
            note = Notes.objects.get(id=id)
        except Notes.DoesNotExist:
            return JsonResponse({"message": "That note does not exist"}, status=404)
        Notes.objects.filter(id=id).update(is_completed=True)
        return JsonResponse(note, encoder=NotesListEncoder, safe=False)


@require_http_methods(["GET", "POST"])
def list_packages(request):
    if request.method == "GET":
        packages = PvtPackage.objects.all()
        return JsonResponse({"packages": packages}, encoder=PackageEncoder, safe=False)
    elif request.method == "POST":
        content = json.loads(request.body)

        try:
            dog = Dog.objects.get(id=content["dog"])
            content["dog"] = dog
        except Dog.DoesNotExist:
            return JsonResponse({"message": "That dog does not exist"}, status=404)

        package = PvtPackage.objects.create(**content)
        return JsonResponse(package, encoder=PackageEncoder, safe=False)


@require_http_methods(["GET", "POST"])
def list_privates(request):
    if request.method == "GET":
        privates = PvtInstance.objects.all()
        return JsonResponse({"privates": privates}, encoder=PrivateEncoder, safe=False)
    elif request.method == "POST":
        content = json.loads(request.body)

        try:
            package = PvtPackage.objects.get(id=content["package"])
            content["package"] = package
        except PvtPackage.DoesNotExist:
            return JsonResponse({"message": "That package does not exist"}, status=404)

        private = PvtInstance.objects.create(**content)
        return JsonResponse(private, encoder=PrivateEncoder, safe=False)
