from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from .models import AirQualityData
from .aqi_utils import calculate_overall_aqi
from django.views.decorators.cache import cache_page

from .chat_engine import (
    extract_year,
    extract_pollutant,
    extract_district,
    extract_state,
    detect_intent,
    detect_advanced_intent,
    extract_multiple_districts,
    AQI_HEALTH_ADVICE,
    extract_multiple_pollutants,
    SCIENCE_EXPLANATIONS,
    extract_date_parts
)


@api_view(["GET"])
def dashboard_summary(request):

    year = request.GET.get("year")

    queryset = AirQualityData.objects.only(
        "year", "pm25", "pm10", "no2", "so2", "o3"
    )

    if year:
        queryset = queryset.filter(year=year)

    data = queryset.aggregate(
        avg_pm25=Avg("pm25"),
        avg_pm10=Avg("pm10"),
        avg_no2=Avg("no2"),
        avg_so2=Avg("so2"),
        avg_o3=Avg("o3"),
    )

    total_records = queryset.count()

    return Response({
        "year": year,
        "total_records": total_records,
        "averages": data
    })
    
    


@api_view(["GET"])
def district_comparison(request):

    year = request.GET.get("year")

    queryset = AirQualityData.objects.only(
        "year",
        "pm25",
        "pm10",
        "station__district__name"
    )

    if year:
        queryset = queryset.filter(year=year)

    data = (
        queryset
        .values("station__district__name")
        .annotate(
            avg_pm25=Avg("pm25"),
            avg_pm10=Avg("pm10")
        )
        .order_by("-avg_pm25")
    )

    result = [
        {
            "district": item["station__district__name"],
            "avg_pm25": item["avg_pm25"],
            "avg_pm10": item["avg_pm10"],
        }
        for item in data
    ]

    return Response(result)    



@api_view(["GET"])
def yearly_trend(request):

    data = (
        AirQualityData.objects
        .values("year")
        .annotate(
            avg_pm25=Avg("pm25"),
            avg_pm10=Avg("pm10"),
            avg_no2=Avg("no2")
        )
        .order_by("year")
    )

    result = [
        {
            "year": item["year"],
            "avg_pm25": item["avg_pm25"],
            "avg_pm10": item["avg_pm10"],
            "avg_no2": item["avg_no2"],
        }
        for item in data
    ]

    return Response(result)


@api_view(["GET"])
def monthly_trend(request):

    year = request.GET.get("year")
    winter = request.GET.get("winter")

    queryset = AirQualityData.objects.only(
        "year", "month", "pm25", "pm10"
    )

    # Year filter (optional)
    if year:
        queryset = queryset.filter(year=year)

    # Winter filter (Nov, Dec, Jan, Feb)
    if winter == "true":
        queryset = queryset.filter(month__in=[11, 12, 1, 2])

    data = (
        queryset
        .values("month")
        .annotate(
            avg_pm25=Avg("pm25"),
            avg_pm10=Avg("pm10")
        )
        .order_by("month")
    )

    result = [
        {
            "month": item["month"],
            "avg_pm25": item["avg_pm25"],
            "avg_pm10": item["avg_pm10"],
        }
        for item in data
    ]

    return Response(result)


@api_view(["GET"])
def aqi_summary(request):

    year = request.GET.get("year")

    queryset = AirQualityData.objects.select_related(
        "station"
    ).only(
        "date",
        "pm25","pm10","no2",
        "station__name"
    )

    # optional filter
    if year:
        queryset = queryset.filter(year=year)

    results = []

    # testing ke liye limit
    for record in queryset[:50]:

        aqi, category, color, dominant = calculate_overall_aqi(record)

        results.append({
            "date": record.date,
            "station": record.station.name,
            "pm25": record.pm25,
            "pm10": record.pm10,
            "no2": record.no2,
            "aqi": aqi,
            "category": category,
            "color": color,
            "dominant_pollutant": dominant
        })

    return Response(results)

