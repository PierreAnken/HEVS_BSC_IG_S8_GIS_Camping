from django.db import models
# *** EXAMPLE ***
# from django.contrib.gis.db import models


# Create your models here.


# *** EXAMPLE ***
# class Canton(models.Model):
#     gid = models.PositiveIntegerField(primary_key=True)
#     name = models.CharField(max_length=200)
#     geom = models.MultiPolygonField(srid=4326, null=True)
#
#     class Meta:
#         db_table = "cantons"
#
#     def __str__(self):
#         return self.name