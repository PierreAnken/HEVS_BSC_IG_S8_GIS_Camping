from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import *
from itertools import chain


# Create your views here.
def campingjson(request):
    areas = Area.objects.all()
    buildings = Building.objects.all()
    camping_areas = CampingArea.objects.all()
    pools = Pool.objects.all()
    trees = Tree.objects.all()

    camping = list(chain(areas, buildings, camping_areas, pools, trees))
    ser = serialize('geojson', camping, geometry_field='geom', fields=('gid',))
    return HttpResponse(ser)


def index(request):
    context = {}
    return render(request, 'index.html', context)


# *** EXAMPLE ***
# def city(request, city_id):
#     try:
#         city = City.objects.get(pk=city_id)
#     except City.DoesNotExist:
#         raise Http404("City not found!")
#     return render(request, 'city.html', {'city': city})
