from django.test import TestCase

from CampMAP.models import *
from CampMAP.Classes import *


class TestCampMap(TestCase):

    def setup(self):
        pass

    def testDistance(self):
        trees = Tree.objects.all()
        place3 = Place.objects.get(gid=3)

        distance = Toolbox.Toolbox.get_min_distance_from_objects(trees, place3)
        self.assertEqual(distance, 8.611048612839674)