#   --------- Dashboard Overview API ----------
@cache_page(60 * 10)
@api_view(["GET"])
def dashboard_overview(request):

    year = request.GET.get("year")

    queryset = AirQualityData.objects.only(
        "year","month","pm25","pm10","no2",
        "station__district__name"
    )
    
    if year:
        queryset = queryset.filter(year=year)

    # ---------- SUMMARY ----------
    summary = queryset.aggregate(
        avg_pm25=Avg("pm25"),
        avg_pm10=Avg("pm10"),
        avg_no2=Avg("no2"),
    )

    # ---------- DISTRICT COMPARISON ----------
    district_data = list(
        queryset.values("station__district__name")
        .annotate(avg_pm25=Avg("pm25"))
        .order_by("-avg_pm25")
    )

    # ---------- YEARLY TREND ----------
    yearly_data = list(
        AirQualityData.objects.values("year")
        .annotate(avg_pm25=Avg("pm25"))
        .order_by("year")
    )

    # ---------- MONTHLY TREND ----------
    monthly_data = list(
        queryset.values("month")
        .annotate(avg_pm25=Avg("pm25"))
        .order_by("month")
    )

    # ---------- AQI SAMPLE ----------
    aqi_sample = []

    for record in queryset[:20]:
        aqi, category, color, dominant = calculate_overall_aqi(record)

        aqi_sample.append({
            "date": record.date,
            "station": record.station.name,
            "aqi": aqi,
            "category": category,
            "color": color,
            "dominant_pollutant": dominant
        })

    return Response({
        "summary": summary,
        "district_comparison": district_data,
        "yearly_trend": yearly_data,
        "monthly_trend": monthly_data,
        "aqi_sample": aqi_sample,
    })


@api_view(["GET"])
def district_dashboard(request):

    year = request.GET.get("year")
    district = request.GET.get("district")

    queryset = AirQualityData.objects.only(
        "year","month",
        "pm25","pm10","no2","so2","co","o3",
        "station__district__name"
    )

    # -------- YEAR FILTER --------
    if year:
        queryset = queryset.filter(year=year)

    # -------- DISTRICT FILTER --------
    if district:
        queryset = queryset.filter(
            station__district__name=district
        )

    # ---------- YEARLY POLLUTANT CARDS ----------
    annual_pollutants = queryset.aggregate(
        pm25=Avg("pm25"),
        pm10=Avg("pm10"),
        no2=Avg("no2"),
        so2=Avg("so2"),
        co=Avg("co"),
        o3=Avg("o3"),
    )
    
    # ---------- PERCENTAGE CALCULATION ----------
    pollutant_values = {
        k: v for k, v in annual_pollutants.items()
        if v is not None
    }

    # total pollution load
    total_pollution = sum(pollutant_values.values())

    annual_with_percent = {}

    for pollutant, value in pollutant_values.items():

        percent = 0
        if total_pollution > 0:
            percent = (value / total_pollution) * 100

        annual_with_percent[pollutant] = {
            "value": round(value, 2),
            "unit": "µg/m³",
            "percent": f"{round(percent,2)}%"
        }    
    
    

    # ---------- MONTHLY GRAPH (Jan–Dec) ----------
    monthly_trend = list(
        queryset.values("month")
        .annotate(
            pm25=Avg("pm25"),
            pm10=Avg("pm10"),
            no2=Avg("no2"),
            so2=Avg("so2"),
            co=Avg("co"),
            o3=Avg("o3"),
        )
        .order_by("month")
    )

    return Response({
        "district": district,
        "year": year,
        "annual_pollutants": annual_with_percent,
        "monthly_trend": monthly_trend
    })
    
    

@api_view(["GET"])
def filter_options(request):

    years = (
        AirQualityData.objects
        .values_list("year", flat=True)
        .distinct()
        .order_by("year")
    )

    districts = (
        AirQualityData.objects
        .values_list("station__district__name", flat=True)
        .distinct()
        .order_by("station__district__name")
    )

    return Response({
        "years": list(years),
        "districts": list(districts)
    })    
    
    
    # no. of pollution days 
    
