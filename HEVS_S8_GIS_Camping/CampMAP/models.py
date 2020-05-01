from django.contrib.gis.db import models


# All models from the database
class Area(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PolygonField(srid=4326, null=True)

    class Meta:
        db_table = "areas"


class Building(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PolygonField(srid=4326, null=True)

    class Meta:
        db_table = "buildings"


class CampingArea(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PolygonField(srid=4326, null=True)

    class Meta:
        db_table = "camping_areas"


class Pool(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PolygonField(srid=4326, null=True)

    class Meta:
        db_table = "pools"


class Tree(models.Model):
    gid = models.PositiveIntegerField(primary_key=True)
    geom = models.PolygonField(srid=4326, null=True)

    class Meta:
        db_table = "trees"
