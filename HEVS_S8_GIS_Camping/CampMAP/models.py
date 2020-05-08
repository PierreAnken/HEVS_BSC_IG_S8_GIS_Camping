from django.contrib.gis.db import models


# **** Model for the authentication part ****




# **** All models from the database ****
class Place(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.MultiPolygonField(srid=4326, null=True)

    class Meta:
        db_table = "places"

    def __int__(self):
        return self.gid


class Building(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.MultiPolygonField(srid=4326, null=True)

    class Meta:
        db_table = "buildings"

    def __int__(self):
        return self.gid


class CampingArea(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.MultiPolygonField(srid=4326, null=True)

    class Meta:
        db_table = "camping_areas"

    def __int__(self):
        return self.gid


class Pool(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.MultiPolygonField(srid=4326, null=True)

    class Meta:
        db_table = "pools"

    def __int__(self):
        return self.gid


class Tree(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PointField(srid=4326, null=True)

    class Meta:
        db_table = "trees"

    def __int__(self):
        return self.gid