@api_view(["GET"])
def pollution_days(request):

    year = request.GET.get("year")
    district = request.GET.get("district")

    queryset = AirQualityData.objects.only(
        "date","pm25","year",
        "station__district__name"
    )

    # -------- Filters --------
    if year:
        queryset = queryset.filter(year=year)

    if district:
        queryset = queryset.filter(
            station__district__name=district
        )

    # -------- ignore missing PM2.5 --------
    queryset = queryset.exclude(pm25__isnull=True)


    # DAILY DISTRICT AVERAGE (ALL STATIONS INCLUDED)

    daily_avg = (
        queryset
        .values("date")
        .annotate(avg_pm25=Avg("pm25"))
        .order_by("date")
    )

    # -------- TOTAL UNIQUE DAYS --------
    total_days = daily_avg.count()

    # -------- CPCB AQI CATEGORY COUNTS --------
    good_days = daily_avg.filter(avg_pm25__lte=30).count()

    satisfactory_days = daily_avg.filter(
        avg_pm25__gt=30,
        avg_pm25__lte=60
    ).count()

    moderate_days = daily_avg.filter(
        avg_pm25__gt=60,
        avg_pm25__lte=90
    ).count()

    poor_days = daily_avg.filter(
        avg_pm25__gt=90,
        avg_pm25__lte=120
    ).count()

    very_poor_days = daily_avg.filter(
        avg_pm25__gt=120,
        avg_pm25__lte=250
    ).count()

    severe_days = daily_avg.filter(
        avg_pm25__gt=250
    ).count()

    # -------- RESPONSE --------
    return Response({
        "year": year,
        "district": district,
        "total_days": total_days,
        "good_days": good_days,
        "satisfactory_days": satisfactory_days,
        "moderate_days": moderate_days,
        "poor_days": poor_days,
        "very_poor_days": very_poor_days,
        "severe_days": severe_days
    })
    
# ---------------- CHAT AI ----------------

@api_view(["POST"])
def chat_ai(request):

    import re
    
    from rest_framework.exceptions import ParseError

    try:
        message = request.data.get("message", "")
    except ParseError:
        return Response({
            "reply": "Invalid request format. Please send JSON like: {\"message\":\"your question\"}"
        })

    # ---------------- EMPTY MESSAGE GUARD ----------------
    if not message or not message.strip():
        return Response({"reply": "Please type a question."})

    # ---------------- NORMALIZATION ----------------
    msg = message.lower()
    msg = re.sub(r'[^a-z0-9. ]', ' ', msg)
    msg = re.sub(r'\s+', ' ', msg).strip()
    

    # CONVERSATIONAL AI LAYER (ADD HERE)


    # -------- GREETING --------
    greetings = ["hi", "hello", "hey", "hii", "helo", "namaste"]
    
    if msg in greetings:
        return Response({
            "reply":
            "Hello 👋 I am an AI-Powered Air Quality Assistant.\n\n"
            "I can help you explore pollution data, AQI trends, "
            "district comparisons and health insights.\n\n"
            "Try asking:\n"
            "• PM2.5 Patna 2022\n"
            "• Compare Patna and Gaya pollution\n"
            "• Cleanest district 2023"
        })


    # -------- BOT IDENTITY --------
    if "who are you" in msg or "tum kaun" in msg or "kon ho" in msg:
        return Response({
            "reply":
            "I am an AI-powered environmental analytics assistant. "
            "I analyze real air quality monitoring data and provide "
            "scientific pollution insights using AQI calculations."
        })


    # -------- DATA SOURCE --------
    if "source" in msg or "data kaha se" in msg or "data source" in msg:
        return Response({
            "reply":
            "Pollution data comes from CPCB (Central Pollution Control Board, "
            "Government of India) and the Central Control Room for Air Quality "
            "Management – All India. District values are calculated by "
            "aggregating monitoring station readings."
        })


    # -------- HELP COMMAND --------
    if "help" in msg or "kya puch" in msg or "what can you do" in msg:
        return Response({
            "reply":
            "You can ask things like:\n\n"
            "• Pollution level of a district\n"
            "• Compare two districts\n"
            "• Year pollution trends\n"
            "• Cleanest district\n"
            "• Health effects of pollution\n\n"
            "Examples:\n"
            "- PM10 Patna 2021\n"
            "- Compare Patna and Gaya\n"
            "- Cleanest district 2022"
        })
    

    #-------- MANUAL INTENT DETECTION --------
    manual_intent = None

    if (
        ("clean" in msg or "lowest" in msg or "least" in msg)
        and ("district" in msg or "pollution" in msg)
    ):
        manual_intent = "cleanest_district"

    # -------- AUTO INTENT DETECTION --------
    detected_intent = detect_advanced_intent(msg)

    intent2 = manual_intent or detected_intent

    #  DEBUG INTENT
    print("INTENT DETECTED:", intent2)
    # ---------------- FOLLOWUP CONTEXT DETECTION ----------------
    FOLLOWUP_WORDS = [
    "aur", "also", "what about",
    "uska", "iska", "phir",
    "bhi",
    ]
    is_followup = any(w in message.lower() for w in FOLLOWUP_WORDS)

    # ---------------- LOAD MEMORY ----------------
    last_district = request.session.get("last_district")
    last_pollutant = request.session.get("last_pollutant")
    last_year = request.session.get("last_year")
    last_intent = request.session.get("last_intent")

    districts = list(
        AirQualityData.objects.values_list(
            "station__district__name",
            flat=True
        ).distinct()
    )

