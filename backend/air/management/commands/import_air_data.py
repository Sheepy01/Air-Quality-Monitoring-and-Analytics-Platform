from django.core.management.base import BaseCommand
from air.models import Country, State, District, Station, AirQualityData
import pandas as pd
import os
from air.aqi_utils import calculate_aqi_from_values


# ================= PATH =================
BASE_PATH = r"D:\ADRI\DATA\Air_Quality_Monitoring_Data"


# ================= FLEXIBLE COLUMN FINDER =================
def get_col(row, *keys):
    for col in row.index:
        name = (
            str(col)
            .lower()
            .replace("µ", "u")
            .replace("/", "")
            .replace(".", "")
            .replace("(", "")
            .replace(")", "")
            .replace(" ", "")
        )

        for key in keys:
            if key in name:
                val = row[col]
                if pd.notna(val):
                    return val
    return None


# ================= SAFE DATE PARSER =================
def parse_timestamp(val):
    if pd.isna(val):
        return None
    try:
        return pd.to_datetime(val)
    except:
        return None


# ================= COMMAND =================
class Command(BaseCommand):
    help = "Import Air Quality Data"

    def handle(self, *args, **kwargs):

        country, _ = Country.objects.get_or_create(name="India")
        state, _ = State.objects.get_or_create(
            name="Bihar",
            country=country
        )

        # -------- DISTRICT LOOP --------
        for district_name in os.listdir(BASE_PATH):

            district_path = os.path.join(BASE_PATH, district_name)

            if not os.path.isdir(district_path):
                continue

            district, _ = District.objects.get_or_create(
                name=district_name,
                state=state
            )

            print(f"\nDistrict: {district_name}")

            # -------- STATION LOOP --------
            for station_name in os.listdir(district_path):

                print("   FOUND ITEM:", station_name)

                station_path = os.path.join(district_path, station_name)

                if not os.path.isdir(station_path):
                    continue

                station, _ = Station.objects.get_or_create(
                    name=station_name,
                    district=district
                )

                # -------- FILE LOOP --------
                for file in os.listdir(station_path):

                    print("      CHECKING FILE:", file)

                    if not file.lower().endswith((".xlsx", ".csv")):
                        continue

                    file_path = os.path.join(station_path, file)

                    print(f"      Reading: {file}")

                    # CSV or Excel loader
                    if file.lower().endswith(".csv"):
                        df = pd.read_csv(file_path)
                    else:
                        df = pd.read_excel(file_path)

                    # -------- ROW LOOP --------
                    for _, row in df.iterrows():
                        try:
                            raw_time = get_col(row, "time", "date")
                            date = parse_timestamp(raw_time)

                            if date is None:
                                continue

                            pm25 = get_col(row, "pm25")
                            pm10 = get_col(row, "pm10")
                            no2 = get_col(row, "no2")
                            so2 = get_col(row, "so2")
                            o3 = get_col(row, "ozone", "o3")
                            co = get_col(row, "co")
                            nh3 = get_col(row, "nh3")

                            aqi, category, color, dominant = calculate_aqi_from_values(
                                pm25=pm25,
                                pm10=pm10,
                                no2=no2,
                                so2=so2,
                                o3=o3,
                                co=co,
                                nh3=nh3
                            )

                            AirQualityData.objects.update_or_create(
                                station=station,
                                date=date,
                                defaults={
                                    "year": date.year,
                                    "month": date.month,
                                    "day": date.day,
                                    "pm25": pm25,
                                    "pm10": pm10,
                                    "no2": no2,
                                    "so2": so2,
                                    "o3": o3,
                                    "co": co,
                                    "nh3": nh3,
                                    "aqi": aqi,
                                    "aqi_category": category,
                                    "dominant_pollutant": dominant,
                                }
                            )

                        except Exception as e:
                            print("Skipped row:", e)

        print("\nDATA IMPORT COMPLETED")