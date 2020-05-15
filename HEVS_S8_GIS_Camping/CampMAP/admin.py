from django.contrib.gis import admin
from .models import *

admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Building, admin.OSMGeoAdmin)
admin.site.register(CampingArea, admin.OSMGeoAdmin)
admin.site.register(Pool, admin.OSMGeoAdmin)
admin.site.register(Tree, admin.OSMGeoAdmin)


# *** EXAMPLES ***
# from .models import City, Hospital, Canton


# Register your models here.

# *** EXAMPLES ***
# admin.site.register(City)
# admin.site.register(Hospital)