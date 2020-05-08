from CampMAP.models import *
from CampMAP.Classes import *


class CampDistances:

    @staticmethod
    def get_min_distance_from_objects(shapes, other_shape):
        if shapes.count() < 1:
            raise ValueError("gis_multi_polygons is empty")

        if shapes[0].geom.geom_type not in ['MultiPolygon', 'Point']:
            raise ValueError("gis_multi_polygons object type must be MultiPolygon or Point")

        if other_shape.geom.geom_type not in ['MultiPolygon', 'Point']:
            raise ValueError("other_shape object type must be MultiPolygon or Point")

        distance_min = 99999

        for shape in shapes:
            distance = shape.geom.centroid.distance(other_shape.geom.centroid)
            if distance_min > distance:
                distance_min = distance
        return distance_min

    @staticmethod
    def get_places_at_distance_from(object_type, min_distance=-1, max_distance=9999):

        places = objects = Place.objects.all()
        if object_type == ObjectType.ObjectType.BUILDING:
            objects = Building.objects.all()
        elif object_type == ObjectType.ObjectType.CAMPING_AREA:
            v = CampingArea.objects.all()
        elif object_type == ObjectType.ObjectType.TREE:
            objects = Tree.objects.all()
        elif object_type == ObjectType.ObjectType.POOL:
            objects = Pool.objects.all()
        elif object_type == ObjectType.ObjectType.PLACE:
            objects = Place.objects.all()

        places_at_range = []
        for place in places:
            distance_to_objects = CampDistances.get_min_distance_from_objects(objects, place)
            if min_distance <= distance_to_objects <= max_distance:
                places_at_range.append(place)

        return places_at_range
