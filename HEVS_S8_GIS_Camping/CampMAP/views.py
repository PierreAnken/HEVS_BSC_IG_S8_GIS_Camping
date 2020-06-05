from django.shortcuts import render, redirect
from django.core.serializers import serialize
from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .classes.RegisterForm import RegisterForm
from .classes.CampDistances import CampDistances
from .models import *


# **** Manage users views below ****
def signup_user(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            # create user
            user = form.save()
            # create camper
            adults = form.cleaned_data.get('adults')
            if not adults:
                adults = 0
            kids = form.cleaned_data.get('kids')
            if not kids:
                kids = 0
            pets = form.cleaned_data.get('pets')
            camper = Camper(adults=adults, kids=kids, pets=pets, user_id=user.id)
            camper.save()
            # log the user in
            login(request, user)
            return redirect('homepage')
    else:
        form = RegisterForm()
    return render(request, 'signup.html', {'form': form})


def login_user(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('homepage')
    else:
        form = AuthenticationForm()
    return render(request, 'index.html', {'form': form})


def logout_user(request):
    if request.method == 'POST':
        logout(request)
        return redirect('login')


def reserve_slot(request, id_camper, id_place):
    print('reserve!')
    camper = Camper.objects.get(user_id = id_camper)
    place = Place.objects.get(gid = id_place)
    reservation = Reservation(camper = camper, place = place, status = 1)
    reservation.save()
    return redirect('homepage')


# **** App views below ****
@login_required(login_url='/')
def homepage(request):
    # retrieve only asked reservations
    reservations = Reservation.objects.filter(status=1)
    return render(request, 'homePage.html', {'reservations': reservations})


def delete_reservation(request):
    # delete // id = request.get('decline')
    return redirect('homepage')


def update_reservation(request):
    # change status // id = request.get('accept')
    return redirect('homepage')


# **** Json views below ****
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


def poolsfilterjson(request, poolMaxRange):
    pools = Pool.objects.all()
    places = Place.objects.all()
    places_near_pools = CampDistances.get_shapes_in_range_from(places, pools, 0, poolMaxRange)

    ser = serialize('geojson', places_near_pools, geometry_field='geom')
    return HttpResponse(ser)


def treesjson(request):
    trees = Tree.objects.all()
    ser = serialize('geojson', trees, geometry_field='geom')
    return HttpResponse(ser)


def treesfilterjson(request):
    trees = Tree.objects.all()
    places = Place.objects.all()
    places_with_trees = CampDistances.get_shapes_into_other_shapes(places, trees)
    ser = serialize('geojson', places_with_trees, geometry_field='geom')
    return HttpResponse(ser)
