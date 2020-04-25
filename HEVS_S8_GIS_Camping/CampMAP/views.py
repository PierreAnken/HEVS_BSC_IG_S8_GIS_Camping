from django.shortcuts import render

# Create your views here.

# *** EXAMPLE ***
# def city(request, city_id):
#     try:
#         city = City.objects.get(pk=city_id)
#     except City.DoesNotExist:
#         raise Http404("City not found!")
#     return render(request, 'city.html', {'city': city})