# ---------------- ENTITY EXTRACTION ----------------
    year = extract_year(msg)
    pollutant = extract_pollutant(msg)

      # catch invalid numbers
    number_match = re.search(r"\b\d{3,4}\b", msg)
    if number_match and not year:
        return Response({
            "reply": f"{number_match.group()} is not a valid year in dataset."
        })

          # -------- VALID YEARS LOAD (for validation) --------
    valid_years = set(
        AirQualityData.objects
        .values_list("year", flat=True)
        .distinct()
    )

        #  year exists but not in DB
    if year and year not in valid_years:
        return Response({
            "reply": f"No data available for year {year}."
        })
               
    
    # -------- STATE LIST LOAD --------
    states = list(
        AirQualityData.objects
        .values_list("station__district__state__name", flat=True)
        .distinct()
    )

     #  normalize states
    states = [s.strip().lower() for s in states if s]
    
    district = extract_district(msg, districts)
    state = extract_state(msg, states)
    day, month = extract_date_parts(msg)
    
    


    # ---------------- CONTEXT REASONING ----------------
    if is_followup:
        year = year or last_year
        pollutant = pollutant or last_pollutant
        district = district or last_district
        state = state or request.session.get("last_state")
        
    # -------- DISTRICT VALIDATION  --------
   # -------- SMART LOCATION VALIDATION --------

    LOCATION_REQUIRED_INTENTS = [
        None,          # normal queries
        "trend"
    ]

    # skip validation for intelligent intents
    SKIP_LOCATION_INTENTS = [
        "cleanest_district",
        "district_compare",
        "year_compare",
        "health_info"
    ]

    if (
        intent2 not in SKIP_LOCATION_INTENTS
        and not district
        and not state
    ):

        words = msg.split()

        ignore_words = [
            "compare","pm25","pm10","no2","so2","co","o3",
            "pollution","trend","year","cleanest",
            "district","and","vs"
        ]

        if any(w.isalpha() and w not in ignore_words for w in words):
            return Response({
                "reply": "Location not recognized. Please check spelling."
            })
    
    if (day or month) and last_year:
        year = year or last_year

    if (day or month) and last_district and not state:
        district = district or last_district
    
    if (day or month) and last_pollutant:
        pollutant = pollutant or last_pollutant
    
    if district and not year and last_year:
        year = last_year

    if not pollutant and last_pollutant:
        pollutant = last_pollutant              
        
    # -------- SMART SCOPE RESOLUTION --------
    scope_type = None

    if district:
        scope_type = "district"

    elif state:
        scope_type = "state"

    else:
        scope_type = "global"        
                
        
    # -------- SAFE FOLLOWUP CLEANEST SUPPORT --------
    if (
        is_followup
        and not intent2
        and request.session.get("last_intent") == "cleanest_district"
    ):
        intent2 = "cleanest_district"
    if not intent2:
        intent2 = detect_advanced_intent(msg)



    # AUTO COMPARISON 


    multi_districts = extract_multiple_districts(msg, districts) or []

    # -------- FORCE FOLLOWUP COMPARE --------
    if "compare" in msg and last_district:

        # case 1: user said "compare with siwan"
        if len(multi_districts) == 1:
            if multi_districts[0] != last_district:
                multi_districts = [last_district, multi_districts[0]]

        # case 2: user wrote "compare" but district extracted separately
        elif len(multi_districts) == 0 and district:
            multi_districts = [last_district, district]

    # -------- FORCE INTENT --------
    if len(multi_districts) >= 2:
        intent2 = "district_compare"
        
