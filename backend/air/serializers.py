from rest_framework import serializers
from .models import AirQualityData


class AirQualitySerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source="station.name")
    district_name = serializers.CharField(source="station.district.name")

    class Meta:
        model = AirQualityData
        fields = [
            "date",
            "year",
            "month",
            "pm25",
            "pm10",
            "no2",
            "so2",
            "o3",
            "co",
            "nh3",
            "station_name",
            "district_name",
        ]