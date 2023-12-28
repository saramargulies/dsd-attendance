from json import JSONEncoder
from datetime import datetime, date
from django.db.models import QuerySet, ManyToManyField
from decimal import Decimal


class QuerySetEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return list(o)
        else:
            return super().default(o)


class DateEncoder(JSONEncoder):
    def default(self, obj):
        if type(obj) == date:
            return datetime.strftime(obj,'%B %d, %Y')
        else:
            return super().default(obj)


class DateTimeEncoder(JSONEncoder):
    def default(self, obj):
        if type(obj) == datetime:
            return datetime.strftime(obj,'%B %d, %Y, %I:%M%p')
        else:
            return super().default(obj)


class CalendarEncoder(JSONEncoder):
    def default(self, obj):
        if type(obj) == datetime:
            return obj.isoformat()
        else:
            return super().default(obj)
        

class DecimalEncoder(JSONEncoder):
    def default(self, obj):
        if type(obj) == Decimal:
            return str(obj)
        else:
            return super().default(obj)


class ModelEncoder(DateTimeEncoder, DecimalEncoder, QuerySetEncoder, DateEncoder, JSONEncoder):
    encoders = {}

    def default(self, obj):
        if isinstance(obj, self.model):
            dictionary = {}
            # if hasattr(obj, "client"):
            #     dictionary["client"] = obj.client
            for property in self.properties:
                value = getattr(obj, property)
                if property in self.encoders:
                    encoder = self.encoders[property]
                    value = encoder.default(value)
                dictionary[property] = value
            dictionary.update(self.get_extra_data(obj))
            return dictionary
        else:
            return super().default(obj)

    def get_extra_data(self, obj):
        return {}


class ExtraModelEncoder(CalendarEncoder, DecimalEncoder, QuerySetEncoder, DateEncoder, JSONEncoder):
    encoders = {}

    def default(self, obj):
        if isinstance(obj, self.model):
            dictionary = {}
            # if hasattr(obj, "client"):
            #     dictionary["client"] = obj.client
            for property in self.properties:
                value = getattr(obj, property)
                if property in self.encoders:
                    encoder = self.encoders[property]
                    value = encoder.default(value)
                dictionary[property] = value
            dictionary.update(self.get_extra_data(obj))
            return dictionary
        else:
            return super().default(obj)

    def get_extra_data(self, obj):
        return {}
