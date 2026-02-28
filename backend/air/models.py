from django.db import models
from django.conf import settings

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class State(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=150)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    # Census data
    census_code = models.CharField(max_length=20, null=True, blank=True, unique=True)
    population_2011 = models.IntegerField(null=True, blank=True)
    male_population = models.IntegerField(null=True, blank=True)
    female_population = models.IntegerField(null=True, blank=True)

    area_km2 = models.FloatField(null=True, blank=True)
    density = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

class Station(models.Model):
    name = models.CharField(max_length=200)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class AirQualityData(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, db_index=True)

    date = models.DateField(db_index=True)
    year = models.IntegerField(db_index=True)
    month = models.IntegerField(db_index=True)
    day = models.IntegerField()

    pm25 = models.FloatField(null=True, blank=True)
    pm10 = models.FloatField(null=True, blank=True)
    no2 = models.FloatField(null=True, blank=True)
    so2 = models.FloatField(null=True, blank=True)
    o3 = models.FloatField(null=True, blank=True)
    co = models.FloatField(null=True, blank=True)
    nh3 = models.FloatField(null=True, blank=True)

    aqi = models.FloatField(null=True, blank=True)
    aqi_category = models.CharField(max_length=50, null=True, blank=True)
    aqi_color = models.CharField(max_length=20, null=True, blank=True)
    dominant_pollutant = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        unique_together = ("station", "date")
        indexes = [
            models.Index(fields=["year", "month"]),
            models.Index(fields=["station", "year"]),
            models.Index(fields=["station", "date"]),
        ]

    def __str__(self):
        return f"{self.station} - {self.date}"
    
class ExportLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    export_type = models.CharField(max_length=100)
    filters_used = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)