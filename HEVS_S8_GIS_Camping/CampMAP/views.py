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
    if request.user.is_authenticated:
        return redirect('homepage')
    else:
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
    if request.user.is_superuser:
        return HttpResponse('Admins can only approved reservations, not reserve.')
    camper = Camper.objects.get(user_id=request.user.id)
    place = Place.objects.get(gid=id_place)
    existingReservation = Reservation.objects.filter(camper=camper, place=place)
    if len(existingReservation) > 0:
        return HttpResponse('You already booked this')
    else:
        reservation = Reservation(camper=camper, place=place, status=1)
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
    bookings = Reservation.objects.filter(status=2)
    unavailable_ids = []
    for booking in bookings:
        unavailable_ids.append(booking.place_id)
    places = Place.objects.all().exclude(gid__in=unavailable_ids)
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)

def oneplacejson(request,id_place):
    place = Place.objects.filter(gid = id_place)
    print('oi')
    print(place)
    ser = serialize('geojson', place, geometry_field='geom')
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


def applyfilters(request, pool_max_range, max_neighbour, with_tree, pet_min_range, children_min_range):
    trees = Tree.objects.all()
    pools = Pool.objects.all()
    places = Place.objects.all()
    bookings = Reservation.objects.filter(status=2)

    # 1 - filter by pool range
    filtered_places = CampDistances.get_shapes_in_range_from(places, pools, 0, pool_max_range)

    # 2 - filter with tree
    places_filtered_with_tree = CampDistances.get_shapes_into_other_shapes(filtered_places, trees)
    if with_tree == "true":
        filtered_places = places_filtered_with_tree
    else:
        for place_with_tree in places_filtered_with_tree:
            if place_with_tree in filtered_places:
                filtered_places.remove(place_with_tree)

    # 3 - filter  neighbour
    places_within_max_neighbour = []
    for place in filtered_places:
        intersect_shapes = CampDistances.get_shapes_intersects_other_shape(place, places)
        if len(intersect_shapes) <= max_neighbour:
            places_within_max_neighbour.append(place)
    filtered_places = places_within_max_neighbour

    # 4 - filter pets and kids
    # 4A - Get places with pets and kids
    places_with_pets = []
    places_with_kids = []
    for booking in bookings:
        if booking.camper.pets is True:
            places_with_pets.append(booking.place)
        if booking.camper.kids > 0:
            places_with_kids.append(booking.place)

    # 4B  - filter pet
    places_away_from_pets = []
    for place in filtered_places:
        distance_from_pets = CampDistances.get_min_distance_from_objects(places_with_pets, place)
        if distance_from_pets >= pet_min_range:
            places_away_from_pets.append(place)
    filtered_places = places_away_from_pets

    # 4C  - filter kids
    places_away_from_kids = []
    for place in filtered_places:
        distance_from_kids = CampDistances.get_min_distance_from_objects(places_with_kids, place)
        if distance_from_kids >= children_min_range:
            places_away_from_kids.append(place)
        else:
            pass
    filtered_places = places_away_from_kids

    # 5 - removed booked places
    for booking in bookings:
        if booking.place in filtered_places:
            filtered_places.remove(booking.place)

    ser = serialize('geojson', filtered_places, geometry_field='geom')
    return HttpResponse(ser)


def treesjson(request):
    trees = Tree.objects.all()
    ser = serialize('geojson', trees, geometry_field='geom')
    return HttpResponse(ser)


def reservedplacesjson(request):
    reservations = Reservation.objects.filter(status=1)
    unavailable_ids = []
    for res in reservations:
        unavailable_ids.append(res.place_id)
    places = Place.objects.filter(gid__in=unavailable_ids)
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)


def bookedplacesjson(request):
    bookings = Reservation.objects.filter(status=2)
    unavailable_ids = []
    for booking in bookings:
        unavailable_ids.append(booking.place_id)
    places = Place.objects.filter(gid__in=unavailable_ids)
    ser = serialize('geojson', places, geometry_field='geom')
    return HttpResponse(ser)


def userbookingjson(request):
    camper = Camper.objects.get(user_id=request.user.id)
    print(camper)
    bookings = Reservation.objects.filter(status=2, camper=camper) | Reservation.objects.filter(status=1, camper=camper)
    user_places = []
    for booking in bookings:
        place = Place.objects.get(gid=booking.place_id)
        user_places.append(place)
    ser = serialize('geojson', user_places, geometry_field='geom')
    return HttpResponse(ser)
