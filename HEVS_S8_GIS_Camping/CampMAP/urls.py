from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('places.json', views.placesjson, name='placesjson'),
    path('buildings.json', views.buildingsjson, name='buildingsjson'),
    path('campingareas.json', views.campingareasjson, name='campingareasjson'),
    path('pools.json', views.poolsjson, name='poolsjson'),
    path('trees.json', views.treesjson, name='treesjson'),
]

# *** EXAMPLES ***
# urlpatterns = [
#    path('city/', views.cities, name='cities'),
#    path('city/<int:city_id>', views.city, name='city'),
#    path('cantons/<str:canton_name>', views.canton, name='canton'),
#    path('cantons.json', views.cantonsjson, name='cantonsjson'),
#    path('cantons', views.cantons, name='cantons'),
# ]
