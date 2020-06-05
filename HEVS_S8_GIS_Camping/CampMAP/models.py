from django.contrib.gis.db import models
from django.contrib.auth.models import User


# **** Model for the authentication part ****
class Camper(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    adults = models.PositiveIntegerField()
    kids = models.PositiveIntegerField()
    pets = models.BooleanField()


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


# **** Relational table ****
class Reservation(models.Model):
    camper = models.OneToOneField(User, on_delete=models.DO_NOTHING)
    place = models.OneToOneField(Place, on_delete=models.DO_NOTHING)
    status = models.PositiveIntegerField()

