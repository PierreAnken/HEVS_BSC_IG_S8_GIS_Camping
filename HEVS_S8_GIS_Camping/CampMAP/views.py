from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import *


# Create your views here.
def index(request):
    context = {}
    return render(request, 'index.html', context)


def placesjson(request):
    places = Place.objects.all()
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)


def buildingsjson(request):
    buildings = Building.objects.all()
    ser = serialize('geojson', buildings, geometry_field='geom')
    return HttpResponse(ser)


def campingareasjson(request):
    camping_areas = CampingArea.objects.all()
    ser = serialize('geojson', camping_areas, geometry_field='geom')
    return HttpResponse(ser)


def poolsjson(request):
    pools = Pool.objects.all()
    ser = serialize('geojson', pools, geometry_field='geom')
    return HttpResponse(ser)


def treesjson(request):
    trees = Tree.objects.all()
    ser = serialize('geojson', trees, geometry_field='geom')
    return HttpResponse(ser)


# *** EXAMPLE ***
# def city(request, city_id):
#     try:
#         city = City.objects.get(pk=city_id)
#     except City.DoesNotExist:
#         raise Http404("City not found!")
#     return render(request, 'city.html', {'city': city})