#  DISTRICT COMPARISON


    if intent2 == "district_compare" and multi_districts and len(multi_districts) >= 2:
        
        request.session["last_intent"] = "district_compare"
        request.session["last_district"] = multi_districts[1]

        data = (
            AirQualityData.objects
            .filter(station__district__name__in=multi_districts[:2])
            .values("station__district__name")
            .annotate(avg_pm25=Avg("pm25"))
        )

        results = {
            d["station__district__name"]: d["avg_pm25"]
            for d in data if d["avg_pm25"] is not None
        }

        if len(results) < 2:
            return Response({"reply": "Not enough data to compare."})

        higher = max(results, key=results.get)
        lower = min(results, key=results.get)

        
        request.session["last_intent"] = "district_compare"

        return Response({
            "reply":
            f"{higher} has higher pollution than {lower}. "
            f"{higher} = {round(results[higher],2)} µg/m³, "
            f"{lower} = {round(results[lower],2)} µg/m³."
        })

#  CLEANEST DISTRICT

    if intent2 == "cleanest_district":
    
        if state and state.lower() == "india":
            state = None
    
        qs = AirQualityData.objects.exclude(pm25__isnull=True)

        if year:
            qs = qs.filter(year=year)

        if state:
            qs = qs.filter(
                station__district__state__name=state
            )

        data = (
            qs.values("station__district__name")
            .annotate(avg_pm25=Avg("pm25"))
            .order_by("avg_pm25")
            .first()
        )

        # ---------- SAFETY CHECK ----------
        if not data:
            return Response({
                "reply": "No cleanest district data found."
            })

        cleanest_district = data["station__district__name"]
        scope = state if state else "available data"

        # ---------- SAVE MEMORY ----------
        request.session["last_district"] = cleanest_district
        request.session["last_year"] = year
        request.session["last_state"] = state


        # ---------- MULTI INTENT SUPPORT ----------
        if "pm25" in msg or "pm2.5" in msg:
    
            qs2 = AirQualityData.objects.filter(
                station__district__name=cleanest_district
            )

            if year:
                qs2 = qs2.filter(year=year)

            value = qs2.aggregate(v=Avg("pm25"))["v"]

            if value is None:
                return Response({
                    "reply": "PM2.5 data not available for this selection."
                })
    
            location_text = f"in {state}" if state else ""
    
            return Response({
                "reply":
                f"In {year}, {cleanest_district} was the cleanest district {location_text}. "
                f"Its average PM2.5 was {round(value,2)} µg/m³."
            })

        return Response({
            "reply":
            f"{cleanest_district} is the cleanest district in {scope} "
            f"(avg PM2.5 {round(data['avg_pm25'],2)} µg/m³)."
        })

#  HEALTH INFO

    if intent2 == "health_info":
        return Response({
            "reply":
            "Long exposure to air pollution may cause asthma, lung damage, "
            "heart disease and reduced immunity."
        })

