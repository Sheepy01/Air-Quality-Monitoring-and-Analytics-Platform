from django.core.management.base import BaseCommand
from air.models import Country, State, District
import pandas as pd


FILE_PATH = r"E:\Bihar_District_Population_2011.xlsx"


class Command(BaseCommand):
    help = "Import Bihar Census Population Data"

    def handle(self, *args, **kwargs):

        print("Reading Census File...")

        df = pd.read_excel(FILE_PATH)

        # remove hidden spaces
        df.columns = df.columns.str.strip()

        print("Columns Found:", df.columns.tolist())
        print("\nImport Started...\n")

        country, _ = Country.objects.get_or_create(name="India")
        state, _ = State.objects.get_or_create(
            name="Bihar",
            country=country
        )

        updated_count = 0

        for _, row in df.iterrows():
            try:
                if pd.isna(row.get("District")):
                    continue

                district_name = str(row.get("District")).strip()

                census_code = row.get("District_ID")
                population = row.get("Persons")
                male = row.get("Male")
                female = row.get("Female")

                district, _ = District.objects.get_or_create(
                    name=district_name,
                    state=state
                )

                #  save all values
                district.census_code = census_code
                district.population_2011 = population
                district.male_population = male
                district.female_population = female
                district.save()

                updated_count += 1
                print(f" Updated: {district_name}")

            except Exception as e:
                print(" Skipped:", e)

        print("\n Census Data Import Completed Successfully")
        print(f"Total Updated: {updated_count}")