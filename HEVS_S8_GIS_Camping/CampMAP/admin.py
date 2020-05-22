from django.contrib.gis import admin
from django.contrib.auth.models import Group
from .models import *


# *** Models registered ***
admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Building, admin.OSMGeoAdmin)
admin.site.register(CampingArea, admin.OSMGeoAdmin)
admin.site.register(Pool, admin.OSMGeoAdmin)
admin.site.register(Tree, admin.OSMGeoAdmin)
