from django.db import models
from decimal import Decimal
from datetime import date, datetime


# Current goals in model building:


class Group(models.Model):
    """
    The Group model is a system of classifying dogs by which outings are available to them
    """

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class WeeklyClass(models.Model):
    """
    The ClassSet model represents the weekly reserved spot that class has, and will be used to compare available classes to attended classes in specific dog's attendance records.
    """

    day_and_time = models.CharField(max_length=200)

    def __str__(self):
        return self.day_and_time


class Client(models.Model):
    """
    The Client model represents the handler of the dog
    """

    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


class Dog(models.Model):
    """
    The Dog model represents the individual dog whose hours need to be tracked
    """

    name = models.CharField(max_length=200)
    group = models.ForeignKey(Group, related_name="group", on_delete=models.PROTECT)
    w_class = models.ForeignKey(
        WeeklyClass, related_name="w_class", on_delete=models.PROTECT
    )
    client = models.ForeignKey(Client, related_name="client", on_delete=models.PROTECT)
    started_on = models.DateField(default=date.today)

    class_available = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    outing_available = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ClassInstance(models.Model):
    """
    The ClassInstance model represents a specific instance of a class. For example if there is class every week on Thursday @ 2pm, an instance of that class would include the specific date and the dogs that attended
    """

    occurred_on = models.DateField(null=True)
    class_attendance = models.ManyToManyField(Dog, blank=True)
    weekly_class = models.ForeignKey(
        WeeklyClass, related_name="weekly_class", on_delete=models.PROTECT
    )
    str_date = str(occurred_on)

    def __str__(self):
        return self.str_date

    def update_avail_class(self):
        for dog in Dog.objects.filter(w_class=self.weekly_class):
            dog.class_available += Decimal.from_float(1.5)
            dog.save()


class PvtPackage(models.Model):
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE)
    sessions = models.IntegerField()
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return str(self.dog) + ", " + str(self.sessions)

    def add_pvt_avail(self):
        dog = Dog.objects.get(id=self.dog.id)
        num = self.sessions * 1.5
        dog.pvt_avail += Decimal.from_float(num)
        dog.save()


class PvtInstance(models.Model):
    """
    The PvtInstance model represents a specific instance of a private.
    """

    occurred_on = models.DateField(null=True)
    package = models.ForeignKey(
        PvtPackage, related_name="package", on_delete=models.CASCADE
    )

    str_date = str(occurred_on)

    def __str__(self):
        return self.str_date


class OutingInstance(models.Model):
    """
    The OutingInstance model tracks when an outing happened, how long it occurred for, which groups were invited, which dogs attended, and where it took place
    """

    location = models.CharField(max_length=200)
    starts = models.DateTimeField()
    ends = models.DateTimeField()
    groups_invited = models.ManyToManyField(Group)
    outing_attendance = models.ManyToManyField(Dog, blank=True)
    attendance_taken = models.BooleanField(default=False)
    address = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.location

    def get_hours(self):
        """
        Get the duration of this outing
        """
        delta = self.ends - self.starts
        time_in_sec = delta.total_seconds()
        hours = time_in_sec / 3600

        return Decimal.from_float(hours)

    def update_avail_out(self):
        hours = self.get_hours()

        for group in self.groups_invited.all():
            for dog in Dog.objects.filter(group=group):
                dog.outing_available += hours
                dog.save()


class Notes(models.Model):
    """
    Most recent 5 instances will show up on user's home page. Anyone can make them.
    """

    note = models.TextField()
    date_added = models.DateField(auto_now_add=True, null=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.note
