from django.urls import path
from . import views

urlpatterns = [
    # **** Manage users ****
    path('signup/', views.signup_user, name='signup'),
    path('reserve/', views.reserve_slot, name='reserve'),
    path('', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    # **** App urls ****
    path('homepage/', views.homepage, name='homepage'),
    path('homepage/reserve/<int:id_place>', views.reserve_slot, name='reserve'),
    path('accept/', views.update_reservation, name='accept'),
    path('decline/', views.delete_reservation, name='decline'),
    # **** Json files ****
    path('places.json/', views.placesjson, name='placesjson'),
    path('reservedplaces.json/', views.reservedplacesjson, name='reservedplacesjson'),
    path('bookedplaces.json/', views.bookedplacesjson, name='bookedplacesjson'),
    path('buildings.json/', views.buildingsjson, name='buildingsjson'),
    path('campingareas.json/', views.campingareasjson, name='campingareasjson'),
    path('pools.json/', views.poolsjson, name='poolsjson'),
    path('trees.json/', views.treesjson, name='treesjson'),
    path('userbookings.json/', views.userbookingjson, name='userbookingjson'),

    path(
        'applyfilters.json/<int:pool_max_range>/<int:max_neighbour>/<str:with_tree>/<int:pet_min_range>/<int:children_min_range>/',
        views.applyfilters, name='applyfiltersjson'
    )
]