#  SCIENCE EXPLANATIONS


    if "winter" in msg and ("kyun" in message.lower() or "why" in msg):
        return Response({"reply": SCIENCE_EXPLANATIONS.get("winter")})

    if "pm2.5" in msg and ("danger" in msg or "dangerous" in msg):
        return Response({"reply": SCIENCE_EXPLANATIONS.get("pm25")})

    if "pollution" in msg and ("reason" in msg or "cause" in msg):
        return Response({"reply": SCIENCE_EXPLANATIONS.get("reason")})
    
    

#  DATE SPECIFIC QUERY 


    if day and month and year and district:

        queryset = AirQualityData.objects.filter(
            year=year,
            month=month,
            day=day,
            station__district__name=district
        )

        multi_pollutants = extract_multiple_pollutants(msg)

        #  fallback from memory
        if not multi_pollutants and pollutant:
            multi_pollutants = [pollutant]

        if not multi_pollutants:
            return Response({"reply": "Please mention pollutant."})

        result = {}

        for p in multi_pollutants:
            val = queryset.aggregate(v=Avg(p))["v"]
            if val is not None:
                result[p.upper()] = round(val, 2)

        if not result:
            return Response({"reply": "No data available for this date."})

        #  SAVE MEMORY AFTER SUCCESS
        request.session["last_year"] = year
        request.session["last_district"] = district
        request.session["last_pollutant"] = multi_pollutants[0]

        return Response({
            "reply": f"Pollution data for {day}/{month}/{year} in {district}",
            "data": result
        })


#  MULTI POLLUTANT QUERY


    multi_pollutants = extract_multiple_pollutants(msg)

    if (
    intent2 != "year_compare"
    and len(multi_pollutants) > 1
    and year
    and district
    ):

        queryset = AirQualityData.objects.filter(
            year=year,
            station__district__name=district
        )

        result = {}

        for p in multi_pollutants:
            val = queryset.aggregate(v=Avg(p))["v"]
            if val:
                result[p.upper()] = round(val, 2)

        if result:
            return Response({
                "reply": f"Pollution levels in {district} ({year})",
                "data": result
            })
            

    
    
# ---------------- YEAR COMPARISON ----------------

    if intent2 == "year_compare":

        years = re.findall(r"(20\d{2})", msg)

        if len(years) < 2:
            return Response({
                "reply": "Please mention two years to compare."
            })

        y1, y2 = int(years[0]), int(years[1])

        # -------- SMART CONTEXT LOCATION --------
        # user mentioned state → ignore old district
        if state:
            district = None

        # nothing mentioned → use memory
        if is_followup and not district and not state:
            district = request.session.get("last_district")
            state = request.session.get("last_state")

        qs = AirQualityData.objects.filter(year__in=[y1, y2])

        if district:
            qs = qs.filter(
                station__district__name=district
            )

        elif state:
            qs = qs.filter(
                station__district__state__name=state
            )

        data = (
            qs.values("year")
            .annotate(avg_pm25=Avg("pm25"))
            .order_by("year")
            )

        result = {d["year"]: d["avg_pm25"] for d in data}

        if result.get(y1) is None or result.get(y2) is None:
            return Response({
                "reply": "PM2.5 data missing for one of the years."
            })

        trend = (
            "Air quality improved."
            if result[y2] < result[y1]
            else "Pollution worsened."
        )

        scope = district or state or "available data"

        return Response({
            "reply":
            f"In {scope}, PM2.5 changed from {round(result[y1],2)} in {y1} "
            f"to {round(result[y2],2)} in {y2}. {trend}"
        })
# ================= DIRECT QUERY =================

