from django.contrib.gis import admin
from .models import *


# *** Models registered ***
admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Building, admin.OSMGeoAdmin)
admin.site.register(CampingArea, admin.OSMGeoAdmin)
admin.site.register(Pool, admin.OSMGeoAdmin)
admin.site.register(Tree, admin.OSMGeoAdmin)
