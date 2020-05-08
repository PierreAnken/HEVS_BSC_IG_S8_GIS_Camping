from django.test import TestCase

from CampMAP.Classes import *
from CampMAP.models import *


class TestCampMap(TestCase):

    def setup(self):
        pass

    def testDistance(self):
        trees = Tree.objects.all()
        place3 = Place.objects.get(gid=3)

        distance = CampDistances.CampDistances.get_min_distance_from_objects(trees, place3)
        self.assertEqual(distance, 8.611048612839674)

    def testPlaceNearTree(self):
        trees = Tree.objects.all()
        places = Place.objects.all()

        places_near_tree = CampDistances.CampDistances.get_shapes_in_range_from(places, trees, 10, 30)
        self.assertEqual(places_near_tree[0].gid, 4)
