from django.urls import path
from . import views

urlpatterns = [
    # **** Manage users ****
    path('signup/', views.signup_user, name='signup'),
    path('', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    # **** App urls ****
    path('homepage/', views.homepage, name='homepage'),
    path('homepage/reserve/<int:id_camper>/<int:id_place>', views.reserve_slot, name='reserve'),
    # **** Json files ****
    path('places.json/', views.placesjson, name='placesjson'),
    path('buildings.json/', views.buildingsjson, name='buildingsjson'),
    path('campingareas.json/', views.campingareasjson, name='campingareasjson'),
    path('pools.json/', views.poolsjson, name='poolsjson'),
    path('trees.json/', views.treesjson, name='treesjson'),
    path('treesfilter.json/', views.treesfilterjson, name='treesfilterjson'),
    path('poolsfilter.json/', views.poolsfilterjson, name='poolsfilterjson'),
]
