from django.shortcuts import render, redirect
from django.core.serializers import serialize
from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.db.models import Q
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
    if request.user.is_authenticated:
        return redirect('homepage')
    else:
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


def reserve_slot(request, id_place):
    if(request.user.is_superuser):
        return HttpResponse('Admins can only approved reservations, not reserve.')
    camper = Camper.objects.get(user_id = request.user.id)
    place = Place.objects.get(gid = id_place)
    existingReservation = Reservation.objects.filter(camper = camper, place = place)
    if(len(existingReservation)>0):
        return HttpResponse('You already booked this')
    else:
        reservation = Reservation(camper = camper, place = place, status = 1)
        reservation.save()
        return redirect('homepage')


# **** App views below ****
@login_required(login_url='/')
def homepage(request):
    # retrieve reservations
    reservations = Reservation.objects.filter(status=1)
    booked = Reservation.objects.filter(status=2)
    return render(request, 'homePage.html', {'reservations': reservations, 'booked': booked})


def delete_reservation(request):
    id = request.POST.get('decline')
    Reservation.objects.filter(id=id).delete()
    return redirect('homepage')


def update_reservation(request):
    id = request.POST.get('accept')
    Reservation.objects.filter(id=id).update(status=2)
    return redirect('homepage')


# **** Json views below ****
def placesjson(request):
    bookings = Reservation.objects.filter(status = 2)
    unavailable_ids = []
    for booking in bookings:
        unavailable_ids.append(booking.place_id)
    places = Place.objects.all().exclude(gid__in=unavailable_ids)
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


def poolsfilterjson(request, pool_max_range):
    pools = Pool.objects.all()
    places = Place.objects.all()
    places_near_pools = CampDistances.get_shapes_in_range_from(places, pools, 0, pool_max_range)
    # create the json
    ser = serialize('geojson', places_near_pools, geometry_field='geom')
    return HttpResponse(ser)


def neighbourfilterjson(request, max_neighbour):
    # get all objects
    places = Place.objects.all()
    # filter the objects
    places_within_max_neighbour = []
    for place in places:
        intersect_shapes = CampDistances.get_shapes_intersects_other_shape(place, places)
        if len(intersect_shapes) <= max_neighbour:
            places_within_max_neighbour.append(place)
    # create the json
    ser = serialize('geojson', places_within_max_neighbour, geometry_field='geom')
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

def reservedplacesjson(request):
    reservations = Reservation.objects.filter(status = 1)
    unavailable_ids = []
    for res in reservations:
        unavailable_ids.append(res.place_id)
    places = Place.objects.filter(gid__in=unavailable_ids)
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)

def bookedplacesjson(request):
    bookings = Reservation.objects.filter(status = 2)
    unavailable_ids = []
    for booking in bookings:
        unavailable_ids.append(booking.place_id)
    places = Place.objects.filter(gid__in=unavailable_ids)
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)


def petfilterjson(request):
    bookings = Reservation.objects.filter(status=2)
    places = Place.objects.all()
    places_with_pets = []
    for booking in bookings:
        if booking.camper.pets:
            places_with_pets.append(booking.place)
    places_near_pets=[]
    for place in places_with_pets:
        intersect_shapes = CampDistances.get_shapes_intersects_other_shape(place, places)
        places_near_pets.extend(intersect_shapes)
    ser = serialize('geojson', places_near_pets, geometry_field='geom')
    return HttpResponse(ser)


def childrenfilterjson(request):
    bookings = Reservation.objects.filter(status=2)
    places = Place.objects.all()
    places_with_kids = []
    for booking in bookings:
        if booking.camper.kids > 0:
            places_with_kids.append(booking.place)

    places_near_kids = CampDistances.get_shapes_in_range_from(places, places_with_kids, 0, 10)
    print('hwy')
    ser = serialize('geojson', places_near_kids, geometry_field='geom')

    return HttpResponse(ser)