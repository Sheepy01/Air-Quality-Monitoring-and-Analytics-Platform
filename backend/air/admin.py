from django.contrib import admin
from .models import Country, State, District, Station, AirQualityData


admin.site.register(Country)
admin.site.register(State)
admin.site.register(District)
admin.site.register(Station)
admin.site.register(AirQualityData)