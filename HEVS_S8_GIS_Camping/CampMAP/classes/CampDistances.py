
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
    def get_shapes_in_range_from(shapes,  other_shapes, min_distance=-1, max_distance=9999):

        shapes_in_range = []
        for shape in shapes:
            distance_to_objects = CampDistances.get_min_distance_from_objects(other_shapes, shape)
            if min_distance <= distance_to_objects <= max_distance:
                shapes_in_range.append(shape)

        return shapes_in_range

    @staticmethod
    def get_shapes_into_other_shapes(container_shapes,  other_shapes):

        shapes_within = []
        for container_shape in container_shapes:
            for other_shape in other_shapes:
                if other_shape.geom.within(container_shape.geom):
                    shapes_within.append(other_shape)
        return shapes_within
