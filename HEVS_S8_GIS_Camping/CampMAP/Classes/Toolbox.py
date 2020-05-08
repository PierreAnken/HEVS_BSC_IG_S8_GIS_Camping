import geopandas

class Toolbox:

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