# -------- INTENT BYPASS GUARD --------
    INTENT_ONLY = [
    "cleanest_district",
    "health_info",
    "year_compare"
    ]
    
    if intent2 not in INTENT_ONLY:
        
    
        if not year:
            return Response({"reply": "Please mention year."})
    
        if not pollutant:
            return Response({"reply": "Please mention pollutant."})
    
    
    # -------- SMART QUERY FILTER --------
    
    queryset = AirQualityData.objects.only(
        "year",
        pollutant,
        "station__district__name",
        "station__district__state__name"
    ).filter(year=year)
    
    # scope based filtering
    if scope_type == "district" and district:
        queryset = queryset.filter(
            station__district__name=district
        )
    
    elif scope_type == "state" and state:
        queryset = queryset.filter(
            station__district__state__name=state
        )
    
    # remove null pollutant values
    queryset = queryset.exclude(**{f"{pollutant}__isnull": True})

    value = queryset.aggregate(value=Avg(pollutant))["value"]

    if value is None:
        return Response({"reply": "No data available."})
    
    # -------- TREND ANALYSIS  --------
    trend_text = ""

    previous_year = year - 1

    prev_qs = AirQualityData.objects.only(
        "year",
        pollutant,
        "station__district__name",
        "station__district__state__name"
    ).filter(year=previous_year)

    if scope_type == "district" and district:
        prev_qs = prev_qs.filter(
            station__district__name=district
        )

    elif scope_type == "state" and state:
        prev_qs = prev_qs.filter(
            station__district__state__name=state
        )

    prev_qs = prev_qs.exclude(**{f"{pollutant}__isnull": True})

    prev_value = prev_qs.aggregate(v=Avg(pollutant))["v"]

    if prev_value and value:

        change = ((value - prev_value) / prev_value) * 100

        if change > 5:
            trend_text = f"Pollution increased by {abs(change):.1f}% compared to {previous_year}."
        elif change < -5:
            trend_text = f"Air quality improved by {abs(change):.1f}% compared to {previous_year}."
        else:
            trend_text = "Pollution levels remained relatively stable compared to last year."    


    # -------- AQI CALCULATION --------
    class TempRecord:
        pass

    temp = TempRecord()
    setattr(temp, pollutant, value)
    
    aqi, category, color, dominant = calculate_overall_aqi(temp)
    advice = AQI_HEALTH_ADVICE.get(category, "")


    # -------- SMART LOCATION TEXT --------
    
    reply = "" 
    if scope_type == "district":
        location_text = district
    elif scope_type == "state":
        location_text = state
    else:
        location_text = "available data"
        
        
    # -------- SMART INSIGHT --------
    insight = ""

    if value >= 120:
        insight = "Air quality was severely polluted and harmful even for healthy individuals."
    elif value >= 90:
        insight = "Air quality was poor and prolonged exposure may cause breathing discomfort."
    elif value >= 60:
        insight = "Pollution level was moderate and sensitive groups may be affected."
    elif value <= 30:
        insight = "Air quality was relatively clean during this period."
        


    # -------- FINAL REPLY --------

    if category == "Unknown":
        reply = (
            f"In {year}, average {pollutant.upper().replace('PM25','PM2.5')} in {location_text} "
            f"was {round(value,2)} µg/m³.\n"
            f"(Based on aggregated CPCB monitoring station data.)"
        )

    else:
        reply = (
            f"In {year}, average {pollutant.upper().replace('PM25','PM2.5')} in {location_text} "
            f"was {round(value,2)} µg/m³. "
            f"AQI category: {category}. {advice}\n"
            f"(Based on aggregated CPCB monitoring station data.)"
        )
        
    # -------- ADD AI INSIGHT --------
    if insight:
        reply += f"\n\nInsight: {insight}"   
        
    if trend_text:
        reply += f"\n\nTrend Insight: {trend_text}"         

#  SAVE MEMORY 


    if district:
        request.session["last_district"] = district
    if pollutant:
        request.session["last_pollutant"] = pollutant
    if year:
        request.session["last_year"] = year    
    if state:
        request.session["last_state"] = state    

    # -------- FRIENDLY FALLBACK --------
    if not reply:
        return Response({
            "reply":
            "I couldn't understand completely 🤔.\n"
            "Try asking about pollution levels, AQI trends or comparisons.\n"
            "Type 'help' to see examples."
        })        

    return Response({"reply": reply})